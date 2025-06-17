// Real API integration with session-based authentication

async function getApiBase() {
  const { apiBase } = await chrome.storage.local.get(['apiBase']);
  return apiBase || 'http://localhost:5000/api';
}

export async function login(username, password) {
  const apiBase = await getApiBase();
  
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const user = await response.json();
  
  // Store session info locally for extension
  await chrome.storage.local.set({
    baaijus_user: user,
    isLoggedIn: true
  });
  
  return user;
}

export async function getBaajuses() {
  const apiBase = await getApiBase();
  
  const response = await fetch(`${apiBase}/baaijuses`, {
    credentials: 'include'
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear local auth state
      await chrome.storage.local.remove(['baaijus_user', 'isLoggedIn']);
      throw new Error('Not authenticated');
    }
    throw new Error('Failed to fetch baaijuses');
  }

  return response.json();
}

export async function getUser() {
  const { baaijus_user, isLoggedIn } = await chrome.storage.local.get(['baaijus_user', 'isLoggedIn']);
  
  if (!isLoggedIn || !baaijus_user) {
    throw new Error('Not authenticated');
  }
  
  return baaijus_user;
}