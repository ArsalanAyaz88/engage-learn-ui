
// Quiz service for handling quiz-related API requests

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

export interface Quiz {
  id: string | number;
  title: string;
  description: string;
  time_limit: number;
  course_id: string | number;
  is_completed: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string | number;
  question_text: string;
  options: string[];
  correct_option?: number;
}

export interface QuizSubmission {
  id: string | number;
  quiz_id: string | number;
  score: number;
  is_passed: boolean;
  completed_at: string;
}

export interface QuizAnswer {
  question_id: string | number;
  selected_option: number;
}

// Quiz service functions
export const quizService = {
  // List quizzes for a course
  listQuizzes: async (courseId: string | number) => {
    return apiRequest(`/quizzes/${courseId}`);
  },

  // Get quiz detail
  getQuizDetail: async (courseId: string | number, quizId: string | number) => {
    return apiRequest(`/quizzes/${courseId}/${quizId}`);
  },

  // Submit quiz
  submitQuiz: async (courseId: string | number, quizId: string | number, answers: QuizAnswer[]) => {
    return apiRequest(`/quizzes/${courseId}/${quizId}/submit`, "POST", { answers });
  },

  // Get quiz result
  getQuizResult: async (courseId: string | number, quizId: string | number, submissionId: string | number) => {
    return apiRequest(`/quizzes/${courseId}/${quizId}/${submissionId}`);
  },
};
