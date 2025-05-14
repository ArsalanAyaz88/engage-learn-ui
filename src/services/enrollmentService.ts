
// Enrollment service for handling enrollment-related API requests

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

export interface EnrollmentStatus {
  status: "pending" | "approved" | "rejected" | "not_enrolled";
  message: string;
}

// Enrollment service functions
export const enrollmentService = {
  // Submit payment proof
  submitPaymentProof: async (courseId: string | number, proofFile: File) => {
    const formData = new FormData();
    formData.append("payment_proof", proofFile);
    
    return apiFileRequest(`/enrollments/enrollments/${courseId}/payment-proof`, formData);
  },

  // Check enrollment status
  checkEnrollmentStatus: async (courseId: string | number): Promise<EnrollmentStatus> => {
    return apiRequest(`/enrollments/enrollments/${courseId}/status`);
  },
};
