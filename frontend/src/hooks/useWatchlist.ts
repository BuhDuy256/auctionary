import { useState, useEffect, useCallback } from "react";
import { notify } from "../utils/toast";
import * as watchlistService from "../services/watchlistService";
import { useAuth } from "./useAuth";
import type { WatchlistProduct } from "../types/watchlist";

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWatchlist = useCallback(async () => {
    if (!user) {
      setWatchlist([]);
      return;
    }

    try {
      setIsLoading(true);
      const data = await watchlistService.getWatchlist();
      setWatchlist(data.products || []);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const isWatched = useCallback(
    (productId: string) => {
      return watchlist.some((item) => item.id === productId);
    },
    [watchlist]
  );

  const addToWatchlist = async (product: WatchlistProduct, undoing = false) => {
    if (!user) {
      notify.error("Please login to use watchlist");
      return;
    }

    if (!undoing && isWatched(product.id)) return;

    const previousList = [...watchlist];
    setWatchlist((prev) => [...prev, product]);

    try {
      await watchlistService.addProductToWatchlist({
        productId: Number(product.id),
      });
      notify.success(`Added ${product.title} to watchlist`);
    } catch (error) {
      setWatchlist(previousList);
      notify.error("Failed to add to watchlist");
      console.error(error);
    }
  };

  // if product is string, it is product id
  const removeFromWatchlist = async (input: string | WatchlistProduct) => {
    if (!user) return;

    let productId, product;
    if (typeof input === "object") {
      product = input;
      productId = input.id;
    } else {
      productId = input;
    }

    const previousList = [...watchlist];
    setWatchlist((prev) => prev.filter((item) => item.id !== productId));

    try {
      await watchlistService.removeProductFromWatchlist(Number(productId));
      if (product) {
        notify.undo(`Removed ${product.title} from watchlist`, () => {
          addToWatchlist(product, true);
        });
      } else {
        notify.success("Removed from watchlist");
      }
    } catch (error) {
      setWatchlist(previousList);
      notify.error("Failed to remove from watchlist");
      console.error(error);
    }
  };

  return {
    watchlist,
    isLoading,
    isWatched,
    addToWatchlist,
    removeFromWatchlist,
    refreshWatchlist,
  };
};
