
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthPage from "@/components/auth/AuthPage";
import AuthCard from "@/components/auth/AuthCard";
import FormInput from "@/components/auth/FormInput";
import SocialLogin from "@/components/auth/SocialLogin";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

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
      email: "",
      password: "",
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      await authService.login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled by the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage 
      imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
      imageSide="right"
    >
      <AuthCard
        title="Welcome back"
        subtitle="Log in to your account to continue learning"
      >
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            autoComplete="email"
            required
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, remember: checked === true })
                }
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none cursor-pointer text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-lms-primary hover-link"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg font-medium transition-all duration-300 bg-lms-primary hover:bg-lms-secondary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 mr-2 border-t-2 border-white rounded-full animate-spin" />
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </Button>

          <SocialLogin />

          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-lms-primary font-medium hover-link">
                Sign up
              </Link>
            </p>
            <p className="text-gray-600">
              <Link to="/admin-login" className="text-lms-primary font-medium hover-link">
                Login as Admin
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </AuthPage>
  );
};

export default LoginPage;
