import { Knex } from "knex";
import db from "../database/db";

export const createBid = async (
  productId: number,
  bidderId: number,
  amount: number,
  trx?: Knex.Transaction
) => {
  const [bid] = await (trx || db)("bids")
    .insert({
      product_id: productId,
      bidder_id: bidderId,
      amount: amount,
    })
    .returning("*");
  return bid;
};

export const upsertAutoBid = async (
  productId: number,
  bidderId: number,
  maxAmount: number,
  trx?: Knex.Transaction
) => {
  const [autoBid] = await (trx || db)("auto_bids")
    .insert({
      product_id: productId,
      bidder_id: bidderId,
      max_amount: maxAmount,
    })
    .onConflict(["product_id", "bidder_id"])
    .merge(["max_amount"])
    .returning("*");
  return autoBid;
};

export const getAutoBidsByProductId = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  return (trx || db)("auto_bids")
    .where({ product_id: productId })
    .orderBy("max_amount", "desc")
    .orderBy("created_at", "asc");
};

export const getHighestBid = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  return (trx || db)("bids")
    .where({ product_id: productId })
    .orderBy("amount", "desc")
    .orderBy("created_at", "asc")
    .first();
};

export const addRejection = async (
  productId: number,
  bidderId: number,
  reason: string,
  trx?: Knex.Transaction
) => {
  const query = db("product_rejections").insert({
    product_id: productId,
    bidder_id: bidderId,
    reason: reason || "Seller rejected bid",
    created_at: new Date(), // db.sql của bạn có cột này
  });

  if (trx) query.transacting(trx);
  await query;
};

export const deleteUserAutoBids = async (
  productId: number,
  bidderId: number,
  trx?: Knex.Transaction
) => {
  const query = db("auto_bids")
    .where({ product_id: productId, bidder_id: bidderId })
    .del();

  if (trx) query.transacting(trx);
  await query;
};

export const deleteUserBids = async (
  productId: number,
  bidderId: number,
  trx?: Knex.Transaction
) => {
  const query = db("bids")
    .where({ product_id: productId, bidder_id: bidderId })
    .del();

  if (trx) query.transacting(trx);
  await query;
};

export const deleteBidsAboveAmount = async (
  productId: number,
  amount: number,
  trx?: Knex.Transaction
) => {
  await (trx || db)("bids")
    .where({ product_id: productId })
    .andWhere("amount", ">", amount)
    .del();
};

export const findBidByDetails = async (
  productId: number,
  bidderId: number | null,
  amount: number,
  trx?: Knex.Transaction
) => {
  return (trx || db)("bids")
    .where({
      product_id: productId,
      bidder_id: bidderId,
      amount: amount,
    })
    .first();
};

export const getBidCount = async (
  productId: number,
  trx?: Knex.Transaction
): Promise<number> => {
  const result = await (trx || db)("bids")
    .where({ product_id: productId })
    .count("id as count")
    .first();
  return result ? Number(result.count) : 0;
};

export const getUniqueBiddersByProductId = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  return (trx || db)("bids")
    .join("users", "bids.bidder_id", "users.id")
    .where("bids.product_id", productId)
    .distinct("users.id", "users.email", "users.full_name")
    .select();
};
