import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

interface StatusPageLayoutProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

export default function StatusPageLayout({
  icon,
  title,
  message,
}: StatusPageLayoutProps) {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] text-center font-display text-[var(--text-main)] p-5">
      <div className="text-[4.5rem] mb-6 animate-bounce">{icon}</div>
      <h1 className="text-4xl font-semibold text-[var(--text-main)] mb-3">
        {title}
      </h1>
      <p className="text-lg text-[var(--text-muted)] max-w-[400px] leading-relaxed">
        {message}
      </p>
      <Button
        onClick={handleGoBack}
        variant="outline"
        size="lg"
        className="mt-4 w-40"
      >
        Go Back
      </Button>
    </div>
  );
}
