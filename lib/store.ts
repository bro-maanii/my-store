import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "@/lib/features/cart/cartSlice";
import productsReducer from "@/lib/features/products/productsSlice";
import wishlistReducer from "@/lib/features/wishlist/wishlistSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
