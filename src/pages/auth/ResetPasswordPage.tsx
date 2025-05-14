
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthPage from "@/components/auth/AuthPage";
import AuthCard from "@/components/auth/AuthCard";
import FormInput from "@/components/auth/FormInput";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Extract token from URL query params
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setFormErrors({
        ...formErrors,
        token: "Missing reset token. Please use the link from your email.",
      });
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      token: "",
      password: "",
      confirmPassword: "",
    };

    // Token validation
    if (!token) {
      newErrors.token = "Reset token is missing";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await authService.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Password has been reset successfully");
      navigate("/login");
    } catch (error) {
      // Error is already handled by the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage imageUrl="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80">
      <AuthCard
        title="Set new password"
        subtitle="Create a strong password for your account"
      >
        {formErrors.token ? (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <p className="text-red-800 mb-2">
              {formErrors.token}
            </p>
            <Link to="/forgot-password" className="text-lms-primary font-medium hover-link">
              Request a new password reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormInput
              label="New Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              autoComplete="new-password"
              required
            />

            <PasswordStrengthMeter password={formData.password} />

            <FormInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              className="w-full py-6 text-lg font-medium transition-all duration-300 bg-lms-primary hover:bg-lms-secondary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-2 border-t-2 border-white rounded-full animate-spin" />
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-lms-primary font-medium hover-link">
            Back to login
          </Link>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default ResetPasswordPage;
