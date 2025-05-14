
// Assignment service for handling assignment-related API requests

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

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  is_submitted: boolean;
  submission?: AssignmentSubmission;
}

export interface AssignmentSubmission {
  id: string | number;
  submitted_at: string;
  file_url?: string;
  content?: string;
  score?: number;
  feedback?: string;
}

// Assignment service functions
export const assignmentService = {
  // Get assignments for a course
  getAssignments: async (courseId: string | number) => {
    return apiRequest(`/assignments/${courseId}`);
  },

  // Get assignment details
  getAssignment: async (courseId: string | number, assignmentId: string | number) => {
    return apiRequest(`/assignments/${courseId}/${assignmentId}`);
  },

  // Submit assignment
  submitAssignment: async (
    courseId: string | number,
    assignmentId: string | number,
    submissionFile: File,
    content?: string
  ) => {
    const formData = new FormData();
    formData.append("file", submissionFile);
    
    if (content) {
      formData.append("content", content);
    }
    
    return apiFileRequest(`/assignments/${courseId}/${assignmentId}/submit`, formData);
  },

  // Submit text-only assignment
  submitTextAssignment: async (
    courseId: string | number,
    assignmentId: string | number,
    content: string
  ) => {
    return apiRequest(`/assignments/${courseId}/${assignmentId}/submit`, "POST", { content });
  },
};
