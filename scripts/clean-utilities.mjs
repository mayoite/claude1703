import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/theme-tokens.css');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to remove blocks like:
  // @utility text-ui-9 {
  //   font-size: var(--ref-size-001);
  // }
  // We'll remove @utility text-ui-*, leading-ui-*, tracking-ui-*
  
  content = content.replace(/@utility (text-ui-|leading-ui-|tracking-ui-)[^{]+\{\s*[^}]*\s*\}/g, '');
  
  // also clean up any empty lines introduced (multiple newlines to double newline)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Orphaned utilities stripped from theme-tokens.css');
}
