import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import InputOTP from "../../components/ui/input-otp";
import { Button } from "../../components/ui/button";
import { notify } from "../../utils/notify";
import { useAuth } from "../../hooks/useAuth";

const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, verifyAccount, resendVerificationEmail, logout } = useAuth();

  // Form state
  const [otp, setOtp] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Resend OTP state
  const [isResending, setIsResending] = useState<boolean>(false);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Redirect if no user data available
  useEffect(() => {
    if (!user) {
      notify.error("Unable to verify account. Please try logging in again.");
      navigate("/login");
    }
  }, [user, navigate]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [cooldownSeconds]);

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    if (!user) {
      setError("Unable to verify account. Please try logging in again.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verifyAccount(otp);

      notify.success("Account verified successfully!");

      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      const errorMessage =
        err.message || "Invalid or expired OTP. Please try again.";
      setError(errorMessage);
      notify.error(errorMessage);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPComplete = (value: string) => {
    setOtp(value);
  };

  const handleResendOTP = async () => {
    if (!canResend || isResending || !user) return;

    setIsResending(true);
    setError("");

    try {
      await resendVerificationEmail();

      notify.success("A new verification code has been sent to your email!");

      setCooldownSeconds(60);
      setCanResend(false);
      setOtp("");
    } catch (err: any) {
      console.error("Resend OTP failed:", err);
      const errorMessage =
        err.message || "Failed to resend code. Please try again.";
      notify.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AuthLayout title="Verify Your Account">
      <div className="w-full max-w-[400px] mx-auto px-4 sm:px-0">
        {/* Info Message */}
        <div className="text-center mb-8">
          <p className="text-sm text-[var(--text-main)] leading-relaxed mb-2">
            We've sent a 6-digit verification code to{" "}
            <strong className="font-semibold text-[var(--text-main)]">
              {user?.email}
            </strong>
          </p>
          <p className="text-[13px] text-[var(--text-muted)]">
            Please check your inbox and enter the code below.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="flex flex-col items-center">
          <InputOTP
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleOTPComplete}
            disabled={isVerifying}
          />

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[rgba(239,68,68,0.1)] border border-[var(--status-error)] rounded-md text-[var(--status-error)] text-[13px] my-4 w-full box-border">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Verify Button */}
          <Button
            type="submit"
            variant="default"
            isLoading={isVerifying}
            disabled={otp.length !== 6 || isVerifying}
            className="mt-6 gap-2 w-full"
          >
            {isVerifying ? "Verifying..." : "Verify Account"}
          </Button>
        </form>

        {/* Resend OTP Section */}
        <div className="text-center mt-8 pt-6 border-t border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Didn't receive the code?
          </p>

          {canResend ? (
            <Button
              onClick={handleResendOTP}
              isLoading={isResending}
              disabled={isResending}
              variant="ghost"
              className="text-[var(--accent-color)] font-semibold text-sm cursor-pointer p-2 rounded hover:bg-[rgba(255,153,0,0.1)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Resend code in{" "}
              <span className="font-semibold text-[var(--text-main)]">
                {cooldownSeconds}s
              </span>
            </p>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={handleBackToLogin}
            className="bg-transparent border-none text-[var(--text-muted)] text-sm cursor-pointer p-2 hover:text-[var(--text-main)] transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTPPage;
