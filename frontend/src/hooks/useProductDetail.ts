import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as productService from "../services/productService";
import { extractIdFromSlug } from "../utils/url";
import type {
  ProductDetailResponse,
  BidHistoryResponse,
  QuestionsResponse,
} from "../types/product";

export const useProductDetail = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const productId = extractIdFromSlug(paramId || "");

  const [productData, setProductData] = useState<ProductDetailResponse | null>(
    null
  );
  const [bidsData, setBidsData] = useState<BidHistoryResponse | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionsResponse | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch main product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await productService.getProductDetail(productId);
        setProductData(data);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch product detail:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load product details");
        } else {
          setError("Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch Bids (can be optimized to load on tab change, but loading initially for now)
  useEffect(() => {
    const fetchBids = async () => {
      if (!productId) return;
      try {
        const data = await productService.getProductBids(productId);
        setBidsData(data);
      } catch (err) {
        console.error("Failed to fetch bids:", err);
      }
    };

    fetchBids();
  }, [productId]);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!productId) return;
      try {
        const data = await productService.getProductQuestions(productId);
        setQuestionsData(data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    fetchQuestions();
  }, [productId]);

  return {
    product: productData?.product,
    seller: productData?.seller,
    auction: productData?.auction,
    userStatus: productData?.userProductStatus,
    bids: bidsData,
    questions: questionsData,
    loading,
    error,
    placeBid: async (amount: number) => {
      if (!productId) return;
      const result = await productService.placeBid(productId, amount);

      // Update local state based on result
      if (result.status === "winning" || result.status === "outbid") {
        setProductData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            auction: {
              ...prev.auction,
              currentPrice: result.currentPrice,
              bidCount: prev.auction.bidCount + 1,
              topBidder: result.currentWinnerId.toString()
            },
            userProductStatus: {
              ...prev.userProductStatus,
              isOutbid: result.status === "outbid",
              isTopBidder: result.status === "winning",
              currentUserMaxBid: amount,
              isWatchlisted: prev.userProductStatus?.isWatchlisted || false
            }
          };
        });

        // Refresh bids history to show the new bid
        const bids = await productService.getProductBids(productId);
        setBidsData(bids);
      }
      return result;
    },
    appendDescription: async (content: string) => {
      if (!productId || !productData?.seller.id) return;
      await productService.appendDescription(productId, content, productData.seller.id);

      // Refresh product details to show new description
      const data = await productService.getProductDetail(productId);
      setProductData(data);
    },
    appendQuestion: async (content: string, askBy: number | undefined) => {
      if (!productId || !productData?.seller.id) return;
      await productService.appendQuestion(productId, content, askBy);
      const questionsData = await productService.getProductQuestions(productId);
      setQuestionsData(questionsData);
    },
    appendAnswer: async (content: string, questionId: number | undefined, answerBy: number | undefined) => {
      if (!productId || !productData?.seller.id) return;
      await productService.appendAnswer(productId, questionId, content, answerBy);
      const questionsData = await productService.getProductQuestions(productId);
      setQuestionsData(questionsData);
    }
  };
};
