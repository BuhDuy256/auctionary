import React, { useEffect } from "react";
import { BookA } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { notify } from "../utils/notify";

interface AuthLayoutProps {
  title: string;

  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigateToHome = () => {
    navigate("/", { replace: true });

    if (isAuthenticated) {
      logout().catch((err: any) => {
        notify.error(err.message || "Logout failed");
      });
    }
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center relative box-border mt-0">
      <main className="flex items-center justify-center w-full">
        <div className="w-[420px] flex flex-col items-center text-center m-5 bg-[var(--bg-secondary)] p-8 md:px-10 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <BookA
            className="h-12 w-12 text-accent mb-4 animate-[scale-up] cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={handleNavigateToHome}
            aria-label="Go to home page"
            style={{
              animation: "zoomBounce 0.6s ease-out",
            }}
          />

          <h1 className="text-xl font-semibold mt-0 mb-6 animate-fade-in">
            {title}
          </h1>

          {/* Form content (Login or Signup) will be injected here */}

          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
