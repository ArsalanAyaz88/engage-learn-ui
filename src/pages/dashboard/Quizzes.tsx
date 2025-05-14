
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Play, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Quiz, quizService } from "@/services/quizService";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const Quizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // If we have a courseId, fetch quizzes for that course, otherwise show a placeholder
        if (courseId) {
          const data = await quizService.listQuizzes(courseId);
          setQuizzes(data);
        } else {
          // Mock data for demo
          setQuizzes([]);
          toast.info("Select a course to view its quizzes");
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        toast.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  // Function to format time (minutes to hours and minutes)
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground">
              Test your knowledge with course quizzes
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-lg font-semibold">No quizzes available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {courseId 
                  ? "There are no quizzes available for this course at the moment."
                  : "Select a course to view available quizzes."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" /> {quiz.title}
                  </CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Time Limit: {formatTime(quiz.time_limit)}
                      </span>
                    </div>
                    
                    {quiz.is_completed && quiz.score !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Your Score</span>
                          <span className="font-medium">{quiz.score}%</span>
                        </div>
                        <Progress 
                          value={quiz.score} 
                          className="h-2" 
                          indicator={quiz.score >= 70 ? "bg-green-500" : "bg-amber-500"} 
                        />
                      </div>
                    )}
                    
                    <div className="mt-2">
                      {quiz.is_completed ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full" variant={quiz.is_completed ? "outline" : "default"}>
                    {quiz.is_completed ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> View Results
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" /> Start Quiz
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quizzes;
