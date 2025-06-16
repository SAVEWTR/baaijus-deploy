// Popup script for Baaijus extension
class BaaijusPopup {
  constructor() {
    this.init();
  }

  async init() {
    // Check if user is already logged in
    const { baaijus_token } = await this.getStorage(['baaijus_token']);
    
    if (baaijus_token) {
      await this.showDashboard();
    } else {
      this.showLogin();
    }

    this.setupEventListeners();
  }

  getStorage(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
  }

  sendMessage(message) {
    return new Promise(resolve => chrome.runtime.sendMessage(message, resolve));
  }

  async getApiBase() {
    const { apiBase } = await this.getStorage(['apiBase']);
    return apiBase || 'https://f9655579-a631-49b5-a59f-879d7de9b35c-00-295kw66h2pml0.janeway.replit.dev/api';
  }

  setupEventListeners() {
    // Login form
    document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
    document.getElementById('password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });

    // Dashboard controls
    document.getElementById('activeToggle').addEventListener('change', (e) => {
      this.handleToggleActive(e.target.checked);
    });

    document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    
    document.getElementById('openDashboard').addEventListener('click', async () => {
      const apiBase = await this.getApiBase();
      const dashboardUrl = apiBase.replace('/api', '/');
      chrome.tabs.create({ url: dashboardUrl });
    });
  }

  showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
  }

  async showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    // Show connection status indicator
    const connectionStatus = document.getElementById('connectionStatus');
    if (connectionStatus) {
      connectionStatus.style.display = 'flex';
    }

    // Load current state
    const { active } = await this.getStorage(['active']);
    document.getElementById('activeToggle').checked = active !== false;

    // Load user's Baajuses
    await this.loadBaajuses();
  }

  async handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const statusEl = document.getElementById('loginStatus');
    const loginBtn = document.getElementById('loginBtn');

    if (!username || !password) {
      this.showStatus('Please enter both username and password', 'error');
      return;
    }

    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    try {
      const apiBase = await this.getApiBase();
      console.log('Attempting login to:', `${apiBase}/auth/login`);
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, user data:', data);
        await chrome.storage.local.set({ baaijus_token: data.id }); // Store user ID as token
        this.showStatus('Login successful!', 'success');
        setTimeout(() => {
          this.showDashboard();
          // Show connection status when authenticated
          document.getElementById('connectionStatus').style.display = 'flex';
        }, 1000);
      } else {
        const error = await response.json();
        this.showStatus(error.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showStatus(`Connection error: ${error.message}`, 'error');
    }

    loginBtn.textContent = 'Sign In';
    loginBtn.disabled = false;
  }

  async loadBaajuses() {
    const { baaijus_token } = await this.getStorage(['baaijus_token']);
    
    if (!baaijus_token) return;

    try {
      // Note: We're using session-based auth, so no Bearer token needed
      const apiBase = await this.getApiBase();
      const response = await fetch(`${apiBase}/baajuses`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const baajuses = await response.json();
        this.displayBaajuses(baajuses);
      } else {
        console.error('Failed to load Baajuses');
      }
    } catch (error) {
      console.error('Error loading Baajuses:', error);
    }
  }

  displayBaajuses(baajuses) {
    const listEl = document.getElementById('baajusList');
    
    if (baajuses.length === 0) {
      listEl.innerHTML = '<div style="color: #666; font-size: 12px; text-align: center; padding: 16px;">No Baajuses created yet. Create one in the dashboard!</div>';
      return;
    }

    listEl.innerHTML = baajuses.map(baajus => `
      <div class="baajus-item">
        <div class="baajus-info">
          <div class="baajus-name">${this.escapeHtml(baajus.name)}</div>
          <div class="baajus-meta">
            ${baajus.sensitivity} • ${baajus.keywords ? baajus.keywords.split(',').length + ' keywords' : 'No keywords'}
          </div>
        </div>
        <div style="font-size: 12px; color: ${baajus.isActive ? '#16a34a' : '#666'};">
          ${baajus.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
    `).join('');
  }

  async handleToggleActive(active) {
    await this.sendMessage({ type: 'TOGGLE_ACTIVE', active });
    
    // Reload current tab to apply/remove filtering
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.reload(tab.id);
  }

  async handleLogout() {
    try {
      // Try to logout from backend
      const apiBase = await this.getApiBase();
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Backend logout failed, continuing with local logout');
    }

    // Clear local storage
    await this.sendMessage({ type: 'SET_TOKEN', token: null });
    await this.sendMessage({ type: 'SET_SELECTED_BAAJUS', baajus: null });
    
    this.showLogin();
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('loginStatus');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BaaijusPopup();
});