// Options page script for Baaijus extension
class BaaijusOptions {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
  }

  getStorage(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
  }

  setStorage(items) {
    return new Promise(resolve => chrome.storage.local.set(items, resolve));
  }

  async loadSettings() {
    const settings = await this.getStorage([
      'apiBase',
      'autoEnable',
      'defaultSensitivity'
    ]);

    document.getElementById('apiBase').value = settings.apiBase || 'https://baaijus-filter.replit.app/api';
    document.getElementById('autoEnable').checked = settings.autoEnable !== false;
    document.getElementById('defaultSensitivity').value = settings.defaultSensitivity || 'balanced';
  }

  setupEventListeners() {
    document.getElementById('saveApiBase').addEventListener('click', () => this.saveApiConfiguration());
    document.getElementById('savePreferences').addEventListener('click', () => this.savePreferences());
    document.getElementById('openDashboard').addEventListener('click', () => this.openDashboard());
  }

  async saveApiConfiguration() {
    const apiBase = document.getElementById('apiBase').value.trim();
    const statusEl = document.getElementById('apiStatus');
    const saveBtn = document.getElementById('saveApiBase');

    if (!apiBase) {
      this.showStatus('apiStatus', 'Please enter a valid server URL', 'error');
      return;
    }

    // Remove trailing slash and /api if present for consistency
    let cleanUrl = apiBase.replace(/\/$/, '');
    if (cleanUrl.endsWith('/api')) {
      cleanUrl = cleanUrl.slice(0, -4);
    }
    cleanUrl += '/api';

    saveBtn.textContent = 'Testing connection...';
    saveBtn.disabled = true;

    try {
      // Test connection to the API
      const response = await fetch(`${cleanUrl}/baajuses/public`);
      
      if (response.ok || response.status === 401) { // 401 is expected for auth-required endpoints
        await this.setStorage({ apiBase: cleanUrl });
        this.showStatus('apiStatus', 'Configuration saved successfully!', 'success');
        
        // Update the input to show the cleaned URL
        document.getElementById('apiBase').value = cleanUrl;
      } else {
        this.showStatus('apiStatus', `Cannot connect to server (HTTP ${response.status})`, 'error');
      }
    } catch (error) {
      this.showStatus('apiStatus', 'Connection failed. Please check the URL and try again.', 'error');
    }

    saveBtn.textContent = 'Save Configuration';
    saveBtn.disabled = false;
  }

  async savePreferences() {
    const autoEnable = document.getElementById('autoEnable').checked;
    const defaultSensitivity = document.getElementById('defaultSensitivity').value;

    await this.setStorage({
      autoEnable,
      defaultSensitivity
    });

    this.showStatus('prefStatus', 'Preferences saved successfully!', 'success');
  }

  async openDashboard() {
    const { apiBase } = await this.getStorage(['apiBase']);
    const dashboardUrl = (apiBase || 'https://baaijus-filter.replit.app/api').replace('/api', '');
    chrome.tabs.create({ url: dashboardUrl });
  }

  showStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';

    // Hide status after 3 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 3000);
    }
  }
}

// Initialize options page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BaaijusOptions();
});