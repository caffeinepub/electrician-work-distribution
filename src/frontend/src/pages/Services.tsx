import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  CalendarCheck,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Refrigerator,
  Tv,
  Wind,
  Zap,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ElectricianQualification } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateFixedPriceWorkOrder } from "../hooks/useQueries";

const SERVICE_TYPES = [
  {
    id: "electronicRepair",
    label: "Electronic Repair",
    description: "TV, washing machine, and other electronic appliances",
    icon: Tv,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "acTechnician",
    label: "AC Technician",
    description: "Air conditioner installation, repair, and servicing",
    icon: Wind,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    id: "fridgeRepairWork",
    label: "Fridge Repair",
    description: "Refrigerator repair and maintenance",
    icon: Refrigerator,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    id: "electrician",
    label: "Electrician",
    description: "Wiring, switches, sockets, and electrical faults",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low — Within a week" },
  { value: "medium", label: "Medium — Within 2–3 days" },
  { value: "high", label: "High — Within 24 hours" },
  { value: "urgent", label: "Urgent — ASAP" },
];

const QUALIFICATION_OPTIONS = [
  { value: ElectricianQualification.itiElectrician, label: "ITI Electrician" },
  {
    value: ElectricianQualification.electronicElectricalEngineering,
    label: "Electronic Electrical Engineering",
  },
  { value: ElectricianQualification.eeeDiploma, label: "EEE Diploma" },
];

const SERVICE_COST = 1150;
const BOOKING_CHARGE = 50;
const TOTAL_PRICE = SERVICE_COST + BOOKING_CHARGE;
const UPI_ID = "8015393383@fam";

export default function Services() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const createMutation = useCreateFixedPriceWorkOrder();
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const [selectedService, setSelectedService] = useState<string>("");
  const [form, setForm] = useState({
    description: "",
    location: "",
    priority: "medium",
    customerEmail: "",
    customerAddress: "",
    customerContactNumber: "",
    paymentMethod: "upi",
    preferredEducation: ElectricianQualification.itiElectrician,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleBookService = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a service.");
      login();
      return;
    }
    bookingFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to book a service.");
      return;
    }
    if (!selectedService) {
      toast.error("Please select a service type.");
      return;
    }

    const serviceLabel =
      SERVICE_TYPES.find((s) => s.id === selectedService)?.label ??
      selectedService;

    try {
      await createMutation.mutateAsync({
        title: serviceLabel,
        description: form.description,
        location: form.location,
        priority: form.priority as any,
        customerEmail: form.customerEmail,
        customerAddress: form.customerAddress,
        customerContactNumber: form.customerContactNumber,
        paymentMethod: form.paymentMethod,
        preferredEducation: form.preferredEducation,
      });
      setSubmitted(true);
      toast.success("Service booked successfully!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to book service.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your service request has been submitted. An admin will review and
            assign a technician shortly.
          </p>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6 text-left space-y-3">
            <p className="text-sm font-semibold text-foreground mb-2">
              Price Breakdown
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Cost</span>
              <span className="font-medium text-foreground">
                ₹{SERVICE_COST}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Booking Charge (online)
              </span>
              <span className="font-medium text-foreground">
                ₹{BOOKING_CHARGE}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">
                ₹{TOTAL_PRICE}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Booking charge ₹{BOOKING_CHARGE} to be paid online via UPI:{" "}
              <span className="font-medium text-foreground">{UPI_ID}</span>
            </p>
          </div>
          <Button onClick={() => setSubmitted(false)}>
            Book Another Service
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero / CTA Banner */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Our Services
              </h1>
              <p className="text-muted-foreground mt-1 max-w-lg">
                Professional home appliance repair and electrical services at a
                flat rate of{" "}
                <span className="text-primary font-semibold">
                  ₹{TOTAL_PRICE}
                </span>{" "}
                (₹{SERVICE_COST} service + ₹{BOOKING_CHARGE} booking charge).
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleBookService}
              className="flex items-center gap-2 shrink-0 font-semibold"
            >
              <CalendarCheck className="w-5 h-5" />
              Book a Service
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* Service Cards Grid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Available Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_TYPES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(service.id);
                    if (isAuthenticated) {
                      bookingFormRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className={`relative text-left p-5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
                  }`}
                >
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-sm px-2 py-0.5">
                      ₹{TOTAL_PRICE}
                    </Badge>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-lg ${service.bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {service.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Booking Form */}
        <section ref={bookingFormRef}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Book a Service
            </h2>
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </div>

          {!isAuthenticated ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CalendarCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Login Required
                </h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                  Please log in to book a service. It only takes a moment.
                </p>
                <Button onClick={login}>Log In to Book</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Service Booking Form</CardTitle>
                <CardDescription>
                  Fill in the details below to request a service. Total:{" "}
                  <span className="text-primary font-bold">₹{TOTAL_PRICE}</span>{" "}
                  (₹{SERVICE_COST} service + ₹{BOOKING_CHARGE} booking charge)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label>Service Type *</Label>
                    <Select
                      value={selectedService}
                      onValueChange={setSelectedService}
                    >
                      <SelectTrigger data-ocid="service.select">
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Problem Description *</Label>
                    <Textarea
                      id="description"
                      data-ocid="service.textarea"
                      placeholder="Describe the issue in detail..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Service Location *</Label>
                    <Input
                      id="location"
                      data-ocid="service.input"
                      placeholder="City / Area"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={form.priority}
                      onValueChange={(v) => setForm({ ...form, priority: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.customerEmail}
                      onChange={(e) =>
                        setForm({ ...form, customerEmail: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Customer Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Your Address *</Label>
                    <Input
                      id="address"
                      placeholder="Full address for the technician"
                      value={form.customerAddress}
                      onChange={(e) =>
                        setForm({ ...form, customerAddress: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.customerContactNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          customerContactNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Preferred Qualification */}
                  <div className="space-y-2">
                    <Label>Preferred Technician Qualification</Label>
                    <Select
                      value={form.preferredEducation}
                      onValueChange={(v) =>
                        setForm({
                          ...form,
                          preferredEducation: v as ElectricianQualification,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALIFICATION_OPTIONS.map((q) => (
                          <SelectItem key={q.value} value={q.value}>
                            {q.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={form.paymentMethod}
                      onValueChange={(v) =>
                        setForm({ ...form, paymentMethod: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cost Summary */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Price Breakdown
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Service Cost
                      </span>
                      <div className="flex items-center gap-0.5 font-medium text-foreground">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {SERVICE_COST}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Booking Charge (online)
                      </span>
                      <div className="flex items-center gap-0.5 font-medium text-foreground">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {BOOKING_CHARGE}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">Total</p>
                      <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                        <IndianRupee className="w-5 h-5" />
                        {TOTAL_PRICE}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Booking charge ₹{BOOKING_CHARGE} to be paid online via
                      UPI:{" "}
                      <span className="font-medium text-foreground">
                        {UPI_ID}
                      </span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    data-ocid="service.submit_button"
                    className="w-full font-semibold"
                    disabled={createMutation.isPending}
                    size="lg"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        Book Service — ₹{TOTAL_PRICE}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
