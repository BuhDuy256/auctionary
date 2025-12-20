import { useState } from "react";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { TransactionRoom } from "./components/TransactionRoomPayment";
import { TransactionRoomShipping } from "./components/TransactionRoomShipping";
import { TransactionRoomDelivery } from "./components/TransactionRoomDelivery";
import { TransactionRoomComplete } from "./components/TransactionRoomComplete";
import { FeedbackModal } from "./components/FeedbackModal";
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
import { useTransactionActions } from "../../hooks/useTransactionActions";
import { useAuth } from "../../hooks/useAuth";
import { formatTime } from "../../utils/dateUtils";
import type { TransactionDetailResponse, TransactionStatus } from "../../types/transaction";
import type { PaymentSubmitData, ShippingSubmitData } from "../../types/transactionActions";
import { notify } from "../../utils/notify";

type StepState = "completed" | "active-actor" | "active-observer" | "locked";

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

const mapTransactionMessagesToChat = (
  messages: TransactionDetailResponse["messages"],
  buyerId: number,
  sellerId: number,
  buyerName: string,
  sellerName: string
): ChatMessage[] => {
  return messages.map((msg) => {
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

  // Payment step: completed when buyer uploads proof
  if (transaction.payment.uploadedAt) {
    states.payment = "completed";
  } else {
    states.payment = isSeller ? "active-observer" : "active-actor";
  }

  // Shipping step: starts when payment proof uploaded
  if (transaction.fulfillment.shippedConfirmedAt) {
    states.shipping = "completed";
  } else if (transaction.payment.uploadedAt) {
    states.shipping = isSeller ? "active-actor" : "active-observer";
  } else {
    states.shipping = "locked";
  }

  if (transaction.fulfillment.buyerReceivedAt) {
    states.delivery = "completed";
  } else if (transaction.fulfillment.shippedConfirmedAt) {
    states.delivery = isSeller ? "active-observer" : "active-actor";
  } else {
    states.delivery = "locked";
  }

  if (transaction.completedAt) {
    states.complete = "completed";
  } else if (transaction.fulfillment.buyerReceivedAt) {
    // After buyer confirms delivery, show rating step for BOTH users
    states.complete = "active-actor";
  } else {
    states.complete = "locked";
  }

  return states;
};

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
  const { id } = useParams<{ id: string }>();
  const transactionId = Number(id);

  const { transaction, isLoading, error, refetch } = useTransaction(transactionId);
  const { 
    handleSubmitPayment, 
    handleConfirmAndShip,
    handleConfirmDelivery,
    handleSubmitReview,
    isUpdating 
  } = useTransactionActions();
  const { user } = useAuth();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isSeller = user?.id === transaction?.seller.id;

  const stepStates = transaction
    ? getStepStates(transaction, isSeller)
    : {
        payment: "locked" as StepState,
        shipping: "locked" as StepState,
        delivery: "locked" as StepState,
        complete: "locked" as StepState,
      };

  React.useEffect(() => {
    if (!transaction) return;
    
    const active: string[] = [];
    if (stepStates.payment === "active-actor" || stepStates.payment === "active-observer") active.push("payment");
    if (stepStates.shipping === "active-actor" || stepStates.shipping === "active-observer") active.push("shipping");
    if (stepStates.delivery === "active-actor" || stepStates.delivery === "active-observer") active.push("delivery");
    
    // Auto-expand complete step when status is completed OR when buyerReceivedAt exists
    if (transaction.status === "completed" || transaction.fulfillment.buyerReceivedAt) {
      active.push("complete");
    }
    
    setExpandedItems(active);
  }, [transaction?.status, transaction?.fulfillment?.buyerReceivedAt, isSeller]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading transaction...</div>
        </div>
      </MainLayout>
    );
  }

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

  const chatMessages = mapTransactionMessagesToChat(
    transaction.messages,
    transaction.buyer.id,
    transaction.seller.id,
    transaction.buyer.fullName,
    transaction.seller.fullName
  );

  const handlePaymentProof = async (
    file: File,
    shippingInfo: PaymentSubmitData["shippingInfo"]
  ) => {
    if (isUpdating || !transaction) return;

    try {
      const data: PaymentSubmitData = {
        paymentProof: file,
        shippingInfo,
      };

      await handleSubmitPayment(transaction.id, data);
      
      // Refetch transaction to get updated data
      await refetch();
      
      notify.success("Payment proof submitted successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit payment proof";
      notify.error(message);
    }
  };

  const handleShippingProof = async (file: File, paymentConfirmed: boolean) => {
    if (isUpdating || !transaction) return;

    try {
      const data: ShippingSubmitData = {
        shippingProof: file,
        paymentConfirmed,
      };

      await handleConfirmAndShip(transaction.id, data);
      
      // Refetch transaction to get updated data
      await refetch();
      
      notify.success("Shipping proof submitted successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit shipping proof";
      notify.error(message);
    }
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

  const handleSubmitFeedback = async (rating: "positive" | "negative", review: string) => {
    if (!transaction) return;

    try {
      // Convert rating string to number: positive = 1, negative = -1
      const ratingValue = rating === "positive" ? 1 : -1;
      
      await handleSubmitReview(transaction.id, {
        rating: ratingValue,
        comment: review,
      });
      
      await refetch();
      
      toast.success("Feedback Submitted!", {
        description: `You gave a ${rating} rating.`,
      });
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to submit feedback"
      );
      throw error;
    }
  };

  const handleConfirmReceipt = async () => {
    if (!transaction) return;

    try {
      await handleConfirmDelivery(transaction.id, {
        received: true,
      });

      await refetch();

      toast.success("Receipt Confirmed!", {
        description:
          "Funds have been released to the seller. Transaction complete.",
      });
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Failed to confirm delivery"
      );
    }
  };

  const handleReportIssue = () => {
    toast.info("Issue Reported", {
      description: "Our support team will contact you shortly.",
    });
  };

  const handleSendMessage = (message: string) => {
    console.log("Send message:", message);
  };

  return (
    <MainLayout>
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

            {transaction.completedAt && (
              <Button variant="outline" size="sm" onClick={handleOpenFeedback}>
                Rate Transaction
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <TransactionRoomHeader
            statusBadge={getStatusBadge(transaction.status)}
            description={getDescription(transaction.status, isSeller)}
            transactionId={`TXN-${transaction.id}`}
            isSeller={isSeller}
            currentScreen={transaction.status}
            onCancelTransaction={handleCancelTransaction}
          />

          <TransactionProductSummary
            product={{
              image: transaction.product.thumbnailUrl,
              title: transaction.product.name,
              endDate: "Auction Ended",
              category: "Product",
              winningBid: transaction.finalPrice,
            }}
          />

          <TransactionStepper
            steps={getTransactionSteps(transaction.status)}
            progressPercentage={getProgressPercentage(transaction.status)}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Accordion
                type="multiple"
                value={expandedItems}
                onValueChange={setExpandedItems}
                className="space-y-4"
              >
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
                      isLoading={isUpdating}
                    />
                  </AccordionContent>
                </AccordionItem>

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
                      isLoading={isUpdating}
                    />
                  </AccordionContent>
                </AccordionItem>

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

                <AccordionItem
                  value="complete"
                  className={`border rounded-lg ${
                    stepStates.complete === "completed"
                      ? "border-green-500/30"
                      : stepStates.complete === "active-actor"
                      ? "border-accent shadow-lg shadow-accent/20"
                      : "border-border opacity-60"
                  }`}
                  disabled={stepStates.complete === "locked"}
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
                      onSubmitFeedback={handleSubmitFeedback}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

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

      <FeedbackModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        onSubmit={(feedback: { rating: "positive" | "negative" | null; review: string }) => {
          if (feedback.rating) {
            handleSubmitFeedback(feedback.rating, feedback.review);
          }
        }}
        partnerType={isSeller ? "buyer" : "seller"}
        partnerName={isSeller ? transaction.buyer.fullName : transaction.seller.fullName}
        transactionId={`TXN-${transaction.id}`}
      />
    </MainLayout>
  );
}
