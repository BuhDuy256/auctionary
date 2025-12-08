import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Breadcrumb } from "../../components/common/Breadcrumb";

type Step = "step1" | "step2";

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("step1");
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const handleStep1Complete = (data: Step1Data) => {
    console.log("handleStep1Complete called with:", data);
    setStep1Data(data);
    setCurrentStep("step2");
    console.log("State updated to step2");
  };

  const handleStep2Back = () => {
    setCurrentStep("step1");
  };

  const handleStep1Back = () => {
    navigate("/seller/dashboard");
  };

  const handleAuctionSubmit = (data: AuctionData) => {
    console.log("Auction Data:", data);

    // TODO: Call API to create auction
    // await productService.createAuction(data);

    // Show success toast
    toast.success("Auction Published!", {
      description: "Your auction is now live and accepting bids.",
    });

    // Reset and go back to dashboard
    setStep1Data(null);
    setCurrentStep("step1");
    navigate("/seller/dashboard");
  };

  return (
    <MainLayout>
      <Breadcrumb />
      <main className="container mx-auto px-4 py-8">
        {currentStep === "step1" && (
          <PostAuctionStep1
            onNext={handleStep1Complete}
            onBack={handleStep1Back}
          />
        )}

        {currentStep === "step2" && step1Data && (
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
