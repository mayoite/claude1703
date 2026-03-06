/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = process.cwd();

// Directories to skip
const ignoreDirs = ['node_modules', '.git', '.next', 'build', 'out'];

// Supported original formats
const supportedExts = ['.png', '.jpg', '.jpeg'];

let totalFound = 0;
let totalConverted = 0;
let totalFailed = 0;

async function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (ignoreDirs.includes(file)) continue;
            await walkDir(fullPath);
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (supportedExts.includes(ext)) {
                totalFound++;
                
                // Replace extension with .webp
                const baseName = path.basename(fullPath, path.extname(fullPath));
                const webpPath = path.join(dir, baseName + '.webp');

                try {
                    // Convert to WebP using sharp
                    await sharp(fullPath).webp({ quality: 80 }).toFile(webpPath);
                    // Delete the original image
                    fs.unlinkSync(fullPath);
                    console.log(`✅ Converted & Deleted: ${path.relative(projectRoot, fullPath)} -> .webp`);
                    totalConverted++;
                } catch (err) {
                    console.error(`❌ Failed on ${path.relative(projectRoot, fullPath)}:`, err.message);
                    totalFailed++;
                }
            }
        }
    }
}

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  BATCH WEBP CONVERSION STARTED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await walkDir(projectRoot);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Done! Found: ${totalFound} | Converted: ${totalConverted} | Failed: ${totalFailed}`);
}

main();
