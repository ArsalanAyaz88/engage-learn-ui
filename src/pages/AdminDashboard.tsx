
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-lms-dark text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-gray-200"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-6">Administrator Control Panel</h1>
          <p className="text-gray-600 mb-4">
            This is a placeholder admin dashboard. Administrators would manage courses, users, and content here.
          </p>
          <p className="text-gray-600">
            You've successfully logged in as an administrator!
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
