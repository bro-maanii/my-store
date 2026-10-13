import { describe, expect, it } from "vitest";

import reducer, {
  selectIsWishlisted,
  selectWishlistCount,
  toggleWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { makeStore } from "@/lib/store";

describe("wishlistSlice", () => {
  it("toggles product IDs without duplicates", () => {
    let state = reducer(undefined, toggleWishlist(1));
    expect(state.productIds).toEqual([1]);

    state = reducer(state, toggleWishlist(1));
    expect(state.productIds).toEqual([]);
  });

  it("selects wishlist count and membership", () => {
    const store = makeStore();
    store.dispatch(toggleWishlist(2));

    expect(selectWishlistCount(store.getState())).toBe(1);
    expect(selectIsWishlisted(store.getState(), 2)).toBe(true);
    expect(selectIsWishlisted(store.getState(), 3)).toBe(false);
  });
});
