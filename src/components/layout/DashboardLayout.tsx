
import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Home, 
  User, 
  FileText, 
  LogOut, 
  Bell,
  CreditCard,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { profileService, UserProfile } from "@/services/profileService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "My Courses", path: "/dashboard/my-courses" },
  { icon: BookOpen, label: "Explore Courses", path: "/dashboard/explore-courses" },
  { icon: FileText, label: "Assignments", path: "/dashboard/assignments" },
  { icon: FileText, label: "Quizzes", path: "/dashboard/quizzes" },
  { icon: CreditCard, label: "Payments", path: "/dashboard/payments" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar - now always visible */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 fixed inset-y-0 left-0 z-30 transition-all duration-300 transform">
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="px-4 py-5 flex items-center justify-between border-b border-gray-700">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Course LMS</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 text-gray-300 rounded-md hover:bg-gray-700 transition-all duration-300 hover:translate-x-1",
                      location.pathname === item.path && "bg-indigo-900 text-white font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="transition-all duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center">
              <Avatar className="h-9 w-9 ring-2 ring-indigo-500">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-indigo-700 text-white">{getInitials(profile?.full_name)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full flex items-center justify-center border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content - adjusted margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top navigation */}
        <header className="bg-gray-800 shadow-lg z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">
                {navItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-gray-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-gray-800" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-gray-800 text-gray-200 border border-gray-700">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <div className="max-h-80 overflow-y-auto">
                    <div className="py-2 px-3 text-center text-sm text-gray-400">
                      No new notifications
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 text-gray-300 hover:text-white hover:bg-gray-700">
                    <Avatar className="h-8 w-8 ring-1 ring-indigo-500 ring-offset-2 ring-offset-gray-800">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-indigo-700 text-white">{getInitials(profile?.full_name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 text-gray-200 border border-gray-700">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild className="hover:bg-gray-700 hover:text-white focus:bg-gray-700">
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-700 hover:text-white focus:bg-gray-700">Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-100">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
