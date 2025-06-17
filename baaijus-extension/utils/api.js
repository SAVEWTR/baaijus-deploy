// Real API integration with session-based authentication

async function getApiBase() {
  const { apiBase } = await chrome.storage.local.get(['apiBase']);
  return apiBase || 'https://baaijus.replit.app/api';
}

export async function login(username, password) {
  const apiBase = await getApiBase();
  
  console.log('Extension login attempt:', { username, apiBase });
  
  try {
    const response = await fetch(`${apiBase}/ext/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Login error response:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.message || 'Login failed');
      } catch {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }
    }

    const user = await response.json();
    console.log('Login successful:', user);
    
    // Store token and user info for extension
    await chrome.storage.local.set({
      baaijus_user: user,
      baaijus_token: user.token,
      isLoggedIn: true
    });
    
    return user;
  } catch (error) {
    console.error('Login fetch error:', error);
    throw error;
  }
}

export async function getBaajuses() {
  const apiBase = await getApiBase();
  const { baaijus_token } = await chrome.storage.local.get(['baaijus_token']);
  
  if (!baaijus_token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${apiBase}/ext/baaijuses`, {
    headers: {
      'Authorization': `Bearer ${baaijus_token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear local auth state
      await chrome.storage.local.remove(['baaijus_user', 'baaijus_token', 'isLoggedIn']);
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