
// Payment service for handling payment-related API requests

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

export interface BankAccount {
  id: string | number;
  bank_name: string;
  account_holder: string;
  account_number: string;
  branch_code?: string;
}

// Payment service functions
export const paymentService = {
  // Get bank accounts
  getBankAccounts: async (): Promise<BankAccount[]> => {
    return apiRequest("/payments/bank-accounts");
  },
};
