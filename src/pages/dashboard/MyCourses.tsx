
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import { courseService, Course } from "@/services/courseService";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getMyCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getInProgressCourses = () => {
    return filteredCourses.filter(course => (course.progress || 0) < 100);
  };

  const getCompletedCourses = () => {
    return filteredCourses.filter(course => (course.progress || 0) === 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 w-full sm:w-[250px] md:w-[300px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Courses ({filteredCourses.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({getInProgressCourses().length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({getCompletedCourses().length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <CourseGrid courses={filteredCourses} loading={loading} />
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-6">
            <CourseGrid courses={getInProgressCourses()} loading={loading} />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <CourseGrid courses={getCompletedCourses()} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
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
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="text-muted-foreground mt-2">
          {courses.length === 0 ? "No courses match your search criteria." : "You haven't enrolled in any courses yet."}
        </p>
        {courses.length === 0 && (
          <Button className="mt-4" asChild>
            <Link to="/dashboard/explore-courses">Explore Courses</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <Link to={`/dashboard/my-courses/${course.id}`}>
                  {(course.progress || 0) === 100 ? "Review" : "Continue"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyCourses;
