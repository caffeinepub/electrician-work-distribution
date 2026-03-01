import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllElectricians, useCreateFixedPriceWorkOrder } from '../hooks/useQueries';
import { ElectricianQualification, RepairServiceType } from '../backend';
import { toast } from 'sonner';
import { Loader2, Zap, Wind, Refrigerator, Wrench, Star, MapPin, Clock, IndianRupee, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SERVICE_TYPES = [
  {
    type: RepairServiceType.electrician,
    label: 'Electrician',
    icon: Zap,
    description: 'Wiring, installations, repairs',
    color: 'text-yellow-500',
  },
  {
    type: RepairServiceType.acTechnician,
    label: 'AC Technician',
    icon: Wind,
    description: 'AC service, repair & installation',
    color: 'text-blue-400',
  },
  {
    type: RepairServiceType.fridgeRepairWork,
    label: 'Fridge Repair',
    icon: Refrigerator,
    description: 'Refrigerator repair & maintenance',
    color: 'text-cyan-400',
  },
  {
    type: RepairServiceType.electronicRepair,
    label: 'Electronic Repair',
    icon: Wrench,
    description: 'Electronics diagnosis & repair',
    color: 'text-purple-400',
  },
];

const QUALIFICATION_OPTIONS = [
  { value: ElectricianQualification.itiElectrician, label: 'ITI Electrician' },
  { value: ElectricianQualification.electronicElectricalEngineering, label: 'Electronic Electrical Engineering' },
  { value: ElectricianQualification.eeeDiploma, label: 'EEE Diploma' },
];

const FIXED_PRICE = 50;

export default function Services() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: electricians, isLoading: electriciansLoading } = useGetAllElectricians();
  const createFixedPriceWorkOrder = useCreateFixedPriceWorkOrder();

  const [selectedService, setSelectedService] = useState<RepairServiceType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    customerEmail: '',
    customerAddress: '',
    customerContactNumber: '',
    paymentMethod: 'cash',
    preferredEducation: ElectricianQualification.itiElectrician,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<bigint | null>(null);

  const availableElectricians = electricians?.filter((e) => e.isAvailable) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      toast.error('Please select a service type');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to book a service');
      return;
    }

    try {
      const orderId = await createFixedPriceWorkOrder.mutateAsync({
        title: `${SERVICE_TYPES.find((s) => s.type === selectedService)?.label ?? 'Service'} Request`,
        description: formData.description,
        location: formData.location,
        priority: BigInt(2),
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        customerContactNumber: formData.customerContactNumber,
        paymentMethod: formData.paymentMethod,
        preferredEducation: formData.preferredEducation,
      });

      setSubmittedOrderId(orderId);
      setSubmitted(true);
      toast.success(`Service booked successfully! Fixed price: ₹${FIXED_PRICE}`, {
        description: 'Your request has been submitted and is pending admin verification.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to book service';
      toast.error('Booking failed', { description: message });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-lg mx-auto mt-16">
          <Card className="border-primary/30 bg-card">
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-1">
                  Order #{submittedOrderId?.toString()} has been submitted.
                </p>
                <p className="text-muted-foreground text-sm">
                  Your service request is pending admin verification. Once verified, an electrician will be assigned.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-4 py-3 w-full justify-center">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-primary">₹{FIXED_PRICE}</span>
                <span className="text-muted-foreground text-sm">Fixed Service Price</span>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedOrderId(null);
                    setSelectedService(null);
                    setFormData({
                      title: '',
                      description: '',
                      location: '',
                      customerEmail: '',
                      customerAddress: '',
                      customerContactNumber: '',
                      paymentMethod: 'cash',
                      preferredEducation: ElectricianQualification.itiElectrician,
                    });
                  }}
                >
                  Book Another
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => { window.location.href = '/my-bookings'; }}
                >
                  View My Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-card to-background border-b border-border px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
            Fixed Price ₹{FIXED_PRICE}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Book a Service
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Professional electrical and appliance repair services at a fixed price of ₹{FIXED_PRICE}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Type Selection */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">Select Service Type</CardTitle>
              <CardDescription>Choose the type of service you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {SERVICE_TYPES.map((service) => {
                  const Icon = service.icon;
                  const isSelected = selectedService === service.type;
                  return (
                    <button
                      key={service.type}
                      type="button"
                      onClick={() => setSelectedService(service.type)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary' : service.color}`} />
                      <p className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {service.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">Service Details</CardTitle>
              <CardDescription>Fill in your contact and service information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="customerContactNumber">Contact Number *</Label>
                    <Input
                      id="customerContactNumber"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.customerContactNumber}
                      onChange={(e) => setFormData({ ...formData, customerContactNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customerAddress">Your Address *</Label>
                  <Input
                    id="customerAddress"
                    placeholder="House/Flat No., Street, Area"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Service Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Problem Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="preferredEducation">Preferred Qualification</Label>
                    <Select
                      value={formData.preferredEducation}
                      onValueChange={(val) =>
                        setFormData({ ...formData, preferredEducation: val as ElectricianQualification })
                      }
                    >
                      <SelectTrigger id="preferredEducation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALIFICATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                    >
                      <SelectTrigger id="paymentMethod">
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
                </div>

                {/* Fixed Price Display */}
                <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <IndianRupee className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Fixed Service Price</p>
                    <p className="text-xs text-muted-foreground">All-inclusive, no hidden charges</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">₹{FIXED_PRICE}</div>
                </div>

                {!isAuthenticated && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-600 dark:text-yellow-400">
                    Please log in to book a service.
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createFixedPriceWorkOrder.isPending || !isAuthenticated || !selectedService}
                >
                  {createFixedPriceWorkOrder.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {createFixedPriceWorkOrder.isPending ? 'Booking...' : `Confirm Booking — ₹${FIXED_PRICE}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-4">
          {/* Price Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Fixed Service Price</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <span className="text-4xl font-bold text-primary">{FIXED_PRICE}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">All-inclusive · No hidden charges</p>
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { step: '1', text: 'Select service & fill details' },
                { step: '2', text: 'Admin verifies your request' },
                { step: '3', text: 'Electrician gets assigned' },
                { step: '4', text: 'Service completed & pay ₹50' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{item.step}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Technicians */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground flex items-center gap-2">
                <span>Available Technicians</span>
                {electriciansLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableElectricians.length === 0 ? (
                <p className="text-xs text-muted-foreground">No technicians available right now.</p>
              ) : (
                <div className="space-y-2">
                  {availableElectricians.slice(0, 4).map((e) => (
                    <div key={e.id.toString()} className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {e.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{e.name}</p>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">{e.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-muted-foreground">4.8</span>
                      </div>
                    </div>
                  ))}
                  {availableElectricians.length > 4 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      +{availableElectricians.length - 4} more available
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timing */}
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Service within <strong className="text-foreground">24–48 hours</strong> of booking</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 mt-8">
        <div className="max-w-5xl mx-auto text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Technical Tech · Built with{' '}
            <span className="text-red-500">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
