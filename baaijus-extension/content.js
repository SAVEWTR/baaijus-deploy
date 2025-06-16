// Content script - runs on every page to apply filtering
function getStorage(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function sendMessage(message) {
  return new Promise(resolve => chrome.runtime.sendMessage(message, resolve));
}

async function applyFiltering() {
  try {
    const { baaijus_token, active, selectedBaajus, apiBase } = await getStorage([
      "baaijus_token", 
      "active", 
      "selectedBaajus", 
      "apiBase"
    ]);

    if (!active || !baaijus_token) {
      return;
    }

    let baajusToUse = selectedBaajus;
    
    // If no specific Baajus selected, fetch the first active one
    if (!baajusToUse) {
      try {
        const response = await fetch(`${apiBase || 'http://localhost:5000/api'}/baajuses`, {
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const baajuses = await response.json();
          baajusToUse = baajuses.find(b => b.isActive) || baajuses[0];
          
          if (baajusToUse) {
            // Cache the selected Baajus
            await sendMessage({ type: "SET_SELECTED_BAAJUS", baajus: baajusToUse });
          }
        }
      } catch (error) {
        console.error('Baaijus: Failed to fetch filters', error);
        return;
      }
    }

    if (!baajusToUse || !baajusToUse.keywords) {
      return;
    }

    // Parse keywords
    const keywords = baajusToUse.keywords.split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    if (keywords.length === 0) {
      return;
    }

    // Apply filtering based on sensitivity level
    const sensitivity = baajusToUse.sensitivity || 'balanced';
    filterContent(keywords, sensitivity);
    
  } catch (error) {
    console.error('Baaijus: Error applying filtering', error);
  }
}

function filterContent(keywords, sensitivity) {
  const elements = document.querySelectorAll('p, div, span, article, h1, h2, h3, h4, h5, h6');
  
  elements.forEach(element => {
    if (element.hasAttribute('data-baaijus-filtered')) {
      return; // Already processed
    }
    
    const text = element.textContent.toLowerCase();
    const hasMatch = keywords.some(keyword => text.includes(keyword));
    
    if (hasMatch) {
      element.setAttribute('data-baaijus-filtered', 'true');
      
      switch (sensitivity) {
        case 'strict':
          // Hide completely
          element.style.display = 'none';
          break;
          
        case 'balanced':
          // Blur content with overlay
          element.style.filter = 'blur(5px)';
          element.style.position = 'relative';
          element.style.cursor = 'pointer';
          
          const overlay = document.createElement('div');
          overlay.style.position = 'absolute';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.right = '0';
          overlay.style.bottom = '0';
          overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
          overlay.style.display = 'flex';
          overlay.style.alignItems = 'center';
          overlay.style.justifyContent = 'center';
          overlay.style.fontSize = '12px';
          overlay.style.color = '#666';
          overlay.textContent = 'Content filtered by Baaijus - Click to view';
          overlay.style.pointerEvents = 'none';
          
          element.style.position = 'relative';
          element.appendChild(overlay);
          
          element.addEventListener('click', () => {
            element.style.filter = 'none';
            overlay.remove();
          });
          break;
          
        case 'permissive':
          // Just highlight
          element.style.backgroundColor = '#fff3cd';
          element.style.border = '1px solid #ffeaa7';
          element.style.borderRadius = '3px';
          element.style.padding = '2px';
          break;
      }
    }
  });
}

// Apply filtering when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyFiltering);
} else {
  applyFiltering();
}

// Also apply filtering when new content is added dynamically
const observer = new MutationObserver(() => {
  applyFiltering();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});