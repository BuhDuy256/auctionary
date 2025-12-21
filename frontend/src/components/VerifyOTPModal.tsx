import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { notify } from "../utils/notify";
import { validateOTP } from "../utils/validate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import InputOTP from "./ui/input-otp";
import { AlertTriangle } from "lucide-react";

interface VerifyOTPModalProps {
  open: boolean;
}

export function VerifyOTPModal({ open }: VerifyOTPModalProps) {
  const { user, verifyAccount, resendVerificationEmail, logout } = useAuth();

  const [otp, setOtp] = useState<string>("");
  const [disableVerify, setDisableVerify] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

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

  // Validate OTP to enable/disable verify button
  useEffect(() => {
    const error = validateOTP(otp);
    setDisableVerify(!!error);
  }, [otp]);

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      notify.error("Unable to verify account. Please try logging in again.");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyAccount(otp);
      notify.success("Account verified successfully!");
      // Modal will close automatically as user.isVerified becomes true
    } catch (err: any) {
      const errorMessage =
        err.message || "Invalid or expired OTP. Please try again.";
      notify.error(errorMessage);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || isResending || !user) return;

    setIsResending(true);

    try {
      await resendVerificationEmail();
      notify.success("A new verification code has been sent to your email!");
      setCooldownSeconds(60);
      setCanResend(false);
      setOtp("");
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to resend code. Please try again.";
      notify.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Dialog open={open} modal>
      <DialogContent
        className="sm:max-w-[420px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showClose={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Verify Your Account
          </DialogTitle>
          <DialogDescription className="text-center">
            Please verify your email to continue using Auctionary
          </DialogDescription>
        </DialogHeader>

        <Alert
          variant="destructive"
          className="border-destructive bg-destructive/10"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your account is not verified. You must verify your email address to
            access the platform.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm font-semibold">{user?.email}</p>
            <p className="text-xs text-muted-foreground">
              Please check your inbox and enter the code below.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={isVerifying}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={disableVerify || isVerifying}
              isLoading={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify Account"}
            </Button>
          </form>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Didn't receive the code?
                </span>
              </div>
            </div>

            {canResend ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOTP}
                disabled={isResending}
                className="w-full"
                isLoading={isResending}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            ) : (
              <p className="text-sm text-center text-muted-foreground">
                Resend code in{" "}
                <span className="font-semibold text-foreground">
                  {cooldownSeconds}s
                </span>
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Logging out will require you to verify your account before accessing
            the platform again.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
