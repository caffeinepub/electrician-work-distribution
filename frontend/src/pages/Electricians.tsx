import { useState } from 'react';
import {
  useGetAllElectricians,
  useGetAllWorkOrders,
  useAddElectrician,
  useUpdateElectrician,
  useRemoveElectrician,
} from '../hooks/useQueries';
import { Speciality, WorkAvailability } from '../backend';
import type { Electrician } from '../backend';
import { calculateElectricianRating } from '../lib/utils';
import { RatingDisplay } from '../components/RatingDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

type ElectricianForm = {
  name: string;
  specialist: Speciality;
  workAvailability: WorkAvailability;
  email: string;
  address: string;
  hourlyRate: string;
  currency: string;
  paymentMethod: string;
};

const defaultForm: ElectricianForm = {
  name: '',
  specialist: Speciality.residential,
  workAvailability: WorkAvailability.fullTime,
  email: '',
  address: '',
  hourlyRate: '',
  currency: '$',
  paymentMethod: '',
};

export default function Electricians() {
  const { data: electricians = [], isLoading } = useGetAllElectricians();
  const { data: workOrders = [] } = useGetAllWorkOrders();
  const addElectrician = useAddElectrician();
  const updateElectrician = useUpdateElectrician();
  const removeElectrician = useRemoveElectrician();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Electrician | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Electrician | null>(null);
  const [form, setForm] = useState<ElectricianForm>(defaultForm);

  const openAdd = () => {
    setForm(defaultForm);
    setAddOpen(true);
  };

  const openEdit = (e: Electrician) => {
    setEditTarget(e);
    setForm({
      name: e.name,
      specialist: e.specialist,
      workAvailability: e.workAvailability,
      email: e.email,
      address: e.address,
      hourlyRate: e.hourlyRate.toString(),
      currency: e.currency,
      paymentMethod: e.paymentMethod,
    });
  };

  const handleAdd = async () => {
    try {
      await addElectrician.mutateAsync({
        name: form.name,
        specialist: form.specialist,
        workAvailability: form.workAvailability,
        email: form.email,
        address: form.address,
        hourlyRate: BigInt(Math.round(parseFloat(form.hourlyRate) || 0)),
        currency: form.currency,
        paymentMethod: form.paymentMethod,
      });
      toast.success('Electrician added.');
      setAddOpen(false);
    } catch {
      toast.error('Failed to add electrician.');
    }
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    try {
      await updateElectrician.mutateAsync({
        id: editTarget.id,
        name: form.name,
        specialist: form.specialist,
        isAvailable: undefined,
        workAvailability: form.workAvailability,
        email: form.email,
        address: form.address,
        hourlyRate: BigInt(Math.round(parseFloat(form.hourlyRate) || 0)),
        currency: form.currency,
        paymentMethod: form.paymentMethod,
      });
      toast.success('Electrician updated.');
      setEditTarget(null);
    } catch {
      toast.error('Failed to update electrician.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeElectrician.mutateAsync(deleteTarget.id);
      toast.success('Electrician removed.');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to remove electrician.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Electricians</h1>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Electrician
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {electricians.map((e) => {
          const { averageRating, ratingCount } = calculateElectricianRating(workOrders, e.id);
          return (
            <div key={e.id.toString()} className="bg-card border border-border rounded-sm p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{e.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{e.specialist}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(e)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(e)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Email: {e.email}</p>
                <p>Address: {e.address}</p>
                <p>Rate: {e.currency}{Number(e.hourlyRate)}/hr</p>
                <p>Payment: {e.paymentMethod}</p>
                <p>Availability: {e.workAvailability === WorkAvailability.fullTime ? 'Full Time' : 'Part Time'}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${e.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {e.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                <RatingDisplay rating={averageRating} count={ratingCount} size="sm" />
              </div>
            </div>
          );
        })}
        {electricians.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No electricians yet. Add one to get started.
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Electrician</DialogTitle>
            <DialogDescription>Fill in the details to add a new electrician.</DialogDescription>
          </DialogHeader>
          <ElectricianFormFields form={form} setForm={setForm} />
          <DialogFooter>
            <Button onClick={handleAdd} disabled={addElectrician.isPending}>
              {addElectrician.isPending ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Electrician</DialogTitle>
            <DialogDescription>{editTarget?.name}</DialogDescription>
          </DialogHeader>
          <ElectricianFormFields form={form} setForm={setForm} />
          <DialogFooter>
            <Button onClick={handleEdit} disabled={updateElectrician.isPending}>
              {updateElectrician.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Electrician</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeElectrician.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ElectricianFormFields({
  form,
  setForm,
}: {
  form: ElectricianForm;
  setForm: React.Dispatch<React.SetStateAction<ElectricianForm>>;
}) {
  const update = (key: keyof ElectricianForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-3 py-2">
      <div className="space-y-1">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Specialist</Label>
          <Select value={form.specialist} onValueChange={(v) => update('specialist', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={Speciality.residential}>Residential</SelectItem>
              <SelectItem value={Speciality.commercial}>Commercial</SelectItem>
              <SelectItem value={Speciality.industrial}>Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Availability</Label>
          <Select value={form.workAvailability} onValueChange={(v) => update('workAvailability', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={WorkAvailability.fullTime}>Full Time</SelectItem>
              <SelectItem value={WorkAvailability.partTime}>Part Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label>Email</Label>
        <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" />
      </div>
      <div className="space-y-1">
        <Label>Address</Label>
        <Input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Address" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label>Currency</Label>
          <Input value={form.currency} onChange={(e) => update('currency', e.target.value)} placeholder="$" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Hourly Rate</Label>
          <Input type="number" min="0" value={form.hourlyRate} onChange={(e) => update('hourlyRate', e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Payment Method</Label>
        <Input value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)} placeholder="e.g. Cash, UPI" />
      </div>
    </div>
  );
}
