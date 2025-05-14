
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { courseService, Course, Curriculum, Outcome, Prerequisite } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";
import { paymentService, BankAccount } from "@/services/paymentService";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  Loader2,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ExploreCourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [description, setDescription] = useState<string>("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>("not_enrolled");
  const [activeTab, setActiveTab] = useState("description");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        // Fetch course data
        const courseData = await courseService.getExploreCoursesDetail(courseId);
        setCourse(courseData);

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

        // Check enrollment status
        try {
          const statusData = await enrollmentService.checkEnrollmentStatus(courseId);
          setEnrollmentStatus(statusData.status);
        } catch (error) {
          console.error("Failed to check enrollment status:", error);
        }

        // Fetch bank accounts
        try {
          const accountsData = await paymentService.getBankAccounts();
          setBankAccounts(accountsData);
        } catch (error) {
          console.error("Failed to load bank accounts:", error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !courseId) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      await enrollmentService.submitPaymentProof(courseId, file);
      toast.success("Payment proof submitted successfully");
      setEnrollmentStatus("pending");
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to submit payment proof:", error);
      toast.error("Failed to submit payment proof");
    } finally {
      setUploading(false);
      setFile(null);
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
            The course you are looking for does not exist.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/dashboard/explore-courses">Back to Explore Courses</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <AspectRatio ratio={21 / 9} className="bg-muted">
            <img
              src={course.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"}
              alt={course.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground mt-2">Instructor: {course.instructor}</p>
                
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{curriculum.reduce((acc, curr) => acc + (curr.lessons || 0), 0)} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Self-paced</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {course.price ? `$${course.price}` : 'Free'}
                </div>
                
                {enrollmentStatus === "not_enrolled" && (
                  course.price ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full md:w-auto">Enroll Now</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Course Enrollment</DialogTitle>
                          <DialogDescription>
                            Complete payment to enroll in this course.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Payment Information</AlertTitle>
                            <AlertDescription>
                              To enroll in this course, please make a payment of ${course.price} to one of the accounts below,
                              then upload a proof of payment.
                            </AlertDescription>
                          </Alert>

                          <div className="space-y-4">
                            <h4 className="font-medium">Bank Account Options:</h4>
                            {bankAccounts.length === 0 ? (
                              <p className="text-muted-foreground">No bank accounts available.</p>
                            ) : (
                              <div className="space-y-3 max-h-40 overflow-y-auto border rounded-md p-3">
                                {bankAccounts.map((account) => (
                                  <div key={account.id} className="p-2 bg-muted/30 rounded">
                                    <div className="font-medium">{account.bank_name}</div>
                                    <div className="text-sm">{account.account_holder}</div>
                                    <div className="text-sm font-mono">{account.account_number}</div>
                                    {account.branch_code && (
                                      <div className="text-sm">Branch: {account.branch_code}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <form onSubmit={handleSubmitPaymentProof}>
                            <div className="space-y-2">
                              <Label htmlFor="payment_proof">Upload Payment Proof</Label>
                              <Input
                                id="payment_proof"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,application/pdf"
                                required
                              />
                              <p className="text-xs text-muted-foreground">
                                Upload a screenshot or PDF of your payment confirmation.
                              </p>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <Button type="submit" disabled={uploading || !file}>
                                {uploading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Submit Payment Proof
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button className="w-full md:w-auto">Enroll for Free</Button>
                  )
                )}
                
                {enrollmentStatus === "pending" && (
                  <Button disabled variant="outline" className="w-full md:w-auto">
                    <Clock className="mr-2 h-4 w-4" />
                    Enrollment Pending
                  </Button>
                )}
                
                {enrollmentStatus === "approved" && (
                  <Button asChild className="w-full md:w-auto">
                    <Link to={`/dashboard/my-courses/${courseId}`}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Go to Course
                    </Link>
                  </Button>
                )}
                
                {enrollmentStatus === "rejected" && (
                  <div className="space-y-2">
                    <Button variant="destructive" className="w-full md:w-auto" disabled>
                      Enrollment Rejected
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your enrollment was rejected. Please contact support for more information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                {description ? (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  <p className="text-muted-foreground">No description available for this course.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="curriculum" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  What you'll learn in this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {curriculum.length === 0 ? (
                  <p className="text-muted-foreground">No curriculum available for this course yet.</p>
                ) : (
                  curriculum.map((section, index) => (
                    <div key={section.id} className={cn("border rounded-md overflow-hidden", index > 0 && "mt-4")}>
                      <div className="bg-muted/30 p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{section.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {section.lessons} lessons · {section.duration}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-card">
                        <p className="text-sm text-muted-foreground">
                          {enrollmentStatus === "approved" ? (
                            "Enroll to access course content"
                          ) : (
                            "Enroll to access full course content"
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outcomes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
                <CardDescription>
                  What you'll be able to do after completing this course
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          
          <TabsContent value="prerequisites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
                <CardDescription>
                  Skills or knowledge required before taking this course
                </CardDescription>
              </CardHeader>
              <CardContent>
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
    </DashboardLayout>
  );
};

export default ExploreCourseDetail;
