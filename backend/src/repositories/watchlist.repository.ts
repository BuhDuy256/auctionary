import db from "../database/db";

export const getWatchlist = async (userId: number) => {
  return await db("watchlist")
    .join("products", "watchlist.product_id", "products.id")
    .where("watchlist.user_id", userId)
    .select("products.*");
};

export const addProductToWatchlist = async (
  userId: number,
  productId: number
) => {
  return await db("watchlist")
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .returning("product_id");
};

export const removeProductFromWatchlist = async (
  userId: number,
  productId: number
) => {
  return await db("watchlist")
    .where("user_id", userId)
    .andWhere("product_id", productId)
    .del()
    .returning("product_id");
};
