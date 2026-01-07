import { Resend } from "resend";
import { envConfig } from "../configs/env.config";
import { getOTPTemplate } from "../mails/otp.template";
import { getBidPlacedTemplate } from "../mails/bid-placed.template";
import { getBidPlacedSellerTemplate } from "../mails/bid-placed-seller.template";
import { getOutbidNotificationTemplate } from "../mails/outbid-notification.template";
import { getBidderRejectedTemplate } from "../mails/bidder-rejected.template";
import { getAuctionEndedNoWinnerTemplate } from "../mails/auction-ended-no-winner.template";
import { getAuctionEndedWinnerTemplate } from "../mails/auction-ended-winner.template";
import { getAuctionWonTemplate } from "../mails/auction-won.template";
import { getNewQuestionTemplate } from "../mails/new-question.template";
import { getSellerAnsweredTemplate } from "../mails/seller-answered.template";
import { getSellerUpgradeApprovedTemplate } from "../mails/seller-upgrade-approved.template";
import { getPasswordResetTemplate } from "../mails/password-reset.template";
import { getTransactionCancelledTemplate } from "../mails/transaction-cancelled.template";
import { getWelcomeTemplate } from "../mails/welcome.template";
import { getPasswordResetAdminTemplate } from "../mails/password-reset-admin.template";

const resend = new Resend(envConfig.RESEND_API_KEY);

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const { error } = await resend.emails.send({
      from: envConfig.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
  userName: string
): Promise<void> => {
  const htmlContent = getOTPTemplate({
    userName: userName,
    otp: otp,
    expiryMinutes: envConfig.OTP_EXPIRY_MINUTES || 15,
  });

  await sendEmail(email, "Verify your account - Auctionary", htmlContent);
  console.log(`OTP email sent to ${email}`);
};

export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<void> => {
  const htmlContent = getWelcomeTemplate({
    userName: userName,
    homeUrl: envConfig.CLIENT_URL,
  });

  await sendEmail(email, "Welcome to Auctionary! 🎉", htmlContent);
};

export const sendBidPlacedEmail = async (
  email: string,
  userName: string,
  productName: string,
  productImage: string,
  bidAmount: number,
  currentHighestBidder: boolean,
  productUrl: string
): Promise<void> => {
  const htmlContent = getBidPlacedTemplate({
    userName: userName,
    productName: productName,
    productImage: productImage,
    bidAmount: bidAmount,
    currentHighestBidder: currentHighestBidder,
    productUrl: productUrl,
  });

  await sendEmail(email, "Bid Placed Successfully - Auctionary", htmlContent);
};

export const sendBidPlacedSellerEmail = async (
  email: string,
  sellerName: string,
  productName: string,
  productImage: string,
  bidAmount: number,
  bidderName: string,
  productUrl: string
): Promise<void> => {
  const htmlContent = getBidPlacedSellerTemplate({
    sellerName: sellerName,
    productName: productName,
    productImage: productImage,
    bidAmount: bidAmount,
    bidderName: bidderName,
    productUrl: productUrl,
  });

  await sendEmail(
    email,
    "New Bid Received on Your Product - Auctionary",
    htmlContent
  );
};

export const sendOutbidNotificationEmail = async (
  email: string,
  userName: string,
  productName: string,
  productImage: string,
  currentBidAmount: number,
  productUrl: string
): Promise<void> => {
  const htmlContent = getOutbidNotificationTemplate({
    userName: userName,
    productName: productName,
    productImage: productImage,
    currentBidAmount: currentBidAmount,
    productUrl: productUrl,
  });

  await sendEmail(email, "You've Been Outbid - Auctionary", htmlContent);
};

export const sendBidderRejectedEmail = async (
  email: string,
  userName: string,
  productName: string,
  productImage: string,
  productUrl: string
): Promise<void> => {
  const htmlContent = getBidderRejectedTemplate({
    userName: userName,
    productName: productName,
    productImage: productImage,
    productUrl: productUrl,
  });

  await sendEmail(email, "Bid Rejection Notice - Auctionary", htmlContent);
};

export const sendAuctionEndedNoWinnerEmail = async (
  email: string,
  sellerName: string,
  productName: string,
  productImage: string,
  startPrice: number,
  endDate: string,
  dashboardUrl: string
): Promise<void> => {
  const htmlContent = getAuctionEndedNoWinnerTemplate({
    sellerName: sellerName,
    productName: productName,
    productImage: productImage,
    startPrice: startPrice,
    endDate: endDate,
    dashboardUrl: dashboardUrl,
  });

  await sendEmail(
    email,
    "Auction Ended - No Bids Received - Auctionary",
    htmlContent
  );
};

export const sendAuctionEndedWinnerEmail = async (
  email: string,
  sellerName: string,
  productName: string,
  productImage: string,
  finalBidAmount: number,
  winnerName: string,
  productUrl: string
): Promise<void> => {
  const htmlContent = getAuctionEndedWinnerTemplate({
    sellerName,
    productName,
    productImage,
    finalBidAmount,
    winnerName,
    productUrl,
  });

  await sendEmail(
    email,
    "Auction Ended - Winner Confirmed - Auctionary",
    htmlContent
  );
};

export const sendAuctionWonEmail = async (
  email: string,
  userName: string,
  productName: string,
  productImage: string,
  finalBidAmount: number,
  productUrl: string
): Promise<void> => {
  const htmlContent = getAuctionWonTemplate({
    userName,
    productName,
    productImage,
    finalBidAmount,
    productUrl,
  });

  await sendEmail(
    email,
    "Congratulations! You Won the Auction - Auctionary",
    htmlContent
  );
};

export const sendNewQuestionEmail = async (
  email: string,
  sellerName: string,
  productName: string,
  productImage: string,
  question: string,
  askedBy: string,
  productUrl: string
): Promise<void> => {
  const htmlContent = getNewQuestionTemplate({
    sellerName,
    productName,
    productImage,
    question,
    askedBy,
    productUrl,
  });

  await sendEmail(
    email,
    "New Question About Your Product - Auctionary",
    htmlContent
  );
};

export const sendSellerAnsweredEmail = async (
  email: string,
  userName: string,
  productName: string,
  productImage: string,
  question: string,
  answer: string,
  productUrl: string
): Promise<void> => {
  const htmlContent = getSellerAnsweredTemplate({
    userName,
    productName,
    productImage,
    question,
    answer,
    productUrl,
  });

  await sendEmail(
    email,
    "Seller Has Answered a Question - Auctionary",
    htmlContent
  );
};

export const sendSellerUpgradeApprovedEmail = async (
  email: string,
  userName: string,
  dashboardUrl: string
): Promise<void> => {
  const htmlContent = getSellerUpgradeApprovedTemplate({
    userName,
    dashboardUrl,
  });

  await sendEmail(
    email,
    "Seller Account Upgrade Approved - Auctionary",
    htmlContent
  );
};

export const sendPasswordResetEmail = async (
  email: string,
  userName: string,
  otp: string
): Promise<void> => {
  const htmlContent = getPasswordResetTemplate({
    userName,
    otp,
    expiryMinutes: envConfig.OTP_EXPIRY_MINUTES || 15,
  });

  await sendEmail(email, "Reset Your Password - Auctionary", htmlContent);
};

export const sendTransactionCancelledEmail = async (
  email: string,
  userName: string,
  productName: string,
  productImage: string,
  finalBidAmount: number,
  cancellationReason: string,
  productUrl: string
): Promise<void> => {
  const htmlContent = getTransactionCancelledTemplate({
    userName,
    productName,
    productImage,
    finalBidAmount,
    cancellationReason,
    productUrl,
  });

  await sendEmail(
    email,
    "Transaction Cancelled by Seller - Auctionary",
    htmlContent
  );
};

// New function for admin password reset
export const sendAdminPasswordResetEmail = async (
  email: string,
  userName: string,
  temporaryPassword: string
): Promise<void> => {
  const htmlContent = getPasswordResetAdminTemplate({
    userName: userName,
    temporaryPassword,
  });

  await sendEmail(
    email,
    "🔐 Your Password Has Been Reset by Administrator",
    htmlContent
  );
};
