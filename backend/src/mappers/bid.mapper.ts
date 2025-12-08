import { PlaceBidResponse } from "../api/dtos/responses/place-bid.type";

export const toPlaceBidResponse = (
  status: "winning" | "outbid",
  currentPrice: number,
  currentWinnerId: number
): PlaceBidResponse => {
  return {
    status,
    currentPrice: Number(currentPrice),
    currentWinnerId,
  };
};