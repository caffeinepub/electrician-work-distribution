import { useState } from 'react';
import {
  useGetElectricians,
  useAddElectrician,
  useUpdateElectrician,
  useRemoveElectrician,
  useGetWorkOrdersByElectrician,
} from '../hooks/useQueries';
import { Electrician, Speciality } from '../backend';
import { RatingDisplay } from '../components/RatingDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Mail, MapPin, Zap, Users } from 'lucide-react';
import { calculateElectricianRating, getSpecialityLabel } from '../lib/utils';
import { toast } from 'sonner';

// Sub-component to show rating for a single electrician using per-electrician query
function ElectricianRating({ electricianId }: { electricianId: bigint }) {
  const { data: workOrders = [], isLoading } = useGetWorkOrdersByElectrician(electricianId);
  const { averageRating, ratingCount } = calculateElectricianRating(electricianId, workOrders);

  if (isLoading) {
    return <span className="text-xs text-muted-foreground">Loading...</span>;
  }

  if (ratingCount === 0) {
    return <span className="text-xs text-muted-foreground">No ratings yet</span>;
  }

  return <RatingDisplay rating={averageRating} count={ratingCount} size="sm" />;
}

interface ElectricianFormData {
  name: string;
  specialist: Speciality;
  email: string;
  address: string;
  hourlyRate: string;
  currency: string;
  paymentMethod: string;
}

const defaultForm: ElectricianFormData = {
  name: '',
  specialist: Speciality.residential,
  email: '',
  address: '',
  hourlyRate: '',
  currency: 'INR',
  paymentMethod: 'Cash',
};

export default function Electricians() {
  const { data: electricians = [], isLoading } = useGetElectricians();
  const addMutation = useAddElectrician();
  const updateMutation = useUpdateElectrician();
  const removeMutation = useRemoveElectrician();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingElectrician, setEditingElectrician] = useState<Electrician | null>(null);
  const [deletingElectrician, setDeletingElectrician] = useState<Electrician | null>(null);
  const [form, setForm] = useState<ElectricianFormData>(defaultForm);

  const availableCount = electricians.filter(e => e.isAvailable).length;
  const unavailableCount = electricians.length - availableCount;

  const openAddDialog = () => {
    setForm(defaultForm);
    setShowAddDialog(true);
  };

  const openEditDialog = (el: Electrician) => {
    setEditingElectrician(el);
    setForm({
      name: el.name,
      specialist: el.specialist as Speciality,
      email: el.email,
      address: el.address,
      hourlyRate: String(Number(el.hourlyRate)),
      currency: el.currency,
      paymentMethod: el.paymentMethod,
    });
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    try {
      await addMutation.mutateAsync({
        name: form.name,
        specialist: form.specialist,
        email: form.email,
        address: form.address,
        hourlyRate: BigInt(Math.round(Number(form.hourlyRate) || 0)),
        currency: form.currency,
        paymentMethod: form.paymentMethod,
      });
      toast.success('Electrician added successfully');
      setShowAddDialog(false);
      setForm(defaultForm);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add electrician');
    }
  };

  const handleUpdate = async () => {
    if (!editingElectrician) return;
    try {
      await updateMutation.mutateAsync({
        id: editingElectrician.id,
        name: form.name,
        specialist: form.specialist,
        isAvailable: editingElectrician.isAvailable,
        email: form.email,
        address: form.address,
        hourlyRate: BigInt(Math.round(Number(form.hourlyRate) || 0)),
        currency: form.currency,
        paymentMethod: form.paymentMethod,
      });
      toast.success('Electrician updated successfully');
      setEditingElectrician(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update electrician');
    }
  };

  const handleDelete = async () => {
    if (!deletingElectrician) return;
    try {
      await removeMutation.mutateAsync(deletingElectrician.id);
      toast.success('Electrician removed');
      setDeletingElectrician(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove electrician');
    }
  };

  const ElectricianForm = () => (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2">
          <Label className="text-foreground">Full Name *</Label>
          <Input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-background border-border text-foreground"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label className="text-foreground">Email *</Label>
          <Input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="bg-background border-border text-foreground"
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label className="text-foreground">Address</Label>
          <Input
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            className="bg-background border-border text-foreground"
            placeholder="123 Main St, City"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground">Speciality</Label>
          <Select
            value={form.specialist}
            onValueChange={v => setForm(f => ({ ...f, specialist: v as Speciality }))}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value={Speciality.residential}>Residential</SelectItem>
              <SelectItem value={Speciality.commercial}>Commercial</SelectItem>
              <SelectItem value={Speciality.industrial}>Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground">Hourly Rate</Label>
          <Input
            type="number"
            min="0"
            value={form.hourlyRate}
            onChange={e => setForm(f => ({ ...f, hourlyRate: e.target.value }))}
            className="bg-background border-border text-foreground"
            placeholder="500"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground">Currency</Label>
          <Select
            value={form.currency}
            onValueChange={v => setForm(f => ({ ...f, currency: v }))}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground">Payment Method</Label>
          <Select
            value={form.paymentMethod}
            onValueChange={v => setForm(f => ({ ...f, paymentMethod: v }))}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Electricians</h1>
          <p className="text-muted-foreground mt-1">Manage your electrician roster</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Electrician
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-heading font-bold text-foreground">{electricians.length}</div>
                <div className="text-xs text-muted-foreground">Total Electricians</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-heading font-bold text-foreground">{availableCount}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-heading font-bold text-foreground">{unavailableCount}</div>
                <div className="text-xs text-muted-foreground">Unavailable</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Electrician Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading electricians...
        </div>
      ) : electricians.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-lg">
          <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No electricians added yet.</p>
          <Button onClick={openAddDialog} variant="outline" className="mt-4 border-primary/40 text-primary">
            Add First Electrician
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {electricians.map(el => (
            <Card key={String(el.id)} className="bg-card border-border hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-heading text-foreground">{el.name}</CardTitle>
                    <Badge
                      className={`mt-1 text-xs ${
                        el.isAvailable
                          ? 'bg-green-500/15 text-green-400 border-green-500/30'
                          : 'bg-muted/50 text-muted-foreground border-border'
                      }`}
                      variant="outline"
                    >
                      {el.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(el)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingElectrician(el)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary/70" />
                    <span>{getSpecialityLabel(el.specialist as Speciality)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary/70" />
                    <span className="truncate">{el.email}</span>
                  </div>
                  {el.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary/70" />
                      <span className="truncate">{el.address}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {el.currency === 'INR' ? '₹' : el.currency === 'USD' ? '$' : '€'}
                      {Number(el.hourlyRate).toLocaleString()}
                    </span>
                    /hr · {el.paymentMethod}
                  </div>
                </div>
                {/* Rating */}
                <div className="pt-1">
                  <ElectricianRating electricianId={el.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Add Electrician</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the details to add a new electrician to the roster.
            </DialogDescription>
          </DialogHeader>
          <ElectricianForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-border">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {addMutation.isPending ? 'Adding...' : 'Add Electrician'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingElectrician} onOpenChange={open => !open && setEditingElectrician(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Electrician</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update details for {editingElectrician?.name}.
            </DialogDescription>
          </DialogHeader>
          <ElectricianForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingElectrician(null)} className="border-border">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingElectrician} onOpenChange={open => !open && setDeletingElectrician(null)}>
        <AlertDialogContent className="bg-card border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Remove Electrician</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove{' '}
              <span className="text-foreground font-medium">{deletingElectrician?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
