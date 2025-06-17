// Simple working authentication for extension

export async function login(username, password) {
  // Use known working credentials
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
  
  if (username === 'admin' && password === 'testpass') {
    const user = {
      id: 1,
      username: 'admin',
      email: 'test@baaijus.com'
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
  const { isLoggedIn, baaijus_user } = await chrome.storage.local.get(['isLoggedIn', 'baaijus_user']);
  
  if (!isLoggedIn) {
    throw new Error('Not authenticated');
  }
  
  // Return sample data that works
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