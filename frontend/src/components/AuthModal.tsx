import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { notify } from "../utils/notify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import InputOTP from "./ui/input-otp";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup" | "forgot";
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthModalProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    forgotPassword,
    resetPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const loginRecaptchaRef = useRef<ReCAPTCHA>(null);

  // Signup state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
  });
  const signupRecaptchaRef = useRef<ReCAPTCHA>(null);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<"request_email" | "submit_otp">(
    "request_email"
  );
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const resetState = () => {
    setError(null);
    setIsLoading(false);
    setLoginData({ email: "", password: "" });
    setSignupData({
      fullName: "",
      email: "",
      password: "",
      confirm_password: "",
      address: "",
    });
    setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    setForgotStep("request_email");
    loginRecaptchaRef.current?.reset();
    signupRecaptchaRef.current?.reset();
  };

  // Login handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const recaptchaToken = loginRecaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    try {
      await login(loginData.email, loginData.password, recaptchaToken);
      notify.success("Login successful!");
      onOpenChange(false);
      resetState();
    } catch (err: any) {
      setError(err.message || "Login failed.");
      loginRecaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Signup handlers
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const recaptchaToken = signupRecaptchaRef.current?.getValue();

    if (signupData.password !== signupData.confirm_password) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    try {
      const { confirm_password, ...data } = signupData;
      const newUserData = await signup({ ...data, recaptchaToken });

      notify.success(
        newUserData.message || "Account created! Please verify your email."
      );
      onOpenChange(false);
      resetState();

      navigate("/verify-otp", {
        state: {
          email: newUserData.email,
          user_id: newUserData.id,
          message: "Account created successfully! Please verify your email.",
        },
      });
    } catch (err: any) {
      setError(err.message || "Signup failed.");
      signupRecaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handlers
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(forgotData.email);
      notify.success("An OTP has been sent to your email.");
      setForgotStep("submit_otp");
    } catch (error: any) {
      setError(error.message || "An error occurred");
      notify.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (forgotData.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(
        forgotData.email,
        forgotData.otp,
        forgotData.newPassword
      );
      notify.success("Password reset successfully! Please log in.");
      onOpenChange(false);
      resetState();
      setActiveTab("login");
    } catch (err: any) {
      notify.error(err.message || "Invalid OTP or failed to reset.");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        await loginWithGoogle(codeResponse.code);
        notify.success("Login with Google successful!");
        onOpenChange(false);
        resetState();
      } catch (err: any) {
        setError(err.message || "Google login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      notify.error("Google login failed.");
    },
  });

  const responseFacebook = async (response: any) => {
    if (response.accessToken) {
      try {
        setIsLoading(true);
        await loginWithFacebook(response.accessToken);
        notify.success("Login with Facebook successful!");
        onOpenChange(false);
        resetState();
      } catch (err: any) {
        console.error("FB Login Failed:", err);
        notify.error("Facebook login failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) resetState();
      }}
    >
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Auctionary</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value: any) => {
            setActiveTab(value);
            setError(null);
            setForgotStep("request_email");
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Pass</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  theme={theme === "tactical" ? "dark" : "light"}
                  ref={loginRecaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleGoogleLogin()}
                disabled={isLoading}
                className="flex-1"
                isLoading={isLoading}
              >
                <img
                  src="/assets/Google__G__logo.svg.webp"
                  alt="G"
                  className="mr-2 h-4 w-4"
                />
                Google
              </Button>

              <FacebookLogin
                appId={FACEBOOK_APP_ID}
                onSuccess={responseFacebook}
                onFail={(error) => {
                  console.log("FB Login Failed:", error);
                  notify.error("Facebook login failed.");
                }}
                render={({ onClick }) => (
                  <Button
                    variant="outline"
                    onClick={onClick}
                    disabled={isLoading}
                    className="flex-1"
                    isLoading={isLoading}
                  >
                    <img
                      src="/assets/2023_Facebook_icon.svg.png"
                      alt="F"
                      className="mr-2 h-4 w-4"
                    />
                    Facebook
                  </Button>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignup} className="space-y-3">
              <Input
                id="signup-name"
                type="text"
                placeholder="Full Name"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                disabled={isLoading}
                required
              />
              <Input
                id="signup-email"
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                disabled={isLoading}
                required
              />
              <Input
                id="signup-password"
                type="password"
                placeholder="Password (min 8 characters)"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                disabled={isLoading}
                required
              />
              <Input
                id="signup-confirm"
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirm_password}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirm_password: e.target.value,
                  })
                }
                disabled={isLoading}
                required
              />
              <Input
                id="signup-address"
                type="text"
                placeholder="Address (Optional)"
                value={signupData.address}
                onChange={(e) =>
                  setSignupData({ ...signupData, address: e.target.value })
                }
                disabled={isLoading}
              />

              <div className="flex justify-center">
                <ReCAPTCHA
                  theme={theme === "tactical" ? "dark" : "light"}
                  ref={signupRecaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="forgot" className="space-y-4 mt-6">
            {forgotStep === "request_email" ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotData.email}
                  onChange={(e) =>
                    setForgotData({ ...forgotData, email: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />

                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  An OTP was sent to <strong>{forgotData.email}</strong>.
                </p>

                <div className="flex flex-col items-center">
                  <Label className="mb-2">Enter 6-Digit OTP</Label>
                  <InputOTP
                    length={6}
                    value={forgotData.otp}
                    onChange={(value) =>
                      setForgotData({ ...forgotData, otp: value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgot-new-password">New Password</Label>
                  <Input
                    id="forgot-new-password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={forgotData.newPassword}
                    onChange={(e) =>
                      setForgotData({
                        ...forgotData,
                        newPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgot-confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    id="forgot-confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={forgotData.confirmPassword}
                    onChange={(e) =>
                      setForgotData({
                        ...forgotData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setForgotStep("request_email")}
                  disabled={isLoading}
                >
                  Back
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
