
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { adminService, AdminStats } from "@/services/adminService";
import { toast } from "sonner";
import { 
  LogOut, 
  Users, 
  BookOpen, 
  BarChart2, 
  Bell, 
  FileText,
  Settings
} from "lucide-react";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminStudents } from "@/components/admin/AdminStudents";
import { AdminCourses } from "@/components/admin/AdminCourses";
import { AdminAssignments } from "@/components/admin/AdminAssignments";
import { AdminQuizzes } from "@/components/admin/AdminQuizzes";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
        
        // Get unread notifications count
        const notifications = await adminService.getNotifications();
        setNotificationCount(notifications.filter(n => !n.is_read).length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Admin logged out successfully");
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                )}
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <div className="md:col-span-3 lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="p-4 space-y-1">
                <Button 
                  variant={activeTab === "overview" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("overview")}
                >
                  <BarChart2 size={18} className="mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "students" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("students")}
                >
                  <Users size={18} className="mr-2" />
                  Students
                </Button>
                <Button 
                  variant={activeTab === "courses" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("courses")}
                >
                  <BookOpen size={18} className="mr-2" />
                  Courses
                </Button>
                <Button 
                  variant={activeTab === "assignments" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("assignments")}
                >
                  <FileText size={18} className="mr-2" />
                  Assignments
                </Button>
                <Button 
                  variant={activeTab === "quizzes" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("quizzes")}
                >
                  <FileText size={18} className="mr-2" />
                  Quizzes
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings size={18} className="mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-9 lg:col-span-10">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              {/* Content based on active tab */}
              {activeTab === "overview" && (
                <AdminOverview stats={stats} loading={loading} />
              )}
              
              {activeTab === "students" && (
                <AdminStudents />
              )}
              
              {activeTab === "courses" && (
                <AdminCourses />
              )}
              
              {activeTab === "assignments" && (
                <AdminAssignments />
              )}
              
              {activeTab === "quizzes" && (
                <AdminQuizzes />
              )}
              
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Settings</h2>
                  <p className="text-gray-500 dark:text-gray-400">Admin settings will be available here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
