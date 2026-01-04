# Mailing System Checklist

Track the implementation and integration of email notifications.

## Authentication & Account

- [x] OTP Verification (`sendOTPEmail`) - Integrated
- [x] Welcome Email (`sendWelcomeEmail`) - Integrated
- [x] Password Reset (`sendPasswordResetEmail`) - Integrated

## Bidding

- [x] Bid Placed - To Bidder (`sendBidPlacedEmail`) - Integrated
- [x] New Bid Received - To Seller (`sendBidPlacedSellerEmail`) - Integrated
- [x] Outbid Notification - To Previous Bidder (`sendOutbidNotificationEmail`) - Integrated
- [x] Bidder Rejected (`sendBidderRejectedEmail`) - Integrated

## Auction End

- [ ] Auction Ended - No Winner (`sendAuctionEndedNoWinnerEmail`)
- [ ] Auction Ended - To Seller (`sendAuctionEndedWinnerEmail`)
- [ ] Auction Won - To Winner (`sendAuctionWonEmail`)

## Q&A

- [x] New Question - To Seller (`sendNewQuestionEmail`) - Integrated
- [x] Seller Answered - To Bidder (`sendSellerAnsweredEmail`) - Integrated

## Seller Upgrade

- [x] Upgrade Approved (`sendSellerUpgradeApprovedEmail`) - Integrated

## Transaction

- [x] Transaction Cancelled (`sendTransactionCancelledEmail`) - Integrated
