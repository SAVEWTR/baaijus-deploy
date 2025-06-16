# Baaijus Browser Extension

A production-ready Chrome/Edge extension that connects to your Baaijus backend to provide real-time content filtering across all websites.

## Features

- **Seamless Authentication**: Login with your Baaijus account credentials
- **Real-time Filtering**: Apply your custom Baajuses to any webpage
- **Multiple Sensitivity Levels**: 
  - Permissive: Light highlighting of filtered content
  - Balanced: Blur content with click-to-reveal
  - Strict: Hide content completely
- **Smart Detection**: Automatically applies filtering when new content loads (AJAX/dynamic content)
- **Cross-browser Support**: Works with Chrome, Edge, Brave, and other Chromium-based browsers

## Installation

### For Testing (Development)

1. Clone or download this extension folder
2. Update the API endpoints in the files:
   - In `popup/popup.js`: Change `http://localhost:5000` to your backend URL
   - In `content.js`: Change `http://localhost:5000/api` to your backend API URL
   - In `options/options.js`: Update the default API base URL

3. Open Chrome/Edge and go to `chrome://extensions/`
4. Enable "Developer mode" (top right toggle)
5. Click "Load unpacked" and select the `baaijus-extension` folder
6. The extension icon should appear in your browser toolbar

### For Production Deployment

1. Update all localhost URLs to your production domain
2. Test thoroughly in development mode
3. Package the extension as a ZIP file
4. Submit to Chrome Web Store or distribute privately

## Usage

1. **First Setup**: Click the extension icon and login with your Baaijus credentials
2. **Configure**: Access extension options by right-clicking the icon → "Options"
3. **Filter Content**: The extension automatically applies your active Baajuses to websites
4. **Toggle On/Off**: Use the popup to quickly enable/disable filtering

## Configuration

### Extension Options
Access via right-click on extension icon → "Options"

- **Backend Server URL**: Configure your Baaijus server endpoint
- **Auto-enable on new domains**: Automatically apply filtering to new websites
- **Default Sensitivity**: Set fallback filtering level

### Backend Integration

The extension connects to your Baaijus backend using these endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout  
- `GET /api/baajuses` - Fetch user's filter profiles
- `GET /api/auth/user` - Get current user info

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage, scripting, activeTab, host permissions
- **Architecture**: Content script + background service worker + popup UI
- **Authentication**: Session-based with your backend
- **Real-time Updates**: MutationObserver for dynamic content

## File Structure

```
baaijus-extension/
├── manifest.json          # Extension configuration
├── background.js           # Service worker for messaging
├── content.js             # Content filtering logic
├── popup/
│   ├── index.html         # Popup interface
│   └── popup.js           # Popup functionality
├── options/
│   ├── index.html         # Options page
│   └── options.js         # Options management
├── utils/
│   └── api.js             # API helper functions
└── icons/                 # Extension icons (16x16, 48x48, 128x128)
```

## Development

### Testing Content Filtering

1. Install the extension in development mode
2. Login through the popup
3. Create test Baajuses in your main dashboard with keywords
4. Visit websites and observe filtering behavior
5. Check browser console for any errors

### Debugging

- **Background Script**: Check `chrome://extensions/` → Extension details → "Inspect views: background page"
- **Content Script**: Use browser DevTools on any webpage
- **Popup**: Right-click extension icon → "Inspect popup"

## Production Deployment

1. Update all localhost URLs to production domains
2. Test authentication flow end-to-end
3. Verify filtering works on various websites
4. Package and submit to Chrome Web Store

## Patent Pending

This extension implements patent-pending technology for personalized content filtering. See the main Baaijus application for more details.

---

**Baaijus - Content Filtering Made Personal**