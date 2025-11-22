# Beginner's Toolkit: Building Chrome Extensions with WXT Framework

**Moringa AI Capstone Project**  
**Technology:** WXT (Web Extension Tools) + React + TypeScript  
**Project:** Website Blocker with Grace Period System

---

## 1. Title & Objective

### What Technology Did I Choose?
**WXT Framework** - A modern, type-safe framework for building cross-browser extensions with React, Vue, or Svelte support.

### Why This Technology?
- **Modern Development Experience:** Hot module replacement, TypeScript support, and React integration
- **Cross-Browser Compatibility:** Write once, deploy to Chrome, Firefox, Safari, and Edge
- **Better Than Traditional Extensions:** Eliminates boilerplate and provides intuitive API abstractions
- **Growing Ecosystem:** Active community and excellent documentation

### End Goal
Build a functional Chrome extension that:
1. Blocks specified websites with customizable rules
2. Implements a grace period system with unique access keys
3. Enforces time-based restrictions (3 grace periods per hour)
4. Provides an intuitive user interface for management
5. Stores data persistently using Chrome's local storage

---

## 2. Quick Summary of the Technology

### What is WXT?
WXT (Web Extension Tools) is a next-generation framework for building browser extensions. It provides a modern developer experience with features like:
- **File-based routing** for extension pages
- **Automatic manifest generation** from configuration
- **Hot module replacement** during development
- **TypeScript-first** architecture
- **Framework agnostic** (React, Vue, Svelte support)

### Where is it Used?
- Browser extension development for Chrome, Firefox, Edge, and Safari
- Developer tools and productivity extensions
- Content blockers and privacy tools
- Browser automation and enhancement tools

### Real-World Example
**Grammarly Chrome Extension** could theoretically be built with WXT, benefiting from:
- Content scripts for text analysis on any webpage
- Background workers for AI processing
- Popup UI for settings and suggestions
- Persistent storage for user preferences

---

## 3. System Requirements

### Operating System
- **Windows:** 10 or later
- **macOS:** 10.15 (Catalina) or later
- **Linux:** Ubuntu 20.04 or equivalent

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x or later | JavaScript runtime |
| npm | 9.x or later | Package manager |
| Chrome Browser | Latest | Testing environment |
| VS Code | Latest | Code editor (recommended) |
| Git | 2.x or later | Version control |

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- React Developer Tools

---

## 4. Installation & Setup Instructions

### Step 1: Verify Node.js Installation

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher
```

If not installed, download from: https://nodejs.org/

### Step 2: Create New WXT Project

```bash
# Create new project with React template
npm create wxt@latest website-blocker

# When prompted, choose:
# - Package Manager: npm
# - Template: react
# - TypeScript: Yes
```

### Step 3: Navigate to Project Directory

```bash
cd website-blocker
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Project Structure Setup

Create the following folder structure:

```
website-blocker/
├── entrypoints/
│   ├── background.ts
│   ├── content.ts
│   └── popup/
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       └── App.css
├── types/
│   └── index.ts
├── utils/
│   └── storage.ts
├── wxt.config.ts
├── package.json
└── tsconfig.json
```

### Step 6: Configure WXT

Update `wxt.config.ts`:

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Website Blocker with Grace Period',
    description: 'Block websites with optional grace period access',
    version: '1.0.0',
    permissions: [
      'storage',
      'tabs',
      'webNavigation',
      'activeTab'
    ],
    host_permissions: ['<all_urls>'],
  },
});
```

### Step 7: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
✔ Building chrome-mv3 for development
  → .output/chrome-mv3
✔ Ready in 2.3s
```

### Step 8: Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the `.output/chrome-mv3` folder
6. Extension appears in toolbar ✓

---

## 5. Minimal Working Example

### Example 1: Simple Content Script

**File:** `entrypoints/content.ts`

```typescript
export default defineContentScript({
  matches: ['*://example.com/*'],
  main() {
    console.log('Hello from content script!');
    document.body.style.border = '5px solid red';
  },
});
```

**Expected Output:**
- Visit `example.com`
- Page will have a red border
- Console shows: "Hello from content script!"

### Example 2: Background Service Worker

**File:** `entrypoints/background.ts`

```typescript
export default defineBackground({
  main() {
    console.log('Background script loaded!');
    
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Extension installed successfully!');
    });
  },
});
```

**Expected Output:**
- Check background console: Right-click extension → "Inspect service worker"
- See: "Background script loaded!"

### Example 3: Simple Popup UI

**File:** `entrypoints/popup/App.tsx`

```tsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <h1>Hello WXT!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;
```

**Expected Output:**
- Click extension icon
- See popup with counter
- Click button to increment

---

## 6. AI Prompt Journal

### Prompt 1: Understanding WXT Framework
**Prompt:**
```
Explain WXT framework for building browser extensions. What are its key features 
and how does it differ from traditional Chrome extension development?
```

**Response Summary:**
- WXT provides modern developer experience with TypeScript support
- Auto-generates manifest.json from config
- Supports hot module replacement
- Framework-agnostic with React/Vue/Svelte support

**Evaluation:** ⭐⭐⭐⭐⭐ (5/5)  
Very clear explanation. Helped understand core concepts immediately.

---

### Prompt 2: Project Architecture
**Prompt:**
```
Design a Chrome extension architecture for a website blocker with these features:
1. Block websites by URL
2. Grace period system with unique keys
3. Time-based restrictions (3 per hour)
4. Persistent storage
```

**Response Summary:**
- Suggested using background service worker for blocking logic
- Content scripts for UI injection
- Chrome storage API for persistence
- Popup for management interface

**Evaluation:** ⭐⭐⭐⭐ (4/5)  
Good architecture but needed refinement for grace period implementation.

---

### Prompt 3: Storage Implementation
**Prompt:**
```
Create a TypeScript utility module for Chrome extension storage that handles:
- Blocked sites list
- Active grace periods
- Grace period history tracking
- Hourly limit enforcement
```

**Response Summary:**
- Provided complete storage utility with all CRUD operations
- Implemented hourly tracking using timestamp-based keys
- Included helper functions for URL pattern matching

**Evaluation:** ⭐⭐⭐⭐⭐ (5/5)  
Production-ready code with minimal modifications needed.

---

### Prompt 4: URL Pattern Matching
**Prompt:**
```
How do I differentiate between youtube.com and youtube.com/shorts/ when blocking? 
The current regex treats them the same.
```

**Response Summary:**
- Suggested including pathname in regex pattern
- Modified urlToPattern function to handle paths
- Explained difference between hostname-only and path-specific blocking

**Evaluation:** ⭐⭐⭐⭐⭐ (5/5)  
Solved the issue perfectly. Now paths are treated independently.

---

### Prompt 5: Grace Period Flow
**Prompt:**
```
The page reloads immediately after generating the grace period key, not giving 
users time to save it. How do I fix this?
```

**Response Summary:**
- Removed automatic reload from background script
- Added "Unlock Site Now" button in UI
- User manually triggers reload after saving key

**Evaluation:** ⭐⭐⭐⭐⭐ (5/5)  
Perfect solution. Much better user experience.

---

### Prompt 6: Timer Overlay
**Prompt:**
```
When a site is unlocked with a grace period, show a timer overlay in the 
top-right corner instead of blocking the page completely.
```

**Response Summary:**
- Created showTimerOverlay function
- Floating timer with countdown
- Auto-blocks when time expires

**Evaluation:** ⭐⭐⭐⭐⭐ (5/5)  
Beautiful implementation with smooth animations.

---

## 7. Common Issues & Fixes

### Issue 1: "Module not found: storage"

**Error Message:**
```
ERROR: Cannot find module '../utils/storage'
```

**Cause:** Import path incorrect or file doesn't exist

**Fix:**
1. Check file exists at `utils/storage.ts`
2. Use relative path: `import { blockerStorage } from '../utils/storage'`
3. Ensure file exports: `export const blockerStorage = { ... }`

---

### Issue 2: "Default export not found in background.ts"

**Error Message:**
```
entrypoints\background.ts: Default export not found, did you forget 
to call "export default defineBackground(...)"?
```

**Cause:** Incorrect export syntax

**Fix:**
```typescript
// ❌ Wrong
export default defineBackground(() => {
  // code
});

// ✅ Correct
export default defineBackground({
  main() {
    // code
  },
});
```

---

### Issue 3: Storage Naming Conflict

**Error Message:**
```
WARN: Duplicated imports "storage", the one from "wxt/utils/storage" 
has been ignored
```

**Cause:** WXT has built-in storage utility with same name

**Fix:**
Rename your storage to avoid conflict:
```typescript
// Change from 'storage' to 'blockerStorage'
export const blockerStorage = { ... }
```

---

### Issue 4: Content Script Not Injecting

**Symptom:** Block screen doesn't appear on blocked sites

**Cause:** Permissions not set or content script not registered

**Fix:**
1. Check `wxt.config.ts` has correct permissions:
```typescript
permissions: ['storage', 'tabs', 'webNavigation', 'activeTab'],
host_permissions: ['<all_urls>']
```

2. Ensure content script exports correctly:
```typescript
export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // your code
  },
});
```

3. Reload extension: `chrome://extensions/` → Click refresh icon

---

### Issue 5: Grace Period Not Working

**Symptom:** Entering valid key doesn't unlock site

**Cause:** URL matching logic mismatch

**Fix:**
Store base blocked site URL in grace period, not current page URL:
```typescript
async addGracePeriod(siteUrl: string, duration: number) {
  const matchingSite = data.blockedSites.find(site => {
    const regex = new RegExp(site.pattern);
    return regex.test(siteUrl);
  });
  
  // Use matchingSite.url instead of siteUrl
  const gracePeriod: GracePeriod = {
    url: matchingSite ? matchingSite.url : siteUrl,
    // ...
  };
}
```

---

### Issue 6: Multiple Windows Opening

**Symptom:** Opening blocked site creates many tabs/windows

**Cause:** Navigation listener firing multiple times

**Fix:**
1. Use `tabs.onUpdated` instead of `webNavigation.onBeforeNavigate`
2. Track checked tabs to prevent duplicates:
```typescript
const checkedTabs = new Set<string>();
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const tabKey = `${tabId}-${tab.url}`;
  if (checkedTabs.has(tabKey)) return;
  checkedTabs.add(tabKey);
  // ... rest of logic
});
```

---

### Issue 7: Extension Doesn't Work After Build

**Symptom:** Production build loads but doesn't function

**Cause:** Source maps or dev-only code in production

**Fix:**
1. Run clean build:
```bash
rm -rf .output
npm run build
```

2. Load fresh: Remove extension from Chrome, then re-add `.output/chrome-mv3`

3. Check console for errors: Right-click extension → Inspect

---

## 8. References

### Official Documentation
- **WXT Framework:** https://wxt.dev/
- **Chrome Extensions API:** https://developer.chrome.com/docs/extensions/
- **Chrome Storage API:** https://developer.chrome.com/docs/extensions/reference/storage/
- **React Documentation:** https://react.dev/

### Tutorials & Guides
- **WXT Getting Started:** https://wxt.dev/get-started/installation.html
- **Chrome Extension Manifest V3:** https://developer.chrome.com/docs/extensions/mv3/intro/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

### Video Resources
- **Chrome Extensions Tutorial:** https://www.youtube.com/watch?v=uV4L-wcnK3Y
- **WXT Framework Overview:** https://www.youtube.com/watch?v=xXrBN3Ctq1U
- **React Crash Course:** https://www.youtube.com/watch?v=w7ejDZ8SWv8

### Helpful Blogs
- **Building Modern Chrome Extensions:** https://web.dev/tags/extensions/
- **Extension Best Practices:** https://developer.chrome.com/docs/extensions/mv3/best_practices/

### Community Resources
- **WXT Discord:** https://discord.gg/ZFsZqGery9
- **Chrome Extensions Stack Overflow:** https://stackoverflow.com/questions/tagged/google-chrome-extension
- **Reddit r/webextensions:** https://www.reddit.com/r/webextensions/

### GitHub Examples
- **WXT Examples:** https://github.com/wxt-dev/wxt/tree/main/examples
- **Chrome Extension Samples:** https://github.com/GoogleChrome/chrome-extensions-samples
- **This Project:** [Your GitHub Repository URL]

---

## 9. Key Learnings & Reflections

### What I Learned
1. **Modern Frameworks Matter:** WXT made extension development 10x easier than traditional methods
2. **AI as a Learning Partner:** GenAI helped me iterate quickly and solve complex problems
3. **TypeScript Benefits:** Type safety caught many bugs before runtime
4. **User Experience Design:** Grace period flow required multiple iterations to get right
5. **State Management:** Chrome storage API is powerful but requires careful planning

### Challenges Overcome
- Understanding Chrome extension architecture
- Implementing time-based restrictions correctly
- Handling URL pattern matching for paths
- Preventing navigation loops
- Managing state across background, content, and popup scripts

### AI's Impact on Productivity
- **Reduced Learning Curve:** From weeks to days
- **Faster Debugging:** AI helped identify issues quickly
- **Code Quality:** Suggestions improved architecture
- **Documentation:** AI helped explain complex concepts clearly

### What I Would Do Differently
- Start with simpler features and add complexity gradually
- Write tests from the beginning
- Plan storage schema more carefully upfront
- Document architecture decisions earlier

---

## 10. Project Features Summary

### Core Functionality
✅ Block websites by URL pattern  
✅ Path-specific blocking (e.g., youtube.com/shorts)  
✅ Grace period system (30 seconds - 9 minutes random)  
✅ Unique access key generation (8 characters)  
✅ Hourly limit enforcement (3 grace periods max)  
✅ Persistent storage using Chrome local storage  
✅ Beautiful UI with gradient design  
✅ Timer overlay showing remaining access time  
✅ Manual key entry for re-access  

### Technical Highlights
- **Architecture:** Background worker + Content script + Popup UI
- **Framework:** WXT + React + TypeScript
- **Storage:** Chrome Storage API with custom utility
- **Security:** Time-based key expiration
- **UX:** Non-intrusive timer overlay when unlocked

---

## 11. Testing & Iteration

### Peer Testing Session
**Tester:** [Peer Name]  
**Date:** [Testing Date]

**Feedback Received:**
1. ✅ "Easy to understand and install"
2. ✅ "Grace period flow is intuitive"
3. 🔧 "Needed clarification on path-specific blocking"
4. ✅ "Timer overlay is very helpful"

**Iterations Made:**
- Added clearer instructions in popup
- Improved error messages
- Enhanced README documentation

### Self-Testing Checklist
- [x] Extension installs without errors
- [x] Sites block correctly
- [x] Path-specific blocking works
- [x] Grace period generates unique keys
- [x] Keys unlock sites successfully
- [x] Timer overlay appears and counts down
- [x] Hourly limit enforced properly
- [x] Data persists after browser restart
- [x] Works across multiple tabs
- [x] Production build functions correctly

---

## 12. Future Enhancements

### Planned Features
- [ ] Schedule-based blocking (work hours only)
- [ ] Category presets (Social Media, News, Entertainment)
- [ ] Usage statistics and analytics
- [ ] Export/import blocked sites list
- [ ] Sync across devices
- [ ] Custom grace period durations
- [ ] Whitelist mode (allow only certain sites)

### Technical Improvements
- [ ] Unit tests for core functionality
- [ ] E2E tests with Playwright
- [ ] Better error handling
- [ ] Internationalization (i18n)
- [ ] Dark mode support
- [ ] Firefox and Edge compatibility

---

## Conclusion

This project demonstrates how modern tools like WXT and generative AI can dramatically accelerate learning and development. What traditionally would take weeks of reading documentation and trial-and-error was accomplished in days through strategic AI prompting and iterative development.

The Website Blocker extension is not just a functional tool—it's a testament to how beginners can leverage AI to build production-quality software while learning advanced concepts like browser extension architecture, TypeScript, and React.

**Key Takeaway:** With the right tools and AI assistance, the barrier to entry for complex technologies is lower than ever. The future of software development is collaborative—humans and AI working together to build amazing things.

---

**Project Repository:** [GitHub Link]  
**Live Demo:** [Video/Screenshots]  
**Contact:** [Your Email/LinkedIn]

---

*Built with ❤️ using WXT, React, TypeScript, and Claude AI*
