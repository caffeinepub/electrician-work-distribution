import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  CheckCircle,
  Loader2,
  Star,
  Zap,
  Heart,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetElectricians, useGetWorkOrders, useCreateWorkOrder, useSubmitWorkerRating } from '@/hooks/useQueries';
import { JobApplicationStepper } from '@/components/JobApplicationStepper';
import { RatingInput } from '@/components/RatingInput';
import { toast } from 'sonner';
import { formatTimestamp } from '@/lib/utils';

const SERVICE_TYPES = [
  'Television Repair',
  'AC Repair',
  'Fridge Repair',
  'Ceiling Fan Repair',
  'Table Fan Repair',
];

const EDUCATION_OPTIONS = [
  'Electronic Commerce Engineering',
  'AC Mechanic',
  'Electrical Engineering',
  'ITI (Electrician Trade)',
  'Diploma in Refrigeration & Air Conditioning',
  'Diploma in Electronics & Communication',
  'B.Tech / B.E. (Electronics)',
  'B.Tech / B.E. (Electrical)',
  'Polytechnic Diploma (Electrical)',
  'Polytechnic Diploma (Electronics)',
  'ITI (Wireman Trade)',
  'High School / Secondary',
  'Other',
];

const SPECIALITY_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

const STEP_LABELS = ['Your Info', 'Job Details', 'Confirm'];
const TOTAL_STEPS = 3;

interface ApplicantInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredEducation: string;
}

interface JobSelection {
  serviceType: string;
  speciality: string;
  experience: string;
  coverNote: string;
}

const initialApplicant: ApplicantInfo = {
  name: '',
  email: '',
  phone: '',
  address: '',
  preferredEducation: '',
};

const initialJobSelection: JobSelection = {
  serviceType: '',
  speciality: 'residential',
  experience: '',
  coverNote: '',
};

export default function JobBoard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicant, setApplicant] = useState<ApplicantInfo>(initialApplicant);
  const [jobSelection, setJobSelection] = useState<JobSelection>(initialJobSelection);
  const [submitted, setSubmitted] = useState(false);

  // Rating dialog state
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingWorkOrderId, setRatingWorkOrderId] = useState<bigint | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const { data: electricians = [] } = useGetElectricians();
  const { data: workOrders = [] } = useGetWorkOrders();
  const createWorkOrder = useCreateWorkOrder();
  const submitWorkerRating = useSubmitWorkerRating();

  const appId = encodeURIComponent(window.location.hostname || 'technical-tech');

  const openWorkOrders = workOrders.filter((wo) => wo.status === 'open');
  const completedWorkOrders = workOrders.filter((wo) => wo.status === 'completed');

  const handleApplicantChange = (field: keyof ApplicantInfo, value: string) => {
    setApplicant((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobChange = (field: keyof JobSelection, value: string) => {
    setJobSelection((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!applicant.name || !applicant.email) {
        toast.error('Please fill in your name and email.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!jobSelection.serviceType) {
        toast.error('Please select a service type.');
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const availableElectrician = electricians.find((e) => e.isAvailable);
    if (!availableElectrician) {
      toast.error('No available positions at the moment. Please try again later.');
      return;
    }

    try {
      await createWorkOrder.mutateAsync({
        title: `Job Application: ${jobSelection.serviceType}`,
        description: jobSelection.coverNote || `Application for ${jobSelection.serviceType} technician role.`,
        location: applicant.address,
        priority: BigInt(1),
        issuedElectrician: availableElectrician.id,
        customerEmail: applicant.email,
        customerAddress: applicant.address,
        paymentAmount: BigInt(0),
        paymentMethod: 'Cash',
        preferredEducation: applicant.preferredEducation,
      });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application.';
      toast.error(msg);
    }
  };

  const openRatingDialog = (workOrderId: bigint) => {
    setRatingWorkOrderId(workOrderId);
    setRatingValue(0);
    setRatingComment('');
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!ratingWorkOrderId || ratingValue < 1) {
      toast.error('Please select a rating (1–5 stars).');
      return;
    }
    try {
      await submitWorkerRating.mutateAsync({
        workOrderId: ratingWorkOrderId,
        rating: BigInt(ratingValue),
        comment: ratingComment,
      });
      toast.success('Rating submitted!');
      setRatingDialogOpen(false);
      setRatingWorkOrderId(null);
      setRatingValue(0);
      setRatingComment('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit rating.';
      toast.error(msg);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setApplicant(initialApplicant);
    setJobSelection(initialJobSelection);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-wide uppercase">
              Technical Tech
            </span>
          </Link>
          <Link to="/services">
            <Button variant="outline" size="sm">Request a Service</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-card border-b border-border py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Worker Job Apply
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Join our team of skilled technicians. Apply for open positions and grow your career.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-10">
        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Thank you for applying. Our team will review your application and get back to you.
                  </p>
                  <Button onClick={resetForm} variant="outline">
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <JobApplicationStepper
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={STEP_LABELS}
                  />

                  {/* Step 1: Applicant Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> Personal Information
                      </h3>

                      <div className="space-y-1.5">
                        <Label htmlFor="name">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={applicant.name}
                          onChange={(e) => handleApplicantChange('name', e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email">
                          <Mail className="w-3.5 h-3.5 inline mr-1" />
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={applicant.email}
                          onChange={(e) => handleApplicantChange('email', e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone">
                          <Phone className="w-3.5 h-3.5 inline mr-1" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={applicant.phone}
                          onChange={(e) => handleApplicantChange('phone', e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="address">
                          <MapPin className="w-3.5 h-3.5 inline mr-1" />
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Your full address"
                          value={applicant.address}
                          onChange={(e) => handleApplicantChange('address', e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>
                          <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
                          Preferred Education / Qualification
                        </Label>
                        <Select
                          value={applicant.preferredEducation}
                          onValueChange={(v) => handleApplicantChange('preferredEducation', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            {EDUCATION_OPTIONS.map((edu) => (
                              <SelectItem key={edu} value={edu}>
                                {edu}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button onClick={handleNext}>
                          Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Job Selection */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" /> Job Details
                      </h3>

                      <div className="space-y-1.5">
                        <Label>
                          Service Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={jobSelection.serviceType}
                          onValueChange={(v) => handleJobChange('serviceType', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_TYPES.map((svc) => (
                              <SelectItem key={svc} value={svc}>
                                {svc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Speciality Area</Label>
                        <Select
                          value={jobSelection.speciality}
                          onValueChange={(v) => handleJobChange('speciality', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SPECIALITY_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          min="0"
                          placeholder="e.g. 3"
                          value={jobSelection.experience}
                          onChange={(e) => handleJobChange('experience', e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="coverNote">Cover Note</Label>
                        <Textarea
                          id="coverNote"
                          placeholder="Tell us about your skills and why you want to join..."
                          value={jobSelection.coverNote}
                          onChange={(e) => handleJobChange('coverNote', e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-between pt-2">
                        <Button variant="outline" onClick={handleBack}>
                          <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                        <Button onClick={handleNext}>
                          Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" /> Review & Submit
                      </h3>

                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span className="font-medium text-foreground">{applicant.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email</span>
                          <span className="font-medium text-foreground">{applicant.email}</span>
                        </div>
                        {applicant.phone && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone</span>
                            <span className="font-medium text-foreground">{applicant.phone}</span>
                          </div>
                        )}
                        {applicant.preferredEducation && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Education</span>
                            <span className="font-medium text-foreground">{applicant.preferredEducation}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service Type</span>
                          <span className="font-medium text-foreground">{jobSelection.serviceType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speciality</span>
                          <span className="font-medium text-foreground capitalize">{jobSelection.speciality}</span>
                        </div>
                        {jobSelection.experience && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Experience</span>
                            <span className="font-medium text-foreground">{jobSelection.experience} years</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-2">
                        <Button variant="outline" onClick={handleBack}>
                          <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                        <Button onClick={handleSubmit} disabled={createWorkOrder.isPending}>
                          {createWorkOrder.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Open Work Orders */}
        {openWorkOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Open Positions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {openWorkOrders.map((wo) => {
                const elec = electricians.find((e) => e.id === wo.issuedElectrician);
                return (
                  <Card key={String(wo.id)} className="border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground text-sm leading-tight">{wo.title}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">Open</Badge>
                      </div>
                      {wo.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{wo.description}</p>
                      )}
                      {elec && (
                        <p className="text-xs text-muted-foreground">
                          Technician: <span className="text-foreground font-medium">{elec.name}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(wo.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed Work Orders */}
        {completedWorkOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Completed Jobs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedWorkOrders.map((wo) => {
                const elec = electricians.find((e) => e.id === wo.issuedElectrician);
                return (
                  <Card key={String(wo.id)} className="border-border">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground text-sm leading-tight">{wo.title}</h3>
                        <Badge variant="secondary" className="text-xs shrink-0">Done</Badge>
                      </div>
                      {elec && (
                        <p className="text-xs text-muted-foreground">
                          Technician: <span className="text-foreground font-medium">{elec.name}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(wo.createdAt)}
                      </p>
                      {!wo.workerRating && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => openRatingDialog(wo.id)}
                        >
                          <Star className="w-3 h-3 mr-1" /> Rate Technician
                        </Button>
                      )}
                      {wo.workerRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-muted-foreground">
                            Rated {String(wo.workerRating.rating)}/5
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Rating Dialog */}
      {ratingDialogOpen && ratingWorkOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-md border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" /> Rate Technician
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RatingInput
                value={ratingValue}
                onChange={setRatingValue}
                comment={ratingComment}
                onCommentChange={setRatingComment}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setRatingDialogOpen(false);
                    setRatingWorkOrderId(null);
                    setRatingValue(0);
                    setRatingComment('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitRating}
                  disabled={submitWorkerRating.isPending || ratingValue < 1}
                >
                  {submitWorkerRating.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rating'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-5 px-4 text-center mt-auto">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Built with <Heart className="w-3 h-3 text-primary fill-primary" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
