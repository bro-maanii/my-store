"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { ProductImage } from "@/components/storefront/ProductImage";
import type { CartItem } from "@/lib/types/product";
import { formatCurrency } from "@/lib/utils/format";

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  itemCount: number;
  total: number;
  onClose: () => void;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export function CartDrawer({
  isOpen,
  items,
  itemCount,
  total,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
}: CartDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }

    if (!isOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-slate-950 shadow-none backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm sm:max-w-lg"
    >
      <div className="cart-panel flex h-full flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-7">
          <div>
            <h2 id="cart-drawer-title" className="text-xl font-bold tracking-tight text-slate-950">
              Your cart
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label="Close cart"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              <ShoppingBag aria-hidden="true" className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-950">Your cart is empty</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Explore the catalog and add something you&apos;ll love.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-slate-200 overflow-y-auto px-5 sm:px-7">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <ProductImage
                      src={product.image}
                      alt={product.title}
                      sizes="80px"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
                        {product.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        aria-label={`Remove ${product.title} from cart`}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-950">
                      {formatCurrency(product.price * quantity)}
                    </p>
                    <div
                      className="mt-auto flex w-fit items-center rounded-lg border border-slate-200"
                      aria-label={`Quantity for ${product.title}`}
                    >
                      <button
                        type="button"
                        onClick={() => onDecrement(product.id)}
                        disabled={quantity === 1}
                        className="grid h-8 w-8 place-items-center rounded-l-lg text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                        aria-label={`Decrease quantity of ${product.title}`}
                      >
                        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrement(product.id)}
                        className="grid h-8 w-8 place-items-center rounded-r-lg text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                        aria-label={`Increase quantity of ${product.title}`}
                      >
                        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Total</p>
                  <p className="mt-1 text-xs text-slate-400">Taxes and shipping not included</p>
                </div>
                <p className="text-2xl font-bold tracking-tight text-slate-950" aria-live="polite">
                  {formatCurrency(total)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 h-12 w-full rounded-xl bg-blue-700 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
