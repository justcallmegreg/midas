/**
 * Playwright Script - Generate Mockup Screenshots
 * Fixed API: browser.newContext() instead of browser.createContext()
 * 
 * Installation:
 *   npm install -D @playwright/test
 * 
 * Run with:
 *   node mockups/playwright-mockup-screenshot.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateMockupScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Get the absolute path to the mockup HTML file
  const mockupPath = `file://${path.resolve(__dirname, 'transfers-canvas-mockup.html')}`;

  console.log(`📸 Loading mockup from: ${mockupPath}`);

  try {
    // Navigate to the mockup
    await page.goto(mockupPath, { waitUntil: 'networkidle' });

    // Wait for animations to settle
    await page.waitForTimeout(1000);

    // Screenshot 1: Full page
    console.log('📷 Taking screenshot 1: Full page view...');
    await page.screenshot({
      path: path.join(__dirname, 'transfers-canvas-mockup-full.png'),
      fullPage: true,
    });
    console.log('✅ Saved: transfers-canvas-mockup-full.png');

    // Screenshot 2: Desktop viewport (1920x1080)
    console.log('📷 Taking screenshot 2: Desktop (1920x1080)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: path.join(__dirname, 'transfers-canvas-mockup-desktop.png'),
      fullPage: true,
    });
    console.log('✅ Saved: transfers-canvas-mockup-desktop.png');

    // Screenshot 3: Tablet viewport (1024x768)
    console.log('📷 Taking screenshot 3: Tablet (1024x768)...');
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.screenshot({
      path: path.join(__dirname, 'transfers-canvas-mockup-tablet.png'),
      fullPage: true,
    });
    console.log('✅ Saved: transfers-canvas-mockup-tablet.png');

    // Screenshot 4: Mobile viewport (375x667)
    console.log('📷 Taking screenshot 4: Mobile (375x667)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: path.join(__dirname, 'transfers-canvas-mockup-mobile.png'),
      fullPage: true,
    });
    console.log('✅ Saved: transfers-canvas-mockup-mobile.png');

    // Screenshot 5: Hover effect (hover over a source box)
    console.log('📷 Taking screenshot 5: Hover effect...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Hover over first source box
    const firstSourceBox = await page.$('[data-id="src1"]');
    if (firstSourceBox) {
      await firstSourceBox.hover();
      await page.waitForTimeout(500); // Let glow effect settle
      await page.screenshot({
        path: path.join(__dirname, 'transfers-canvas-mockup-hover.png'),
        fullPage: true,
      });
      console.log('✅ Saved: transfers-canvas-mockup-hover.png');
    }

    console.log('\n✨ All screenshots generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - transfers-canvas-mockup-full.png');
    console.log('  - transfers-canvas-mockup-desktop.png');
    console.log('  - transfers-canvas-mockup-tablet.png');
    console.log('  - transfers-canvas-mockup-mobile.png');
    console.log('  - transfers-canvas-mockup-hover.png');

  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
}

// Run the function
generateMockupScreenshots();
