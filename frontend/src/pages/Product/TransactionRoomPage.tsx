import { useState } from "react";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { TransactionRoom } from "./components/TransactionRoomPayment";
import { TransactionRoomShipping } from "./components/TransactionRoomShipping";
import { TransactionRoomDelivery } from "./components/TransactionRoomDelivery";
import { TransactionRoomComplete } from "./components/TransactionRoomComplete";
import { FeedbackModal, type FeedbackData } from "./components/FeedbackModal";
import { TransactionRoomHeader } from "./components/TransactionRoomHeader";
import { TransactionProductSummary } from "./components/TransactionProductSummary";
import {
  TransactionStepper,
  type TransactionStep,
} from "./components/TransactionStepper";
import {
  TransactionChat,
  type ChatMessage,
} from "./components/TransactionChat";
import { toast } from "sonner";
import MainLayout from "../../layouts/MainLayout";
import { Clock, CreditCard, Package, Truck, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useTransaction } from "../../hooks/useTransaction";
import { useAuth } from "../../hooks/useAuth";
import { formatTime } from "../../utils/dateUtils";
import type { TransactionDetailResponse, TransactionStatus } from "../../types/transaction";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type StepState = "completed" | "active-actor" | "active-observer" | "locked";

// ============================================================================
// HELPER FUNCTIONS - Map Transaction Status to UI State
// ============================================================================

/**
 * Get status badge configuration based on transaction status
 */
const getStatusBadge = (status: TransactionStatus) => {
  switch (status) {
    case "payment_pending":
      return {
        icon: Clock,
        text: "Payment Pending",
        className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
      };
    case "shipping_pending":
      return {
        icon: Package,
        text: "Shipping Pending",
        className: "bg-blue-500/20 text-blue-500 border-blue-500/50",
      };
    case "delivered":
      return {
        icon: Truck,
        text: "Delivered",
        className: "bg-green-500/20 text-green-500 border-green-500/50",
      };
    case "completed":
      return {
        icon: CheckCircle2,
        text: "Completed",
        className: "bg-green-500/20 text-green-500 border-green-500/50",
      };
    case "cancelled":
      return {
        icon: Clock,
        text: "Cancelled",
        className: "bg-red-500/20 text-red-500 border-red-500/50",
      };
  }
};

const getDescription = (status: TransactionStatus, isSeller: boolean) => {
  switch (status) {
    case "payment_pending":
      return isSeller
        ? "Waiting for buyer to submit payment proof"
        : "Please upload payment proof and delivery address";
    case "shipping_pending":
      return isSeller
        ? "Please upload shipping proof"
        : "Waiting for seller to ship the item";
    case "delivered":
      return isSeller
        ? "Waiting for buyer to confirm receipt"
        : "Please confirm you received the item";
    case "completed":
      return "Transaction completed successfully";
    case "cancelled":
      return "This transaction was cancelled";
  }
};

const getTransactionSteps = (status: TransactionStatus): TransactionStep[] => {
  const steps: TransactionStep[] = [
    {
      id: 1,
      label: "Payment",
      icon: CreditCard,
      status: "upcoming",
      description: "Payment confirmed",
    },
    {
      id: 2,
      label: "Shipping",
      icon: Package,
      status: "upcoming",
      description: "Package shipped",
    },
    {
      id: 3,
      label: "Delivery",
      icon: Truck,
      status: "upcoming",
      description: "Successfully delivered",
    },
    {
      id: 4,
      label: "Complete",
      icon: CheckCircle2,
      status: "upcoming",
      description: "Transaction complete",
    },
  ];

  // Update statuses based on transaction state (cumulative)
  switch (status) {
    case "payment_pending":
      steps[0].status = "pending";
      break;
    case "shipping_pending":
      steps[0].status = "completed";
      steps[1].status = "pending";
      break;
    case "delivered":
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "pending";
      break;
    case "completed":
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "completed";
      break;
    case "cancelled":
      // All steps remain upcoming for cancelled
      break;
  }

  return steps;
};

const getProgressPercentage = (status: TransactionStatus): number => {
  switch (status) {
    case "payment_pending":
      return 0;
    case "shipping_pending":
      return 33;
    case "delivered":
      return 66;
    case "completed":
      return 100;
    case "cancelled":
      return 0;
  }
};

/**
 * Map transaction messages to chat messages format
 */
const mapTransactionMessagesToChat = (
  messages: TransactionDetailResponse["messages"],
  buyerId: number,
  sellerId: number,
  buyerName: string,
  sellerName: string
): ChatMessage[] => {
  return messages.map((msg) => {
    // Determine sender type
    let sender: "buyer" | "seller" | "system";
    let name: string | undefined;
    let avatar: string | undefined;

    if (msg.senderId === buyerId) {
      sender = "buyer";
      name = buyerName;
      avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${buyerId}`;
    } else if (msg.senderId === sellerId) {
      sender = "seller";
      name = sellerName;
      avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerId}`;
    } else {
      sender = "system";
    }

    return {
      id: msg.id,
      sender,
      name,
      message: msg.content,
      timestamp: formatTime(msg.createdAt),
      avatar,
    };
  });
};

/**
 * Get footer text for chat based on transaction status
 */
const getChatFooterText = (status: TransactionStatus): string => {
  switch (status) {
    case "payment_pending":
      return "All messages are monitored for security";
    case "shipping_pending":
      return "All messages are monitored for security";
    case "delivered":
      return "Contact the seller if you have concerns";
    case "completed":
      return "Chat remains available for post-transaction support";
    case "cancelled":
      return "Transaction has been cancelled";
  }
};

/**
 * Determine the state of each transaction step based on backend data
 * Priority: Actual database timestamps over status enum
 * 
 * Rules:
 * - Completed: Timestamp for end of step is NOT NULL
 * - Active: Previous step completed AND current step timestamp is NULL
 * - Locked: Previous step NOT completed
 */
const getStepStates = (
  transaction: TransactionDetailResponse,
  isSeller: boolean
): {
  payment: StepState;
  shipping: StepState;
  delivery: StepState;
  complete: StepState;
} => {
  const states = {
    payment: "locked" as StepState,
    shipping: "locked" as StepState,
    delivery: "locked" as StepState,
    complete: "locked" as StepState,
  };

  // ============================================================================
  // STEP 1: PAYMENT
  // Completed when: payment.confirmedAt is NOT NULL
  // Active when: payment.confirmedAt is NULL
  // ============================================================================
  if (transaction.payment.confirmedAt) {
    // Payment confirmed - step completed
    states.payment = "completed";
  } else {
    // Payment not confirmed yet
    // Buyer must upload proof (actor), Seller waits (observer)
    states.payment = isSeller ? "active-observer" : "active-actor";
  }

  // ============================================================================
  // STEP 2: SHIPPING
  // Completed when: fulfillment.shippedConfirmedAt is NOT NULL
  // Active when: payment confirmed AND (shippingInfo exists OR shippedConfirmedAt is NULL)
  // Locked when: payment NOT confirmed
  // ============================================================================
  if (transaction.fulfillment.shippedConfirmedAt) {
    // Shipping confirmed - step completed
    states.shipping = "completed";
  } else if (transaction.payment.confirmedAt) {
    // Payment confirmed, but shipping not confirmed yet
    
    // Sub-step 1: Buyer provides shipping address (if not provided yet)
    const hasShippingAddress = transaction.shippingInfo.fullName && 
                                transaction.shippingInfo.address;
    
    if (!hasShippingAddress) {
      // Buyer needs to provide shipping address
      states.shipping = isSeller ? "active-observer" : "active-actor";
    } else {
      // Address exists, Seller needs to upload shipping proof
      states.shipping = isSeller ? "active-actor" : "active-observer";
    }
  } else {
    // Payment not confirmed - shipping is locked
    states.shipping = "locked";
  }

  // ============================================================================
  // STEP 3: DELIVERY
  // Completed when: fulfillment.buyerReceivedAt is NOT NULL
  // Active when: shipping confirmed AND buyerReceivedAt is NULL
  // Locked when: shipping NOT confirmed
  // ============================================================================
  if (transaction.fulfillment.buyerReceivedAt) {
    // Buyer confirmed receipt - step completed
    states.delivery = "completed";
  } else if (transaction.fulfillment.shippedConfirmedAt) {
    // Package shipped, waiting for buyer confirmation
    // Buyer confirms receipt (actor), Seller waits (observer)
    states.delivery = isSeller ? "active-observer" : "active-actor";
  } else {
    // Shipping not confirmed - delivery is locked
    states.delivery = "locked";
  }

  // ============================================================================
  // STEP 4: COMPLETE (FEEDBACK)
  // Completed when: completedAt is NOT NULL
  // Active when: buyer received AND completedAt is NULL
  // Locked when: buyer NOT received
  // ============================================================================
  if (transaction.completedAt) {
    // Transaction completed
    states.complete = "completed";
  } else if (transaction.fulfillment.buyerReceivedAt) {
    // Buyer received item, waiting for feedback/completion
    // Both can leave feedback (both are actors)
    states.complete = "active-actor";
  } else {
    // Buyer hasn't received - complete is locked
    states.complete = "locked";
  }

  return states;
};

/**
 * Render step header with status indicator
 */
const StepHeader = ({
  icon: Icon,
  label,
  state,
  description,
}: {
  icon: React.ElementType;
  label: string;
  state: StepState;
  description?: string;
}) => {
  const getStateIndicator = () => {
    switch (state) {
      case "completed":
        return (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        );
      case "active-actor":
        return (
          <div className="flex items-center gap-2 text-accent">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium">Action Required</span>
          </div>
        );
      case "active-observer":
        return (
          <div className="flex items-center gap-2 text-blue-500">
            <Clock className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-medium">Waiting...</span>
          </div>
        );
      case "locked":
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-muted-foreground opacity-50" />
            <span className="text-sm font-medium">Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            state === "completed"
              ? "bg-green-500/20 text-green-500"
              : state === "active-actor"
              ? "bg-accent/20 text-accent"
              : state === "active-observer"
              ? "bg-blue-500/20 text-blue-500"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{label}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {getStateIndicator()}
    </div>
  );
};

export default function TransactionRoomPage() {
  // Get transaction ID from URL
  const { id } = useParams<{ id: string }>();
  const transactionId = Number(id);

  // Fetch transaction data and current user
  const { transaction, isLoading, error } = useTransaction(transactionId);
  const { user } = useAuth();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // State for controlling which accordion items are expanded
  // Initialize with active steps expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Determine if current user is the seller (safe with optional chaining)
  const isSeller = user?.id === transaction?.seller.id;

  // Determine step states (only if transaction exists)
  const stepStates = transaction
    ? getStepStates(transaction, isSeller)
    : {
        payment: "locked" as StepState,
        shipping: "locked" as StepState,
        delivery: "locked" as StepState,
        complete: "locked" as StepState,
      };

  // Auto-expand active steps when transaction data changes
  React.useEffect(() => {
    if (!transaction) return;
    
    const active: string[] = [];
    if (stepStates.payment === "active-actor" || stepStates.payment === "active-observer") active.push("payment");
    if (stepStates.shipping === "active-actor" || stepStates.shipping === "active-observer") active.push("shipping");
    if (stepStates.delivery === "active-actor" || stepStates.delivery === "active-observer") active.push("delivery");
    if (stepStates.complete === "completed") active.push("complete");
    setExpandedItems(active);
  }, [transaction, stepStates.payment, stepStates.shipping, stepStates.delivery, stepStates.complete]);

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading transaction...</div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error || !transaction) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            {error || "Transaction not found"}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Map transaction messages to chat format
  const chatMessages = mapTransactionMessagesToChat(
    transaction.messages,
    transaction.buyer.id,
    transaction.seller.id,
    transaction.buyer.fullName,
    transaction.seller.fullName
  );

  // const handleSubmitAddress = () => {
  //   toast.success("Address Confirmed!", {
  //     description:
  //       "Your delivery address has been saved and shared with the seller.",
  //   });
  // };

  const handlePaymentProof = (file: File) => {
    console.log("Payment proof uploaded:", file.name);
    toast.success("Payment Proof Uploaded!", {
      description: "Your payment receipt has been submitted for verification.",
    });
  };

  const handleShippingProof = (file: File) => {
    console.log("Shipping proof uploaded:", file.name);
    toast.success("Shipping Proof Uploaded!", {
      description: "Your shipping confirmation has been submitted.",
    });
  };

  const handleCancelTransaction = () => {
    console.log("Transaction cancelled");
    toast.error("Transaction Cancelled", {
      description: "The transaction has been cancelled and buyer rating will be decreased.",
    });
  };

  const handleOpenFeedback = () => {
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = (feedback: FeedbackData) => {
    console.log("Feedback submitted:", feedback);
    toast.success("Feedback Submitted!", {
      description: `You gave a ${feedback.rating} rating with ${feedback.tags.length} tags.`,
    });
  };

  const handleConfirmReceipt = () => {
    toast.success("Receipt Confirmed!", {
      description:
        "Funds have been released to the seller. Transaction complete.",
    });
  };

  const handleReportIssue = () => {
    toast.info("Issue Reported", {
      description: "Our support team will contact you shortly.",
    });
  };

  const handleSendMessage = (message: string) => {
    console.log("Send message:", message);
    // In real app, send to API
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <button className="text-muted-foreground hover:text-amber transition-colors">
                My Purchases
              </button>
              <span className="text-muted-foreground">/</span>
              <button className="text-muted-foreground hover:text-amber transition-colors">
                Active Transactions
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">TXN-{transaction.id}</span>
            </div>

            {/* Only show Rate Transaction button if transaction is completed */}
            {transaction.completedAt && (
              <Button variant="outline" size="sm" onClick={handleOpenFeedback}>
                Rate Transaction
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Shared Header */}
          <TransactionRoomHeader
            statusBadge={getStatusBadge(transaction.status)}
            description={getDescription(transaction.status, isSeller)}
            transactionId={`TXN-${transaction.id}`}
            isSeller={isSeller}
            currentScreen={transaction.status}
            onCancelTransaction={handleCancelTransaction}
          />

          {/* Shared Product Summary */}
          <TransactionProductSummary
            product={{
              image: transaction.product.thumbnailUrl,
              title: transaction.product.name,
              endDate: "Auction Ended", // TODO: Need auction end date from backend
              category: "Product", // TODO: Need category from backend
              winningBid: transaction.finalPrice,
            }}
          />

          {/* Shared Transaction Stepper */}
          <TransactionStepper
            steps={getTransactionSteps(transaction.status)}
            progressPercentage={getProgressPercentage(transaction.status)}
          />

          {/* Vertical Stacked Accordion Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Transaction Stages (Accordion) */}
            <div className="lg:col-span-2 space-y-4">
              <Accordion
                type="multiple"
                value={expandedItems}
                onValueChange={setExpandedItems}
                className="space-y-4"
              >
                {/* Step 1: Payment */}
                <AccordionItem
                  value="payment"
                  className={`border rounded-lg ${
                    stepStates.payment === "active-actor"
                      ? "border-accent shadow-lg shadow-accent/20"
                      : stepStates.payment === "active-observer"
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : stepStates.payment === "completed"
                      ? "border-green-500/30"
                      : "border-border opacity-60"
                  }`}
                  disabled={stepStates.payment === "locked"}
                >
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <StepHeader
                      icon={CreditCard}
                      label="Payment"
                      state={stepStates.payment}
                      description={
                        stepStates.payment === "completed"
                          ? `Confirmed ${
                              transaction.payment.confirmedAt
                                ? formatTime(transaction.payment.confirmedAt)
                                : ""
                            }`
                          : undefined
                      }
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <TransactionRoom
                      mode={stepStates.payment}
                      transaction={transaction}
                      onPaymentProof={handlePaymentProof}
                      isSeller={isSeller}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Step 2: Shipping */}
                <AccordionItem
                  value="shipping"
                  className={`border rounded-lg ${
                    stepStates.shipping === "active-actor"
                      ? "border-accent shadow-lg shadow-accent/20"
                      : stepStates.shipping === "active-observer"
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : stepStates.shipping === "completed"
                      ? "border-green-500/30"
                      : "border-border opacity-60"
                  }`}
                  disabled={stepStates.shipping === "locked"}
                >
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <StepHeader
                      icon={Package}
                      label="Shipping"
                      state={stepStates.shipping}
                      description={
                        stepStates.shipping === "completed"
                          ? `Shipped ${
                              transaction.fulfillment.shippedConfirmedAt
                                ? formatTime(transaction.fulfillment.shippedConfirmedAt)
                                : ""
                            }`
                          : undefined
                      }
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <TransactionRoomShipping
                      mode={stepStates.shipping}
                      transaction={transaction}
                      isSeller={isSeller}
                      onShippingProof={handleShippingProof}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Step 3: Delivery */}
                <AccordionItem
                  value="delivery"
                  className={`border rounded-lg ${
                    stepStates.delivery === "active-actor"
                      ? "border-accent shadow-lg shadow-accent/20"
                      : stepStates.delivery === "active-observer"
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : stepStates.delivery === "completed"
                      ? "border-green-500/30"
                      : "border-border opacity-60"
                  }`}
                  disabled={stepStates.delivery === "locked"}
                >
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <StepHeader
                      icon={Truck}
                      label="Delivery"
                      state={stepStates.delivery}
                      description={
                        stepStates.delivery === "completed"
                          ? `Delivered ${
                              transaction.fulfillment.deliveredAt
                                ? formatTime(transaction.fulfillment.deliveredAt)
                                : ""
                            }`
                          : undefined
                      }
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <TransactionRoomDelivery
                      mode={stepStates.delivery}
                      transaction={transaction}
                      isSeller={isSeller}
                      onConfirmReceipt={handleConfirmReceipt}
                      onReportIssue={handleReportIssue}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Step 4: Complete */}
                <AccordionItem
                  value="complete"
                  className={`border rounded-lg ${
                    stepStates.complete === "completed"
                      ? "border-green-500/30"
                      : "border-border opacity-60"
                  }`}
                  disabled={stepStates.complete !== "completed"}
                >
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <StepHeader
                      icon={CheckCircle2}
                      label="Transaction Complete"
                      state={stepStates.complete}
                      description={
                        stepStates.complete === "completed"
                          ? `Completed ${
                              transaction.completedAt
                                ? formatTime(transaction.completedAt)
                                : ""
                            }`
                          : undefined
                      }
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <TransactionRoomComplete 
                      transaction={transaction}
                      isSeller={isSeller}
                      onOpenFeedback={handleOpenFeedback}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Shared Chat Box */}
            <div className="lg:col-span-1">
              <TransactionChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                footerText={getChatFooterText(transaction.status)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        onSubmit={handleSubmitFeedback}
        partnerType={isSeller ? "buyer" : "seller"}
        partnerName={isSeller ? transaction.buyer.fullName : transaction.seller.fullName}
        transactionId={`TXN-${transaction.id}`}
      />
    </MainLayout>
  );
}
