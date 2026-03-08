import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import type { CompatCategory, CompatProduct } from "../lib/getProducts.ts";
import { oandoCatalog } from "../lib/catalog.ts";
import { auditCompatProduct, collectProductImages } from "../lib/productSpecSchema.ts";

config({ path: resolve(process.cwd(), ".env.local") });

type AuditRow = {
  categoryId: string;
  seriesId: string;
  seriesName: string;
  productId: string;
  productName: string;
  slug: string;
  severity: string;
  issueCode: string;
  issueMessage: string;
  imageCount: number;
};

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function toCompatFallbackCatalog(): CompatCategory[] {
  return oandoCatalog.map((category) => ({
    id: category.id.replace(/^oando-/, ""),
    name: category.name,
    description: category.description,
    series: category.series.map((series) => ({
      id: series.id,
      name: series.name,
      description: series.description,
      products: series.products.map((product) => ({
        id: product.id,
        slug: product.id,
        name: product.name,
        description: product.description,
        flagshipImage: product.flagshipImage,
        sceneImages: product.sceneImages,
        variants: product.variants,
        detailedInfo: product.detailedInfo,
        metadata: product.metadata || {},
        technicalDrawings: product.technicalDrawings,
        documents: product.documents,
        images: [product.flagshipImage, ...product.sceneImages].filter(Boolean),
      })),
    })),
  }));
}

async function main() {
  const catalog = toCompatFallbackCatalog();
  const rows: AuditRow[] = [];
  const issueCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  let productCount = 0;

  for (const category of catalog) {
    for (const series of category.series) {
      for (const product of series.products) {
        productCount += 1;
        categoryCounts.set(category.id, (categoryCounts.get(category.id) || 0) + 1);
        const issues = auditCompatProduct(category.id, product as CompatProduct);
        for (const issue of issues) {
          rows.push({
            categoryId: category.id,
            seriesId: series.id,
            seriesName: series.name,
            productId: product.id,
            productName: product.name,
            slug: product.slug || "",
            severity: issue.severity,
            issueCode: issue.code,
            issueMessage: issue.message,
            imageCount: collectProductImages(product as CompatProduct).length,
          });
          issueCounts.set(issue.code, (issueCounts.get(issue.code) || 0) + 1);
        }
      }
    }
  }

  const summary = {
    auditedAt: new Date().toISOString(),
    productsAudited: productCount,
    issueRows: rows.length,
    categories: Array.from(categoryCounts.entries())
      .map(([categoryId, count]) => ({ categoryId, count }))
      .sort((a, b) => a.categoryId.localeCompare(b.categoryId)),
    issues: Array.from(issueCounts.entries())
      .map(([issueCode, count]) => ({ issueCode, count }))
      .sort((a, b) => b.count - a.count),
  };

  const outDir = resolve(process.cwd(), "docs", "audit");
  mkdirSync(outDir, { recursive: true });

  const csv = [
    [
      "categoryId",
      "seriesId",
      "seriesName",
      "productId",
      "productName",
      "slug",
      "severity",
      "issueCode",
      "issueMessage",
      "imageCount",
    ].join(","),
    ...rows.map((row) =>
      [
        row.categoryId,
        row.seriesId,
        row.seriesName,
        row.productId,
        row.productName,
        row.slug,
        row.severity,
        row.issueCode,
        row.issueMessage,
        row.imageCount,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ].join("\n");

  const markdown = [
    "# Product Quality Audit",
    "",
    `- Audited at: ${summary.auditedAt}`,
    `- Products audited: ${summary.productsAudited}`,
    `- Total issue rows: ${summary.issueRows}`,
    "",
    "## Issues by type",
    ...summary.issues.map((issue) => `- ${issue.issueCode}: ${issue.count}`),
    "",
    "## Products by category",
    ...summary.categories.map((entry) => `- ${entry.categoryId}: ${entry.count}`),
    "",
    "## First 40 issue rows",
    ...rows
      .slice(0, 40)
      .map(
        (row) =>
          `- ${row.categoryId}/${row.slug || row.productId}: ${row.issueCode} (${row.severity})`,
      ),
    "",
  ].join("\n");

  writeFileSync(resolve(outDir, "product-quality-audit.csv"), csv, "utf8");
  writeFileSync(
    resolve(outDir, "product-quality-audit.json"),
    JSON.stringify({ summary, rows }, null, 2),
    "utf8",
  );
  writeFileSync(resolve(outDir, "product-quality-audit.md"), markdown, "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
