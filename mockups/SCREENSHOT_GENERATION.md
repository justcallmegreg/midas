# Playwright Screenshot Generation Guide

## Overview

This guide explains how to generate screenshots of the Observe > Transfers canvas mockup using Playwright.

## Prerequisites

```bash
npm install -D @playwright/test
```

## Running the Screenshot Generator

```bash
cd mockups
node generate-screenshots.js
```

## Expected Output

The script generates 5 PNG screenshots:

### 1. Desktop Screenshot (1920×1080)
- **File**: `transfers-canvas-mockup-desktop.png`
- **Contents**:
  - All 3 sources (green boxes on left)
  - 4 accounts (yellow boxes in center)
  - 4 sinks (red boxes on right)
  - Animated timeline (vertical striped bar)
  - 9 connection lines (green/red colored)
  - Full legend at bottom
- **Viewport**: Full desktop view

### 2. Tablet Screenshot (1024×768)
- **File**: `transfers-canvas-mockup-tablet.png`
- **Contents**: Same as desktop but with reduced box sizes
- **Viewport**: Tablet landscape orientation

### 3. Mobile Screenshot (375×667)
- **File**: `transfers-canvas-mockup-mobile.png`
- **Contents**: Compact layout optimized for mobile
- **Viewport**: Mobile portrait orientation
- **Note**: May show scroll indicators

### 4. Full Page Screenshot (Desktop)
- **File**: `transfers-canvas-mockup-full.png`
- **Contents**: Complete page including header and legend
- **Viewport**: 1920×1080 (desktop)

### 5. Hover Effect Screenshot (Desktop + Hover)
- **File**: `transfers-canvas-mockup-hover-source.png`
- **Contents**: 
  - First source box in hovered state
  - Enhanced green glow effect
  - Scaled 1.05x
  - Connected lines highlighted
- **Viewport**: 1920×1080 (desktop)

## Script Details

### File: `generate-screenshots.js`

```javascript
// Import Playwright chromium browser
const { chromium } = require('@playwright/test');

// Creates browser instance
const browser = await chromium.launch();

// Creates new context (isolated browser session)
const context = await browser.newContext({ viewport: { ... } });

// Opens page and navigates to mockup
const page = await context.newPage();
await page.goto(mockupUrl);

// Captures screenshot
await page.screenshot({ path: filename, fullPage: true });
```

### How It Works

1. Launches Chromium browser instance
2. Creates isolated context for each viewport
3. Loads the mockup HTML file from disk
4. Waits for network idle (animations loaded)
5. Captures full page screenshots
6. Simulates hover effect on source box
7. Saves PNG files to mockups/ directory

## Visual Elements to Verify in Screenshots

### Colors (Fallout Aesthetic)
- ✅ Green sources: #0DF500 (neon glow)
- ✅ Yellow accounts: #FFD700 (neutral glow)
- ✅ Red sinks: #FF0000 (bright neon glow)
- ✅ Dark CRT background: #0A0E27
- ✅ Scanline effect overlay (subtle)

### Animations
- ✅ Timeline stripes (diagonal pattern)
- ✅ Box glows (neon shadows)
- ✅ Connection lines (colored strokes)

### Layout (Desktop)
- ✅ Sources positioned on left (X: 50-200)
- ✅ Timeline in center (X: 400-430)
- ✅ Accounts in center-right (X: 600-1100)
- ✅ Sinks on right (X: 1400-1550)

### Responsive Behavior
- **Tablet**: Boxes smaller, closer spacing
- **Mobile**: Even smaller boxes, may require horizontal scroll

### Hover State
- ✅ Glow enhanced (more bright)
- ✅ Box scales slightly (1.05x)
- ✅ Connection lines brighten
- ✅ Text remains readable

## Troubleshooting

### "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/
# Or use your package manager:
brew install node      # macOS
sudo apt install node  # Ubuntu/Debian
```

### "Cannot find module '@playwright/test'"
```bash
npm install -D @playwright/test
```

### "file:// URL not found"
Ensure `transfers-canvas-mockup.html` is in the same directory as `generate-screenshots.js`

### Screenshots are blank
1. Check browser console for errors
2. Ensure HTML file loads correctly in browser first
3. Verify Playwright chromium is installed: `npx playwright install`

## Manual Verification

If Playwright is unavailable, manually test the mockup:

1. **Open in Browser**: 
   ```
   open mockups/transfers-canvas-mockup.html
   ```

2. **Check Desktop (1920×1080)**:
   - Resize browser to 1920×1080
   - Verify all elements visible
   - Take screenshot with browser dev tools

3. **Check Tablet (1024×768)**:
   - Resize browser to 1024×768
   - Verify responsive layout
   - Take screenshot

4. **Check Mobile (375×667)**:
   - Resize browser to 375×667
   - Verify mobile layout
   - Take screenshot

5. **Test Hover Effects**:
   - Hover over each box
   - Observe glow enhancement
   - Observe scale change (1.05x)

6. **Test Animations**:
   - Observe timeline stripes moving downward
   - Observe scanline flicker (subtle)
   - Check smooth animation without stuttering

## Screenshot Naming Convention

```
transfers-canvas-mockup-{viewport}.png

{viewport} values:
- desktop    : 1920×1080 viewport
- tablet     : 1024×768 viewport
- mobile     : 375×667 viewport
- full       : Desktop full page
- hover-*    : Desktop with interaction
```

## Next Steps

Once screenshots are generated:

1. Review all 5 screenshots
2. Verify colors and glows match Fallout aesthetic
3. Check responsive behavior
4. Confirm animations work smoothly
5. Attach screenshots to design review
6. Provide feedback for Phase 2 implementation

## Files Generated Location

All screenshots are saved in the `mockups/` directory:
```
mockups/
├── transfers-canvas-mockup.html
├── generate-screenshots.js
├── transfers-canvas-mockup-desktop.png
├── transfers-canvas-mockup-tablet.png
├── transfers-canvas-mockup-mobile.png
├── transfers-canvas-mockup-full.png
└── transfers-canvas-mockup-hover-source.png
```

---

**Command to Generate**: `cd mockups && node generate-screenshots.js`
