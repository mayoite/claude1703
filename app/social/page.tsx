import { getProducts } from "@/lib/getProducts";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

export const metadata = {
  title: "Social | One and Only Furniture",
  description: "Get inspired by our shoppable social feed.",
};

// Mock data to simulate social_posts until backend is populated
const MOCK_POSTS = [
  {
    id: 1,
    product_slug: "oando-workstations--curvivo",
    image: "/images/products/imported/cabin/image-1.webp",
    caption:
      "Elevating the workspace with minimalist curves. ✨ #OfficeDesign #Workspace",
  },
  {
    id: 2,
    product_slug: "oando-seating--fluid",
    image: "/images/products/imported/fluid/image-1.webp",
    caption: "Ergonomics meets aesthetics. Sit better, work better. 🪑",
  },
  {
    id: 3,
    product_slug: "oando-collaborative--pod",
    image: "/images/products/imported/pod/image-2.webp",
    caption: "Quiet zones for loud ideas. 🤫 Acoustic pods now available.",
  },
  {
    id: 4,
    product_slug: "oando-tables--meeting",
    image: "/images/products/imported/meeting-table/image-33.webp",
    caption: "Where great decisions are made. Our premium meeting tables. 🤝",
  },
  {
    id: 5,
    product_slug: "oando-soft-seating--cocoon",
    image: "/images/products/imported/cocoon/image-1.webp",
    caption:
      "Soft seating that feels like home. Perfect for collaborative spaces. 🛋️",
  },
  {
    id: 6,
    product_slug: "oando-storage--storage",
    image: "/images/products/imported/storage/image-14.webp",
    caption: "Keep it clean, keep it organized. Engineered storage systems. 📁",
  },
];

export default async function SocialPage() {
  const products = await getProducts();

  return (
    <section className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container-wide px-6 2xl:px-0">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-light text-neutral-900 mb-4 tracking-tight">
            Inspired Living & Working
          </h1>
          <p className="text-neutral-500 font-light flex items-center justify-center gap-2">
            <Instagram className="w-4 h-4" /> @OneAndOnlyFurn
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 lg:gap-4 max-w-6xl mx-auto">
          {MOCK_POSTS.map((post) => {
            const product = products.find((p) => p.slug === post.product_slug);
            const redirectUrl = product
              ? `/products/${product.category_id}/${product.slug}`
              : "/products";

            return (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden bg-neutral-200"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6 sm:p-4">
                  <p className="text-white text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                    {post.caption}
                  </p>
                  <Link
                    href={redirectUrl}
                    className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-neutral-200 transition-colors"
                  >
                    Shop this Look
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

