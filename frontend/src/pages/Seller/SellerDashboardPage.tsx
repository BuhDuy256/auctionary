import { useNavigate } from "react-router-dom";
import { SellerDashboard } from "../../components/auction/SellerDashboard";
import MainLayout from "../../layouts/MainLayout";

export default function SellerDashboardPage() {
  const navigate = useNavigate();

  const handleCreateAuction = () => {
    navigate("/seller/auction/create");
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        <SellerDashboard onCreateAuction={handleCreateAuction} />
      </main>
    </MainLayout>
  );
}
