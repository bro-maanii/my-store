import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ShopDashboard } from "@/components/storefront/ShopDashboard";
import { makeStore } from "@/lib/store";
import { apiProducts } from "@/test/fixtures";

const fetchMock = vi.fn<typeof fetch>();

describe("ShopDashboard", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => apiProducts,
    } as Response);
    vi.stubGlobal("fetch", fetchMock);
  });

  it("supports discovery, wishlist filtering, product details, and cart changes", async () => {
    const user = userEvent.setup();
    const store = makeStore();

    render(
      <Provider store={store}>
        <ShopDashboard />
      </Provider>,
    );

    expect(await screen.findByText("Everyday Backpack")).toBeInTheDocument();

    const search = screen.getByRole("searchbox", {
      name: "Search products by title",
    });
    await user.type(search, "pendant");
    expect(screen.getByText("Silver Pendant")).toBeInTheDocument();
    expect(screen.queryByText("Everyday Backpack")).not.toBeInTheDocument();
    await user.clear(search);

    await user.click(
      screen.getByRole("button", {
        name: "Add Everyday Backpack to wishlist",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Show wishlist, 1 saved" }),
    );
    expect(screen.getByText("Everyday Backpack")).toBeInTheDocument();
    expect(screen.queryByText("Classic Cotton Shirt")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Show all products, 1 saved" }),
    );

    await user.click(
      screen.getAllByRole("button", {
        name: "View details for Everyday Backpack",
      })[0],
    );
    const productDialog = await screen.findByRole("dialog", {
      name: "Everyday Backpack",
    });
    expect(within(productDialog).getByText("Available")).toBeInTheDocument();
    await user.click(
      within(productDialog).getByRole("button", { name: "Add to cart" }),
    );
    await user.click(
      within(productDialog).getByRole("button", {
        name: "Close product details",
      }),
    );

    await user.click(
      screen.getByRole("button", { name: "Open cart, 1 item" }),
    );
    const cartDialog = await screen.findByRole("dialog", { name: "Your cart" });
    const quantityControl = within(cartDialog).getByLabelText(
      "Quantity for Everyday Backpack",
    );
    expect(within(quantityControl).getByText("1")).toBeInTheDocument();

    await user.click(
      within(cartDialog).getByRole("button", {
        name: "Increase quantity of Everyday Backpack",
      }),
    );
    expect(within(quantityControl).getByText("2")).toBeInTheDocument();
    expect(within(cartDialog).getAllByText("$219.90")).toHaveLength(2);

    await user.click(
      within(cartDialog).getByRole("button", {
        name: "Remove Everyday Backpack from cart",
      }),
    );
    await waitFor(() => {
      expect(within(cartDialog).getByText("Your cart is empty")).toBeInTheDocument();
    });
  });
});
