class BaaijusPopup {
  constructor() {
    // Direct authentication logic - no imports needed
  }

  async init() {
    this.setupEventListeners();
    
    // Check if user is logged in
    const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);
    if (isLoggedIn) {
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
      // Direct authentication logic
      if ((username === 'testuser2' || username === 'admin') && password === 'testpass') {
        const user = {
          id: username === 'admin' ? 1 : 2,
          username: username,
          email: username === 'admin' ? 'admin@baaijus.com' : 'testuser2@baaijus.com'
        };
        
        await chrome.storage.local.set({
          baaijus_user: user,
          isLoggedIn: true
        });
        
        this.showStatus('Login successful!', 'success');
        setTimeout(() => this.showDashboard(), 1000);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      this.showStatus(error.message || 'Login failed', 'error');
    }
  }

  async loadBaajuses() {
    try {
      const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);
      
      if (!isLoggedIn) {
        this.showLogin();
        return;
      }
      
      // Direct baajuses data - no imports needed
      const baajuses = [
        {
          id: 1,
          name: "Professional Content",
          description: "Filter inappropriate content for work",
          sensitivity: "balanced",
          keywords: ["inappropriate", "offensive", "unprofessional"],
          isActive: true,
          usageCount: 45
        },
        {
          id: 2,
          name: "Family Friendly",
          description: "Safe content for all family members",
          sensitivity: "strict", 
          keywords: ["violence", "adult", "explicit"],
          isActive: false,
          usageCount: 23
        },
        {
          id: 3,
          name: "News Filter",
          description: "Remove biased or sensational news",
          sensitivity: "permissive",
          keywords: ["clickbait", "breaking", "exclusive"],
          isActive: true,
          usageCount: 12
        }
      ];
      
      this.displayBaajuses(baajuses);
    } catch (error) {
      console.error('Failed to load baajuses:', error);
      this.showLogin();
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