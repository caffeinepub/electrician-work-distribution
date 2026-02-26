import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Wrench, MapPin, Mail, Phone, Star, CheckCircle, Loader2, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetElectricians, useCreateWorkOrder } from '@/hooks/useQueries';
import { toast } from 'sonner';

const SERVICE_TYPES = [
  { value: 'Television Repair', label: 'Television Repair' },
  { value: 'AC Repair', label: 'AC Repair' },
  { value: 'Fridge Repair', label: 'Fridge Repair' },
  { value: 'Ceiling Fan Repair', label: 'Ceiling Fan Repair' },
  { value: 'Table Fan Repair', label: 'Table Fan Repair' },
];

const PRIORITY_OPTIONS = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'High' },
  { value: '4', label: 'Urgent' },
];

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card'];

const EDUCATION_OPTIONS = [
  'Electronic Commerce Engineering',
  'AC Mechanic',
  'Electrical Engineering',
  'ITI (Electrician Trade)',
  'Diploma in Refrigeration & Air Conditioning',
  'Diploma in Electronics & Communication',
  'B.Tech / B.E. (Electronics)',
  'Polytechnic Diploma (Electrical)',
  'High School / Secondary',
  'Other',
];

interface ServiceFormData {
  serviceType: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  customerEmail: string;
  customerAddress: string;
  paymentAmount: string;
  paymentMethod: string;
  preferredEducation: string;
}

const initialForm: ServiceFormData = {
  serviceType: '',
  title: '',
  description: '',
  location: '',
  priority: '2',
  customerEmail: '',
  customerAddress: '',
  paymentAmount: '',
  paymentMethod: 'Cash',
  preferredEducation: '',
};

export default function Services() {
  const [form, setForm] = useState<ServiceFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const { data: electricians = [] } = useGetElectricians();
  const createWorkOrder = useCreateWorkOrder();

  const appId = encodeURIComponent(window.location.hostname || 'technical-tech');

  const handleChange = (field: keyof ServiceFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Auto-fill title when service type is selected
    if (field === 'serviceType') {
      setForm((prev) => ({ ...prev, serviceType: value, title: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.serviceType) {
      toast.error('Please select a service type.');
      return;
    }
    if (!form.customerEmail || !form.customerAddress) {
      toast.error('Please fill in your email and address.');
      return;
    }

    const availableElectrician = electricians.find((e) => e.isAvailable);
    if (!availableElectrician) {
      toast.error('No available technicians at the moment. Please try again later.');
      return;
    }

    try {
      await createWorkOrder.mutateAsync({
        title: form.title || form.serviceType,
        description: form.description || `Service request for: ${form.serviceType}`,
        location: form.location,
        priority: BigInt(form.priority),
        issuedElectrician: availableElectrician.id,
        customerEmail: form.customerEmail,
        customerAddress: form.customerAddress,
        paymentAmount: BigInt(Math.round(parseFloat(form.paymentAmount || '0'))),
        paymentMethod: form.paymentMethod,
        preferredEducation: form.preferredEducation,
      });
      setSubmitted(true);
      setForm(initialForm);
      toast.success('Service request submitted successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit request.';
      toast.error(msg);
    }
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
          <Link to="/jobs">
            <Button variant="outline" size="sm">Worker Job Apply</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-card border-b border-border py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Wrench className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Request a Service
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Fast, reliable home appliance repair. Fill in the form below and our technician will be assigned to you.
          </p>
        </div>
      </section>

      {/* Service Type Cards */}
      <section className="max-w-6xl mx-auto w-full px-4 py-8">
        <h2 className="text-lg font-bold text-foreground mb-4 text-center">Our Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          {SERVICE_TYPES.map((svc) => (
            <button
              key={svc.value}
              type="button"
              onClick={() => handleChange('serviceType', svc.value)}
              className={`rounded-xl border p-4 text-center transition-all duration-200 cursor-pointer ${
                form.serviceType === svc.value
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <Wrench className="w-6 h-6 mx-auto mb-2 opacity-70" />
              <span className="text-xs font-medium leading-tight">{svc.label}</span>
            </button>
          ))}
        </div>

        {/* Electrician Showcase */}
        {electricians.filter((e) => e.isAvailable).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">Available Technicians</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {electricians.filter((e) => e.isAvailable).slice(0, 3).map((elec) => (
                <Card key={String(elec.id)} className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{elec.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{String(elec.specialist)}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-muted-foreground">Available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Service Request Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Service Request Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Request Submitted!</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Your service request has been received. A technician will contact you shortly.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Service Type */}
                  <div className="space-y-1.5">
                    <Label>Service Type <span className="text-destructive">*</span></Label>
                    <Select value={form.serviceType} onValueChange={(v) => handleChange('serviceType', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((svc) => (
                          <SelectItem key={svc.value} value={svc.value}>{svc.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description">Problem Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue with your appliance..."
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label htmlFor="location">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      Location / Area
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g. Sector 12, Delhi"
                      value={form.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="customerEmail">
                      <Mail className="w-3.5 h-3.5 inline mr-1" />
                      Your Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={form.customerEmail}
                      onChange={(e) => handleChange('customerEmail', e.target.value)}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="customerAddress">
                      <Phone className="w-3.5 h-3.5 inline mr-1" />
                      Full Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="customerAddress"
                      placeholder="House No., Street, City, PIN"
                      value={form.customerAddress}
                      onChange={(e) => handleChange('customerAddress', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <Label>Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => handleChange('priority', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Amount */}
                  <div className="space-y-1.5">
                    <Label htmlFor="paymentAmount">Estimated Budget (₹)</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.paymentAmount}
                      onChange={(e) => handleChange('paymentAmount', e.target.value)}
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-1.5">
                    <Label>Payment Method</Label>
                    <Select value={form.paymentMethod} onValueChange={(v) => handleChange('paymentMethod', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preferred Education */}
                  <div className="space-y-1.5">
                    <Label>Preferred Technician Education</Label>
                    <Select value={form.preferredEducation} onValueChange={(v) => handleChange('preferredEducation', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_OPTIONS.map((edu) => (
                          <SelectItem key={edu} value={edu}>{edu}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createWorkOrder.isPending}
                  >
                    {createWorkOrder.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Service Request'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

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
