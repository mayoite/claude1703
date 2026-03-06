import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="py-6">
            <ol className="flex items-center space-x-3 text-xs uppercase tracking-widest font-medium text-neutral-400">
                <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center space-x-3">
                        <span className="text-neutral-300">/</span>
                        <Link
                            href={item.href}
                            className={`transition-colors ${index === items.length - 1
                                ? "text-neutral-900 pointer-events-none"
                                : "hover:text-primary"
                                }`}
                            aria-current={index === items.length - 1 ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
