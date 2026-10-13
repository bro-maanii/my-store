import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/store";

export interface WishlistState {
  productIds: number[];
}

const initialWishlistState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialWishlistState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<number>) {
      const existingIndex = state.productIds.indexOf(action.payload);

      if (existingIndex >= 0) {
        state.productIds.splice(existingIndex, 1);
      } else {
        state.productIds.push(action.payload);
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;

export const selectWishlistIds = (state: RootState) =>
  state.wishlist.productIds;
export const selectWishlistCount = (state: RootState) =>
  state.wishlist.productIds.length;
export const selectIsWishlisted = (state: RootState, productId: number) =>
  state.wishlist.productIds.includes(productId);

export default wishlistSlice.reducer;
