
// Admin service for handling all admin-related API requests

// Base API URL
const API_URL = "http://127.0.0.1:8000/api/admin";

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

// Type definitions
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: number;
  pendingAssignments: number;
}

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  enrollments: number;
  avatar_url?: string;
}

export interface AdminCourse {
  id: number;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail: string;
  created_at: string;
  enrollments: number;
}

export interface AdminCourseDetail extends AdminCourse {
  videos: AdminVideo[];
  curriculum: string[];
  outcomes: string[];
  prerequisites: string[];
}

export interface AdminVideo {
  id: number;
  title: string;
  url: string;
  duration: string;
}

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface AdminAssignment {
  id: number;
  title: string;
  description: string;
  course_id: number;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface AdminQuiz {
  id: number;
  title: string;
  description: string;
  course_id: number;
  time_limit: number;
  created_at: string;
}

// Admin service functions
export const adminService = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<AdminStats> => {
    return apiRequest("/admin/dashboard/stats");
  },

  // Users/Students
  getStudentsList: async (): Promise<AdminUser[]> => {
    return apiRequest("/admin/users");
  },

  // Courses
  getCoursesList: async (skip: number = 0, limit: number = 10): Promise<AdminCourse[]> => {
    return apiRequest(`/admin/courses?skip=${skip}&limit=${limit}`);
  },

  getCourseDetails: async (courseId: string | number): Promise<AdminCourseDetail> => {
    return apiRequest(`/admin/courses/${courseId}`);
  },

  createCourse: async (courseData: Partial<AdminCourse>): Promise<AdminCourse> => {
    return apiRequest("/admin/courses", "POST", courseData);
  },

  updateCourse: async (courseId: string | number, courseData: Partial<AdminCourse>): Promise<AdminCourse> => {
    return apiRequest(`/admin/courses/${courseId}`, "PUT", courseData);
  },

  deleteCourse: async (courseId: string | number): Promise<void> => {
    return apiRequest(`/admin/courses/${courseId}`, "DELETE");
  },

  // Course Videos
  updateCourseVideos: async (courseId: string | number, videos: Partial<AdminVideo>[]): Promise<AdminVideo[]> => {
    return apiRequest(`/admin/courses/${courseId}/videos`, "PUT", { videos });
  },

  // Enrollments
  approveEnrollment: async (userId: string | number, courseId: string | number, durationMonths: number): Promise<void> => {
    return apiRequest(`/admin/enrollments/approve?user_id=${userId}&course_id=${courseId}&duration_months=${durationMonths}`, "POST");
  },

  testEnrollmentExpiration: async (userId: string | number, courseId: string | number): Promise<void> => {
    return apiRequest(`/admin/enrollments/test-expiration?user_id=${userId}&course_id=${courseId}`, "GET");
  },

  // Notifications
  getNotifications: async (): Promise<AdminNotification[]> => {
    return apiRequest("/admin/notifications");
  },

  // Assignments
  createAssignment: async (courseId: string | number, assignmentData: Partial<AdminAssignment>): Promise<AdminAssignment> => {
    return apiRequest(`/admin/courses/${courseId}/assignments`, "POST", assignmentData);
  },

  listAssignments: async (courseId: string | number): Promise<AdminAssignment[]> => {
    return apiRequest(`/admin/courses/${courseId}/assignments`);
  },

  updateAssignment: async (courseId: string | number, assignmentId: string | number, assignmentData: Partial<AdminAssignment>): Promise<AdminAssignment> => {
    return apiRequest(`/admin/courses/${courseId}/assignments/${assignmentId}`, "PUT", assignmentData);
  },

  deleteAssignment: async (courseId: string | number, assignmentId: string | number): Promise<void> => {
    return apiRequest(`/admin/courses/${courseId}/assignments/${assignmentId}`, "DELETE");
  },

  // Quizzes
  createQuiz: async (courseId: string | number, quizData: Partial<AdminQuiz>): Promise<AdminQuiz> => {
    return apiRequest(`/admin/courses/${courseId}/quizzes`, "POST", quizData);
  },

  listQuizzes: async (courseId: string | number): Promise<AdminQuiz[]> => {
    return apiRequest(`/admin/courses/${courseId}/quizzes`);
  },

  deleteQuiz: async (courseId: string | number, quizId: string | number): Promise<void> => {
    return apiRequest(`/admin/quizzes/${courseId}`, "DELETE");
  },
};
