class BaaijusPopup {
  constructor() {
    this.apiBase = 'https://baaijus.replit.app/api';
  }

  async init() {
    this.setupEventListeners();
    
    // Check if user is logged in
    const { baaijus_user } = await chrome.storage.local.get(['baaijus_user']);
    if (baaijus_user) {
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  setupEventListeners() {
    document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
    document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    document.getElementById('activeToggle').addEventListener('change', (e) => this.handleToggleActive(e.target.checked));
  }

  showLogin() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';
  }

  showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'flex';
    this.loadBaajuses();
  }

  async handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
      this.showStatus('Please enter username and password', 'error');
      return;
    }

    try {
      const { login } = await import('../utils/api.js');
      const userData = await login(username, password);
      this.showStatus('Login successful!', 'success');
      setTimeout(() => this.showDashboard(), 1000);
    } catch (error) {
      this.showStatus(error.message || 'Login failed', 'error');
    }
  }

  async loadBaajuses() {
    try {
      const { getBaajuses } = await import('../utils/api.js');
      const baajuses = await getBaajuses();
      this.displayBaajuses(baajuses);
    } catch (error) {
      console.error('Failed to load baajuses:', error);
      // If not authenticated, show login form
      if (error.message === 'Not authenticated') {
        this.showLogin();
      }
    }
  }

  displayBaajuses(baajuses) {
    const container = document.getElementById('baajusList');
    container.innerHTML = '';

    if (baajuses.length === 0) {
      container.innerHTML = '<div style="color: #666; font-size: 12px;">No Baajuses found</div>';
      return;
    }

    baajuses.forEach(baajus => {
      const item = document.createElement('div');
      item.className = 'baajus-item';
      item.innerHTML = `
        <div class="baajus-info">
          <div class="baajus-name">${baajus.name}</div>
          <div class="baajus-meta">${baajus.sensitivity} • ${baajus.usageCount || 0} uses</div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  async handleToggleActive(active) {
    await chrome.storage.local.set({ filtering_active: active });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_FILTERING', active });
    });
  }

  async handleLogout() {
    await chrome.storage.local.clear();
    this.showLogin();
  }

  showStatus(message, type) {
    const status = document.getElementById('loginStatus');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    setTimeout(() => status.style.display = 'none', 3000);
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new BaaijusPopup().init();
});