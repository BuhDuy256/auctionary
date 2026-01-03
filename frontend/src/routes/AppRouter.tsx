import { Routes, Route } from "react-router-dom";

// 1. Import guards
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

// 2. Import roles
import { ROLES } from "../constants/roles";

// 3. Import pages
import UnderDevelopmentPage from "../pages/Error/UnderDevelopmentPage";
import UnauthorizedPage from "../pages/Error/Forbidden";
import NotFoundPage from "../pages/Error/NotFoundPage";
import SignupPage from "../pages/Auth/SignupPage";
import LoginPage from "../pages/Auth/LoginPage";
import VerifyOTPPage from "../pages/Auth/VerifyOTPPage";
import HomePage from "../pages/Home/HomePage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import UIKitPage from "../pages/Dev/UIKitPage";
import ProductListPage from "../pages/Product/ProductListPage";
import ProductDetailPage from "../pages/Product/ProductDetailPage";
import UserProfilePage from "../pages/Account/UserProfilePage";
import SellerDashboardPage from "../pages/Seller/SellerDashboardPage";
import CreateAuctionPage from "../pages/Seller/CreateAuctionPage";
import TransactionRoomPage from "../pages/Product/TransactionRoomPage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import MemberIntroductionPage from "../pages/Infomation/MemberIntroductionPage";
import BidderProtectionPage from "../pages/Infomation/BidderProtectionPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* ============================================== */}
      {/* PUBLIC ROUTES (Accessible to everyone) */}
      {/* ============================================== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/under-development" element={<UnderDevelopmentPage />} />

      {/* Information Routes */}
      <Route path="/info/members" element={<MemberIntroductionPage />} />
      <Route
        path="/info/bidder-protection"
        element={<BidderProtectionPage />}
      />

      {/* Dev Routes */}
      <Route path="/dev/ui-kit" element={<UIKitPage />} />

      {/* ============================================== */}
      {/* PUBLIC ONLY ROUTES (Guest users only) */}
      {/* ============================================== */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* ============================================== */}
      {/* PROTECTED ROUTES - All Authenticated Users */}
      {/* ============================================== */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.BIDDER, ROLES.SELLER, ROLES.ADMIN]}
          />
        }
      >
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
      </Route>

      {/* ============================================== */}
      {/* PROTECTED ROUTES - Seller & Admin */}
      {/* ============================================== */}
      <Route
        element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN]} />}
      >
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller/auction/create" element={<CreateAuctionPage />} />
        <Route path="/transactions/:id" element={<TransactionRoomPage />} />
      </Route>

      {/* ============================================== */}
      {/* PROTECTED ROUTES - Admin Only */}
      {/* ============================================== */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* ============================================== */}
      {/* CATCH ALL - 404 */}
      {/* ============================================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
