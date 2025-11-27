import "./UIKitPage.css";
import MainLayout from "../../layouts/MainLayout";
import { Lock } from "lucide-react";

export default function UIKitPage() {
  return (
    <MainLayout>
      <main className="ui-kit-page-container">
        {/* Hero Section */}
        <div className="hero-section">
          {/* Badge Area */}
          <div className="hero-badge">
            <Lock className="hero-icon" />
            <span className="hero-badge-text">
              Secure • Anonymous • Tactical
            </span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">Black Market Design System</h1>

          {/* Description */}
          <p className="hero-description">
            A high-fidelity UI kit featuring tactical amber accents on
            industrial dark surfaces. Built for secure, secretive, and modern
            web applications.
          </p>
        </div>
      </main>
    </MainLayout>
  );
}
