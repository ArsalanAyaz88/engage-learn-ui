
// Course service for handling all course-related API requests

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

export interface Course {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  progress?: number;
  enrolled?: boolean;
  price?: number;
}

export interface Video {
  id: string | number;
  title: string;
  duration: string;
  url: string;
  completed: boolean;
  checkpoint: number;
}

export interface Curriculum {
  id: string | number;
  title: string;
  lessons: number;
  duration: string;
}

export interface Outcome {
  id: string | number;
  description: string;
}

export interface Prerequisite {
  id: string | number;
  description: string;
}

// Course service functions
export const courseService = {
  // Get user's enrolled courses
  getMyCourses: async () => {
    return apiRequest("/courses/my-courses");
  },

  // Get courses available for enrollment
  getExploreCourses: async () => {
    return apiRequest("/courses/explore-courses");
  },

  // Get details for a specific course
  getExploreCoursesDetail: async (courseId: string | number) => {
    return apiRequest(`/courses/explore-courses/${courseId}`);
  },

  // Get course curriculum
  getCourseCurriculum: async (courseId: string | number) => {
    return apiRequest(`/courses/courses/${courseId}/curriculum`);
  },

  // Get course outcomes
  getCourseOutcomes: async (courseId: string | number) => {
    return apiRequest(`/courses/courses/${courseId}/outcomes`);
  },

  // Get course prerequisites
  getCoursePrerequisites: async (courseId: string | number) => {
    return apiRequest(`/courses/courses/${courseId}/prerequisites`);
  },

  // Get course description
  getCourseDescription: async (courseId: string | number) => {
    return apiRequest(`/courses/courses/${courseId}/description`);
  },

  // Get course videos with checkpoint
  getCourseVideos: async (courseId: string | number) => {
    return apiRequest(`/courses/my-courses/${courseId}/videos`);
  },

  // Mark video as completed
  markVideoCompleted: async (courseId: string | number, videoId: string | number) => {
    return apiRequest(`/courses/videos/${courseId}/complete`, "POST", { videoId });
  },

  // Get course certificate
  getCourseCertificate: async (courseId: string | number) => {
    return apiRequest(`/courses/courses/${courseId}/certificate`);
  },
};
