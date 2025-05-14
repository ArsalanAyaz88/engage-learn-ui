
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { courseService, Course, Video, Curriculum, Outcome, Prerequisite } from "@/services/courseService";
import { Calendar, Clock, Award, File, PlayCircle, CheckCircle, Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        // Fetch course data
        const courseData = await courseService.getExploreCoursesDetail(courseId);
        setCourse(courseData);

        // Fetch course videos
        try {
          const videosData = await courseService.getCourseVideos(courseId);
          setVideos(videosData);
          // Set the first video as active if available
          if (videosData.length > 0) {
            setActiveVideo(videosData[0]);
          }
        } catch (error) {
          console.error("Failed to load videos:", error);
        }

        // Fetch curriculum
        try {
          const curriculumData = await courseService.getCourseCurriculum(courseId);
          setCurriculum(curriculumData);
        } catch (error) {
          console.error("Failed to load curriculum:", error);
        }

        // Fetch outcomes
        try {
          const outcomesData = await courseService.getCourseOutcomes(courseId);
          setOutcomes(outcomesData);
        } catch (error) {
          console.error("Failed to load outcomes:", error);
        }

        // Fetch prerequisites
        try {
          const prerequisitesData = await courseService.getCoursePrerequisites(courseId);
          setPrerequisites(prerequisitesData);
        } catch (error) {
          console.error("Failed to load prerequisites:", error);
        }

        // Fetch description
        try {
          const descriptionData = await courseService.getCourseDescription(courseId);
          setDescription(descriptionData.description || "");
        } catch (error) {
          console.error("Failed to load description:", error);
        }
      } catch (error) {
        console.error("Error loading course details:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
  };

  const handleMarkVideoCompleted = async () => {
    if (!activeVideo || !courseId) return;
    
    try {
      await courseService.markVideoCompleted(courseId, activeVideo.id);
      
      // Update local videos state to mark this video as completed
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === activeVideo.id ? { ...video, completed: true } : video
        )
      );
      
      // Update active video state
      setActiveVideo(prev => prev ? { ...prev, completed: true } : null);
      
      toast.success("Video marked as completed");
      
      // Find and automatically load the next uncompleted video
      const currentIndex = videos.findIndex(v => v.id === activeVideo.id);
      const nextVideos = videos.slice(currentIndex + 1);
      const nextVideo = nextVideos.find(v => !v.completed) || nextVideos[0];
      
      if (nextVideo) {
        setActiveVideo(nextVideo);
      }
    } catch (error) {
      console.error("Failed to mark video as completed:", error);
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin">
            <Loader2 className="h-8 w-8 text-lms-primary" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Course not found</h3>
          <p className="text-muted-foreground mt-2">
            The course you are looking for does not exist or you don't have access to it.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/dashboard/my-courses">Back to My Courses</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate progress percentage
  const completedCount = videos.filter(video => video.completed).length;
  const progressPercentage = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.instructor}</p>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{videos.length} lectures</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Self-paced</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Your progress</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      {progressPercentage === 100 ? (
                        <div>
                          <Award className="h-12 w-12 mx-auto text-green-500" />
                          <h3 className="mt-2 font-semibold">Course Completed!</h3>
                          <p className="text-sm text-muted-foreground">
                            You've successfully completed this course
                          </p>
                          <Button className="mt-4 w-full" asChild>
                            <Link to={`/dashboard/my-courses/${courseId}/certificate`}>
                              View Certificate
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold">Continue Learning</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            You've completed {completedCount} of {videos.length} lectures
                          </p>
                          <Button className="w-full" asChild>
                            <a href="#content">Resume Course</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6" id="content">
            {/* Video Player */}
            {activeVideo && (
              <Card>
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 9}>
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <PlayCircle className="h-12 w-12 mx-auto mb-2" />
                        <p>Video Player: {activeVideo.title}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Duration: {activeVideo.duration}
                        </p>
                      </div>
                    </div>
                  </AspectRatio>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{activeVideo.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeVideo.duration}
                      </p>
                    </div>
                    <Button 
                      onClick={handleMarkVideoCompleted}
                      variant={activeVideo.completed ? "outline" : "default"}
                      disabled={activeVideo.completed}
                    >
                      {activeVideo.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        'Mark as Completed'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                {curriculum.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-muted-foreground">No curriculum available for this course yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  curriculum.map((section) => (
                    <Card key={section.id} className="overflow-hidden">
                      <CardHeader className="p-4 bg-muted/30">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription className="text-right">
                            {section.lessons} lessons · {section.duration}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ul className="divide-y">
                          {videos.map((video) => (
                            <li 
                              key={video.id}
                              onClick={() => handleVideoSelect(video)}
                              className={cn(
                                "flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors",
                                activeVideo?.id === video.id && "bg-muted/40"
                              )}
                            >
                              <div className="flex items-center">
                                {video.completed ? (
                                  <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                                ) : (
                                  <PlayCircle className="h-5 w-5 mr-3 text-muted-foreground" />
                                )}
                                <span className={video.completed ? "text-muted-foreground line-through" : ""}>
                                  {video.title}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">{video.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="description">
                <Card>
                  <CardContent className="p-4">
                    {description ? (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
                    ) : (
                      <p className="text-muted-foreground">No description available for this course.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="outcomes">
                <Card>
                  <CardContent className="p-4">
                    {outcomes.length === 0 ? (
                      <p className="text-muted-foreground">No learning outcomes specified for this course.</p>
                    ) : (
                      <ul className="space-y-2 list-disc pl-5">
                        {outcomes.map((outcome) => (
                          <li key={outcome.id}>{outcome.description}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="prerequisites">
                <Card>
                  <CardContent className="p-4">
                    {prerequisites.length === 0 ? (
                      <p className="text-muted-foreground">No prerequisites required for this course.</p>
                    ) : (
                      <ul className="space-y-2 list-disc pl-5">
                        {prerequisites.map((prereq) => (
                          <li key={prereq.id}>{prereq.description}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course progress card */}
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>
                  Track your journey through this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span>{completedCount} of {videos.length} completed</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      Lessons
                    </span>
                    <span>{videos.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </span>
                    <span>{completedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration
                    </span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </CardContent>
              {progressPercentage === 100 && (
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/dashboard/my-courses/${courseId}/certificate`}>
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
