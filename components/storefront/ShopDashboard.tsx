"use client";

import { useEffect, useState } from "react";

import { CartDrawer } from "@/components/storefront/CartDrawer";
import {
  CatalogEmpty,
  CatalogError,
  CatalogSkeleton,
} from "@/components/storefront/CatalogStates";
import { CatalogToolbar } from "@/components/storefront/CatalogToolbar";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductDetailsDialog } from "@/components/storefront/ProductDetailsDialog";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from "@/lib/features/cart/cartSlice";
import {
  fetchProducts,
  resetFilters,
  selectCategories,
  selectCategory,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
  selectQuery,
  selectVisibleProducts,
  selectWishlistOnly,
  setCategory,
  setQuery,
  setWishlistOnly,
} from "@/lib/features/products/productsSlice";
import {
  selectWishlistCount,
  selectWishlistIds,
  toggleWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { Product } from "@/lib/types/product";

export function ShopDashboard() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const visibleProducts = useAppSelector(selectVisibleProducts);
  const categories = useAppSelector(selectCategories);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const query = useAppSelector(selectQuery);
  const category = useAppSelector(selectCategory);
  const wishlistOnly = useAppSelector(selectWishlistOnly);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const announce = (message: string) => {
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(message), 10);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    announce(`${product.title} added to cart.`);
  };

  const handleWishlistToggle = (product: Product) => {
    const isSaved = wishlistIds.includes(product.id);
    dispatch(toggleWishlist(product.id));
    announce(
      `${product.title} ${isSaved ? "removed from" : "added to"} wishlist.`,
    );
  };

  const handleRemove = (productId: number) => {
    const item = cartItems.find(({ product }) => product.id === productId);
    dispatch(removeFromCart(productId));
    if (item) announce(`${item.product.title} removed from cart.`);
  };

  return (
    <div className="min-h-dvh bg-[#f7f8fa] text-slate-950">
      <a
        href="#catalog-results"
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition-transform focus:translate-y-0"
      >
        Skip to products
      </a>

      <StoreHeader
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        wishlistOnly={wishlistOnly}
        onCartOpen={() => setIsCartOpen(true)}
        onWishlistToggle={() => dispatch(setWishlistOnly(!wishlistOnly))}
      />

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <CatalogToolbar
          query={query}
          category={category}
          categories={categories}
          resultCount={visibleProducts.length}
          totalCount={products.length}
          wishlistOnly={wishlistOnly}
          onQueryChange={(value) => dispatch(setQuery(value))}
          onCategoryChange={(value) => dispatch(setCategory(value))}
          onReset={() => dispatch(resetFilters())}
        />

        <section
          id="catalog-results"
          className="scroll-mt-28 pt-7"
          aria-label="Product catalog"
        >
          {(status === "idle" || status === "loading") && <CatalogSkeleton />}

          {status === "failed" && (
            <CatalogError
              message={error ?? "The catalog could not be loaded."}
              onRetry={() => dispatch(fetchProducts())}
            />
          )}

          {status === "succeeded" && visibleProducts.length === 0 && (
            <CatalogEmpty
              wishlistOnly={wishlistOnly}
              onReset={() => dispatch(resetFilters())}
            />
          )}

          {status === "succeeded" && visibleProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  priority={index < 4}
                  onOpen={setSelectedProduct}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-slate-700">ShopDash</p>
          <p>Catalog data provided by Fake Store API.</p>
        </div>
      </footer>

      <ProductDetailsDialog
        product={selectedProduct}
        isWishlisted={
          selectedProduct ? wishlistIds.includes(selectedProduct.id) : false
        }
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onWishlistToggle={handleWishlistToggle}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        itemCount={cartCount}
        total={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onIncrement={(productId) => dispatch(incrementQuantity(productId))}
        onDecrement={(productId) => dispatch(decrementQuantity(productId))}
        onRemove={handleRemove}
      />

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
