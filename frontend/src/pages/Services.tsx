import { useState } from 'react';
import { Zap, Wind, Thermometer, Wrench, CheckCircle, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetAllElectricians, useCreateWorkOrder } from '@/hooks/useQueries';
import { RepairServiceType } from '@/backend';

const SERVICE_TYPES = [
  {
    id: RepairServiceType.electronicRepair,
    label: 'Electronic Repair',
    description: 'TV, washing machine, and other electronic appliance repairs',
    icon: Wrench,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    id: RepairServiceType.acTechnician,
    label: 'AC Technician',
    description: 'Air conditioner installation, servicing, and repair',
    icon: Wind,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    id: RepairServiceType.fridgeRepairWork,
    label: 'Fridge Repair',
    description: 'Refrigerator and freezer repair and maintenance',
    icon: Thermometer,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    id: RepairServiceType.electrician,
    label: 'Electrician',
    description: 'Wiring, electrical faults, panel upgrades, and installations',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
];

const PRIORITY_OPTIONS = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'High' },
  { value: '4', label: 'Urgent' },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<RepairServiceType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: '2',
    electricianId: '',
    customerEmail: '',
    customerAddress: '',
    paymentAmount: '',
    paymentMethod: 'cash',
    preferredEducation: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: electricians = [] } = useGetAllElectricians();
  const createWorkOrder = useCreateWorkOrder();

  const handleServiceSelect = (serviceId: RepairServiceType) => {
    setSelectedService(serviceId);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !formData.electricianId) return;

    try {
      await createWorkOrder.mutateAsync({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        priority: BigInt(formData.priority),
        issuedElectrician: BigInt(formData.electricianId),
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        paymentAmount: BigInt(Math.round(parseFloat(formData.paymentAmount || '0') * 100)),
        paymentMethod: formData.paymentMethod,
        preferredEducation: formData.preferredEducation,
      });
      setSubmitted(true);
      setFormData({
        title: '',
        description: '',
        location: '',
        priority: '2',
        electricianId: '',
        customerEmail: '',
        customerAddress: '',
        paymentAmount: '',
        paymentMethod: 'cash',
        preferredEducation: '',
      });
    } catch (err) {
      console.error('Failed to create work order:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-background border-b border-border py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Professional Services</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Request a Service</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our range of professional repair and maintenance services. Certified technicians at your doorstep.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Service Type Cards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Select a Service Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_TYPES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${service.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{service.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-primary text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Available Technicians */}
        {electricians.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">Available Technicians</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {electricians.filter(e => e.isAvailable).slice(0, 6).map((electrician) => (
                <Card key={String(electrician.id)} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {electrician.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{electrician.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-muted-foreground">
                            {electrician.specialist.charAt(0).toUpperCase() + electrician.specialist.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{electrician.address}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {electrician.currency}{Number(electrician.hourlyRate)}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Request Form */}
        {selectedService && (
          <section>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Submit a {SERVICE_TYPES.find(s => s.id === selectedService)?.label} Request
                </CardTitle>
                <CardDescription>
                  Fill in the details below and we'll assign the best available technician.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Request Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your service request has been received. A technician will be assigned shortly.
                    </p>
                    <Button onClick={() => { setSubmitted(false); setSelectedService(null); }} variant="outline">
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g. AC not cooling"
                          value={formData.title}
                          onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={v => setFormData(p => ({ ...p, priority: v }))}>
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the issue in detail..."
                        value={formData.description}
                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="Service location"
                          value={formData.location}
                          onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="electrician">Preferred Technician</Label>
                        <Select value={formData.electricianId} onValueChange={v => setFormData(p => ({ ...p, electricianId: v }))}>
                          <SelectTrigger id="electrician">
                            <SelectValue placeholder="Select technician" />
                          </SelectTrigger>
                          <SelectContent>
                            {electricians.map(e => (
                              <SelectItem key={String(e.id)} value={String(e.id)}>
                                {e.name} {!e.isAvailable ? '(Unavailable)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="customerEmail">Your Email</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.customerEmail}
                          onChange={e => setFormData(p => ({ ...p, customerEmail: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="customerAddress">Your Address</Label>
                        <Input
                          id="customerAddress"
                          placeholder="Your address"
                          value={formData.customerAddress}
                          onChange={e => setFormData(p => ({ ...p, customerAddress: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="paymentAmount">Budget (₹)</Label>
                        <Input
                          id="paymentAmount"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={formData.paymentAmount}
                          onChange={e => setFormData(p => ({ ...p, paymentAmount: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select value={formData.paymentMethod} onValueChange={v => setFormData(p => ({ ...p, paymentMethod: v }))}>
                          <SelectTrigger id="paymentMethod">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="preferredEducation">Additional Notes</Label>
                      <Input
                        id="preferredEducation"
                        placeholder="Any special requirements or notes"
                        value={formData.preferredEducation}
                        onChange={e => setFormData(p => ({ ...p, preferredEducation: e.target.value }))}
                      />
                    </div>

                    {createWorkOrder.isError && (
                      <p className="text-sm text-destructive">
                        Failed to submit request. Please try again.
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createWorkOrder.isPending || !formData.electricianId}
                    >
                      {createWorkOrder.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Submit Service Request'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
