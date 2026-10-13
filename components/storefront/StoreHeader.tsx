import { Heart, ShoppingBag } from "lucide-react";

interface StoreHeaderProps {
  cartCount: number;
  wishlistCount: number;
  wishlistOnly: boolean;
  onCartOpen: () => void;
  onWishlistToggle: () => void;
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function StoreHeader({
  cartCount,
  wishlistCount,
  wishlistOnly,
  onCartOpen,
  onWishlistToggle,
}: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="ShopDash home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
            <ShoppingBag aria-hidden="true" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-950">
              ShopDash
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Product workspace
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-2" aria-label="Store actions">
          <button
            type="button"
            onClick={onWishlistToggle}
            aria-pressed={wishlistOnly}
            aria-label={`${wishlistOnly ? "Show all products" : "Show wishlist"}, ${wishlistCount} saved`}
            className={`group relative flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-4 ${
              wishlistOnly
                ? "bg-rose-50 text-rose-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <span className="relative">
              <Heart
                aria-hidden="true"
                className={`h-5 w-5 ${wishlistOnly ? "fill-current" : ""}`}
              />
              <CountBadge count={wishlistCount} />
            </span>
            <span className="hidden sm:inline">Wishlist</span>
          </button>
          <button
            type="button"
            onClick={onCartOpen}
            aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            className="relative flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-4"
          >
            <span className="relative">
              <ShoppingBag aria-hidden="true" className="h-5 w-5" />
              <CountBadge count={cartCount} />
            </span>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
