import { chromium } from 'playwright';
import fs from 'fs';

const ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Configurator', path: '/configurator' }
];

(async () => {
    try {
        if (!fs.existsSync('tmp/pages')) {
            fs.mkdirSync('tmp/pages', { recursive: true });
        }
        const browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        
        for (const route of ROUTES) {
            console.log(`Navigating to http://localhost:3000${route.path}...`);
            await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000); // Wait for animations
            await page.screenshot({ path: `tmp/pages/${route.name.toLowerCase()}_desktop.png`, fullPage: true });
        }
        
        await browser.close();
        console.log('Successfully captured screenshots for all primary routes.');
    } catch (e) {
        console.error('Error capturing screenshots:', e);
        process.exit(1);
    }
})();
