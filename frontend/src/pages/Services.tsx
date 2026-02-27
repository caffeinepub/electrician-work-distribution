import { useState } from 'react';
import { Wrench, Wind, Refrigerator, Zap, CheckCircle, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetAllElectricians, useCreateWorkOrder } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { ElectricianQualification } from '../backend';
import { getSpecialityLabel, getQualificationLabel } from '../lib/utils';

const SERVICE_TYPES = [
  { id: 'electronicRepair', label: 'Electronic Repair', icon: Wrench, desc: 'TV, audio, and electronics repair' },
  { id: 'acTechnician', label: 'AC Technician', icon: Wind, desc: 'Air conditioning service and repair' },
  { id: 'fridgeRepairWork', label: 'Fridge Repair', icon: Refrigerator, desc: 'Refrigerator and freezer repair' },
  { id: 'electrician', label: 'Electrician', icon: Zap, desc: 'Electrical wiring and installation' },
];

const QUALIFICATION_OPTIONS = [
  { value: ElectricianQualification.itiElectrician, label: 'ITI Electrician' },
  { value: ElectricianQualification.electronicElectricalEngineering, label: 'Electronic Electrical Engineering' },
  { value: ElectricianQualification.eeeDiploma, label: 'EEE Diploma' },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: '2',
    customerEmail: '',
    customerAddress: '',
    customerContactNumber: '',
    paymentAmount: '',
    paymentMethod: 'cash',
    preferredEducation: 'none',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { isFetching: actorFetching } = useActor();
  const { data: electricians = [] } = useGetAllElectricians();
  const createWorkOrder = useCreateWorkOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedService) {
      setError('Please select a service type.');
      return;
    }

    // Determine the preferredEducation value — default to itiElectrician if none selected
    const preferredEducation: ElectricianQualification =
      form.preferredEducation !== 'none'
        ? (form.preferredEducation as ElectricianQualification)
        : ElectricianQualification.itiElectrician;

    try {
      await createWorkOrder.mutateAsync({
        title: form.title || selectedService,
        description: form.description,
        location: form.location,
        priority: BigInt(form.priority),
        issuedElectrician: null,
        customerEmail: form.customerEmail,
        customerAddress: form.customerAddress,
        customerContactNumber: form.customerContactNumber,
        paymentAmount: BigInt(Math.round(parseFloat(form.paymentAmount || '0') * 100)),
        paymentMethod: form.paymentMethod,
        preferredEducation,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({
      title: '',
      description: '',
      location: '',
      priority: '2',
      customerEmail: '',
      customerAddress: '',
      customerContactNumber: '',
      paymentAmount: '',
      paymentMethod: 'cash',
      preferredEducation: 'none',
    });
    setSelectedService('');
    setError('');
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md">
          <div className="rounded-full bg-green-500/10 p-4 w-fit mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your service request has been submitted successfully. Our team will review and assign a technician shortly.
          </p>
          <Button onClick={resetForm}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  // Show a loading state while the actor is initializing
  if (actorFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading service booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Book a Service</h1>
        <p className="text-muted-foreground">Select a service type and fill in the details to submit your request.</p>
      </div>

      {/* Service Type Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">1. Select Service Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SERVICE_TYPES.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
                }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="font-medium text-sm">{service.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{service.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Technicians */}
      {electricians.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">2. Available Technicians</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {electricians.filter(e => e.isAvailable).slice(0, 6).map((e) => (
              <div key={String(e.id)} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{getSpecialityLabel(e.specialist)}</div>
                  <div className="text-xs text-primary">{getQualificationLabel(e.qualification)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Form */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4">3. Request Details</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Request Form</CardTitle>
            <CardDescription>Fill in the details for your service request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Fix AC unit in bedroom"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Service address"
                  value={form.location}
                  onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Your Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={form.customerEmail}
                  onChange={(e) => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Your Address</Label>
                <Input
                  id="customerAddress"
                  placeholder="Your home/office address"
                  value={form.customerAddress}
                  onChange={(e) => setForm(f => ({ ...f, customerAddress: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerContactNumber">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Contact Number
                  </span>
                </Label>
                <Input
                  id="customerContactNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.customerContactNumber}
                  onChange={(e) => setForm(f => ({ ...f, customerContactNumber: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                    <SelectItem value="4">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => setForm(f => ({ ...f, paymentMethod: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Estimated Budget</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.paymentAmount}
                  onChange={(e) => setForm(f => ({ ...f, paymentAmount: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Qualification</Label>
              <Select value={form.preferredEducation} onValueChange={(v) => setForm(f => ({ ...f, preferredEducation: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="No preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Preference</SelectItem>
                  {QUALIFICATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={createWorkOrder.isPending}>
              {createWorkOrder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Service Request'
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
