"use client";

import { Check, Heart, ShoppingBag, Star, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { ProductImage } from "@/components/storefront/ProductImage";
import type { Product } from "@/lib/types/product";
import { formatCategory, formatCurrency } from "@/lib/utils/format";

interface ProductDetailsDialogProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onWishlistToggle: (product: Product) => void;
}

export function ProductDetailsDialog({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onWishlistToggle,
}: ProductDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !product) return;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      if (dialog.open) dialog.close();
    };
  }, [product]);

  if (!product) return null;

  const titleId = `product-dialog-title-${product.id}`;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(62rem,calc(100%-2rem))] max-w-none overflow-hidden rounded-3xl bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm"
    >
      <div className="dialog-panel relative grid max-h-[calc(100dvh-2rem)] overflow-y-auto lg:grid-cols-[0.92fr_1.08fr]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label="Close product details"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="relative min-h-80 bg-slate-50 lg:min-h-[36rem]">
          <ProductImage
            src={product.image}
            alt={product.title}
            sizes="(max-width: 1024px) 90vw, 42vw"
            className="object-contain p-12 sm:p-16"
          />
        </div>

        <div className="flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="pr-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              {formatCategory(product.category)}
            </p>
            <h2
              id={titleId}
              className="mt-3 text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-3xl"
            >
              {product.title}
            </h2>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span
              className="inline-flex items-center gap-1.5 font-bold text-slate-800"
              aria-label={`${product.rating.rate} out of 5 stars from ${product.rating.count} ratings`}
            >
              <Star
                aria-hidden="true"
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
              {product.rating.rate.toFixed(1)}
              <span className="font-medium text-slate-400">
                ({product.rating.count})
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100">
                <Check aria-hidden="true" className="h-3 w-3" />
              </span>
              {product.availability}
            </span>
          </div>

          <p className="mt-7 text-sm leading-7 text-slate-600 sm:text-base">
            {product.description}
          </p>

          <div className="mt-auto pt-9">
            <p className="text-3xl font-bold tracking-tight text-slate-950">
              {formatCurrency(product.price)}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <ShoppingBag aria-hidden="true" className="h-5 w-5" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => onWishlistToggle(product)}
                aria-pressed={isWishlisted}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  isWishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Heart
                  aria-hidden="true"
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
                {isWishlisted ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
