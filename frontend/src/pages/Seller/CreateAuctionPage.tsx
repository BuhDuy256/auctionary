import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostAuctionStep1 } from "./components/PostAuctionStep1";
import { PostAuctionStep2 } from "./components/PostAuctionStep2";
import { notify } from "../../utils/notify";
import MainLayout from "../../layouts/MainLayout";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { useProductUpload } from "../../hooks/useProductUpload";
import type {
  Step1Data,
  Step2Data,
  CreateProductPayload,
} from "../../types/product";
import { useAuth } from "../../hooks/useAuth";

type Step = "step1" | "step2";

export default function CreateAuctionPage() {
  const { user } = useAuth();
  const userId = Number(user?.id);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("step1");
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const { createAuction, isCreating } = useProductUpload();

  const handleStep1Complete = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep("step2");
  };

  const handleStep1Back = () => {
    navigate("/seller/dashboard");
  };

  const handleStep2Back = () => {
    setCurrentStep("step1");
  };

  const handleAuctionSubmit = async (step2Data: Step2Data) => {
    if (isCreating || !step1Data) return;

    try {
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + step2Data.duration);

      const catIdString = step1Data.subCategoryId || step1Data.categoryId;
      const finalCategoryId = catIdString ? parseInt(catIdString) : 0;
      console.log(step1Data);

      const payload: CreateProductPayload = {
        name: step1Data.productName,
        categoryId: finalCategoryId,
        images: step1Data.images,
        startPrice: step2Data.startingPrice,
        stepPrice: step2Data.bidIncrement,
        buyNowPrice: step2Data.buyNowPrice,
        description: step2Data.description,
        autoExtend: step2Data.autoExtend,
        sellerId: userId,
        endTime: endTime,
      };

      const result = await createAuction(payload);

      notify.success("Auction Published!");

      if (result && result.id) {
        navigate(`/products/${result.id}`);
      } else {
        navigate("/seller/dashboard");
      }
    } catch (error) {
      notify.error("Failed to publish auction");
    }
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
