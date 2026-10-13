import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/store";
import {
  isFakeStoreProductArray,
  normalizeProduct,
  type Product,
} from "@/lib/types/product";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ProductsState {
  items: Product[];
  status: RequestStatus;
  error: string | null;
  query: string;
  category: string;
  wishlistOnly: boolean;
}

const initialProductsState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  query: "",
  category: "All",
  wishlistOnly: false,
};

const PRODUCTS_ENDPOINT = "https://fakestoreapi.com/products";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT);

    if (!response.ok) {
      return rejectWithValue(
        `The catalog service returned an error (${response.status}).`,
      );
    }

    const payload: unknown = await response.json();

    if (!isFakeStoreProductArray(payload)) {
      return rejectWithValue("The catalog service returned unexpected data.");
    }

    return payload.map(normalizeProduct);
  } catch {
    return rejectWithValue(
      "We couldn't reach the catalog service. Check your connection and try again.",
    );
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: initialProductsState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setWishlistOnly(state, action: PayloadAction<boolean>) {
      state.wishlistOnly = action.payload;
    },
    resetFilters(state) {
      state.query = "";
      state.category = "All";
      state.wishlistOnly = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "The catalog could not be loaded.";
      });
  },
});

export const { setQuery, setCategory, setWishlistOnly, resetFilters } =
  productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectQuery = (state: RootState) => state.products.query;
export const selectCategory = (state: RootState) => state.products.category;
export const selectWishlistOnly = (state: RootState) =>
  state.products.wishlistOnly;

export const selectCategories = createSelector([selectProducts], (products) => [
  "All",
  ...Array.from(new Set(products.map((product) => product.category))).sort(
    (first, second) => first.localeCompare(second),
  ),
]);

export const selectVisibleProducts = createSelector(
  [
    selectProducts,
    selectQuery,
    selectCategory,
    selectWishlistOnly,
    (state: RootState) => state.wishlist.productIds,
  ],
  (products, query, category, wishlistOnly, wishlistProductIds) => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const savedIds = new Set(wishlistProductIds);

    return products.filter((product) => {
      const matchesSearch = product.title
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesWishlist = !wishlistOnly || savedIds.has(product.id);

      return matchesSearch && matchesCategory && matchesWishlist;
    });
  },
);

export default productsSlice.reducer;
