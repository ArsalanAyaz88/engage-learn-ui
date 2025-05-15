
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStats } from "@/services/adminService";
import { Users, BookOpen, Award, BarChart2 } from "lucide-react";

interface AdminOverviewProps {
  stats: AdminStats | null;
  loading: boolean;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats, loading }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        {/* Total Courses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>

        {/* Total Enrollments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalEnrollments || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{stats?.recentEnrollments || 0}</span> this month
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total platform revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview Information</CardTitle>
            <CardDescription>
              Platform statistics and performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium">Pending Assignments</h3>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <p className="text-xl font-bold">{stats?.pendingAssignments || 0}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium">Recent Enrollments</h3>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <p className="text-xl font-bold">{stats?.recentEnrollments || 0}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  This dashboard shows the key metrics for your learning platform. Use the tabs on the left to navigate to different sections of the admin panel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
