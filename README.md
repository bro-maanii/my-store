# ShopDash

ShopDash is a responsive product catalog and cart workspace built as a take-home technical assessment. It demonstrates typed asynchronous data fetching, focused Redux state management, accessible commerce interactions, and production-minded UI states.

## Features

- Responsive product grid with images, category, price, and ratings
- Real-time title search and category filtering
- Product detail dialog with description and availability
- Redux-powered cart with quantity controls, removal, and live totals
- Dedicated Redux wishlist with a favorites-only catalog view
- Loading skeletons, retryable failures, empty results, and image fallbacks
- Keyboard-friendly dialogs, focus styles, reduced-motion support, and live announcements

## Technology

- Next.js 16 App Router and React 19
- TypeScript with strict mode and no `any`
- Redux Toolkit, `createAsyncThunk`, React Redux, and typed hooks
- Tailwind CSS 4
- Vitest and Testing Library
- Fake Store API

## Local Setup

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev        # Start the local development server
npm run lint       # Run ESLint
npm test           # Run the test suite once
npm run test:watch # Run tests in watch mode
npm run build      # Create a production build
npm start          # Serve the production build
```

## Architecture

The Redux store is split into three business-focused slices:

- `productsSlice` owns remote catalog data, request lifecycle, search, category, and wishlist-only view state.
- `cartSlice` owns cart lines and exposes derived quantity and total selectors.
- `wishlistSlice` owns the unique set of saved product IDs.

The page dispatches `fetchProducts` once while the catalog is idle. The thunk validates the response as unknown data before normalizing it into the application `Product` model. Memoized selectors combine catalog filters and wishlist state without duplicating derived data.

Dialog and drawer visibility remain local component state because they are temporary interface concerns rather than shared business state.

## API Note

The Fake Store API provides product descriptions, categories, prices, images, and ratings, but it does not provide inventory data. ShopDash therefore normalizes active catalog entries to an `Available` status instead of inventing stock quantities. This tradeoff is explicit in the type model and product detail view.

## Scope and Tradeoffs

- Cart and wishlist state intentionally reset on refresh; persistence is outside this assessment scope.
- Checkout, authentication, pagination, and backend mutations are not implemented.
- Remote product images include a local visual fallback for slow or failed assets.
- Prices are displayed in USD using `Intl.NumberFormat`.
