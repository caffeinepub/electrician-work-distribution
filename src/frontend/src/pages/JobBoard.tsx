import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Camera,
  CheckCircle2,
  Clock,
  GraduationCap,
  IndianRupee,
  Loader2,
  MapPin,
  PartyPopper,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { JobApplicationStepper } from "../components/JobApplicationStepper";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type WorkOrder,
  useApplyToWorkOrder,
  useGetAllWorkOrders,
  useIsSubscribedToJobAlerts,
  useSubscribeToJobAlerts,
} from "../hooks/useQueries";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ─── Form Types ─────────────────────────────────────────────────────────────

interface Step1Data {
  fullName: string;
  fatherName: string;
  dob: string;
  addressLine1: string;
  addressLine2: string;
  mobileNo: string;
  gmailId: string;
}

interface Step2Data {
  academicQualification: string;
  otherQualification: string;
  workExperience: string;
  workingTime: string;
  jobType: "part-time" | "full-time" | "";
}

interface Step3Data {
  salaryPerMonth: string;
  salaryPerWeek: string;
  salaryPerDay: string;
  photo: File | null;
  photoPreview: string | null;
}

const emptyStep1: Step1Data = {
  fullName: "",
  fatherName: "",
  dob: "",
  addressLine1: "",
  addressLine2: "",
  mobileNo: "",
  gmailId: "",
};

const emptyStep2: Step2Data = {
  academicQualification: "",
  otherQualification: "",
  workExperience: "",
  workingTime: "",
  jobType: "",
};

const emptyStep3: Step3Data = {
  salaryPerMonth: "",
  salaryPerWeek: "",
  salaryPerDay: "",
  photo: null,
  photoPreview: null,
};

const STEP_LABELS = [
  "Personal Details",
  "Professional Details",
  "Salary & Photo",
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function JobBoard() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: workOrders = [], isLoading: ordersLoading } =
    useGetAllWorkOrders();
  const { data: isSubscribed, isLoading: subLoading } =
    useIsSubscribedToJobAlerts();
  const applyMutation = useApplyToWorkOrder();
  const subscribeMutation = useSubscribeToJobAlerts();

  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(
    null,
  );
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationConfirmed, setApplicationConfirmed] = useState(false);

  // multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [step1, setStep1] = useState<Step1Data>(emptyStep1);
  const [step2, setStep2] = useState<Step2Data>(emptyStep2);
  const [step3, setStep3] = useState<Step3Data>(emptyStep3);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const photoInputRef = useRef<HTMLInputElement>(null);

  const openJobs = workOrders.filter((wo) => wo.status === "open");
  const selectedOrder = workOrders.find((wo) => wo.id === selectedWorkOrderId);

  const handleApplyClick = (workOrderId: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs.");
      return;
    }
    setSelectedWorkOrderId(workOrderId);
    setApplicationConfirmed(false);
    setCurrentStep(1);
    setStep1(emptyStep1);
    setStep2(emptyStep2);
    setStep3(emptyStep3);
    setErrors({});
    setApplyDialogOpen(true);
  };

  const handleDialogClose = () => {
    setApplyDialogOpen(false);
    setSelectedWorkOrderId(null);
    setApplicationConfirmed(false);
    setCurrentStep(1);
    setErrors({});
    // revoke preview URL
    if (step3.photoPreview) URL.revokeObjectURL(step3.photoPreview);
  };

  // ── Validation ──────────────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!step1.fullName.trim()) errs.fullName = "Full name is required";
    if (!step1.fatherName.trim()) errs.fatherName = "Father name is required";
    if (!step1.dob) errs.dob = "Date of birth is required";
    if (!step1.addressLine1.trim())
      errs.addressLine1 = "Address Line 1 is required";
    if (!step1.mobileNo.trim()) errs.mobileNo = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(step1.mobileNo.trim()))
      errs.mobileNo = "Enter a valid 10-digit mobile number";
    if (!step1.gmailId.trim()) errs.gmailId = "Gmail ID is required";
    else if (!/^[\w.+\-]+@gmail\.com$/.test(step1.gmailId.trim()))
      errs.gmailId = "Enter a valid Gmail address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!step2.academicQualification)
      errs.academicQualification = "Please select a qualification";
    if (
      step2.academicQualification === "Other" &&
      !step2.otherQualification.trim()
    )
      errs.otherQualification = "Please specify your qualification";
    if (!step2.workExperience)
      errs.workExperience = "Please select work experience";
    if (!step2.workingTime) errs.workingTime = "Please select working time";
    if (!step2.jobType) errs.jobType = "Please select job type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!step3.photo) errs.photo = "Please upload a photo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((p) => Math.max(1, p - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    if (!selectedWorkOrderId) return;
    try {
      await applyMutation.mutateAsync({ workOrderId: selectedWorkOrderId });
      toast.success("Application Confirmed! You're on the waiting list.", {
        duration: 4000,
        icon: <PartyPopper className="w-4 h-4 text-green-500" />,
      });
      setApplicationConfirmed(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit application.");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be under 1MB" }));
      e.target.value = "";
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (step3.photoPreview) URL.revokeObjectURL(step3.photoPreview);
    setStep3((prev) => ({ ...prev, photo: file, photoPreview: previewUrl }));
    setErrors((prev) => {
      const { photo: _removed, ...next } = prev;
      return next;
    });
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe to job alerts.");
      login();
      return;
    }
    try {
      await subscribeMutation.mutateAsync();
      toast.success("Successfully subscribed to job alerts!", {
        duration: 2000,
        icon: <CheckCircle2 className="text-green-500 w-4 h-4" />,
      });
    } catch (err: any) {
      const msg = err?.message ?? "Failed to subscribe to job alerts.";
      if (msg.includes("already subscribed")) {
        toast.info("You are already subscribed to job alerts.");
      } else {
        toast.error(msg, { duration: 2000 });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-primary" />
                Job Board
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse open service requests and apply to work on them.
              </p>
              <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-xs font-medium w-fit">
                <GraduationCap className="w-3.5 h-3.5" />
                Any ITI Course Learning Accepted — All qualified workers
                welcome!
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!subLoading && isSubscribed ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                  <Bell className="w-4 h-4" />
                  Alerts Active
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending || subLoading}
                  className="flex items-center gap-2"
                  data-ocid="jobboard.subscribe.button"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  {subscribeMutation.isPending
                    ? "Subscribing..."
                    : "Get Job Alerts"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {ordersLoading ? (
          <div
            className="flex items-center justify-center py-20"
            data-ocid="jobboard.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : openJobs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="jobboard.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Open Jobs Right Now
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              There are no open service requests at the moment.
            </p>

            <div className="w-full max-w-md mb-4 p-4 rounded-xl border border-primary/30 bg-primary/5 text-left">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Subscribe to Job Alerts
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Subscribe to job alerts so we can notify you the moment new
                    jobs are posted.
                  </p>
                  {!isSubscribed ? (
                    <Button
                      size="sm"
                      onClick={handleSubscribe}
                      disabled={subscribeMutation.isPending}
                      className="mt-3 flex items-center gap-2"
                      data-ocid="jobboard.subscribe.primary_button"
                    >
                      {subscribeMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Bell className="w-3.5 h-3.5" />
                      )}
                      {subscribeMutation.isPending
                        ? "Subscribing..."
                        : "Subscribe to Job Alerts"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      You're subscribed! We'll notify you of new jobs.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full max-w-md p-4 rounded-xl border border-green-500/30 bg-green-500/5 text-left">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Already Applied? No Worries!
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your application is confirmed and you're on the waiting
                    list.
                  </p>
                  <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Application Confirmed — Waiting List
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {openJobs.length}
                </span>{" "}
                open {openJobs.length === 1 ? "job" : "jobs"} available
              </p>
            </div>
            <div className="grid gap-4">
              {openJobs.map((job, idx) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={idx + 1}
                  isAuthenticated={isAuthenticated}
                  onApply={() => handleApplyClick(job.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── Multi-step Apply Dialog ─────────────────────────────────────────── */}
      <Dialog open={applyDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent
          className="max-w-lg w-full overflow-y-auto max-h-[85vh] p-0"
          data-ocid="jobboard.dialog"
        >
          {applicationConfirmed ? (
            /* ── Success Screen ───────────────────────── */
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center py-4 gap-3">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <PartyPopper className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-bold text-xl text-foreground">
                  You're on the Waiting List!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your application is confirmed. We will alert you when a job is
                  assigned to you.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 flex items-start gap-2">
                <Bell className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Job Alert:</strong> You
                  will receive an alert as soon as this job is assigned to you.
                  No need to keep checking!
                </p>
              </div>
              <Button
                onClick={handleDialogClose}
                className="w-full"
                data-ocid="jobboard.confirm_button"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Got it, I'm on the list!
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-500/40 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  handleDialogClose();
                  window.location.href = "/admin/electricians";
                }}
                data-ocid="jobboard.secondary_button"
              >
                <Users className="w-4 h-4 mr-2" />
                Add Electrician Profile
              </Button>
            </div>
          ) : (
            /* ── Multi-step Form ──────────────────────── */
            <div className="flex flex-col">
              {/* Dialog Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Job Application
                  </DialogTitle>
                </DialogHeader>
                {selectedOrder && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    Applying for:{" "}
                    <span className="font-medium text-foreground">
                      {selectedOrder.title}
                    </span>
                  </p>
                )}
              </div>

              {/* Stepper */}
              <div className="px-6 pt-4">
                <JobApplicationStepper
                  currentStep={currentStep}
                  totalSteps={3}
                  stepLabels={STEP_LABELS}
                />
              </div>

              {/* Step Content */}
              <div className="px-6 py-4 flex-1">
                {currentStep === 1 && (
                  <Step1Form data={step1} onChange={setStep1} errors={errors} />
                )}
                {currentStep === 2 && (
                  <Step2Form data={step2} onChange={setStep2} errors={errors} />
                )}
                {currentStep === 3 && (
                  <Step3Form
                    data={step3}
                    onChange={setStep3}
                    errors={errors}
                    photoInputRef={photoInputRef}
                    onPhotoChange={handlePhotoChange}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="px-6 pb-6 pt-2 border-t border-border flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? handleDialogClose : handleBack}
                  disabled={applyMutation.isPending}
                  data-ocid="jobboard.cancel_button"
                >
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    data-ocid="jobboard.primary_button"
                  >
                    Next Step →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={applyMutation.isPending}
                    data-ocid="jobboard.submit_button"
                  >
                    {applyMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Step 1: Personal Details ────────────────────────────────────────────────

function Step1Form({
  data,
  onChange,
  errors,
}: {
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  errors: Record<string, string>;
}) {
  const set =
    (key: keyof Step1Data) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <FormField
        label="Full Name with Initial"
        required
        error={errors.fullName}
      >
        <Input
          placeholder="e.g. A. Velumanickam"
          value={data.fullName}
          onChange={set("fullName")}
          data-ocid="jobboard.input"
        />
      </FormField>

      <FormField label="Father Name" required error={errors.fatherName}>
        <Input
          placeholder="Father's full name"
          value={data.fatherName}
          onChange={set("fatherName")}
          data-ocid="jobboard.input"
        />
      </FormField>

      <FormField label="Date of Birth" required error={errors.dob}>
        <Input
          type="date"
          value={data.dob}
          onChange={set("dob")}
          data-ocid="jobboard.input"
        />
      </FormField>

      <FormField label="Address Line 1" required error={errors.addressLine1}>
        <Input
          placeholder="House/Door No., Street Name"
          value={data.addressLine1}
          onChange={set("addressLine1")}
          data-ocid="jobboard.input"
        />
      </FormField>

      <FormField label="Address Line 2 (Optional)" error={errors.addressLine2}>
        <Input
          placeholder="Area, Landmark"
          value={data.addressLine2}
          onChange={set("addressLine2")}
          data-ocid="jobboard.input"
        />
      </FormField>

      <FormField label="Mobile No" required error={errors.mobileNo}>
        <Input
          type="tel"
          placeholder="10-digit mobile number"
          value={data.mobileNo}
          onChange={set("mobileNo")}
          maxLength={10}
          data-ocid="jobboard.input"
        />
      </FormField>

      <FormField label="Gmail ID" required error={errors.gmailId}>
        <Input
          type="email"
          placeholder="yourname@gmail.com"
          value={data.gmailId}
          onChange={set("gmailId")}
          data-ocid="jobboard.input"
        />
      </FormField>
    </div>
  );
}

// ─── Step 2: Professional Details ───────────────────────────────────────────

function Step2Form({
  data,
  onChange,
  errors,
}: {
  data: Step2Data;
  onChange: (d: Step2Data) => void;
  errors: Record<string, string>;
}) {
  const set = (key: keyof Step2Data, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <FormField
        label="Academic Qualification"
        required
        error={errors.academicQualification}
      >
        <Select
          value={data.academicQualification}
          onValueChange={(v) => set("academicQualification", v)}
        >
          <SelectTrigger data-ocid="jobboard.select">
            <SelectValue placeholder="Select your qualification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ITI Electrician">ITI Electrician</SelectItem>
            <SelectItem value="Diploma">Diploma</SelectItem>
            <SelectItem value="Electrical/Electronic Engineering">
              Electrical/Electronic Engineering
            </SelectItem>
            <SelectItem value="EEE Diploma">EEE Diploma</SelectItem>
            <SelectItem value="Electronic Commerce Engineering">
              Electronic Commerce Engineering
            </SelectItem>
            <SelectItem value="AC Mechanic">AC Mechanic</SelectItem>
            <SelectItem value="10th Pass">10th Pass</SelectItem>
            <SelectItem value="12th Pass">12th Pass</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {data.academicQualification === "Other" && (
        <FormField
          label="Other Qualification"
          required
          error={errors.otherQualification}
        >
          <Input
            placeholder="Specify your qualification"
            value={data.otherQualification}
            onChange={(e) => set("otherQualification", e.target.value)}
            data-ocid="jobboard.input"
          />
        </FormField>
      )}

      <FormField label="Work Experience" required error={errors.workExperience}>
        <Select
          value={data.workExperience}
          onValueChange={(v) => set("workExperience", v)}
        >
          <SelectTrigger data-ocid="jobboard.select">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fresher">Fresher (No Experience)</SelectItem>
            <SelectItem value="Less than 1 Year">Less than 1 Year</SelectItem>
            <SelectItem value="1-2 Years">1–2 Years</SelectItem>
            <SelectItem value="2-5 Years">2–5 Years</SelectItem>
            <SelectItem value="5+ Years">5+ Years</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Working Time" required error={errors.workingTime}>
        <Select
          value={data.workingTime}
          onValueChange={(v) => set("workingTime", v)}
        >
          <SelectTrigger data-ocid="jobboard.select">
            <SelectValue placeholder="Select working hours per day" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((h) => (
              <SelectItem key={h} value={`${h} Hour${h > 1 ? "s" : ""}`}>
                {h} Hour{h > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Job Type" required error={errors.jobType}>
        <RadioGroup
          value={data.jobType}
          onValueChange={(v) => set("jobType", v)}
          className="flex gap-6 pt-1"
          data-ocid="jobboard.radio"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="part-time" id="part-time" />
            <Label htmlFor="part-time" className="cursor-pointer font-normal">
              Part Time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-time" id="full-time" />
            <Label htmlFor="full-time" className="cursor-pointer font-normal">
              Full Time
            </Label>
          </div>
        </RadioGroup>
      </FormField>
    </div>
  );
}

// ─── Step 3: Salary & Photo ───────────────────────────────────────────────────

function Step3Form({
  data,
  onChange,
  errors,
  photoInputRef,
  onPhotoChange,
}: {
  data: Step3Data;
  onChange: (d: Step3Data) => void;
  errors: Record<string, string>;
  photoInputRef: React.RefObject<HTMLInputElement | null>;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const set =
    (key: keyof Step3Data) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-5">
      {/* Salary Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <IndianRupee className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">
            Required Salary
          </span>
          <span className="text-xs text-green-600 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
            If you work, you get paid
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Per Month (₹)">
            <Input
              type="number"
              placeholder="e.g. 15000"
              min={0}
              value={data.salaryPerMonth}
              onChange={set("salaryPerMonth")}
              data-ocid="jobboard.input"
            />
          </FormField>
          <FormField label="Per Week (₹)">
            <Input
              type="number"
              placeholder="e.g. 3500"
              min={0}
              value={data.salaryPerWeek}
              onChange={set("salaryPerWeek")}
              data-ocid="jobboard.input"
            />
          </FormField>
          <FormField label="Per Day (₹)">
            <Input
              type="number"
              placeholder="e.g. 500"
              min={0}
              value={data.salaryPerDay}
              onChange={set("salaryPerDay")}
              data-ocid="jobboard.input"
            />
          </FormField>
        </div>
      </div>

      {/* Photo Upload */}
      <FormField label="Upload Photo" required error={errors.photo}>
        <div className="flex items-start gap-4">
          {/* Preview circle */}
          <button
            type="button"
            aria-label="Select profile picture"
            className="w-20 h-20 rounded-full border-2 border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-primary/60 transition-colors"
            onClick={() => photoInputRef.current?.click()}
          >
            {data.photoPreview ? (
              <img
                src={data.photoPreview}
                alt="Uploaded worker headshot"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-7 h-7 text-muted-foreground" />
            )}
          </button>

          <div className="flex-1 space-y-2">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              className="w-full flex items-center gap-2"
              data-ocid="jobboard.upload_button"
            >
              <Camera className="w-4 h-4" />
              {data.photo ? "Change Photo" : "Choose Photo"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Max size: <strong>1 MB</strong>. Accepted: JPG, PNG, etc.
            </p>
            {data.photo && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {data.photo.name}
              </p>
            )}
          </div>
        </div>
      </FormField>

      {/* ITI notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          All ITI course learners and related education backgrounds are
          accepted. Your application will be reviewed and you'll be placed on
          the waiting list.
        </p>
      </div>
    </div>
  );
}

// ─── Reusable Field Wrapper ───────────────────────────────────────────────────

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p
          className="text-xs text-destructive flex items-center gap-1"
          data-ocid="jobboard.error_state"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: WorkOrder;
  index: number;
  isAuthenticated: boolean;
  onApply: () => void;
}

function JobCard({ job, index, isAuthenticated, onApply }: JobCardProps) {
  return (
    <Card
      className="hover:border-primary/40 transition-colors"
      data-ocid={`jobboard.item.${index}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {job.description}
            </CardDescription>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xl font-bold text-primary">₹1150</div>
            <div className="text-xs text-muted-foreground">
              Service Earnings
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(job.createdAt)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={job.priority} />
            <StatusBadge status={job.status} />
            {job.preferredEducation ? (
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1 border-green-500/40 text-green-700 dark:text-green-400"
              >
                <GraduationCap className="w-3 h-3" />
                Any ITI Course Accepted
              </Badge>
            ) : null}
          </div>

          <Button
            size="sm"
            onClick={onApply}
            disabled={!isAuthenticated}
            className="shrink-0 font-semibold"
            title={!isAuthenticated ? "Log in to apply" : "Apply for this job"}
            data-ocid={`jobboard.item.${index}`}
          >
            Apply Now
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground mt-2">
            Please log in to apply for jobs.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
