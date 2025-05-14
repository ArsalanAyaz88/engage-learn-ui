
// Profile service for handling profile-related API requests

// Base API URL
const API_URL = "http://127.0.0.1:8000/api";

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
    throw error;
  }
};

// File upload helper function
const apiFileRequest = async (endpoint: string, formData: FormData) => {
  try {
    const options: RequestInit = {
      method: "POST",
      credentials: "include", // Include cookies for authentication
      body: formData,
    };

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
};

export interface UserProfile {
  id: string | number;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  phone_number?: string;
  address?: string;
}

// Profile service functions
export const profileService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    return apiRequest("/profile/profile");
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    return apiRequest("/profile/profile", "PUT", profileData);
  },

  // Upload avatar
  uploadAvatar: async (avatarFile: File) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    
    return apiFileRequest("/profile/profile/avatar", formData);
  },
};
