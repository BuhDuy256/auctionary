import { useState } from "react";
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

type Screen =
  | "transaction-room-payment"
  | "transaction-room-shipping"
  | "transaction-room-delivery"
  | "transaction-room-complete";

// Shared transaction data
const transactionData = {
  id: "TXN-89234",
  product: {
    image:
      "https://images.unsplash.com/photo-1755136979154-c491ac08dc37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYW1lcmElMjBkZXRhaWx8ZW58MXx8fHwxNzY0MTc1NTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Vintage Leica M6 Camera with 50mm Lens",
    category: "Cameras",
    endDate: "Nov 25, 2025",
    winningBid: 1400,
  },
};

// Base chat messages (common to all screens)
const baseChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "seller",
    name: "John Smith",
    message:
      "Congratulations on winning the auction! I'll ship it out as soon as payment clears.",
    timestamp: "10:23 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
  },
  {
    id: 2,
    sender: "buyer",
    name: "You",
    message: "Thanks! How long does shipping usually take?",
    timestamp: "10:25 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Buyer",
  },
  {
    id: 3,
    sender: "seller",
    name: "John Smith",
    message:
      "Usually 2-3 business days. I'll pack it very carefully with the original case.",
    timestamp: "10:27 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
  },
  {
    id: 4,
    sender: "system",
    message:
      "Buyer has submitted payment proof. Waiting for seller verification.",
    timestamp: "10:30 AM",
  },
];

// Helper functions for screen-specific data
const getStatusBadge = (screen: Screen) => {
  switch (screen) {
    case "transaction-room-payment":
      return {
        icon: Clock,
        text: "In Progress",
        className: "bg-accent/20 text-accent border-accent/50",
      };
    case "transaction-room-shipping":
      return {
        icon: Clock,
        text: "In Progress",
        className: "bg-accent/20 text-accent border-accent/50",
      };
    case "transaction-room-delivery":
      return {
        icon: Clock,
        text: "Action Required",
        className: "bg-accent/20 text-accent border-accent/50",
      };
    case "transaction-room-complete":
      return {
        icon: CheckCircle2,
        text: "Completed",
        className: "bg-green-500/20 text-green-500 border-green-500/50",
      };
  }
};

const getDescription = (screen: Screen) => {
  switch (screen) {
    case "transaction-room-payment":
      return "Complete your purchase and communicate with the seller";
    case "transaction-room-shipping":
      return "Track your shipment and communicate with the seller";
    case "transaction-room-delivery":
      return "Package has been delivered - please confirm receipt to release funds";
    case "transaction-room-complete":
      return "Transaction successfully completed. Funds have been released to the seller.";
  }
};

const getTransactionSteps = (screen: Screen): TransactionStep[] => {
  const baseSteps: TransactionStep[] = [
    {
      id: 1,
      label: "Payment",
      icon: CreditCard,
      status: "completed",
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

  // Update statuses based on current screen
  if (screen === "transaction-room-payment") {
    baseSteps[0].status = "pending";
  } else if (screen === "transaction-room-shipping") {
    baseSteps[0].status = "completed";
    baseSteps[1].status = "pending";
  } else if (screen === "transaction-room-delivery") {
    baseSteps[0].status = "completed";
    baseSteps[1].status = "completed";
    baseSteps[2].status = "pending";
  } else if (screen === "transaction-room-complete") {
    baseSteps[0].status = "completed";
    baseSteps[1].status = "completed";
    baseSteps[2].status = "completed";
    baseSteps[3].status = "completed";
  }

  return baseSteps;
};

const getProgressPercentage = (screen: Screen) => {
  switch (screen) {
    case "transaction-room-payment":
      return 0;
    case "transaction-room-shipping":
      return 25;
    case "transaction-room-delivery":
      return 50;
    case "transaction-room-complete":
      return 100;
  }
};

const getChatMessages = (screen: Screen): ChatMessage[] => {
  const messages = [...baseChatMessages];

  if (screen === "transaction-room-shipping") {
    messages.push(
      {
        id: 5,
        sender: "system",
        message: "Payment confirmed! Seller is preparing to ship the package.",
        timestamp: "11:45 AM",
      },
      {
        id: 6,
        sender: "seller",
        name: "John Smith",
        message:
          "I've confirmed the payment. Will ship it out today!",
        timestamp: "11:47 AM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
      }
    );
  } else if (screen === "transaction-room-delivery") {
    messages.push(
      {
        id: 5,
        sender: "system",
        message: "Package has been delivered to 123 Main Street, Apt 4B.",
        timestamp: "2:15 PM",
      },
      {
        id: 6,
        sender: "seller",
        name: "John Smith",
        message:
          "The tracking shows it was delivered! Let me know once you receive it.",
        timestamp: "2:18 PM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
      }
    );
  } else if (screen === "transaction-room-complete") {
    messages.push(
      {
        id: 5,
        sender: "system",
        message:
          "Package has been delivered. Please confirm receipt to release funds.",
        timestamp: "2:15 PM",
      },
      {
        id: 6,
        sender: "buyer",
        name: "You",
        message: "Received it! Everything looks perfect, thanks!",
        timestamp: "2:18 PM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Buyer",
      },
      {
        id: 7,
        sender: "system",
        message:
          "Transaction completed. Thank you for using our platform!",
        timestamp: "2:20 PM",
      },
      {
        id: 8,
        sender: "seller",
        name: "John Smith",
        message:
          "Enjoy your new camera! Feel free to reach out if you have any questions.",
        timestamp: "2:25 PM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
      }
    );
  }

  return messages;
};

const getChatFooterText = (screen: Screen) => {
  switch (screen) {
    case "transaction-room-payment":
      return "All messages are monitored for security";
    case "transaction-room-shipping":
      return "All messages are monitored for security";
    case "transaction-room-delivery":
      return "Contact the seller if you have concerns";
    case "transaction-room-complete":
      return "Chat remains available for post-transaction support";
  }
};

export default function TransactionRoomPage() {
  // const [currentScreen] = useState<Screen>("transaction-room-payment");
  // const [currentScreen] = useState<Screen>("transaction-room-shipping");
  // const [currentScreen] = useState<Screen>("transaction-room-delivery");
  const [currentScreen] = useState<Screen>("transaction-room-complete");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  
  // Mock state to control UI - change this to test different views
  const [isSeller] = useState(true); // true = Seller view, false = Buyer view

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
              <span className="text-foreground">{transactionData.id}</span>
            </div>

            <Button variant="outline" size="sm" onClick={handleOpenFeedback}>
              Rate Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Shared Header */}
          <TransactionRoomHeader
            statusBadge={getStatusBadge(currentScreen)}
            description={getDescription(currentScreen)}
            transactionId={transactionData.id}
            isSeller={isSeller}
            currentScreen={currentScreen}
            onCancelTransaction={handleCancelTransaction}
          />

          {/* Shared Product Summary */}
          <TransactionProductSummary product={transactionData.product} />

          {/* Shared Transaction Stepper */}
          <TransactionStepper
            steps={getTransactionSteps(currentScreen)}
            progressPercentage={getProgressPercentage(currentScreen)}
          />

          {/* Main Grid: Stage-specific content + Chat */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stage-specific content */}
            {currentScreen === "transaction-room-payment" && (
              <TransactionRoom onPaymentProof={handlePaymentProof} />
            )}
            {currentScreen === "transaction-room-shipping" && (
              <TransactionRoomShipping 
                isSeller={isSeller}
                onShippingProof={handleShippingProof}
              />
            )}
            {currentScreen === "transaction-room-delivery" && (
              <TransactionRoomDelivery
                isSeller={isSeller}
                onConfirmReceipt={handleConfirmReceipt}
                onReportIssue={handleReportIssue}
              />
            )}
            {currentScreen === "transaction-room-complete" && (
              <TransactionRoomComplete isSeller={isSeller} />
            )}

            {/* Shared Chat Box */}
            <div className="lg:col-span-1">
              <TransactionChat
                messages={getChatMessages(currentScreen)}
                onSendMessage={handleSendMessage}
                footerText={getChatFooterText(currentScreen)}
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
        partnerType="seller"
        partnerName="John Smith"
        transactionId={transactionData.id}
      />
    </MainLayout>
  );
}
