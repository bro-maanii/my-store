import { ArrowUpRight, Heart, Star } from "lucide-react";

import { ProductImage } from "@/components/storefront/ProductImage";
import type { Product } from "@/lib/types/product";
import { formatCategory, formatCurrency } from "@/lib/utils/format";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  priority?: boolean;
  onOpen: (product: Product) => void;
  onWishlistToggle: (product: Product) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  priority = false,
  onOpen,
  onWishlistToggle,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-36px_rgba(15,23,42,0.5)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_55px_-34px_rgba(15,23,42,0.45)] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative m-2 mb-0 overflow-hidden rounded-xl bg-slate-50">
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="relative block aspect-[4/3] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
          aria-label={`View details for ${product.title}`}
        >
          <ProductImage
            src={product.image}
            alt={product.title}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
            priority={priority}
            className="object-contain p-8 transition duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />
        </button>
        <button
          type="button"
          onClick={() => onWishlistToggle(product)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border shadow-sm backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
            isWishlisted
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-white/80 bg-white/90 text-slate-500 hover:text-rose-600"
          }`}
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.title} ${isWishlisted ? "from" : "to"} wishlist`}
          aria-pressed={isWishlisted}
        >
          <Heart
            aria-hidden="true"
            className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs font-bold uppercase tracking-[0.13em] text-blue-700">
            {formatCategory(product.category)}
          </span>
          <span
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-slate-700"
            aria-label={`${product.rating.rate} out of 5 stars from ${product.rating.count} ratings`}
          >
            <Star
              aria-hidden="true"
              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            />
            {product.rating.rate.toFixed(1)}
          </span>
        </div>

        <h2 className="mt-3 line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-950">
          {product.title}
        </h2>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="text-xl font-bold tracking-tight text-slate-950">
            {formatCurrency(product.price)}
          </p>
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-bold text-blue-700 transition-colors hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            aria-label={`View details for ${product.title}`}
          >
            Details
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
