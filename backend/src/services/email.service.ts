import nodemailer from "nodemailer";
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

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   pool: true,
//   maxConnections: 1,
//   maxMessages: 10,
//   auth: {
//     user: envConfig.EMAIL_USER,
//     pass: envConfig.EMAIL_PASSWORD,
//   },
// });

export const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL_HOST,
  port: envConfig.EMAIL_PORT,
  secure: false,
  auth: {
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASSWORD,
  },
});

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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Verify your account - Auctionary",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<void> => {
  const htmlContent = getWelcomeTemplate({
    userName: userName,
    homeUrl: envConfig.CLIENT_URL,
  });

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Welcome to Auctionary! 🎉",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Bid Placed Successfully - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "New Bid Received on Your Product - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "You've Been Outbid - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Bid Rejection Notice - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Auction Ended - No Bids Received - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Auction Ended - Winner Confirmed - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Congratulations! You Won the Auction - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "New Question About Your Product - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Seller Has Answered a Question - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Seller Account Upgrade Approved - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Reset Your Password - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
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

  const mailOptions = {
    from: envConfig.EMAIL_FROM,
    to: email,
    subject: "Transaction Cancelled by Seller - Auctionary",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
