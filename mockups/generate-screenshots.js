const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function generateScreenshots() {
  const browser = await chromium.launch();
  
  // Get absolute path to mockup file
  const mockupPath = path.resolve(__dirname, 'transfers-canvas-mockup.html');
  const mockupUrl = `file://${mockupPath}`;
  
  console.log(`\n📸 Generating Playwright screenshots...`);
  console.log(`📄 Mockup file: ${mockupPath}`);
  console.log(`🌐 URL: ${mockupUrl}\n`);
  
  // Define viewports to capture
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 1024, height: 768 },
    { name: 'mobile', width: 375, height: 667 },
  ];
  
  try {
    // Generate desktop, tablet, mobile screenshots
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      
      try {
        await page.goto(mockupUrl, { waitUntil: 'networkidle' });
        
        const filename = path.join(__dirname, `transfers-canvas-mockup-${viewport.name}.png`);
        await page.screenshot({ path: filename, fullPage: true });
        console.log(`✅ Generated: transfers-canvas-mockup-${viewport.name}.png (${viewport.width}×${viewport.height})`);
      } catch (error) {
        console.error(`❌ Failed to generate ${viewport.name} screenshot:`, error.message);
      } finally {
        await context.close();
      }
    }
    
    // Generate full page screenshot (desktop)
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    
    try {
      await page.goto(mockupUrl, { waitUntil: 'networkidle' });
      
      const filename = path.join(__dirname, `transfers-canvas-mockup-full.png`);
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`✅ Generated: transfers-canvas-mockup-full.png (full page)`);
      
      // Hover effect screenshot
      await page.hover('[data-entity="source"]');
      const hoverFilename = path.join(__dirname, `transfers-canvas-mockup-hover-source.png`);
      await page.screenshot({ path: hoverFilename, fullPage: false });
      console.log(`✅ Generated: transfers-canvas-mockup-hover-source.png (with hover effect)`);
      
    } catch (error) {
      console.error(`❌ Failed to generate full page screenshot:`, error.message);
    } finally {
      await context.close();
    }
    
    console.log(`\n✨ Screenshot generation complete!\n`);
    console.log(`Generated files in mockups/ directory:`);
    console.log(`  - transfers-canvas-mockup-desktop.png`);
    console.log(`  - transfers-canvas-mockup-tablet.png`);
    console.log(`  - transfers-canvas-mockup-mobile.png`);
    console.log(`  - transfers-canvas-mockup-full.png`);
    console.log(`  - transfers-canvas-mockup-hover-source.png\n`);
    
  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
  } finally {
    await browser.close();
  }
}

generateScreenshots().catch(console.error);
