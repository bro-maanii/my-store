import { Heart, Search, Sparkles, X } from "lucide-react";

import { formatCategory } from "@/lib/utils/format";

interface CatalogToolbarProps {
  query: string;
  category: string;
  categories: string[];
  resultCount: number;
  totalCount: number;
  wishlistOnly: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function CatalogToolbar({
  query,
  category,
  categories,
  resultCount,
  totalCount,
  wishlistOnly,
  onQueryChange,
  onCategoryChange,
  onReset,
}: CatalogToolbarProps) {
  const hasFilters = query.length > 0 || category !== "All" || wishlistOnly;

  return (
    <section className="pt-10 sm:pt-14" aria-labelledby="catalog-heading">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Everyday finds
          </div>
          <h1
            id="catalog-heading"
            className="max-w-2xl text-balance text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Find your next favorite, without the clutter.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
            Browse a thoughtfully organized catalog, save what catches your eye,
            and build your cart in a few effortless clicks.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
          <label htmlFor="product-search" className="sr-only">
            Search products by title
          </label>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
            <Search aria-hidden="true" className="h-5 w-5 text-slate-400" />
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by product name..."
              className="h-13 min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Clear search"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
          aria-label="Product categories"
        >
          {categories.map((item) => {
            const isActive = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isActive}
                onClick={() => onCategoryChange(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                }`}
              >
                {formatCategory(item)}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm font-medium text-slate-500" aria-live="polite">
            {wishlistOnly && (
              <Heart
                aria-hidden="true"
                className="mr-1.5 inline h-4 w-4 fill-rose-500 text-rose-500"
              />
            )}
            Showing <span className="font-bold text-slate-900">{resultCount}</span>{" "}
            of {totalCount}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm font-bold text-blue-700 hover:text-blue-800 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
