# Place Bid Implementation Plan

## Goal

Implement the core "Place Bid" functionality, including the "Proxy Bidding" (Auto-Bid) mechanism on the backend and connecting it to the frontend UI.

## Phase 1: Backend Implementation (The Auction Engine)

### 1. Database Layer (Repositories)

- **File:** `backend/src/repositories/bid.repository.ts` (New)
  - `createBid(data: Bid): Promise<Bid>` - Insert into `bids` table.
  - `upsertAutoBid(data: AutoBid): Promise<AutoBid>` - Insert or Update `auto_bids` table.
  - `getAutoBidsByProductId(productId: number): Promise<AutoBid[]>` - Fetch all active auto-bids for calculation.
  - `getHighestBid(productId: number): Promise<Bid | null>` - Helper to get current reality.

### 2. Service Layer (Business Logic)

- **File:** `backend/src/services/bid.service.ts` (New)
  - `placeBid(userId: number, productId: number, maxAmount: number): Promise<BidResult>`
  - **Logic:**
    1. Upsert `auto_bids` for the user.
    2. Fetch all `auto_bids` and `current_bid`.
    3. Run **Auction Engine Algorithm** (Scenario 1, 2, 3 as defined).
    4. Insert resulting `bids` record.
    5. Return result (Winning/Outbid status, new price).

### 3. API Layer (Controller & Route)

- **File:** `backend/src/api/controllers/product.controller.ts`
  - Add `placeBid(req, res, next)` method.
  - Validate input (`amount` > `current_price` + `step`).
  - Call `BidService.placeBid`.
- **File:** `backend/src/api/routes/product.route.ts`
  - Add `POST /:id/bid` endpoint.
  - Attach `authorize` middleware (User must be logged in).

---

## Phase 2: Frontend Integration

### 1. API Integration

- **File:** `frontend/src/services/product.service.ts` (or similar)
  - Add `placeBid(productId: string, amount: number)` function.

### 2. State Management

- **File:** `frontend/src/hooks/useProductDetail.ts`
  - Expose `placeBid` handler.
  - Handle `loading` state during request.
  - On success: Check response status.
    - If `winning`: Show success message, update `currentPrice` locally (optimistic or from response).
    - If `outbid`: Show "You have been outbid" alert immediately.

### 3. UI Components

- **File:** `frontend/src/pages/Product/components/ProductBidding.tsx`
  - Connect the "Place Bid" button to the hook.
  - Display error messages (e.g., "Bid too low").
  - Display success/outbid alerts permanently until dismissed or new bid.

## Verification

- Test Scenario 1: First bidder (Winning).
- Test Scenario 2: Higher bidder enters (Winning, Price increases).
- Test Scenario 3: Lower bidder enters (Outbid immediately, Price increases).
