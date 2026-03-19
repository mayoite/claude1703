import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    try {
        if (!fs.existsSync('tmp')) {
            fs.mkdirSync('tmp');
        }
        const browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        
        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
        
        // Wait for Framer Motion and GSAP animations to settle
        await page.waitForTimeout(3000);
        
        console.log('Capturing desktop screenshot...');
        await page.screenshot({ path: 'tmp/audit_desktop.png', fullPage: true });
        
        console.log('Switching to mobile viewport...');
        await page.setViewportSize({ width: 375, height: 812 });
        // Wait for responsive adjustments and mobile menu/layout to settle
        await page.waitForTimeout(1500);
        
        console.log('Capturing mobile screenshot...');
        await page.screenshot({ path: 'tmp/audit_mobile.png', fullPage: true });
        
        await browser.close();
        console.log('Screenshots captured successfully to tmp/audit_desktop.png and tmp/audit_mobile.png.');
    } catch (e) {
        console.error('Error capturing screenshots:', e);
        process.exit(1);
    }
})();
