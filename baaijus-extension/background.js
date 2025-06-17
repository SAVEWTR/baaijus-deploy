// Background script for Baaijus extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Baaijus extension installed');
  chrome.storage.local.set({ 
    baaijus_user: null, 
    filtering_active: false,
    selectedBaajus: null
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SET_USER") {
    chrome.storage.local.set({ baaijus_user: msg.user });
    sendResponse({ ok: true });
  }
  
  if (msg.type === "GET_USER") {
    chrome.storage.local.get("baaijus_user", res => sendResponse(res));
    return true;
  }
  
  if (msg.type === "TOGGLE_FILTERING") {
    chrome.storage.local.set({ filtering_active: msg.active });
    // Send message to all content scripts
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { type: 'FILTERING_TOGGLED', active: msg.active });
      });
    });
    sendResponse({ ok: true });
  }
  
  if (msg.type === "GET_FILTERING_STATUS") {
    chrome.storage.local.get("filtering_active", res => sendResponse(res));
    return true;
  }
  
  if (msg.type === "SET_SELECTED_BAAJUS") {
    chrome.storage.local.set({ selectedBaajus: msg.baajus });
    sendResponse({ ok: true });
  }
  
  if (msg.type === "GET_SELECTED_BAAJUS") {
    chrome.storage.local.get("selectedBaajus", res => sendResponse(res));
    return true;
  }

  // Communication with web app
  if (msg.type === "WEB_APP_PING") {
    // Respond to web app ping to confirm extension is active
    sendResponse({ type: "EXTENSION_PONG", active: true });
  }

  if (msg.type === "GET_API_BASE") {
    sendResponse({ apiBase: 'https://baaijus.replit.app/api' });
  }
});