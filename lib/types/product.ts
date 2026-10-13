export interface Rating {
  rate: number;
  count: number;
}

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Product extends FakeStoreProduct {
  availability: "Available";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRating(value: unknown): value is Rating {
  return (
    isRecord(value) &&
    typeof value.rate === "number" &&
    Number.isFinite(value.rate) &&
    typeof value.count === "number" &&
    Number.isInteger(value.count) &&
    value.count >= 0
  );
}

function isFakeStoreProduct(value: unknown): value is FakeStoreProduct {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    typeof value.title === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.image === "string" &&
    isRating(value.rating)
  );
}

export function isFakeStoreProductArray(
  value: unknown,
): value is FakeStoreProduct[] {
  return Array.isArray(value) && value.every(isFakeStoreProduct);
}

export function normalizeProduct(product: FakeStoreProduct): Product {
  return {
    ...product,
    title: product.title.trim(),
    category: product.category.trim(),
    description: product.description.trim(),
    availability: "Available",
  };
}
