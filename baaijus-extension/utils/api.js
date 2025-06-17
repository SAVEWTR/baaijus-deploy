// Extension authentication using existing login endpoint

export async function login(username, password) {
  try {
    // Use the existing login endpoint that's already deployed
    const response = await fetch('https://baaijus.replit.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const user = await response.json();
    
    await chrome.storage.local.set({
      baaijus_user: user,
      isLoggedIn: true
    });
    
    return user;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

export async function getBaajuses() {
  const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);
  
  if (!isLoggedIn) {
    throw new Error('Not authenticated');
  }
  
  try {
    const response = await fetch('https://baaijus.replit.app/api/baajuses', {
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        await chrome.storage.local.remove(['baaijus_user', 'isLoggedIn']);
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch baaijuses');
    }

    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch baaijuses');
  }
}

export async function getUser() {
  const { baaijus_user, isLoggedIn } = await chrome.storage.local.get(['baaijus_user', 'isLoggedIn']);
  
  if (!isLoggedIn || !baaijus_user) {
    throw new Error('Not authenticated');
  }
  
  return baaijus_user;
}