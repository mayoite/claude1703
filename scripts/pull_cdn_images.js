const fs = require('fs');
const https = require('https');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
    path.join(__dirname, '..', 'scripts', 'seed_data.sql'),
    path.join(__dirname, '..', 'lib', 'catalog.ts'),
    path.join(__dirname, '..', 'scripts', 'catalog-seating.json'),
    path.join(__dirname, '..', 'scripts', 'catalog-workstations.json'),
    path.join(__dirname, '..', 'scripts', 'catalog-storage.json'),
    path.join(__dirname, '..', 'scripts', 'catalog-tables.json')
];

const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'catalog');

// Ensure directory exists
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

// Map of original URL -> local filename
const urlMap = new Map();

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) {
            return resolve(true); // Already downloaded
        }
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                fs.unlink(dest, () => { });
                return resolve(false); // Fail gracefully on 404s
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            resolve(false);
        });
    });
}

function generateLocalFilename(url) {
    // Extract the unique part of the filename, e.g., "6899aa009be5eb667a604f17_image%20(5).png"
    const urlParts = new URL(url).pathname.split('/');
    const filename = decodeURIComponent(urlParts[urlParts.length - 1]).replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    // Ensure unique names if there are collisions
    const uniqueId = urlParts[urlParts.length - 2];
    return `${uniqueId}_${filename}`;
}

async function start() {
    console.log('Scanning for cdn.prod.website-files.com URLs...');

    // 1. Collect all URLs
    const cdnRegex = /https:\/\/cdn\.prod\.website-files\.com\/[a-zA-Z0-9%\-_.\/]+/g;

    for (const filePath of DIRECTORIES_TO_SCAN) {
        if (!fs.existsSync(filePath)) continue;

        const content = fs.readFileSync(filePath, 'utf8');
        let match;
        while ((match = cdnRegex.exec(content)) !== null) {
            if (!urlMap.has(match[0])) {
                urlMap.set(match[0], generateLocalFilename(match[0]));
            }
        }
    }

    console.log(`Found ${urlMap.size} unique images to download. Downloading...`);

    // 2. Download all images
    let totalDownloaded = 0;
    const entries = Array.from(urlMap.entries());
    for (let i = 0; i < entries.length; i++) {
        const [url, filename] = entries[i];
        const dest = path.join(PUBLIC_IMAGES_DIR, filename);
        const success = await downloadImage(url, dest);
        if (success) {
            totalDownloaded++;
            process.stdout.write(`\rDownloaded ${totalDownloaded}/${urlMap.size}`);
        }
    }

    console.log('\nDownloads complete. Replacing URLs in files...');

    // 3. Replace URLs in files
    for (const filePath of DIRECTORIES_TO_SCAN) {
        if (!fs.existsSync(filePath)) continue;
        let content = fs.readFileSync(filePath, 'utf8');
        let changesMade = false;

        for (const [url, filename] of urlMap.entries()) {
            // Only replace if we successfully have a mapped local route
            const localPath = `/images/catalog/${filename}`;
            if (content.includes(url)) {
                // Replace all occurrences using split/join to avoid RegEx special character issues
                content = content.split(url).join(localPath);
                changesMade = true;
            }
        }

        if (changesMade) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${path.basename(filePath)}`);
        }
    }

    console.log('All done! No external references should remain in these files.');
}

start();
