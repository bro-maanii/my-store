import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  fetchProducts,
  selectCategories,
  selectVisibleProducts,
  setCategory,
  setQuery,
  setWishlistOnly,
} from "@/lib/features/products/productsSlice";
import { toggleWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { makeStore } from "@/lib/store";
import { apiProducts, products } from "@/test/fixtures";

const fetchMock = vi.fn<typeof fetch>();

function responseWith(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("productsSlice", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("moves through pending and fulfilled lifecycle states", async () => {
    let resolveRequest: (value: Response) => void = () => undefined;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const store = makeStore();

    const request = store.dispatch(fetchProducts());
    expect(store.getState().products.status).toBe("loading");

    resolveRequest(responseWith(apiProducts));
    await request;

    expect(store.getState().products.status).toBe("succeeded");
    expect(store.getState().products.items[0]).toEqual(products[0]);
  });

  it("handles HTTP and network failures with readable errors", async () => {
    const store = makeStore();
    fetchMock.mockResolvedValueOnce(responseWith({}, 503));
    await store.dispatch(fetchProducts());

    expect(store.getState().products.status).toBe("failed");
    expect(store.getState().products.error).toContain("503");

    fetchMock.mockRejectedValueOnce(new Error("offline"));
    await store.dispatch(fetchProducts());
    expect(store.getState().products.error).toContain("couldn't reach");
  });

  it("rejects malformed data and succeeds when retried", async () => {
    const store = makeStore();
    fetchMock
      .mockResolvedValueOnce(responseWith({ products: apiProducts }))
      .mockResolvedValueOnce(responseWith(apiProducts));

    await store.dispatch(fetchProducts());
    expect(store.getState().products.error).toContain("unexpected data");

    await store.dispatch(fetchProducts());
    expect(store.getState().products.status).toBe("succeeded");
    expect(store.getState().products.items).toHaveLength(3);
  });

  it("derives categories and combines search, category, and wishlist filters", async () => {
    fetchMock.mockResolvedValue(responseWith(apiProducts));
    const store = makeStore();
    await store.dispatch(fetchProducts());

    expect(selectCategories(store.getState())).toEqual([
      "All",
      "jewelery",
      "men's clothing",
    ]);

    store.dispatch(setQuery("PENDANT"));
    expect(selectVisibleProducts(store.getState()).map(({ id }) => id)).toEqual([3]);

    store.dispatch(setQuery(""));
    store.dispatch(setCategory("men's clothing"));
    expect(selectVisibleProducts(store.getState())).toHaveLength(2);

    store.dispatch(toggleWishlist(2));
    store.dispatch(setWishlistOnly(true));
    expect(selectVisibleProducts(store.getState()).map(({ id }) => id)).toEqual([2]);
  });
});
