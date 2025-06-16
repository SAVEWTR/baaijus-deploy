# Baaijus Extension Installation Guide

## Quick Setup for Testing

1. **Download the Extension**
   - The complete extension is in the `baaijus-extension` folder
   - All files are ready for immediate testing

2. **Create Icon Files**
   - Open `create-icons.html` in your browser
   - It will automatically download the 3 required icon files
   - Save them in the `icons/` folder as `icon16.png`, `icon48.png`, `icon128.png`

3. **Load in Chrome/Edge**
   - Open `chrome://extensions/` in Chrome or `edge://extensions/` in Edge
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `baaijus-extension` folder
   - Extension will appear in your toolbar

4. **Test the Extension**
   - Click the Baaijus extension icon in your toolbar
   - Login with your Baaijus account credentials
   - Enable filtering via the toggle
   - Visit any website to see content filtering in action

## Current Configuration

The extension is configured to connect to your local development server:
- Backend: `http://localhost:5000/api`
- Frontend: `http://localhost:5000`

## Testing Content Filtering

1. **Setup Test Content**
   - Create a Baajus in your dashboard with test keywords (e.g., "example", "test")
   - Set sensitivity level (permissive/balanced/strict)

2. **Test Filtering**
   - Visit websites containing your test keywords
   - Observe different filtering behaviors based on sensitivity:
     - **Permissive**: Content highlighted with light background
     - **Balanced**: Content blurred with click-to-reveal
     - **Strict**: Content completely hidden

3. **Dynamic Content**
   - The extension automatically detects new content added to pages
   - Works with social media feeds, infinite scroll, etc.

## Production Deployment

When ready to deploy:

1. Update all localhost URLs to your production domain
2. Test authentication and filtering thoroughly
3. Package as ZIP file: `npm run package`
4. Submit to Chrome Web Store or distribute privately

## Troubleshooting

- **Login Issues**: Check browser console for authentication errors
- **Filtering Not Working**: Verify extension is enabled and user is logged in
- **Console Errors**: Check extension permissions and API connectivity

## Features

- Session-based authentication with your Baaijus backend
- Real-time content filtering across all websites
- Multiple sensitivity levels for different use cases
- Options page for advanced configuration
- Patent-pending filtering technology