
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { adminService, AdminStats, AdminUser, AdminCourse, AdminCourseDetail, AdminNotification, AdminAssignment, AdminQuiz } from '@/services/adminService';

// Define the state types
interface AdminState {
  stats: AdminStats | null;
  students: AdminUser[];
  courses: AdminCourse[];
  courseDetail: AdminCourseDetail | null;
  notifications: AdminNotification[];
  assignments: AdminAssignment[];
  quizzes: AdminQuiz[];
  loading: {
    stats: boolean;
    students: boolean;
    courses: boolean;
    courseDetail: boolean;
    notifications: boolean;
    assignments: boolean;
    quizzes: boolean;
  };
  error: {
    stats: string | null;
    students: string | null;
    courses: string | null;
    courseDetail: string | null;
    notifications: string | null;
    assignments: string | null;
    quizzes: string | null;
  };
}

// Initial state
const initialState: AdminState = {
  stats: null,
  students: [],
  courses: [],
  courseDetail: null,
  notifications: [],
  assignments: [],
  quizzes: [],
  loading: {
    stats: false,
    students: false,
    courses: false,
    courseDetail: false,
    notifications: false,
    assignments: false,
    quizzes: false,
  },
  error: {
    stats: null,
    students: null,
    courses: null,
    courseDetail: null,
    notifications: null,
    assignments: null,
    quizzes: null,
  },
};

// Thunks for API calls
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchStudentsList = createAsyncThunk(
  'admin/fetchStudentsList',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getStudentsList();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch students list');
    }
  }
);

export const fetchCoursesList = createAsyncThunk(
  'admin/fetchCoursesList',
  async ({ skip = 0, limit = 10 }: { skip?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await adminService.getCoursesList(skip, limit);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses list');
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  'admin/fetchCourseDetails',
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      return await adminService.getCourseDetails(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch course details');
    }
  }
);

export const createCourse = createAsyncThunk(
  'admin/createCourse',
  async (courseData: Partial<AdminCourse>, { rejectWithValue }) => {
    try {
      return await adminService.createCourse(courseData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'admin/updateCourse',
  async ({ courseId, courseData }: { courseId: string | number; courseData: Partial<AdminCourse> }, { rejectWithValue }) => {
    try {
      return await adminService.updateCourse(courseId, courseData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'admin/deleteCourse',
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      await adminService.deleteCourse(courseId);
      return courseId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete course');
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'admin/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getNotifications();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchAssignments = createAsyncThunk(
  'admin/fetchAssignments',
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      return await adminService.listAssignments(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch assignments');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'admin/createAssignment',
  async ({ courseId, assignmentData }: { courseId: string | number; assignmentData: Partial<AdminAssignment> }, { rejectWithValue }) => {
    try {
      return await adminService.createAssignment(courseId, assignmentData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create assignment');
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'admin/updateAssignment',
  async ({ courseId, assignmentId, assignmentData }: { courseId: string | number; assignmentId: string | number; assignmentData: Partial<AdminAssignment> }, { rejectWithValue }) => {
    try {
      return await adminService.updateAssignment(courseId, assignmentId, assignmentData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update assignment');
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'admin/deleteAssignment',
  async ({ courseId, assignmentId }: { courseId: string | number; assignmentId: string | number }, { rejectWithValue }) => {
    try {
      await adminService.deleteAssignment(courseId, assignmentId);
      return { courseId, assignmentId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete assignment');
    }
  }
);

export const fetchQuizzes = createAsyncThunk(
  'admin/fetchQuizzes',
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      return await adminService.listQuizzes(courseId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quizzes');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'admin/createQuiz',
  async ({ courseId, quizData }: { courseId: string | number; quizData: Partial<AdminQuiz> }, { rejectWithValue }) => {
    try {
      return await adminService.createQuiz(courseId, quizData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'admin/deleteQuiz',
  async ({ courseId, quizId }: { courseId: string | number; quizId: string | number }, { rejectWithValue }) => {
    try {
      await adminService.deleteQuiz(courseId, quizId);
      return { courseId, quizId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete quiz');
    }
  }
);

// Create the slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<AdminStats>) => {
        state.stats = action.payload;
        state.loading.stats = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.payload as string;
      })
      
      // Students List
      .addCase(fetchStudentsList.pending, (state) => {
        state.loading.students = true;
        state.error.students = null;
      })
      .addCase(fetchStudentsList.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
        state.students = action.payload;
        state.loading.students = false;
      })
      .addCase(fetchStudentsList.rejected, (state, action) => {
        state.loading.students = false;
        state.error.students = action.payload as string;
      })
      
      // Courses List
      .addCase(fetchCoursesList.pending, (state) => {
        state.loading.courses = true;
        state.error.courses = null;
      })
      .addCase(fetchCoursesList.fulfilled, (state, action: PayloadAction<AdminCourse[]>) => {
        state.courses = action.payload;
        state.loading.courses = false;
      })
      .addCase(fetchCoursesList.rejected, (state, action) => {
        state.loading.courses = false;
        state.error.courses = action.payload as string;
      })
      
      // Course Details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading.courseDetail = true;
        state.error.courseDetail = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action: PayloadAction<AdminCourseDetail>) => {
        state.courseDetail = action.payload;
        state.loading.courseDetail = false;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading.courseDetail = false;
        state.error.courseDetail = action.payload as string;
      })
      
      // Create Course
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<AdminCourse>) => {
        state.courses.push(action.payload);
      })
      
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<AdminCourse>) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      
      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      })
      
      // Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.error.notifications = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<AdminNotification[]>) => {
        state.notifications = action.payload;
        state.loading.notifications = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
        state.error.notifications = action.payload as string;
      })
      
      // Assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.loading.assignments = true;
        state.error.assignments = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action: PayloadAction<AdminAssignment[]>) => {
        state.assignments = action.payload;
        state.loading.assignments = false;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading.assignments = false;
        state.error.assignments = action.payload as string;
      })
      
      // Create Assignment
      .addCase(createAssignment.fulfilled, (state, action: PayloadAction<AdminAssignment>) => {
        state.assignments.push(action.payload);
      })
      
      // Update Assignment
      .addCase(updateAssignment.fulfilled, (state, action: PayloadAction<AdminAssignment>) => {
        const index = state.assignments.findIndex(assignment => assignment.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      
      // Delete Assignment
      .addCase(deleteAssignment.fulfilled, (state, action: PayloadAction<{ courseId: string | number; assignmentId: string | number }>) => {
        state.assignments = state.assignments.filter(assignment => assignment.id !== action.payload.assignmentId);
      })
      
      // Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading.quizzes = true;
        state.error.quizzes = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<AdminQuiz[]>) => {
        state.quizzes = action.payload;
        state.loading.quizzes = false;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading.quizzes = false;
        state.error.quizzes = action.payload as string;
      })
      
      // Create Quiz
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<AdminQuiz>) => {
        state.quizzes.push(action.payload);
      })
      
      // Delete Quiz
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<{ courseId: string | number; quizId: string | number }>) => {
        state.quizzes = state.quizzes.filter(quiz => quiz.id !== action.payload.quizId);
      });
  },
});

export default adminSlice.reducer;
