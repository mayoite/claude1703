const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'products', '[category]', 'FilterGrid.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const mapCode = `// ─── Product Card ─────────────────────────────────────────────────────────────

const PRICE_MAP: Record<string, string> = {
  budget: "₹4,999",
  mid: "₹14,999",
  premium: "₹34,999",
  luxury: "₹74,999",
};

function ProductCard({`;

content = content.replace('// ─── Product Card ─────────────────────────────────────────────────────────────\r\n\r\nfunction ProductCard({', mapCode);
content = content.replace('// ─── Product Card ─────────────────────────────────────────────────────────────\n\nfunction ProductCard({', mapCode);

const uiRegex = /<h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight">[\s\S]*?\{displayName\}[\s\S]*?<\/h3>[\s\S]*?<p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">/;

const uiReplacement = `<h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight">
            {displayName}
          </h3>
          {product.metadata?.priceRange && (
            <p className="text-xs font-bold text-primary mt-1">
              Starting from {PRICE_MAP[product.metadata.priceRange.toLowerCase()] || "Contact for price"}
            </p>
          )}
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">`;

content = content.replace(uiRegex, uiReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched FilterGrid.tsx');
