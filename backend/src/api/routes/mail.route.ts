// This route is only used for testing mail templates

import { Router } from "express";
import * as emailService from "../../services/email.service";

const router = Router();

router.post("/otp", async (req, res) => {
  await emailService.sendOTPEmail(
    req.body.email,
    req.body.otp,
    req.body.userName
  );
  res.status(200).json({ message: "OTP email sent successfully" });
});

router.post("/bid-placed", async (req, res) => {
  await emailService.sendBidPlacedEmail(
    req.body.email,
    req.body.userName,
    req.body.productName,
    req.body.productImage,
    req.body.bidAmount,
    req.body.currentHighestBidder,
    req.body.productUrl
  );
  res.status(200).json({ message: "Bid placed email sent successfully" });
});

router.post("/bid-placed-seller", async (req, res) => {
  await emailService.sendBidPlacedSellerEmail(
    req.body.email,
    req.body.sellerName,
    req.body.productName,
    req.body.productImage,
    req.body.bidAmount,
    req.body.bidderName,
    req.body.productUrl
  );
  res
    .status(200)
    .json({ message: "Seller bid notification email sent successfully" });
});

router.post("/outbid-notification", async (req, res) => {
  await emailService.sendOutbidNotificationEmail(
    req.body.email,
    req.body.userName,
    req.body.productName,
    req.body.productImage,
    req.body.currentBidAmount,
    req.body.productUrl
  );
  res
    .status(200)
    .json({ message: "Outbid notification email sent successfully" });
});

router.post("/bidder-rejected", async (req, res) => {
  await emailService.sendBidderRejectedEmail(
    req.body.email,
    req.body.userName,
    req.body.productName,
    req.body.productImage,
    req.body.productUrl
  );
  res.status(200).json({ message: "Bidder rejected email sent successfully" });
});

router.post("/auction-ended-no-winner", async (req, res) => {
  await emailService.sendAuctionEndedNoWinnerEmail(
    req.body.email,
    req.body.sellerName,
    req.body.productName,
    req.body.productImage,
    req.body.startPrice,
    req.body.endDate,
    req.body.dashboardUrl
  );
  res
    .status(200)
    .json({ message: "Auction ended no winner email sent successfully" });
});

router.post("/auction-ended-winner", async (req, res) => {
  await emailService.sendAuctionEndedWinnerEmail(
    req.body.email,
    req.body.sellerName,
    req.body.productName,
    req.body.productImage,
    req.body.finalBidAmount,
    req.body.winnerName,
    req.body.productUrl
  );
  res
    .status(200)
    .json({ message: "Auction ended winner email sent successfully" });
});

router.post("/auction-won", async (req, res) => {
  await emailService.sendAuctionWonEmail(
    req.body.email,
    req.body.userName,
    req.body.productName,
    req.body.productImage,
    req.body.finalBidAmount,
    req.body.productUrl
  );
  res.status(200).json({ message: "Auction won email sent successfully" });
});

router.post("/new-question", async (req, res) => {
  await emailService.sendNewQuestionEmail(
    req.body.email,
    req.body.sellerName,
    req.body.productName,
    req.body.productImage,
    req.body.question,
    req.body.askedBy,
    req.body.productUrl
  );
  res.status(200).json({ message: "New question email sent successfully" });
});

router.post("/seller-answered", async (req, res) => {
  await emailService.sendSellerAnsweredEmail(
    req.body.email,
    req.body.userName,
    req.body.productName,
    req.body.productImage,
    req.body.question,
    req.body.answer,
    req.body.productUrl
  );
  res.status(200).json({ message: "Seller answered email sent successfully" });
});

router.post("/seller-upgrade-approved", async (req, res) => {
  await emailService.sendSellerUpgradeApprovedEmail(
    req.body.email,
    req.body.userName,
    req.body.dashboardUrl
  );
  res
    .status(200)
    .json({ message: "Seller upgrade approved email sent successfully" });
});

router.post("/password-reset", async (req, res) => {
  await emailService.sendPasswordResetEmail(
    req.body.email,
    req.body.userName,
    req.body.otp
  );
  res.status(200).json({ message: "Password reset email sent successfully" });
});

router.post("/transaction-cancelled", async (req, res) => {
  await emailService.sendTransactionCancelledEmail(
    req.body.email,
    req.body.userName,
    req.body.productName,
    req.body.productImage,
    req.body.finalBidAmount,
    req.body.cancellationReason,
    req.body.productUrl
  );
  res
    .status(200)
    .json({ message: "Transaction cancelled email sent successfully" });
});

export default router;
