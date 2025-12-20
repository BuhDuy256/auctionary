# Email Templates TODO

Based on the project requirements, the following email templates need to be implemented:

## 1. OTP Verification Email ✅ (Already exists)

- **Title:** Verify Your Email - OTP Code
- **Content summary:** Contains a 6-digit OTP code for email verification during registration
- **Example:** "Your verification code is: 123456. This code will expire in 10 minutes."
- **File:** `otp.template.ts`

---

## 2. Bid Placed Successfully - To Bidder

- **Title:** Your Bid Has Been Placed Successfully
- **Content summary:** Confirms the bidder's successful bid placement with product details and current bid amount
- **Example:** "Congratulations! Your bid of 10,800,000 VND for iPhone 11 has been placed successfully. You are currently the highest bidder."

---

## 3. Bid Placed - To Seller

- **Title:** New Bid Received on Your Product
- **Content summary:** Notifies seller when a new bid is placed on their product, includes product name, new price, and bidder info
- **Example:** "Good news! A new bid of 10,800,000 VND has been placed on your product 'iPhone 11' by \*\*\*\*Khoa."

---

## 4. Outbid Notification - To Previous Highest Bidder

- **Title:** You've Been Outbid
- **Content summary:** Alerts the previous highest bidder that someone has placed a higher bid, encourages them to bid again
- **Example:** "Someone has outbid you on 'iPhone 11'. The current price is now 10,800,000 VND. Place a new bid to stay in the game!"

---

## 5. Bidder Rejected

- **Title:** Bid Rejection Notice
- **Content summary:** Informs bidder they have been rejected from bidding on a specific product by the seller
- **Example:** "Unfortunately, the seller has rejected your participation in the auction for 'iPhone 11'. You are no longer able to bid on this product."

---

## 6. Auction Ended - No Winner (To Seller)

- **Title:** Auction Ended - No Bids Received
- **Content summary:** Notifies seller that their auction has ended without receiving any valid bids
- **Example:** "Your auction for 'iPhone 11' has ended. Unfortunately, no bids were received during the auction period."

---

## 7. Auction Ended - To Seller

- **Title:** Auction Ended - Winner Confirmed
- **Content summary:** Notifies seller that auction ended successfully with a winner, includes winner details and final price
- **Example:** "Your auction for 'iPhone 11' has ended successfully! The winning bid is 11,700,000 VND by \*\*\*\*Khoa. Please proceed to complete the order."

---

## 8. Auction Won - To Winner

- **Title:** Congratulations! You Won the Auction
- **Content summary:** Notifies the winning bidder of their victory, includes product details, final price, and next steps for order completion
- **Example:** "Congratulations! You won the auction for 'iPhone 11' with a final bid of 11,700,000 VND. Please proceed to complete your order."

---

## 9. New Question from Buyer - To Seller

- **Title:** New Question About Your Product
- **Content summary:** Notifies seller when a bidder asks a question about their product, includes the question and a quick link to product details page to answer
- **Example:** "A buyer has asked a question about your product 'iPhone 11': 'Does it come with original accessories?' Click here to view and answer: [Link]"

---

## 10. Seller Answered - To Bidders

- **Title:** Seller Has Answered a Question
- **Content summary:** Notifies all bidders participating in the auction and those who asked questions when the seller posts an answer
- **Example:** "The seller has answered a question about 'iPhone 11': Q: 'Does it come with original accessories?' A: 'Yes, includes original charger and earphones.'"

---

## 11. Seller Upgrade Request Approved - To Bidder

- **Title:** Seller Account Upgrade Approved
- **Content summary:** Notifies bidder that their request to become a seller has been approved by admin
- **Example:** "Great news! Your request to upgrade to a seller account has been approved. You can now start posting auction products."

---

## 12. Password Reset Request

- **Title:** Reset Your Password - OTP Code
- **Content summary:** Contains OTP code for password reset verification as per "Forgot Password" feature
- **Example:** "You requested to reset your password. Your verification code is: 789012. This code will expire in 10 minutes."

---

## 13. Transaction Cancelled - To Winner

- **Title:** Transaction Cancelled by Seller
- **Content summary:** Notifies winner that seller has cancelled the transaction, includes reason (usually non-payment)
- **Example:** "Unfortunately, the seller has cancelled your transaction for 'iPhone 11'. Reason: Winner did not pay. This will result in a -1 rating."

---

## Template Implementation Notes

### Common Elements for All Templates:

- **Branding:** AUCTIONARY logo with accent color
- **Theme Support:** Both light and dark theme colors from `themes.config.ts`
- **Responsive Design:** Mobile-friendly email layout
- **Footer:** Company info, unsubscribe link, social media links
- **CTA Buttons:** Primary action buttons with hover states

### Parameters to Include:

- User name
- Product details (name, image, current price)
- Timestamps (formatted appropriately)
- Action links (view product, view dashboard, etc.)
- Dynamic content based on context
