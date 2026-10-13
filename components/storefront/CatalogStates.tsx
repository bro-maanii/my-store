import { AlertTriangle, Heart, PackageSearch, RotateCcw } from "lucide-react";

export function CatalogSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2"
        >
          <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
          <div className="space-y-3 p-3 pt-5">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
            <div className="mt-6 h-7 w-20 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CatalogError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center" role="alert">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-700">
        <AlertTriangle aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
        We couldn&apos;t load the catalog
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

export function CatalogEmpty({
  wishlistOnly,
  onReset,
}: {
  wishlistOnly: boolean;
  onReset: () => void;
}) {
  const Icon = wishlistOnly ? Heart : PackageSearch;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
        <Icon aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
        {wishlistOnly ? "Your wishlist is waiting" : "No products found"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {wishlistOnly
          ? "Save a few products, then come back here to compare your favorites."
          : "Try another search or clear the filters to see the full catalog."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        View all products
      </button>
    </div>
  );
}
