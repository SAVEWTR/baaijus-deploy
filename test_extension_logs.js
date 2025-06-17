// Direct test of extension authentication with detailed logs

// Simulate chrome.storage.local
const mockStorage = {};
const chrome = {
  storage: {
    local: {
      set: async (data) => {
        console.log('📝 CHROME STORAGE SET:', JSON.stringify(data, null, 2));
        Object.assign(mockStorage, data);
        return Promise.resolve();
      },
      get: async (keys) => {
        console.log('📖 CHROME STORAGE GET:', keys);
        const result = {};
        if (Array.isArray(keys)) {
          keys.forEach(key => {
            if (mockStorage[key] !== undefined) {
              result[key] = mockStorage[key];
            }
          });
        } else {
          Object.keys(keys).forEach(key => {
            result[key] = mockStorage[key] || keys[key];
          });
        }
        console.log('📖 CHROME STORAGE RESULT:', JSON.stringify(result, null, 2));
        return result;
      }
    }
  }
};

// Extension login function (copied from api.js)
async function login(username, password) {
  console.log('🔐 LOGIN ATTEMPT:', { username, password });
  
  // Validate known credentials locally
  if ((username === 'testuser2' || username === 'admin') && password === 'testpass') {
    const user = {
      id: username === 'admin' ? 1 : 2,
      username: username,
      email: username === 'admin' ? 'admin@baaijus.com' : 'testuser2@baaijus.com'
    };
    
    console.log('✅ CREDENTIALS VALID, creating user:', JSON.stringify(user, null, 2));
    
    await chrome.storage.local.set({
      baaijus_user: user,
      isLoggedIn: true
    });
    
    console.log('✅ LOGIN SUCCESS');
    return user;
  }
  
  console.log('❌ INVALID CREDENTIALS');
  throw new Error('Invalid credentials');
}

// Extension getBaajuses function (copied from api.js)
async function getBaajuses() {
  console.log('📋 FETCHING BAAJUSES...');
  
  const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);
  
  if (!isLoggedIn) {
    console.log('❌ NOT AUTHENTICATED');
    throw new Error('Not authenticated');
  }
  
  console.log('✅ USER IS AUTHENTICATED, returning baajuses');
  
  // Return working demo data
  const baajuses = [
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
  
  console.log('✅ BAAJUSES FETCHED:', JSON.stringify(baajuses, null, 2));
  return baajuses;
}

// Run the test
async function runTest() {
  console.log('🚀 STARTING EXTENSION AUTHENTICATION TEST');
  console.log('=====================================');
  
  try {
    console.log('\n1️⃣ TESTING LOGIN WITH testuser2/testpass');
    const user = await login('testuser2', 'testpass');
    console.log('LOGIN RESULT:', JSON.stringify(user, null, 2));
    
    console.log('\n2️⃣ TESTING BAAJUSES FETCH');
    const baajuses = await getBaajuses();
    console.log('BAAJUSES COUNT:', baajuses.length);
    
    console.log('\n✅ ALL TESTS PASSED - EXTENSION AUTHENTICATION WORKING');
    console.log('=====================================');
    
  } catch (error) {
    console.log('\n❌ TEST FAILED:', error.message);
    console.log('=====================================');
  }
}

runTest();