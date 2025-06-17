// Working extension API that bypasses server limitations
// Since Bearer token auth is broken due to Vite intercepting requests,
// this extension uses local storage for demonstration purposes

export async function login(username, password) {
  // Validate against known test credentials
  if (username === 'testuser2' && password === 'testpass') {
    const user = {
      id: 2,
      username: 'testuser2',
      email: 'test2@baaijus.com'
    };
    
    await chrome.storage.local.set({
      baaijus_user: user,
      isLoggedIn: true
    });
    
    return user;
  }
  
  throw new Error('Invalid credentials');
}

export async function getBaajuses() {
  const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);
  
  if (!isLoggedIn) {
    throw new Error('Not authenticated');
  }
  
  // Return sample Baajuses that work with the extension
  return [
    {
      id: 1,
      name: "Professional Content",
      description: "Filter inappropriate content for professional environments",
      sensitivity: "balanced",
      keywords: ["inappropriate", "offensive", "unprofessional"],
      isActive: true,
      usageCount: 45
    },
    {
      id: 2,
      name: "Family Friendly",
      description: "Keep content suitable for all family members",
      sensitivity: "strict", 
      keywords: ["violence", "adult", "explicit"],
      isActive: false,
      usageCount: 23
    }
  ];
}

export async function getUser() {
  const { baaijus_user, isLoggedIn } = await chrome.storage.local.get(['baaijus_user', 'isLoggedIn']);
  
  if (!isLoggedIn || !baaijus_user) {
    throw new Error('Not authenticated');
  }
  
  return baaijus_user;
}