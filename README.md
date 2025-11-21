# Website Blocker Chrome Extension

A Chrome extension built with WXT and React that blocks websites with an optional grace period feature.

## Features

✅ **Block Any Website** - Add URLs to your block list
✅ **Grace Period System** - Request temporary access (30s - 9min random duration)
✅ **Unique Access Keys** - Generated keys expire after the grace period
✅ **Hourly Limits** - Maximum 3 grace periods per hour
✅ **Persistent Storage** - All data saved in Chrome's local storage
✅ **Beautiful UI** - Modern, gradient-based design

## Project Structure

```
website-blocker/
├── entrypoints/
│   ├── background.ts          # Service worker for blocking logic
│   ├── content.ts              # Content script for block screen
│   └── popup/
│       ├── App.tsx             # React popup component
│       └── App.css             # Popup styles
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   └── storage.ts              # Storage utilities
└── wxt.config.ts               # WXT configuration
```

## Installation

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` folder

### Production Build

```bash
npm run build
```

The production build will be in `.output/chrome-mv3/`.

## Usage

### Blocking a Website

1. Click the extension icon in your toolbar
2. Enter a URL (e.g., `facebook.com` or `https://twitter.com`)
3. Click "Add Site"

### Accessing a Blocked Site

When you visit a blocked website, you'll see a block screen with options:

#### Option 1: Request Grace Period
1. Click "Request Grace Period"
2. A unique key will be generated (e.g., `ABCD-1234`)
3. **Save this key!** You'll need it to access the site later
4. The page automatically reloads with access granted
5. Access expires after the random duration (30s - 9min)

#### Option 2: Enter Access Key
1. Click "Enter Access Key"
2. Type or paste your saved key
3. Click "Verify Key"
4. If valid, the page reloads with access granted

### Grace Period Limits

- **3 grace periods maximum per hour**
- Resets every hour (e.g., 2:00 PM - 3:00 PM)
- Counter visible in the extension popup

## Technical Details

### Storage Schema

```typescript
{
  blockedSites: [
    {
      id: "uuid",
      url: "example.com",
      pattern: "^https?://(www\\.)?example\\.com.*",
      addedAt: 1234567890
    }
  ],
  activeGracePeriods: [
    {
      key: "ABCD-1234",
      url: "example.com",
      expiresAt: 1234567890,
      duration: 300000
    }
  ],
  gracePeriodHistory: [
    {
      timestamp: 1234567890,
      hour: "2024-01-15-14"
    }
  ]
}
```

### URL Matching

The extension uses regex patterns to match URLs:
- Supports both HTTP and HTTPS
- Handles www and non-www variants
- Matches all paths and subdomains

Example: Blocking `example.com` blocks:
- `https://example.com`
- `http://www.example.com/page`
- `https://example.com/any/path`

### Random Duration Generation

Grace periods are randomly assigned between:
- **Minimum:** 30 seconds (30,000ms)
- **Maximum:** 9 minutes (540,000ms)

This prevents predictability and encourages mindful site access.

## Development

### Adding New Features

1. **Update Types** (`types/index.ts`)
2. **Modify Storage Logic** (`utils/storage.ts`)
3. **Update Background Script** (`entrypoints/background.ts`)
4. **Update UI** (`entrypoints/popup/App.tsx`)

### Testing

Test the extension thoroughly:
1. Add various URL formats (with/without http, www)
2. Test grace period requests and limits
3. Verify key generation and expiration
4. Test across different websites

### Debugging

- **Background script logs:** `chrome://extensions/` → Inspect service worker
- **Content script logs:** Right-click page → Inspect → Console
- **Popup logs:** Right-click extension icon → Inspect popup

## Permissions Explained

- `storage` - Save blocked sites and grace periods
- `tabs` - Manage tab behavior during blocking
- `webNavigation` - Detect when pages are loading
- `activeTab` - Access current tab information
- `<all_urls>` - Block any website the user specifies

## Troubleshooting

### Sites Not Blocking
- Check if the URL pattern is correct
- Reload the extension after adding sites
- Verify permissions are granted

### Grace Period Not Working
- Check if you've exceeded 3 requests this hour
- Ensure the key hasn't expired
- Verify Chrome sync is not interfering

### Block Screen Not Appearing
- Reload the page after adding to block list
- Check console for errors
- Ensure content script loaded properly

## Future Enhancements

Potential features to add:
- Schedule-based blocking (e.g., block during work hours)
- Category-based blocking (social media, news, etc.)
- Statistics and usage tracking
- Export/import blocked site lists
- Whitelist for specific paths
- Sync across devices

## License

MIT License - Feel free to modify and distribute

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using [WXT](https://wxt.dev/) and React
