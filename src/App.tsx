
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Import dashboard pages
import MyCourses from "./pages/dashboard/MyCourses";
import CourseDetail from "./pages/dashboard/CourseDetail";
import ExploreCourses from "./pages/dashboard/ExploreCourses";
import ExploreCourseDetail from "./pages/dashboard/ExploreCourseDetail";
import Profile from "./pages/dashboard/Profile";

const queryClient = new QueryClient();

const App = () => {
  // Force dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/my-courses" element={<MyCourses />} />
            <Route path="/dashboard/my-courses/:courseId" element={<CourseDetail />} />
            <Route path="/dashboard/explore-courses" element={<ExploreCourses />} />
            <Route path="/dashboard/explore-courses/:courseId" element={<ExploreCourseDetail />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
