import { useState } from "react";
import * as productService from "../services/productService";
import { notify } from "../utils/notify";
import type { BidProductData } from "../pages/Product/components/ProductListCard";

export const useBidding = () => {
  const [selectedProduct, setSelectedProduct] = useState<BidProductData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openBidModal = (productData: BidProductData) => {
    // TODO: Add validation to check if auction is still active before opening modal
    // TODO: Check if user is authenticated, redirect to login if not

    // TODO: navigate("TRANSACTION PAGE") if user is winner || seller

    setSelectedProduct(productData);
    setIsModalOpen(true);
  };

  const closeBidModal = () => {
    setIsModalOpen(false);
    // Reset after animation
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const submitBid = async (amount: number) => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      console.log(`Submitting bid ${amount} for product ${selectedProduct.id}`);

      const result = await productService.placeBid(selectedProduct.id, amount);

      // TODO: Implement optimistic UI update - update product list immediately
      // TODO: Trigger product list refresh after successful bid
      // TODO: If using React Query/SWR, invalidate cache here

      // Handle the bid result
      if (result.status === "winning") {
        notify.success("Bid placed successfully! You are now the top bidder.");
        // TODO: Track analytics event for successful bid
      } else if (result.status === "outbid") {
        notify.warning("Bid placed, but you've been outbid by another bidder.");
        // TODO: Track analytics event for outbid scenario
      }

      closeBidModal();

      // TODO: Consider adding a callback prop to allow parent components to react to successful bids
      // e.g., onBidSuccess callback that refreshes the product list

      // Return result for potential use by caller
      return result;
    } catch (error) {
      console.error("Failed to place bid:", error);

      // TODO: Implement more specific error handling based on error codes
      // - Insufficient balance
      // - Auction ended
      // - Bid too low
      // - User is the seller
      // - User already won with auto-bid

      if (error instanceof Error) {
        notify.error(error.message || "Failed to place bid");
      } else {
        notify.error("Failed to place bid. Please try again.");
      }

      // TODO: Track analytics event for failed bid

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedProduct,
    isModalOpen,
    isSubmitting,
    openBidModal,
    closeBidModal,
    submitBid,
  };
};
