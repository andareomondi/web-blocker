# Production Build Guide - Chrome Extension

## Building for Production

### Step 1: Build the Extension

Run the production build command:

```bash
npm run build
```

This creates a production-ready extension in `.output/chrome-mv3/`

### Step 2: Load the Production Extension

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

2. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to your project folder
   - Select the `.output/chrome-mv3` folder
   - Click "Select Folder"

3. **Extension is Now Installed!**
   - You'll see it in your extensions list
   - The icon will appear in your Chrome toolbar
   - It works without running `npm run dev`

### Step 3: Package for Distribution (Optional)

If you want to share or publish the extension:

```bash
npm run zip
```

This creates a `.zip` file in `.output/` that can be:
- Shared with others
- Submitted to Chrome Web Store
- Distributed manually

### Step 4: Installing from ZIP

**For others to install your extension:**

1. **Unzip the file** to a folder
2. **Open** `chrome://extensions/`
3. **Enable Developer mode**
4. **Click "Load unpacked"**
5. **Select the unzipped folder**

## Production vs Development

| Feature | Development (`npm run dev`) | Production (`npm run build`) |
|---------|----------------------------|------------------------------|
| Hot reload | ✅ Yes | ❌ No |
| File size | Larger | Optimized/minified |
| Source maps | ✅ Included | ❌ Removed |
| Performance | Good | Better |
| Use case | Development | End users |

## Updating the Production Extension

After making changes:

1. **Rebuild:**
   ```bash
   npm run build
   ```

2. **Reload in Chrome:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension card

## Publishing to Chrome Web Store

### Prerequisites
- Google Developer account ($5 one-time fee)
- Extension icon (128x128px)
- Screenshots
- Privacy policy (if collecting data)

### Steps

1. **Prepare Assets**
   ```
   ├── icon-16.png
   ├── icon-48.png
   ├── icon-128.png
   ├── screenshot-1.png
   ├── screenshot-2.png
   └── promotional-tile.png (440x280px)
   ```

2. **Create ZIP**
   ```bash
   npm run zip
   ```

3. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Click "New Item"

4. **Upload ZIP and Fill Details**
   - Upload the `.zip` file
   - Add title, description, category
   - Upload icons and screenshots
   - Set privacy practices

5. **Submit for Review**
   - Review can take 1-3 days
   - You'll receive email notification

## File Structure After Build

```
.output/chrome-mv3/
├── manifest.json           # Extension manifest
├── background.js           # Service worker (minified)
├── content-scripts/
│   └── content.js         # Content script (minified)
├── popup/
│   ├── index.html         # Popup HTML
│   └── assets/            # CSS, JS bundles
├── icons/                  # Extension icons
└── chunks/                 # Shared code chunks
```

## Troubleshooting Production Build

### Extension doesn't work after build

**Check console errors:**
1. Right-click extension icon → Inspect popup
2. Check Console tab for errors

**Common fixes:**
- Clear Chrome cache
- Rebuild: `npm run build`
- Remove and re-add extension

### "Manifest file is missing or unreadable"

**Solution:** Make sure you're selecting the `.output/chrome-mv3` folder, not the root project folder.

### Changes not reflecting

**Solution:** 
1. Rebuild the extension
2. Go to `chrome://extensions/`
3. Click refresh icon on your extension
4. Or remove and re-add the extension

## Best Practices

✅ **Always test production build** before distributing
✅ **Keep source code** in version control (Git)
✅ **Version your releases** (update `manifest.json` version)
✅ **Test on different machines** to ensure it works everywhere
✅ **Document any setup requirements** in README

## Distribution Options

### Option 1: Chrome Web Store (Recommended)
- Official distribution channel
- Automatic updates
- User reviews and ratings
- Requires $5 developer fee

### Option 2: Manual Distribution
- Share ZIP file directly
- Users load unpacked
- No automatic updates
- Free but less convenient

### Option 3: Enterprise Distribution
- For internal company use
- Can use Chrome policies
- No Chrome Web Store needed

## Continuous Deployment

For automated builds:

```json
// Add to package.json scripts
{
  "scripts": {
    "build": "wxt build",
    "build:firefox": "wxt build --browser firefox",
    "package": "npm run build && npm run zip"
  }
}
```

## Summary

🎯 **Quick Production Deploy:**
```bash
npm run build
# Load .output/chrome-mv3 in Chrome
```

🚀 **For Distribution:**
```bash
npm run zip
# Share the .zip file
```

Your extension is now ready to use without running development servers!
