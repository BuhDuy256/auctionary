import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/AuthLayout"; // 1. Import layout
import { Button } from "../../components/ui/button"; // Assuming Button/Input are in ui/
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/useAuth"; // Assuming hook is in contexts/
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

// 2. Get Site Key from .env (Vite)
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

export default function LoginPage() {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  // 3. Update state according to schema: username -> email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Get reCAPTCHA token
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password, recaptchaToken);

      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed.");
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        await loginWithGoogle(codeResponse.code);

        toast.success("Login with Google successful!");
        navigate("/");
      } catch (err: any) {
        setError(err.message || "Google login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed.");
    },
  });

  const responseFacebook = async (response: any) => {
    if (response.accessToken) {
      try {
        setIsLoading(true);
        // Gửi Token xuống Backend
        await loginWithFacebook(response.accessToken);

        toast.success("Login with Facebook successful!");
        navigate("/");
      } catch (err: any) {
        console.error("FB Login Failed:", err);
        toast.error("Facebook login failed.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // User hủy login hoặc lỗi
      console.log("FB Login cancelled or failed");
    }
  };

  return (
    // 6. Use AuthLayout, pass in the title
    <AuthLayout title="Log in to Auctionary">
      <form className="flex w-full flex-col gap-3" onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <div className="mt-2 flex origin-center scale-95 justify-center">
          <ReCAPTCHA
            theme="dark"
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
          />
        </div>

        {error && (
          <p className="animate-shake text-center text-[13px] text-destructive">
            {error}
          </p>
        )}

        {/* Button Group */}
        <div className="mt-3 flex w-full gap-2.5">
          <Button
            type="submit"
            variant="default"
            isLoading={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>

      <Button
        variant="secondary"
        size="lg"
        onClick={() => navigate("/signup")}
        disabled={isLoading}
        className="mt-2.5 w-full font-semibold"
      >
        Don't have an account? Sign Up
      </Button>

      <a
        href="#"
        className="text-accent mt-6 text-[13px] no-underline transition-colors hover:text-accent-hover hover:underline"
        onClick={(e) => {
          e.preventDefault();
          navigate("/forgot-password");
        }}
      >
        Forgot password?
      </a>

      <div className="my-4 flex w-full items-center text-center text-[13px] font-semibold uppercase text-muted-foreground">
        <div className="flex-1 border-b border-border"></div>
        <span className="px-4">OR Continue with</span>
        <div className="flex-1 border-b border-border"></div>
      </div>

      <div className="flex w-full flex-row gap-2">
        <Button
          variant="secondary"
          onClick={() => handleGoogleLogin()}
          disabled={isLoading}
          className="flex-1" // Để 2 nút chia đều chiều rộng
        >
          <img
            src="/assets/Google__G__logo.svg.webp"
            alt="G"
            className="mr-2 h-[18px] w-[18px]"
          />
          Google
        </Button>

        {/* Bỏ thẻ div style marginTop thừa thãi, dùng flex gap-2 là đủ */}

        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          onSuccess={responseFacebook}
          onFail={(error) => {
            console.log("FB Login Failed:", error);
            toast.error("Facebook login failed.");
          }}
          render={({ onClick }) => (
            <Button
              variant="secondary"
              onClick={onClick}
              disabled={isLoading}
              className="flex-1" // Chia đều chiều rộng
            >
              <img
                src="/assets/2023_Facebook_icon.svg.png"
                alt="F"
                className="mr-2 h-[18px] w-[18px]"
              />
              <span>Facebook</span>
            </Button>
          )}
        />
      </div>
    </AuthLayout>
  );
}
