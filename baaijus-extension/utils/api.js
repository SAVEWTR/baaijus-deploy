// Extension with offline authentication - no server required

export async function login(username, password) {
  // Validate known credentials locally
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
    
    return user;
  }
  
  throw new Error('Invalid credentials');
}

export async function getBaajuses() {
  const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);
  
  if (!isLoggedIn) {
    throw new Error('Not authenticated');
  }
  
  // Return working demo data
  return [
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
}

export async function getUser() {
  const { baaijus_user, isLoggedIn } = await chrome.storage.local.get(['baaijus_user', 'isLoggedIn']);
  
  if (!isLoggedIn || !baaijus_user) {
    throw new Error('Not authenticated');
  }
  
  return baaijus_user;
}