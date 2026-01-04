import schedule from "node-schedule";
import db from "../database/db";
import * as productRepository from "../repositories/product.repository";
import * as userRepository from "../repositories/user.repository";
import * as EmailService from "./email.service";
import { envConfig } from "../configs/env.config";
import { toNum } from "../utils/number.util";

const jobs = new Map<number, schedule.Job>();

export const handleAuctionEnd = async (productId: number) => {
  const product = await productRepository.getProductDetailById(productId);

  if (!product) {
    console.error(`Product not found for handleAuctionEnd: ${productId}`);
    return;
  }

  const seller = await productRepository.getProductSeller(productId);

  if (!seller) {
    console.error(`Seller not found for product: ${productId}`);
    return;
  }

  const dashboardUrl = `${envConfig.CLIENT_URL}/seller/dashboard`;
  const productUrl = `${envConfig.CLIENT_URL}/products/${product.id}`;

  if (!product.highest_bidder_id) {
    // Case 1: No bidder => expired
    await productRepository.updateProductStatus(productId, "expired");

    await EmailService.sendAuctionEndedNoWinnerEmail(
      seller.email,
      seller.full_name,
      product.name,
      product.thumbnail_url || "",
      toNum(product.start_price),
      new Date(product.end_time).toLocaleString(),
      dashboardUrl
    ).catch((err) =>
      console.error("Failed to send auction ended (no winner) email:", err)
    );
  } else {
    // Case 2: Winner => pending
    await productRepository.updateProductStatus(productId, "pending");

    const winner = await userRepository.findById(product.highest_bidder_id);

    if (winner) {
      // Send mail to seller
      await EmailService.sendAuctionEndedWinnerEmail(
        seller.email,
        seller.full_name,
        product.name,
        product.thumbnail_url || "",
        toNum(product.current_price),
        winner.full_name,
        productUrl
      ).catch((err) =>
        console.error(
          "Failed to send auction ended (winner) email to seller:",
          err
        )
      );

      // Send mail to winner
      await EmailService.sendAuctionWonEmail(
        winner.email,
        winner.full_name,
        product.name,
        product.thumbnail_url || "",
        toNum(product.current_price),
        productUrl
      ).catch((err) =>
        console.error("Failed to send auction won email to winner:", err)
      );
    }
  }
};

export const scheduleAuctionEnd = (productId: number, date: Date) => {
  if (jobs.has(productId)) {
    jobs.get(productId)?.cancel();
    jobs.delete(productId);
  }

  const job = schedule.scheduleJob(date, async () => {
    await handleAuctionEnd(productId);
    jobs.delete(productId);
  });

  if (job) {
    jobs.set(productId, job);
  }
};

export const restoreJobs = async () => {
  const activeAuctions = await db("products")
    .where("status", "active")
    .andWhere("end_time", ">", new Date())
    .select("id", "end_time");

  activeAuctions.forEach((auction) => {
    scheduleAuctionEnd(auction.id, new Date(auction.end_time));
  });

  const missedAuctions = await db("products")
    .where("status", "active")
    .andWhere("end_time", "<", new Date())
    .select("id");

  for (const auction of missedAuctions) {
    await handleAuctionEnd(auction.id);
  }
};
