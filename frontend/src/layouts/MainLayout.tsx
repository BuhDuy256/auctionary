import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { VerifyOTPModal } from "../components/VerifyOTPModal";
import { useAuth } from "../hooks/useAuth";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Show modal if user is authenticated but not verified
  const showVerifyModal = isAuthenticated && user && !user.isVerified;

  return (
    <div className="main-layout">
      <Header />

      <main className="main-content">{children}</main>

      <Footer />

      {/* Mandatory OTP Verification Modal */}
      <VerifyOTPModal open={!!showVerifyModal} />
    </div>
  );
};

export default MainLayout;
