import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import InputOTP from "../../components/ui/input-otp";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState<"request_email" | "submit_otp">(
    "request_email"
  );
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (otpValue: string) => {
    setFormData({ ...formData, otp: otpValue });
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(formData.email);
      toast.success("An OTP has been sent to your email.");
      setStep("submit_otp");
    } catch (error: any) {
      setError(error.message || "An error occurred");
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword);
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP or failed to reset.");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      {step === "request_email" && (
        <form
          className="flex w-full flex-col gap-3"
          onSubmit={handleRequestOTP}
        >
          <p className="text-sm text-center text-[var(--text-muted)]">
            Enter your email to receive a 6-digit code.
          </p>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {error && (
            <p className="animate-shake text-center text-[13px] text-destructive">
              {error}
            </p>
          )}
          <div className="mt-3 flex w-full gap-2.5">
            <Button
              type="submit"
              variant="default"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Reset OTP"}
            </Button>
          </div>
        </form>
      )}
      {step === "submit_otp" && (
        <form
          className="flex w-full flex-col gap-3"
          onSubmit={handleSubmitNewPassword}
        >
          <p className="text-sm text-center text-[var(--text-muted)]">
            An OTP was sent to <strong>{formData.email}</strong>.
          </p>

          <div className="flex flex-col items-center mt-2">
            <p className="text-sm font-semibold mb-3 text-[var(--text-main)]">
              Enter 6-Digit OTP
            </p>
            <InputOTP
              length={6}
              value={formData.otp}
              onChange={handleOtpChange}
              disabled={isLoading}
            />
          </div>

          <div className="mt-2">
            <p className="text-sm font-semibold mb-2 text-[var(--text-main)]">
              Enter New Password
            </p>
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password (min 8 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          {error && (
            <p className="animate-shake text-center text-[13px] text-destructive">
              {error}
            </p>
          )}
          <div className="mt-3 flex w-full gap-2.5">
            <Button
              type="submit"
              variant="default"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      )}
      <Button
        variant="secondary"
        size="lg"
        onClick={() => {
          if (step === "submit_otp") setStep("request_email");
          else navigate("/login");
        }}
        disabled={isLoading}
        className="w-full mt-2.5 font-semibold"
      >
        Back to Login
      </Button>
    </AuthLayout>
  );
}
