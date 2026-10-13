import type { FakeStoreProduct, Product } from "@/lib/types/product";

export const apiProducts: FakeStoreProduct[] = [
  {
    id: 1,
    title: "Everyday Backpack",
    price: 109.95,
    description: "A durable backpack for work and daily adventures.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/backpack.png",
    rating: { rate: 4.2, count: 120 },
  },
  {
    id: 2,
    title: "Classic Cotton Shirt",
    price: 24.5,
    description: "A comfortable cotton shirt with a tailored fit.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/shirt.png",
    rating: { rate: 4.6, count: 84 },
  },
  {
    id: 3,
    title: "Silver Pendant",
    price: 42,
    description: "A subtle pendant with a polished silver finish.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/pendant.png",
    rating: { rate: 4.8, count: 52 },
  },
];

export const products: Product[] = apiProducts.map((product) => ({
  ...product,
  availability: "Available",
}));
