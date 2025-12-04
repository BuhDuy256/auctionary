import { useState } from "react";
import { Button } from "../../components/ui/button";
import { TransactionRoom } from "./components/TransactionRoom";
import {
  FeedbackModal,
  type FeedbackData,
} from "../../components/auction/FeedbackModal";
import { toast } from "sonner";
import MainLayout from "../../layouts/MainLayout";

type Screen = "transaction-room";

export default function TransactionRoomPage() {
  const [currentScreen] = useState<Screen>("transaction-room");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleSubmitAddress = () => {
    toast.success("Address Confirmed!", {
      description:
        "Your delivery address has been saved and shared with the seller.",
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

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <button className="text-muted-foreground hover:text-accent transition-colors">
                My Purchases
              </button>
              <span className="text-muted-foreground">/</span>
              <button className="text-muted-foreground hover:text-accent transition-colors">
                Active Transactions
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">TXN-89234</span>
            </div>

            <Button variant="outline" size="sm" onClick={handleOpenFeedback}>
              Rate Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentScreen === "transaction-room" && (
          <TransactionRoom
            onSubmitAddress={handleSubmitAddress}
            onOpenFeedback={handleOpenFeedback}
          />
        )}
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        onSubmit={handleSubmitFeedback}
        partnerType="seller"
        partnerName="John Smith"
        transactionId="TXN-89234"
      />
    </MainLayout>
  );
}
