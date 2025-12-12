import { useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { AdminOverview } from "./components/AdminOverview";
import { CategoryManagement } from "./components/CategoryManagement";
import { UserManagement } from "./components/UserManagement";
import { ProductManagement } from "./components/ProductManagement";

type AdminPage = "overview" | "categories" | "users" | "products";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AdminPage>("overview");

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "overview" && <AdminOverview />}
      {currentPage === "categories" && <CategoryManagement />}
      {currentPage === "users" && <UserManagement />}
      {currentPage === "products" && <ProductManagement />}
    </AdminLayout>
  );
}
