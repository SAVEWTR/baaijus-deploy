// API utilities for Baaijus extension
function getApiBase() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_API_BASE" }, res => {
      resolve(res.apiBase || 'http://localhost:5000/api');
    });
  });
}

export async function login(username, password) {
  const apiBase = await getApiBase();
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
}

export async function getBaajuses(token) {
  const apiBase = await getApiBase();
  const response = await fetch(`${apiBase}/baajuses`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Baajuses');
  }

  return await response.json();
}

export async function getUser(token) {
  const apiBase = await getApiBase();
  const response = await fetch(`${apiBase}/auth/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return await response.json();
}