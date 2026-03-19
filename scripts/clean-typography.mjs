import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/typography.css');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We only loaded Montserrat 600/700 and Inter 400/600
  // Map legacy float weights to our highly strict discrete scale

  content = content.replace(/font-weight:\s*250;/g, 'font-weight: 600;');
  content = content.replace(/font-weight:\s*300;/g, 'font-weight: 600;');
  content = content.replace(/font-weight:\s*350;/g, 'font-weight: 400;');
  content = content.replace(/font-weight:\s*500;/g, 'font-weight: 600;');
  content = content.replace(/font-weight:\s*550;/g, 'font-weight: 600;');
  content = content.replace(/font-weight:\s*425;/g, 'font-weight: 400;');

  // Inject font-family: var(--font-sans) into some text-based classes that don't have it explicitly
  // Like .typ-eyebrow, .typ-label, .typ-nav, .typ-stat
  const injectSans = (str) => {
    return str.replace(/(font-size:\s*var\([^)]+\);)/, 'font-family: var(--font-sans);\n    $1');
  };

  // We are keeping it simple, let's just do a blanket regex to add font-family everywhere it's missing but has font-size
  // Actually, wait, it's safer to just let them inherit the global body font, which IS var(--font-sans) 
  // defined in theme-tokens.css -> @layer base body { font-family: var(--font-sans); }
  // Yes! We don't need to manually inject font-family, they inherit Inter natively! We just needed to fix the weights.

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed orphan typography weights in typography.css');
}
