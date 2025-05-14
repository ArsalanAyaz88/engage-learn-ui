
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, GraduationCap, Calendar, Award } from "lucide-react";
import { courseService, Course } from "@/services/courseService";
import { profileService, UserProfile } from "@/services/profileService";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesData, profileData] = await Promise.all([
          courseService.getMyCourses(),
          profileService.getProfile(),
        ]);

        setCourses(coursesData.slice(0, 4)); // Only get the first 4 courses for the dashboard
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'}!</h1>
            <p className="text-muted-foreground">
              Here's a summary of your learning journey
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Button asChild>
              <Link to="/dashboard/explore-courses">Explore Courses</Link>
            </Button>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Courses in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : courses.filter(c => c.progress === 100).length}</div>
              <p className="text-xs text-muted-foreground">
                Courses finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Pending submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : courses.filter(c => c.progress === 100).length}</div>
              <p className="text-xs text-muted-foreground">
                Earned rewards
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My courses section */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Courses</h2>
            <Button variant="outline" asChild>
              <Link to="/dashboard/my-courses">View all</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-md"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <Card className="mt-4 p-6 text-center">
              <CardContent className="pt-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't enrolled in any courses yet. Start your learning journey today!
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/dashboard/explore-courses">Explore Courses</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                  <Link to={`/dashboard/my-courses/${course.id}`}>
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/dashboard/my-courses/${course.id}`} className="hover:underline">
                      <h3 className="text-lg font-semibold line-clamp-1">{course.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{course.progress || 0}%</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {course.duration}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/my-courses/${course.id}`}>Continue</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
