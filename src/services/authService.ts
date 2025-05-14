
import { toast } from "sonner";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
  confirmPassword: string;
}

// Base API URL
const API_URL = "http://127.0.0.1:8000/api/auth";

// Helper function for API requests
const apiRequest = async (endpoint: string, method: string = "GET", data?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error: any) {
    console.error("API Error:", error);
    toast.error(error.message || "An error occurred");
    throw error;
  }
};

// Authentication service functions
export const authService = {
  // User signup
  signup: async (credentials: SignupCredentials) => {
    return apiRequest("/signup", "POST", credentials);
  },

  // User login
  login: async (credentials: LoginCredentials) => {
    return apiRequest("/token", "POST", credentials);
  },

  // Admin login
  adminLogin: async (credentials: LoginCredentials) => {
    return apiRequest("/admin-login", "POST", credentials);
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return apiRequest("/forgot-password", "POST", { email });
  },

  // Reset password
  resetPassword: async (credentials: ResetPasswordCredentials) => {
    return apiRequest("/reset-password", "POST", credentials);
  },

  // Logout user
  logout: async () => {
    return apiRequest("/logout", "POST");
  },

  // Initiate Google login
  googleLogin: () => {
    window.location.href = `${API_URL}/google/login`;
  },

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const result = await apiRequest("/check-auth");
      return result.authenticated;
    } catch (error) {
      return false;
    }
  },
};
