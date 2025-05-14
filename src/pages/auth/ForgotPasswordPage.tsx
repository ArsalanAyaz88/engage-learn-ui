
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AuthPage from "@/components/auth/AuthPage";
import AuthCard from "@/components/auth/AuthCard";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      // Error is already handled by the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage 
      imageUrl="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80"
      imageSide="right"
    >
      <AuthCard
        title="Reset your password"
        subtitle={
          submitted
            ? "Check your inbox for further instructions"
            : "Enter your email and we'll send you instructions to reset your password"
        }
      >
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              error={emailError}
              autoComplete="email"
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
                  Sending Email...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <p className="text-green-800 mb-2">
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <p className="text-green-700 text-sm">
              If you don't see the email, check your spam folder or make sure you entered the correct email address.
            </p>
          </div>
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

export default ForgotPasswordPage;
