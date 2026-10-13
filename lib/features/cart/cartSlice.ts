import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/store";
import type { CartItem, Product } from "@/lib/types/product";

export interface CartState {
  items: CartItem[];
}

const initialCartState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({ product: action.payload, quantity: 1 });
    },
    incrementQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (cartItem) => cartItem.product.id === action.payload,
      );
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (cartItem) => cartItem.product.id === action.payload,
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  ),
);

export default cartSlice.reducer;
