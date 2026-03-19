import fs from 'fs';
import path from 'path';

const filesToClean = [
  'app/custom-components.css',
  'app/typography.css',
  'app/globals.css',
  'app/color-contrast.css'
];

filesToClean.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace font sizes
    content = content.replace(/var\(--ref-size-\d{3}\)/g, 'var(--type-body-size)');

    // Replace colors in box-shadow with a soft neutral shadow
    content = content.replace(/box-shadow:(.*?)var\(--ref-color-\d{3}\)/g, 'box-shadow:$1rgba(10, 14, 51, 0.1)');
    
    // Replace colors in borders with neutral border
    content = content.replace(/border-color:(.*?)var\(--ref-color-\d{3}\)/g, 'border-color:$1var(--color-neutral-200)');
    
    // Replace remaining ref colors (likely gradients/backgrounds) with primary
    content = content.replace(/var\(--ref-color-\d{3}\)/g, 'var(--color-primary)');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned ${file}`);
  }
});
