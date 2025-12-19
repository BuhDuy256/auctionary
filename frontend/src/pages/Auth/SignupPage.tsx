import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { notify } from "../../utils/notify";
import AuthLayout from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/useAuth";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function SignupPage() {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const recaptchaToken = recaptchaRef.current?.getValue();

    if (formData.password !== formData.confirm_password) {
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
      const { confirm_password, ...signupData } = formData;

      const newUserData = await signup({
        ...signupData,
        recaptchaToken,
      });

      notify.success(
        newUserData.message || "Account created! Please verify your email."
      );

      navigate("/verify-otp", {
        state: {
          email: newUserData.email,
          user_id: newUserData.id,
          message: "Account created successfully! Please verify your email.",
        },
      });
    } catch (err: any) {
      setError(err.message || "Signup failed.");
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign up for Auctionary">
      <form className="flex w-full flex-col gap-3" onSubmit={handleSignup}>
        <Input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password (min 8 characters)"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <Input
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="mt-2 flex justify-center scale-95 origin-center">
          <ReCAPTCHA
            theme="dark"
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="button-group">
          <Button
            type="submit"
            variant="default"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </div>
      </form>

      <Button
        variant="secondary"
        onClick={() => navigate("/login")}
        size="lg"
        className="w-full mt-2.5 font-semibold"
      >
        Already have an account? Log In
      </Button>
    </AuthLayout>
  );
}
