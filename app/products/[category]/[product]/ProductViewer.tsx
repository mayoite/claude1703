"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type {
  CompatProduct as Product,
  ProductVariant,
} from "@/lib/getProducts";
import {
  ArrowLeft,
  ChevronRight,
  Share2,
  ShoppingCart,
  GitCompareArrows,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import ThreeViewer from "@/components/ThreeViewer";
import { Reviews } from "@/components/Reviews";
import { ProductGallery } from "@/components/ProductGallery";
import { useQuoteCart } from "@/lib/store/quoteCart";
import { useProductCompare } from "@/lib/store/productCompare";
import { CompareDock } from "@/components/products/CompareDock";
import {
  sanitizeDisplayText as normalizeDisplayText,
  filterMeaningfulDimensionText,
  filterMeaningfulMaterialList,
} from "@/lib/displayText";
import { PDP_ROUTE_COPY } from "@/data/site/routeCopy";

interface ProductViewerProps {
  product: Product;
  seriesName: string;
  categoryRoute: string;
  categoryId?: string;
  categoryName: string;
  productRoute: string;
}

export function sanitizeDisplayText(value: string): string {
  return String(value || "")
    .replace(/[�]+/g, "")
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€\u009d|â€"/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeDisplayList(values: string[]): string[] {
  return values.map((item) => normalizeDisplayText(item)).filter(Boolean);
}

export function ProductViewer({
  product,
  seriesName,
  categoryRoute,
  categoryId,
  categoryName,
  productRoute,
}: ProductViewerProps) {
  const addItem = useQuoteCart((state) => state.addItem);
  const compareItems = useProductCompare((state) => state.items);
  const toggleCompareItem = useProductCompare((state) => state.toggleItem);
  const searchParams = useSearchParams();
  const cleanName = (raw: string) => {
    if (!raw) return raw;
    const m = raw.match(/^([A-Z][a-z]+(?:[- ][A-Z][a-z0-9]*)?)\1/);
    if (m && m[1]) return m[1];
    if (raw.length > 30 && !raw.includes(" ")) {
      const cap = raw.match(/^[A-Z][a-z]+/);
      if (cap) return cap[0];
    }
    return raw;
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );
  const displayName = cleanName(normalizeDisplayText(product.name));

  const modelPath =
    selectedVariant?.threeDModelUrl ||
    product["3d_model"] ||
    product.threeDModelUrl ||
    "";
  const hasModelPath = modelPath.length > 0;

  const allImages = [
    ...(product.images || []),
    product.flagshipImage,
    ...(selectedVariant?.galleryImages || []),
    ...(product.sceneImages || []),
  ].filter(Boolean) as string[];

  const uniqueImages = Array.from(new Set(allImages));
  const swatchFallbackImage =
    product.flagshipImage ||
    product.images?.find(Boolean) ||
    product.sceneImages?.find(Boolean) ||
    uniqueImages[0] ||
    "";
  const productImageAlt =
    (product as unknown as { altText?: string }).altText ||
    (product.metadata as Record<string, unknown> | undefined)?.ai_alt_text?.toString() ||
    (product.metadata as Record<string, unknown> | undefined)?.aiAltText?.toString() ||
    `${displayName} in ${categoryName}`;
  const metadataRecord = product.metadata as Record<string, unknown> | undefined;

  useEffect(() => {
    // Basic anonymous tracking for recommendations
    let userId = localStorage.getItem("oando_user_id");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("oando_user_id", userId);
    }

    fetch("/api/tracking/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product.id }),
    }).catch(console.error);
  }, [product.id]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // When variants change, uniqueImages will update which resets the ProductGallery index implicitly
  };

  const [is3DMode, setIs3DMode] = useState(false);
  const [isModelAvailable, setIsModelAvailable] = useState(false);
  const [isCheckingModel, setIsCheckingModel] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!hasModelPath) {
      setIsModelAvailable(false);
      setIsCheckingModel(false);
      setIs3DMode(false);
      return;
    }

    const validateModel = async () => {
      setIsCheckingModel(true);
      try {
        const response = await fetch(modelPath, { method: "HEAD" });
        if (!cancelled) {
          const ok = response.ok;
          setIsModelAvailable(ok);
          if (!ok) setIs3DMode(false);
        }
      } catch {
        if (!cancelled) {
          setIsModelAvailable(false);
          setIs3DMode(false);
        }
      } finally {
        if (!cancelled) setIsCheckingModel(false);
      }
    };

    validateModel();
    return () => {
      cancelled = true;
    };
  }, [hasModelPath, modelPath]);

  const toText = (value: unknown): string => {
    if (typeof value === "string") return normalizeDisplayText(value);
    if (typeof value === "number") return String(value);
    return "";
  };
  const toStringList = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return sanitizeDisplayList(value.map((item) => String(item)));
  };
  const routeKey = (product.slug || product.id || "").trim();
  const compareId = `compare-${categoryId || "products"}-${routeKey}`;
  const inCompare = compareItems.some((item) => item.id === compareId);
  const rawFrom = searchParams.get("from");
  const safeFrom = rawFrom && rawFrom.length > 0 ? rawFrom.slice(0, 1500) : "";
  const encodedFrom = safeFrom ? encodeURIComponent(safeFrom) : "";
  const categoryRouteWithContext = safeFrom
    ? `${categoryRoute}?${safeFrom}`
    : categoryRoute;
  const productRouteWithContext = encodedFrom
    ? `${productRoute}?from=${encodedFrom}`
    : productRoute;

  const rawSpecs =
    product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? (product.specs as Record<string, unknown>)
      : {};

  const overview = normalizeDisplayText(
    product.detailedInfo?.overview || product.description || "",
  );
  const dimensions = filterMeaningfulDimensionText(
    toText(rawSpecs.dimensions) ||
      toText(rawSpecs.dimension) ||
      product.detailedInfo?.dimensions ||
      "",
  );
  const specMaterials = filterMeaningfulMaterialList(toStringList(rawSpecs.materials));
  const finishOptions = toStringList(rawSpecs.finish_options);
  const primaryMaterials = filterMeaningfulMaterialList(
    sanitizeDisplayList(product.detailedInfo?.materials?.filter(Boolean) || []),
  );
  const materials =
    specMaterials.length > 0
      ? specMaterials
      : primaryMaterials.length > 0
        ? primaryMaterials
        : [];
  const features = sanitizeDisplayList(
    product.detailedInfo?.features?.filter(
      (f: string) => f && f !== "MANUFACTURING" && f !== "Sustainability",
    ) || [],
  );
  const useCases = sanitizeDisplayList(
    Array.isArray(product.metadata?.useCase)
      ? product.metadata.useCase
      : toStringList(rawSpecs.use_case),
  );
  const warrantyYears = product.metadata?.warrantyYears;
  const warrantyRaw = toText(rawSpecs.warranty_text);
  const warrantyText = warrantyYears
    ? `${warrantyYears}-Year Warranty`
    : warrantyRaw;
  const certifications = sanitizeDisplayList([
    ...toStringList(rawSpecs.certifications),
    ...toStringList(metadataRecord?.certifications),
    ...(product.metadata?.bifmaCertified ? ["BIFMA Certified"] : []),
  ]);
  const certificationText = certifications.join(", ");
  const sustainabilityText =
    typeof product.metadata?.sustainabilityScore === "number"
      ? `Eco Score ${product.metadata.sustainabilityScore}/10`
      : toText(rawSpecs.sustainability_text);
  const quickConfig =
    toText(rawSpecs.configuration) ||
    toText(rawSpecs.type);
  const shortOverview = (() => {
    if (!overview) return "";
    const clean = overview.replace(/\s+/g, " ").trim();
    const sentenceMatch = clean.match(/^[^.!?]+[.!?]\s*[^.!?]*[.!?]?/);
    if (sentenceMatch?.[0]) return sentenceMatch[0].trim();
    return clean.length > 180 ? `${clean.slice(0, 180).trim()}...` : clean;
  })();
  const fullOverview =
    overview && shortOverview && overview !== shortOverview ? overview : "";
  const specRows = [
    { label: "Dimensions", value: dimensions },
    ...(materials.length > 0
      ? [
          {
            label: "Materials",
            value: materials.slice(0, 3).join(", "),
          },
        ]
      : []),
    ...(finishOptions.length > 0
      ? [
          {
            label: "Finish Options",
            value: finishOptions.slice(0, 3).join(", "),
          },
        ]
      : []),
    { label: "Warranty", value: warrantyText },
    { label: "Certification", value: certificationText },
    { label: "Configuration", value: quickConfig },
    {
      label: "Use Case",
      value: useCases.length > 0 ? useCases.slice(0, 3).join(", ") : "",
    },
    { label: "Sustainability", value: sustainabilityText },
  ].filter((row) => row.value);
  const formatSpecLabel = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const toSpecText = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return sanitizeDisplayList(value.map((v) => String(v))).join(", ");
    if (typeof value === "object") return "";
    return normalizeDisplayText(String(value));
  };
  const inlineSpecs = (() => {
    const entries: Array<{ label: string; value: string }> = [];
    const seen = new Set<string>();
    const blocked = new Set([
      "category",
      "subcategory",
      "dimensions",
      "materials",
      "finish_options",
      "features",
      "documents",
      "document_titles",
      "certifications",
      "warranty_text",
      "warranty_years",
      "bifma_certified",
      "price_range",
      "overview_sections",
      "dimension_sections",
      "sustainability_text",
      "sustainability_score",
    ]);

    const addEntriesFromObject = (source: unknown) => {
      if (!source || typeof source !== "object" || Array.isArray(source)) return;
      for (const [rawKey, rawValue] of Object.entries(
        source as Record<string, unknown>,
      )) {
        const key = rawKey.toLowerCase();
        if (blocked.has(key) || seen.has(key)) continue;
        const value = toSpecText(rawValue);
        if (!value) continue;
        entries.push({ label: formatSpecLabel(rawKey), value });
        seen.add(key);
      }
    };

    addEntriesFromObject(product.specs);
    addEntriesFromObject(
      metadataRecord?.specifications,
    );
    return entries.slice(0, 16);
  })();

  const seriesShort = normalizeDisplayText(seriesName.replace(/ Series$/i, ""));
  const hasReturnContext = Boolean(encodedFrom);
  const returnLabel = hasReturnContext
    ? PDP_ROUTE_COPY.ctas.returnToResults
    : PDP_ROUTE_COPY.ctas.returnToCategory;
  const imageCount = uniqueImages.length > 0 ? uniqueImages.length : 1;
  const visualCoverageText = PDP_ROUTE_COPY.summary.visualCoverage.replace(
    "{count}",
    String(imageCount),
  );
  const modelStatusText = (() => {
    if (!hasModelPath) return PDP_ROUTE_COPY.summary.galleryOnly;
    if (isCheckingModel) return PDP_ROUTE_COPY.ctas.modelChecking;
    if (isModelAvailable) return PDP_ROUTE_COPY.summary.modelReady;
    return PDP_ROUTE_COPY.summary.modelConditional;
  })();
  const categoryLabel = normalizeDisplayText(categoryName);
  const headlineFacts = [
    { label: "Series", value: seriesShort },
    { label: "Category", value: categoryLabel },
    { label: "Configuration", value: quickConfig },
  ].filter((fact) => fact.value);
  const useCasePreview = useCases.slice(0, 4);
  const materialPreview = materials.slice(0, 3).join(", ");
  const finishPreview = finishOptions.slice(0, 3).join(", ");
  const summaryCards = [
    { label: PDP_ROUTE_COPY.summary.bestFor, value: useCasePreview.join(", ") },
    { label: PDP_ROUTE_COPY.ctas.configuration, value: quickConfig },
    { label: PDP_ROUTE_COPY.summary.dimensions, value: dimensions },
    {
      label:
        materials.length > 0
          ? PDP_ROUTE_COPY.summary.materials
          : finishOptions.length > 0
            ? "Finish Options"
            : PDP_ROUTE_COPY.summary.materials,
      value: materials.length > 0 ? materialPreview : finishPreview,
    },
  ].filter((card) => card.value);
  const assuranceCards = [
    warrantyText ? { label: "Warranty", value: warrantyText } : null,
    certificationText ? { label: "Certification", value: certificationText } : null,
    sustainabilityText ? { label: "Sustainability", value: sustainabilityText } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
  const handleAddToQuote = () =>
    addItem({
      id: `quote-${product.slug || product.id}`,
      name: displayName,
      image: uniqueImages[0],
      href: productRouteWithContext,
      qty: 1,
    });
  const handleCompareToggle = () =>
    toggleCompareItem({
      id: compareId,
      productUrlKey: routeKey,
      categoryId: categoryId || "products",
      name: displayName,
      image: uniqueImages[0],
      href: productRouteWithContext,
    });

  return (
    <section className="bg-white min-h-screen pb-24 sm:pb-28 lg:pb-0">
      {/* ── BREADCRUMB BAR ── */}
      <div className="border-b border-neutral-100 bg-white/90 backdrop-blur-sm sticky top-16 z-10">
        <div className="pdp-breadcrumb container flex h-10 items-center gap-1.5 px-6 2xl:px-0">
          <Link
            href="/products"
            className="hover:text-neutral-900 transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={categoryRouteWithContext}
            className="hover:text-neutral-900 transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">
            {displayName}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-112px)]">
        {/* ── LEFT: IMAGE GALLERY ── */}
        <div className="w-full lg:w-[58%] xl:w-[62%] flex flex-col pt-0 lg:pt-8 bg-neutral-100">
          <div className="flex-1 w-full max-w-[800px] mx-auto p-4 lg:p-8">
            <ProductGallery
              images={uniqueImages}
              productName={displayName}
            />
          </div>

          <div className="border-t border-neutral-200 bg-white/70 px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[800px] flex-wrap gap-2">
              <span className="pdp-chip pdp-chip--white">
                {visualCoverageText}
              </span>
              <span className="pdp-chip pdp-chip--white">
                {modelStatusText}
              </span>
              <span className="pdp-chip pdp-chip--white">{categoryLabel}</span>
            </div>
          </div>

          {/* 3D viewer toggle wrapper */}
          {hasModelPath && (
            <div className="w-full aspect-video bg-neutral-50 border-t border-neutral-200 relative group">
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isModelAvailable) return;
                    setIs3DMode((prev) => !prev);
                  }}
                  disabled={!isModelAvailable}
                  className={clsx(
                    "pdp-chip bg-white/90 px-3 py-1.5 backdrop-blur",
                    isModelAvailable
                      ? "text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors"
                      : "scheme-text-subtle cursor-not-allowed",
                  )}
                >
                  {is3DMode ? PDP_ROUTE_COPY.ctas.viewImage : PDP_ROUTE_COPY.ctas.view3d}
                </button>
              </div>
              {!isModelAvailable && !isCheckingModel && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
                  <p className="typ-overline text-neutral-500">
                    {PDP_ROUTE_COPY.ctas.modelUnavailable}
                  </p>
                </div>
              )}
              {isCheckingModel && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
                  <p className="typ-overline text-neutral-500">
                    {PDP_ROUTE_COPY.ctas.modelChecking}
                  </p>
                </div>
              )}

              {is3DMode && isModelAvailable ? (
                <div className="w-full h-full absolute inset-0 z-10 flex items-center justify-center bg-transparent">
                  <div className="hidden md:block w-full h-full">
                    <ThreeViewer
                      modelUrl={modelPath}
                      fallback={
                        <Image
                          src={uniqueImages[0]}
                          alt={productImageAlt}
                          width={1200}
                          height={900}
                          className="w-full h-full object-contain"
                        />
                      }
                    />
                  </div>
                  <div className="block md:hidden w-full h-full">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                      <model-viewer
                        src="${modelPath}"
                        ar
                        ios-src="${modelPath.replace(".glb", ".usdz")}"
                        camera-controls
                        shadow-intensity="1"
                        alt="3D model of ${displayName}"
                        style="width: 100%; height: 100%;"
                      ></model-viewer>
                    `,
                      }}
                    ></div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ── RIGHT: DETAILS PANEL ── */}
        <div className="w-full lg:w-[42%] xl:w-[38%] lg:sticky lg:top-[112px] lg:h-[calc(100vh-112px)] overflow-y-auto px-6 sm:px-10 lg:px-12 py-10 border-l border-neutral-100 scrollbar-hide">
          <div className="max-w-sm mx-auto lg:max-w-none">
            {/* Title block */}
            <div className="mb-8">
              <Link
                href={categoryRouteWithContext}
                className="pdp-action-label mb-4 inline-flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {returnLabel}
              </Link>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="pdp-chip pdp-chip--soft">
                  {seriesShort}
                </span>
                <span className="pdp-chip pdp-chip--soft">{categoryLabel}</span>
              </div>
              <p className="pdp-section-label mb-3">Product overview</p>
              <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 tracking-tight leading-[1.05] mb-5">
                {displayName}
              </h1>
              {shortOverview ? (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-light mb-6 max-w-prose">
                  {shortOverview}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 mb-6">
                {warrantyText ? (
                  <span className="pdp-chip pdp-chip--soft px-2.5">
                    {warrantyText}
                  </span>
                ) : null}
                {product.metadata?.bifmaCertified && (
                  <span className="pdp-chip pdp-chip--solid px-2.5">
                    BIFMA
                  </span>
                )}
                {typeof product.metadata?.sustainabilityScore === "number" && (
                  <span className="pdp-chip pdp-chip--success px-2.5">
                    Eco {product.metadata.sustainabilityScore}/10
                  </span>
                )}
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="pdp-chip pdp-chip--white">
                    {visualCoverageText}
                  </span>
                  <span className="pdp-chip pdp-chip--white">
                    {modelStatusText}
                  </span>
                </div>
                {headlineFacts.length > 0 ? (
                  <div className="mb-5 grid gap-3 border-b border-neutral-200 pb-5">
                    {headlineFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                      >
                        <p className="pdp-card-label">{fact.label}</p>
                        <p className="text-right text-sm leading-relaxed text-neutral-800">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {summaryCards.length > 0 ? (
                  <>
                    <p className="mb-2 text-sm font-medium text-neutral-900">
                      Product snapshot
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                      The quickest way to judge fit before drawings, quantities,
                      and commercial follow-up.
                    </p>
                    <div className="grid gap-3">
                      {summaryCards.map((card) => (
                        <div
                          key={card.label}
                          className="rounded-2xl border border-neutral-200 bg-white p-4"
                        >
                          <p className="pdp-card-label mb-2">
                            {card.label}
                          </p>
                          <p className="text-sm leading-relaxed text-neutral-800">
                            {card.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
                {assuranceCards.length > 0 ? (
                  <div className="mt-5 border-t border-neutral-200 pt-5">
                    <p className="pdp-card-label mb-3">Verified product facts</p>
                    <div className="grid gap-2">
                      {assuranceCards.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-relaxed text-neutral-700"
                        >
                          <span className="font-medium text-neutral-900">
                            {item.label}:
                          </span>{" "}
                          {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Variant swatches */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-7 border-t border-neutral-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="pdp-section-label">
                    {PDP_ROUTE_COPY.ctas.configuration}
                  </p>
                  <span className="scheme-text-muted text-xs">
                    {product.variants.length} options
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {product.variants.map((variant: ProductVariant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        type="button"
                        key={variant.id}
                        onClick={() => handleVariantChange(variant)}
                        title={variant.variantName}
                        className={clsx(
                          "w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-200",
                          isSelected
                            ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2 scale-110"
                            : "border-neutral-200 hover:border-neutral-500 hover:scale-105",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            variant.galleryImages?.[0] || product.flagshipImage
                          }
                          alt={variant.variantName}
                          className="w-full h-full object-cover scale-150"
                          onError={(e) => {
                            const el = e.currentTarget as HTMLImageElement;
                            if (!el.dataset.fallback) {
                              el.dataset.fallback = "1";
                              const originalSrc = el.getAttribute("src") || "";
                              if (
                                swatchFallbackImage &&
                                swatchFallbackImage !== originalSrc
                              ) {
                                el.src = swatchFallbackImage;
                              } else {
                                el.style.visibility = "hidden";
                              }
                            }
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-800">
                      Selected:
                    </span>{" "}
                    {selectedVariant.variantName}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="mb-8">
              <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                <p className="mb-2 text-sm font-medium text-neutral-900">
                  Take the next step
                </p>
                <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                  Build a shortlist, request a quote, or move into planning support
                  depending on where your team is in the decision.
                </p>
                <button
                  type="button"
                  onClick={handleAddToQuote}
                  className="group mb-2 flex w-full items-center justify-between rounded-2xl border border-primary px-6 py-4 text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <span className="pdp-action-label">
                    {PDP_ROUTE_COPY.ctas.addToQuote}
                  </span>
                  <ShoppingCart className="w-4 h-4" />
                </button>
                {routeKey ? (
                  <button
                    type="button"
                    onClick={handleCompareToggle}
                    className={clsx(
                      "group mb-2 flex w-full items-center justify-between rounded-2xl border px-6 py-4 transition-colors",
                      inCompare
                        ? "border-primary bg-primary text-white hover:bg-primary-hover"
                        : "border-neutral-300 text-neutral-800 hover:border-primary hover:text-primary",
                    )}
                  >
                    <span className="pdp-action-label">
                      {inCompare
                        ? PDP_ROUTE_COPY.ctas.addedToCompare
                        : PDP_ROUTE_COPY.ctas.addToCompare}
                    </span>
                    <GitCompareArrows className="w-4 h-4" />
                  </button>
                ) : null}
                <Link
                  href="/contact"
                  className="group flex w-full items-center justify-between rounded-2xl bg-neutral-900 px-6 py-4 text-white transition-colors hover:bg-neutral-800"
                >
                  <span className="pdp-action-label">
                    {PDP_ROUTE_COPY.ctas.requestQuote}
                  </span>
                  <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/planning"
                    className="group flex items-center justify-between rounded-2xl border border-neutral-200 px-5 py-3.5 text-neutral-900 transition-colors hover:border-neutral-400"
                  >
                    <span className="pdp-action-label">
                      {PDP_ROUTE_COPY.ctas.planning}
                    </span>
                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/downloads"
                    className="group flex items-center justify-between rounded-2xl border border-neutral-200 px-5 py-3.5 text-neutral-900 transition-colors hover:border-neutral-400"
                  >
                    <span className="pdp-action-label">
                      {PDP_ROUTE_COPY.ctas.resourceDesk}
                    </span>
                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    aria-label={PDP_ROUTE_COPY.ctas.copyLink}
                    className="pdp-copy-link inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {PDP_ROUTE_COPY.ctas.copyLink}
                  </button>
                </div>
              </div>
            </div>

            {useCasePreview.length > 0 && (
              <div className="mt-8 border-t border-neutral-100 pt-7">
                <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                  {PDP_ROUTE_COPY.summary.useCases}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {useCasePreview.map((useCase) => (
                    <span
                      key={useCase}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="mt-8 border-t border-neutral-100 pt-7">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                {PDP_ROUTE_COPY.ctas.specifications}
              </h2>
              <div className="mb-7 grid gap-3">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                  >
                    <span className="pdp-card-label mb-2 block">
                      {row.label}
                    </span>
                    <span className="text-sm leading-relaxed text-neutral-700">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {features.length > 0 && (
                <div>
                  <p className="pdp-section-label mb-3 text-neutral-500">
                    {PDP_ROUTE_COPY.ctas.keyFeatures}
                  </p>
                  <ul className="grid gap-3">
                    {features.slice(0, 8).map((f: string, i: number) => (
                      <li
                        key={i}
                        className="flex min-h-full items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-700"
                      >
                        <span className="scheme-text-subtle mt-0.5 shrink-0">-</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {inlineSpecs.length > 0 && (
                <div className="mt-7 border-t border-neutral-100 pt-7">
                  <h3 className="pdp-section-label mb-3 text-neutral-500">
                    {PDP_ROUTE_COPY.ctas.technicalDetails}
                  </h3>
                  <div className="grid gap-3">
                    {inlineSpecs.map((row) => (
                      <div
                        key={row.label}
                        className="rounded-2xl border border-neutral-200 bg-white p-4"
                      >
                        <span className="pdp-card-label mb-2 block">
                          {row.label}
                        </span>
                        <span className="text-sm leading-relaxed text-neutral-700">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fullOverview ? (
                <div className="mt-7 border-t border-neutral-100 pt-7">
                  <h3 className="pdp-section-label mb-3 text-neutral-500">Overview</h3>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-relaxed text-neutral-700">
                    {fullOverview}
                  </div>
                </div>
              ) : null}

              {materials.length > 0 && (
                <div className="mt-7 border-t border-neutral-100 pt-7">
                  <h3 className="pdp-section-label mb-3 text-neutral-500">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((material) => (
                      <span
                        key={material}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-700"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {finishOptions.length > 0 && (
                <div className="mt-7 border-t border-neutral-100 pt-7">
                  <h3 className="pdp-section-label mb-3 text-neutral-500">Finish Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {finishOptions.map((finish) => (
                      <span
                        key={finish}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-700"
                      >
                        {finish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide px-6 2xl:px-0 pb-24">
        <Reviews productId={product.id} />
      </div>
      <CompareDock />

      <style
        dangerouslySetInnerHTML={{
          __html: `.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`,
        }}
      />
    </section>
  );
}

