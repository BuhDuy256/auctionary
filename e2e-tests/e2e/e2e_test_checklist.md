# E2E Test Checklist

> **Last Updated**: 2025-12-15  
> **Purpose**: Comprehensive End-to-End testing checklist for all application flows  
> **Completedness**: ~3% (User Registration section completed)

```bash
# To run all E2E tests:
npm run test:e2e

# To run a specific E2E test file:
npm run test:e2e -- --project=chromium --test-file=user-registration.spec.ts

# Ensure your test environment is properly configured before running.
```

---

## 1. Authentication & Authorization Flows

### 1.1 User Registration

- [x] Signup with valid credentials
  - [x] Email validation works
  - [x] Password strength requirements enforced
  - [x] reCAPTCHA v2 validation required
  - [x] OTP sent to email
  - [x] User redirected to OTP verification page
- [x] Signup with invalid data
  - [x] Duplicate email rejected
  - [x] Weak password rejected
  - [x] Invalid email format rejected
  - [x] Missing required fields show validation errors
- [x] OTP Verification
  - [x] Valid OTP code verifies successfully
  - [x] Invalid OTP code rejected
  - [x] Expired OTP rejected (test created, needs OTP expiry implementation)
  - [x] Resend OTP functionality works
  - [x] After verification, user redirected to home/login

### 1.2 User Login

- [ ] Login with email/password
  - [ ] Valid credentials allow login
  - [ ] reCAPTCHA v2 validation required
  - [ ] JWT tokens (access + refresh) stored correctly
  - [ ] User role and permissions loaded
  - [ ] Redirected to intended page or home
- [ ] Login with invalid credentials
  - [ ] Wrong password rejected
  - [ ] Non-existent email rejected
  - [ ] Account not verified (pending OTP) handled
- [ ] Social Login
  - [ ] Google OAuth login flow
  - [ ] Facebook OAuth login flow
  - [ ] New social accounts created automatically
  - [ ] Existing social accounts linked correctly

### 1.3 Password Management

- [ ] Forgot Password
  - [ ] Email sent with reset link/OTP
  - [ ] Reset link expiration works
  - [ ] Invalid email shows error
- [ ] Reset Password
  - [ ] Valid reset token allows password change
  - [ ] Expired token rejected
  - [ ] Password complexity requirements enforced
  - [ ] After reset, user can login with new password
- [ ] Change Password (Logged In)
  - [ ] Current password verification required
  - [ ] New password must be different
  - [ ] Password complexity enforced
  - [ ] All sessions invalidated except current (optional)

### 1.4 Session Management

- [ ] Access Token Refresh
  - [ ] Expired access token auto-refreshed with refresh token
  - [ ] Invalid refresh token logs user out
  - [ ] Refresh token rotation works
- [ ] Logout
  - [ ] Single logout clears current session
  - [ ] Logout all devices clears all refresh tokens
  - [ ] After logout, protected routes inaccessible
- [ ] Protected Routes
  - [ ] Unauthenticated users redirected to login
  - [ ] Authenticated users can access protected routes
- [ ] Public-Only Routes
  - [ ] Authenticated users redirected away from login/signup
  - [ ] Unauthenticated users can access login/signup
- [ ] Role-Based Access Control (RBAC)
  - [ ] Guest cannot access bidder-only routes
  - [ ] Bidder cannot access seller-only routes
  - [ ] Bidder/Seller cannot access admin routes
  - [ ] Unauthorized access redirects to `/unauthorized`

---

## 2. Guest User Flows (Public Access)

### 2.1 Home Page

- [ ] Homepage loads successfully
  - [ ] "Ending Soon" section displays active auctions
  - [ ] "Most Active" section shows popular auctions
  - [ ] "Highest Price" section displays top-value items
  - [ ] Skeleton loaders shown during data fetch
  - [ ] Error state displayed if API fails
  - [ ] Empty state shown if no auctions available
- [ ] Navigation
  - [ ] Header displays correctly
  - [ ] Navigation links work (Login, Signup, Products, etc.)
  - [ ] Footer displays correctly

### 2.2 Product Listing & Search

- [ ] Product List Page
  - [ ] All active products displayed
  - [ ] Pagination works correctly
  - [ ] Product cards show: image, title, current bid, time remaining, top bidder
  - [ ] "Hot" badge displayed for highly active items
- [ ] Product Filtering
  - [ ] Filter by category (single and multiple)
  - [ ] Filter by price range (min/max slider)
  - [ ] Active filters displayed with remove option
  - [ ] Clear all filters button works
  - [ ] URL updates with filter parameters
- [ ] Product Sorting
  - [ ] Sort by: ending soon, most active, highest price, newest
  - [ ] Sort direction toggle (asc/desc)
- [ ] Product Search
  - [ ] Search by product name/keywords
  - [ ] Search results update correctly
  - [ ] Empty search results handled

### 2.3 Product Detail Page

- [ ] Product detail loads correctly
  - [ ] Product images gallery works
  - [ ] Product title, description, and details displayed
  - [ ] Current bid, top bidder, minimum bid shown
  - [ ] Time remaining displayed with countdown
  - [ ] Bid history tab shows all bids
  - [ ] Q&A tab displays questions and answers
  - [ ] Additional descriptions tab works
  - [ ] Seller card displays seller information
- [ ] Watchlist (Guest)
  - [ ] Guest users see "Login to add to watchlist"
- [ ] Place Bid (Guest)
  - [ ] Guest users see "Login to place bid"

### 2.4 Category Browsing

- [ ] Public category listing
  - [ ] All active categories displayed
  - [ ] Category hierarchy shown correctly
  - [ ] Clicking category navigates to filtered product list

---

## 3. Bidder User Flows

### 3.1 Profile Management

- [ ] View Profile
  - [ ] Display user information (name, email, phone, address, date of birth)
  - [ ] Display user statistics (total bids, won auctions, active bids)
- [ ] Update Profile
  - [ ] Edit name, phone, address, date of birth
  - [ ] Validation enforced on all fields
  - [ ] Success message displayed after update
- [ ] Update Email
  - [ ] New email validation required
  - [ ] OTP sent to new email for verification
  - [ ] Email updated after OTP verification
- [ ] Change Password
  - [ ] Current password required
  - [ ] New password complexity enforced
  - [ ] Success message after password change

### 3.2 Watchlist Management

- [ ] View Watchlist
  - [ ] All watchlisted products displayed
  - [ ] Product status (active/sold/expired) shown
  - [ ] Empty state if no items in watchlist
- [ ] Add to Watchlist
  - [ ] From product list page (heart icon)
  - [ ] From product detail page
  - [ ] Toast notification on success
  - [ ] Icon updates to indicate added state
- [ ] Remove from Watchlist
  - [ ] From watchlist page
  - [ ] From product list/detail page (toggle heart icon)
  - [ ] Confirmation required (optional)
  - [ ] Toast notification on success

### 3.3 Bidding Flow

- [ ] Place Bid from Product List
  - [ ] Click "Place Bid" opens modal
  - [ ] Modal displays: product title, current bid, top bidder, minimum bid
  - [ ] Bid amount validation (must be >= minimum bid)
  - [ ] Bid amount validation (must be > current bid)
  - [ ] Submit bid successfully
  - [ ] Toast notification on success/failure
  - [ ] Modal closes after successful bid
  - [ ] Product card updates with new bid info
- [ ] Place Bid from Product Detail
  - [ ] Same as above
  - [ ] Bid history updates in real-time
  - [ ] Current bid updates immediately
- [ ] Bid Validation Errors
  - [ ] Bid amount too low rejected
  - [ ] Invalid bid amount format rejected
  - [ ] Cannot bid on own auction (if seller)
  - [ ] Cannot bid on expired auction

### 3.4 Active Bids Tracking

- [ ] View Active Bids (Profile Tab)
  - [ ] All active bids displayed
  - [ ] Show product details, current bid, user's bid, status
  - [ ] Indicate if user is top bidder
  - [ ] Countdown to auction end
  - [ ] Empty state if no active bids
- [ ] Bid Status Updates
  - [ ] Show "Outbid" status if another user bids higher
  - [ ] Show "Winning" status if user is top bidder
  - [ ] Show "Won" status if auction ended and user won
  - [ ] Show "Lost" status if auction ended and user didn't win

### 3.5 Won Auctions

- [ ] View Won Auctions (Profile Tab)
  - [ ] All won auctions displayed
  - [ ] Show product details, final bid, win date
  - [ ] Empty state if no won auctions
- [ ] Transaction Room Access
  - [ ] Click won auction navigates to transaction room
  - [ ] Transaction room shows: product summary, stepper, payment/shipping/delivery tabs

---

## 4. Seller User Flows

### 4.1 Upgrade to Seller

- [ ] Submit Upgrade Request
  - [ ] Bidder can submit upgrade request
  - [ ] Reason/justification required
  - [ ] Request submitted successfully
  - [ ] Toast notification on success
- [ ] Check Upgrade Request Status
  - [ ] Pending status shown
  - [ ] Approved status shown (user role upgraded)
  - [ ] Rejected status shown with reason
- [ ] Cancel Upgrade Request
  - [ ] User can cancel pending request
  - [ ] Cannot cancel approved/rejected requests

### 4.2 Create Auction

- [ ] Create Auction Page
  - [ ] Form fields: title, category, description, starting price, min bid increment, start date, end date
  - [ ] Image upload (multiple images, max 10)
  - [ ] Image preview before upload
  - [ ] Category selection (dropdown with hierarchy)
  - [ ] Date/time pickers for start and end dates
- [ ] Validation
  - [ ] All required fields enforced
  - [ ] Minimum price validation
  - [ ] End date must be after start date
  - [ ] At least 1 image required
  - [ ] Image size and format validation
- [ ] Submit Auction
  - [ ] Images uploaded to server
  - [ ] Product created successfully
  - [ ] Redirected to seller dashboard
  - [ ] Toast notification on success/failure

### 4.3 Seller Dashboard

- [ ] View Dashboard
  - [ ] Display all seller's products (active, sold, expired, removed)
  - [ ] Show product statistics (total bids, current bid, status)
  - [ ] Empty state if no products
- [ ] Filter Products
  - [ ] Filter by status (active, sold, expired, removed)
  - [ ] Multi-select status filter
  - [ ] Active filter pills displayed
  - [ ] Clear filters button
- [ ] Search Products
  - [ ] Search by product name
  - [ ] Search results update in real-time
- [ ] Sort Products
  - [ ] Sort by: ID, name, category, start price, current bid, bid count, time remaining
  - [ ] 3-state sort: ASC → DESC → Default (by ID)
  - [ ] Visual indicator for sort direction
- [ ] Pagination
  - [ ] Navigate between pages
  - [ ] Page size selector (10, 20, 50)
  - [ ] Total count displayed

### 4.4 Manage Auction

- [ ] View Product Details (Seller View)
  - [ ] All product information displayed
  - [ ] Bid history visible
  - [ ] Q&A visible
- [ ] Add Product Description
  - [ ] Seller can append additional description
  - [ ] Rich text editor (optional)
  - [ ] Description saved and displayed
- [ ] Answer Questions
  - [ ] Seller can view questions from bidders
  - [ ] Seller can post answers
  - [ ] Answers displayed on product detail page
- [ ] Cannot Bid on Own Auction
  - [ ] Bid button disabled/hidden for own products
  - [ ] API rejects seller bids on own products

### 4.5 Transaction Management

- [ ] Transaction Room (Seller Side)
  - [ ] Access transaction room for sold products
  - [ ] View buyer information
  - [ ] Communication via chat
  - [ ] Update shipping/delivery status
  - [ ] Mark transaction as complete
  - [ ] Provide/receive feedback

---

## 5. Admin User Flows

### 5.1 Admin Dashboard Overview

- [ ] View Admin Overview
  - [ ] Display system statistics: total users, active auctions, pending approvals, total revenue
  - [ ] Recent auctions list
  - [ ] Pending upgrade requests count
  - [ ] System status indicators
  - [ ] Loading state during data fetch
  - [ ] Error state if API fails

### 5.2 User Management

- [ ] View All Users
  - [ ] List all users with: ID, name, email, role, status, registration date
  - [ ] Pagination works
  - [ ] Search users by name/email
- [ ] Suspend User
  - [ ] Admin can suspend any user
  - [ ] Confirmation dialog required
  - [ ] Suspended user cannot login
  - [ ] Toast notification on success
- [ ] View User Details
  - [ ] Display full user profile
  - [ ] Show user's auction activity (bids, products, won auctions)

### 5.3 Product Management

- [ ] View All Products
  - [ ] List all products (all sellers, all statuses)
  - [ ] Show: ID, title, seller, category, current bid, status, start/end dates
  - [ ] Pagination works
  - [ ] Search products by title/seller
- [ ] Remove Product
  - [ ] Admin can delete any product
  - [ ] Confirmation dialog required
  - [ ] Product removed from listings
  - [ ] Toast notification on success
- [ ] View Product Details
  - [ ] Full product information
  - [ ] Bid history
  - [ ] Seller information

### 5.4 Category Management

- [ ] View All Categories
  - [ ] List all categories (including inactive)
  - [ ] Show hierarchy (parent/child relationships)
  - [ ] Show product count per category
  - [ ] Empty state if no categories
- [ ] Create Category
  - [ ] Modal/form to create new category
  - [ ] Fields: name, parent category (optional), description
  - [ ] Validation: unique name, max depth (e.g., 3 levels)
  - [ ] Success toast notification
  - [ ] Category list updates
- [ ] Edit Category
  - [ ] Modal/form to edit existing category
  - [ ] Update name, parent, description
  - [ ] Validation enforced
  - [ ] Success toast notification
  - [ ] Category list updates
- [ ] Delete Category
  - [ ] Admin can delete category
  - [ ] Confirmation dialog required
  - [ ] Cannot delete category with active products (business rule)
  - [ ] Category removed from list
  - [ ] Success toast notification

### 5.5 Upgrade Request Management

- [ ] View All Upgrade Requests
  - [ ] List all pending, approved, rejected requests
  - [ ] Show: user name, reason, submission date, status
  - [ ] Filter by status
  - [ ] Pagination works
- [ ] Approve Upgrade Request
  - [ ] Admin clicks "Approve"
  - [ ] Confirmation dialog required
  - [ ] User role upgraded to Seller
  - [ ] Request status updated to "Approved"
  - [ ] Toast notification on success
- [ ] Reject Upgrade Request
  - [ ] Admin clicks "Reject"
  - [ ] Optional reason for rejection
  - [ ] Request status updated to "Rejected"
  - [ ] User notified (optional)
  - [ ] Toast notification on success

---

## 6. Product Q&A Flow

### 6.1 Ask Question (Bidder)

- [ ] Bidder can ask question on product detail page
  - [ ] Question input field available
  - [ ] Submit question successfully
  - [ ] Question appears in Q&A tab (status: pending)
  - [ ] Toast notification on success

### 6.2 Answer Question (Seller)

- [ ] Seller sees questions on their products
  - [ ] Questions displayed in Q&A tab
  - [ ] Seller can post answer
  - [ ] Answer displayed under question
  - [ ] Toast notification on success

### 6.3 View Q&A (Public)

- [ ] All users can view Q&A
  - [ ] Questions and answers displayed on product detail page
  - [ ] Sorted by date (newest first)
  - [ ] Empty state if no questions

---

## 7. Transaction Room Flow

### 7.1 Access Transaction Room

- [ ] Winner accesses transaction room
  - [ ] Navigate from "Won Auctions" tab
  - [ ] Transaction room displays product summary
  - [ ] Stepper shows current stage (Payment → Shipping → Delivery → Complete)

### 7.2 Payment Stage

- [ ] View payment information
  - [ ] Total amount displayed (final bid + fees)
  - [ ] Payment instructions shown
  - [ ] Payment method selection (if applicable)
- [ ] Confirm Payment (Buyer)
  - [ ] Buyer marks payment as sent
  - [ ] Proof of payment uploaded (optional)
  - [ ] Status updates to "Payment Sent"
- [ ] Verify Payment (Seller)
  - [ ] Seller confirms payment received
  - [ ] Status updates to "Payment Confirmed"
  - [ ] Stepper advances to Shipping stage

### 7.3 Shipping Stage

- [ ] Enter Shipping Information (Buyer)
  - [ ] Address, phone, recipient name
  - [ ] Validation enforced
  - [ ] Save shipping info
- [ ] Ship Product (Seller)
  - [ ] Enter tracking number
  - [ ] Upload shipping proof (optional)
  - [ ] Mark as shipped
  - [ ] Status updates to "Shipped"
  - [ ] Stepper advances to Delivery stage

### 7.4 Delivery Stage

- [ ] Track Shipment (Both)
  - [ ] View tracking information
  - [ ] View shipment status updates
- [ ] Confirm Delivery (Buyer)
  - [ ] Buyer confirms product received
  - [ ] Status updates to "Delivered"
  - [ ] Stepper advances to Complete stage

### 7.5 Complete Stage

- [ ] Provide Feedback (Both)
  - [ ] Rating (1-5 stars)
  - [ ] Written feedback
  - [ ] Submit feedback
  - [ ] Toast notification on success
- [ ] View Feedback
  - [ ] Both parties can view feedback
  - [ ] Feedback displayed on user profiles (optional)
- [ ] Transaction Complete
  - [ ] Final status: "Completed"
  - [ ] No further actions required

### 7.6 Chat Communication

- [ ] Real-time Chat
  - [ ] Send text messages
  - [ ] Upload images (optional)
  - [ ] Messages displayed in chronological order
  - [ ] Unread message indicator
  - [ ] Timestamp on each message

---

## 8. Edge Cases & Error Handling

### 8.1 Network Errors

- [ ] API request fails
  - [ ] Error toast notification displayed
  - [ ] Error state UI shown (with retry button)
  - [ ] User can retry failed request
- [ ] Slow network
  - [ ] Loading indicators shown
  - [ ] Timeout handling

### 8.2 Validation Errors

- [ ] Form validation errors
  - [ ] Inline error messages displayed
  - [ ] Field highlighting for invalid inputs
  - [ ] Cannot submit until errors resolved
- [ ] Server-side validation errors
  - [ ] Error messages from API displayed
  - [ ] User can correct and resubmit

### 8.3 Authorization Errors

- [ ] Insufficient permissions
  - [ ] Redirect to `/unauthorized`
  - [ ] Error message displayed
- [ ] Session expired
  - [ ] Redirect to login
  - [ ] After login, redirect back to intended page

### 8.4 Not Found Errors

- [ ] Invalid product ID
  - [ ] Redirect to 404 page or show "Product not found"
- [ ] Invalid route
  - [ ] Redirect to 404 page

### 8.5 Business Logic Errors

- [ ] Bid on expired auction
  - [ ] Error message: "Auction has ended"
- [ ] Bid on own auction (seller)
  - [ ] Error message: "Cannot bid on own auction"
- [ ] Duplicate watchlist item
  - [ ] No error, just toggle existing item
- [ ] Delete category with products
  - [ ] Error message: "Cannot delete category with active products"
- [ ] Suspend own admin account
  - [ ] Error message: "Cannot suspend yourself"

### 8.6 Empty States

- [ ] No products in category
  - [ ] Empty state displayed with message
- [ ] No watchlist items
  - [ ] Empty state displayed
- [ ] No active bids
  - [ ] Empty state displayed
- [ ] No won auctions
  - [ ] Empty state displayed
- [ ] No categories
  - [ ] Empty state displayed (admin)
- [ ] No users (unlikely)
  - [ ] Empty state displayed (admin)

### 8.7 Loading States

- [ ] Page level loading
  - [ ] Skeleton loaders for lists
  - [ ] Spinner for detail pages
- [ ] Component level loading
  - [ ] Button loading states (disable + spinner)
  - [ ] Form submission loading
- [ ] Image loading
  - [ ] Placeholder while loading
  - [ ] Fallback image if load fails

---

## 9. Cross-Browser & Responsive Testing

### 9.1 Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (Chrome, Safari)

### 9.2 Responsive Design

- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667, 414x896)
- [ ] Navigation menu adapts (hamburger on mobile)
- [ ] Tables/grids adapt to small screens
- [ ] Forms usable on mobile
- [ ] Modals/dialogs responsive

### 9.3 Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatibility (ARIA labels)
- [ ] Color contrast meets WCAG standards
- [ ] Form labels properly associated

---

## 10. Performance Testing

### 10.1 Page Load Performance

- [ ] Home page loads in < 3 seconds
- [ ] Product list page loads in < 3 seconds
- [ ] Product detail page loads in < 3 seconds
- [ ] Admin dashboard loads in < 5 seconds

### 10.2 API Performance

- [ ] API responses < 500ms (90th percentile)
- [ ] Image upload completes in reasonable time
- [ ] Search/filter results return quickly

### 10.3 Pagination Performance

- [ ] Large product lists paginated efficiently
- [ ] No performance degradation with many items

---

## 11. Security Testing

### 11.1 Authentication Security

- [ ] JWT tokens stored securely (HttpOnly cookies or secure storage)
- [ ] Refresh token rotation prevents reuse
- [ ] Password hashing enforced (bcrypt)
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS attacks prevented (input sanitization)

### 11.2 Authorization Security

- [ ] API endpoints properly protected with middleware
- [ ] RBAC enforced on backend
- [ ] Users cannot access resources they don't own
- [ ] Admin-only routes inaccessible to non-admins

### 11.3 Input Validation

- [ ] All user inputs validated on backend
- [ ] File uploads restricted (type, size)
- [ ] SQL injection attempts blocked
- [ ] CSRF protection enabled (if applicable)

---

## 12. Data Integrity Testing

### 12.1 Concurrent Bidding

- [ ] Multiple users bid simultaneously
  - [ ] All bids recorded correctly
  - [ ] Highest bid always wins
  - [ ] No race conditions

### 12.2 Auction Lifecycle

- [ ] Auction starts at scheduled time
  - [ ] Cannot bid before start time
- [ ] Auction ends at scheduled time
  - [ ] Cannot bid after end time
  - [ ] Winner determined correctly
- [ ] Auction status transitions correctly
  - [ ] Pending → Active → Completed/Expired

### 12.3 User Role Changes

- [ ] Bidder upgraded to Seller
  - [ ] Role persists across sessions
  - [ ] New permissions apply immediately
- [ ] User suspended
  - [ ] Cannot login
  - [ ] Existing sessions invalidated

---

## Test Execution Tracking

### Testing Progress

- **Total Tests**: (Count all checkboxes)
- **Completed**: (Count checked boxes)
- **Pass Rate**: (Completed / Total \* 100%)

### Test Environment

- [ ] Development environment tested
- [ ] Staging environment tested
- [ ] Production environment tested (smoke tests)

### Test Data

- [ ] Test users created (Bidder, Seller, Admin)
- [ ] Test products created (various statuses)
- [ ] Test categories created
- [ ] Test transactions created

---

## Notes

- Update this checklist as new features are added
- Mark items as complete after successful testing
- Document any bugs found in separate issue tracker
- Re-test after bug fixes
- Prioritize critical user flows (auth, bidding, transactions) for regression testing
