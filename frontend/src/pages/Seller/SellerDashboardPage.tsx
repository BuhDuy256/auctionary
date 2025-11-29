import { useState } from "react";
import { SellerDashboard } from "../../components/auction/SellerDashboard";
import {
  PostAuctionStep1,
  type Step1Data,
} from "../../components/auction/PostAuctionStep1";
import {
  PostAuctionStep2,
  type AuctionData,
} from "../../components/auction/PostAuctionStep2";
import { toast } from "sonner";
import MainLayout from "../../layouts/MainLayout";

type Screen = "seller-dashboard" | "post-auction-step1" | "post-auction-step2";

export default function SellerDashboardPage() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("seller-dashboard");
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const handleCreateAuction = () => {
    setCurrentScreen("post-auction-step1");
  };

  const handleStep1Complete = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentScreen("post-auction-step2");
  };

  const handleStep2Back = () => {
    setCurrentScreen("post-auction-step1");
  };

  const handleStep1Back = () => {
    setCurrentScreen("seller-dashboard");
  };

  const handleAuctionSubmit = (data: AuctionData) => {
    console.log("Auction Data:", data);

    // Show success toast
    toast.success("Auction Published!", {
      description: "Your auction is now live and accepting bids.",
    });

    // Reset and go back to dashboard
    setStep1Data(null);
    setCurrentScreen("seller-dashboard");
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      {currentScreen !== "seller-dashboard" && (
        <div className="border-b border-border bg-card/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setCurrentScreen("seller-dashboard")}
                className="text-muted-foreground hover:text-amber transition-colors"
              >
                Dashboard
              </button>
              <span className="text-muted-foreground">/</span>
              {currentScreen === "post-auction-step1" && (
                <span className="text-foreground">Create Auction - Step 1</span>
              )}
              {currentScreen === "post-auction-step2" && (
                <>
                  <button
                    onClick={() => setCurrentScreen("post-auction-step1")}
                    className="text-muted-foreground hover:text-amber transition-colors"
                  >
                    Create Auction - Step 1
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground">Step 2</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentScreen === "seller-dashboard" && (
          <SellerDashboard onCreateAuction={handleCreateAuction} />
        )}

        {currentScreen === "post-auction-step1" && (
          <PostAuctionStep1
            onNext={handleStep1Complete}
            onBack={handleStep1Back}
          />
        )}

        {currentScreen === "post-auction-step2" && step1Data && (
          <PostAuctionStep2
            step1Data={step1Data}
            onBack={handleStep2Back}
            onSubmit={handleAuctionSubmit}
          />
        )}
      </main>
    </MainLayout>
  );
}
