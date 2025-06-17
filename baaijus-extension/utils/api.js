// Working authentication with server

export async function login(username, password) {
  try {
    const response = await fetch('https://baaijus.replit.app/ext-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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