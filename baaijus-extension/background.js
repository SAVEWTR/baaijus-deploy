// Background script for Baaijus extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Baaijus extension installed');
  chrome.storage.local.set({ 
    baaijus_token: null, 
    active: true,
    selectedBaajus: null,
    apiBase: 'https://f9655579-a631-49b5-a59f-879d7de9b35c-00-295kw66h2pml0.janeway.replit.dev/api' // Production API endpoint
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SET_TOKEN") {
    chrome.storage.local.set({ baaijus_token: msg.token });
    sendResponse({ ok: true });
  }
  
  if (msg.type === "GET_TOKEN") {
    chrome.storage.local.get("baaijus_token", res => sendResponse(res));
    return true;
  }
  
  if (msg.type === "TOGGLE_ACTIVE") {
    chrome.storage.local.set({ active: msg.active });
    sendResponse({ ok: true });
  }
  
  if (msg.type === "GET_ACTIVE") {
    chrome.storage.local.get("active", res => sendResponse(res));
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
  
  if (msg.type === "GET_API_BASE") {
    chrome.storage.local.get("apiBase", res => sendResponse(res));
    return true;
  }
  
  if (msg.type === "SET_API_BASE") {
    chrome.storage.local.set({ apiBase: msg.apiBase });
    sendResponse({ ok: true });
  }
});