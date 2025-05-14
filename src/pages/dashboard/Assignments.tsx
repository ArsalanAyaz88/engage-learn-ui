
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Clock, AlertCircle } from "lucide-react";
import { Assignment, assignmentService } from "@/services/assignmentService";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // If we have a courseId, fetch assignments for that course, otherwise fetch all
        const data = await assignmentService.getAssignments(courseId || "all");
        setAssignments(data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground">
              View and manage your course assignments
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
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="pt-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-lg font-semibold">No assignments yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no assignments available for your courses at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> {assignment.title}
                  </CardTitle>
                  <CardDescription>Due: {formatDate(assignment.due_date)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm line-clamp-2">{assignment.description}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Max Score: {assignment.max_score} points
                      </span>
                    </div>
                    <div className="mt-2">
                      {assignment.is_submitted ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Submitted
                        </Badge>
                      ) : new Date(assignment.due_date) < new Date() ? (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          Overdue
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full" variant={assignment.is_submitted ? "outline" : "default"}>
                    {assignment.is_submitted ? (
                      "View Submission"
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Submit Assignment
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

export default Assignments;
