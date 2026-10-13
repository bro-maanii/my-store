import { describe, expect, it } from "vitest";

import reducer, {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartCount,
  selectCartTotal,
} from "@/lib/features/cart/cartSlice";
import { makeStore } from "@/lib/store";
import { products } from "@/test/fixtures";

describe("cartSlice", () => {
  it("adds products and increments an existing line", () => {
    let state = reducer(undefined, addToCart(products[0]));
    state = reducer(state, addToCart(products[0]));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("increments, clamps decrement at one, and removes items", () => {
    let state = reducer(undefined, addToCart(products[0]));
    state = reducer(state, decrementQuantity(products[0].id));
    expect(state.items[0].quantity).toBe(1);

    state = reducer(state, incrementQuantity(products[0].id));
    state = reducer(state, decrementQuantity(products[0].id));
    expect(state.items[0].quantity).toBe(1);

    state = reducer(state, removeFromCart(products[0].id));
    expect(state.items).toEqual([]);
  });

  it("calculates total quantity and price", () => {
    const store = makeStore();
    store.dispatch(addToCart(products[0]));
    store.dispatch(addToCart(products[0]));
    store.dispatch(addToCart(products[1]));

    expect(selectCartCount(store.getState())).toBe(3);
    expect(selectCartTotal(store.getState())).toBeCloseTo(244.4);
  });
});
