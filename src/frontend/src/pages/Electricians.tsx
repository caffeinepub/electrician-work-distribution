import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { ElectricianView } from "../backend";
import {
  ElectricianQualification,
  Speciality,
  WorkAvailability,
} from "../backend";
import {
  useAddElectrician,
  useGetAllElectricians,
  useRemoveElectrician,
  useUpdateElectrician,
} from "../hooks/useQueries";
import { getQualificationLabel, getSpecialityLabel } from "../lib/utils";

interface ElectricianForm {
  name: string;
  specialist: Speciality;
  workAvailability: WorkAvailability;
  qualification: ElectricianQualification;
  email: string;
  address: string;
  hourlyRate: string;
  currency: string;
  paymentMethod: string;
}

const DEFAULT_FORM: ElectricianForm = {
  name: "",
  specialist: Speciality.residential,
  workAvailability: WorkAvailability.fullTime,
  qualification: ElectricianQualification.itiElectrician,
  email: "",
  address: "",
  hourlyRate: "0",
  currency: "INR",
  paymentMethod: "cash",
};

export default function Electricians() {
  const { data: electricians = [], isLoading } = useGetAllElectricians();
  const addMutation = useAddElectrician();
  const updateMutation = useUpdateElectrician();
  const removeMutation = useRemoveElectrician();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedElectrician, setSelectedElectrician] =
    useState<ElectricianView | null>(null);
  const [form, setForm] = useState<ElectricianForm>(DEFAULT_FORM);

  const openAddDialog = () => {
    setForm(DEFAULT_FORM);
    setAddDialogOpen(true);
  };

  const openEditDialog = (electrician: ElectricianView) => {
    setSelectedElectrician(electrician);
    setForm({
      name: electrician.name,
      specialist: electrician.specialist as Speciality,
      workAvailability: electrician.workAvailability as WorkAvailability,
      qualification: electrician.qualification as ElectricianQualification,
      email: electrician.email,
      address: electrician.address,
      hourlyRate: String(electrician.hourlyRate),
      currency: electrician.currency,
      paymentMethod: electrician.paymentMethod,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (electrician: ElectricianView) => {
    setSelectedElectrician(electrician);
    setDeleteDialogOpen(true);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!form.qualification) {
      toast.error("Qualification is required.");
      return;
    }
    try {
      await addMutation.mutateAsync({
        name: form.name,
        specialist: form.specialist,
        workAvailability: form.workAvailability,
        qualification: form.qualification,
        email: form.email,
        address: form.address,
        hourlyRate: BigInt(form.hourlyRate || "0"),
        currency: form.currency,
        paymentMethod: form.paymentMethod,
      });
      toast.success("Electrician added successfully!");
      setAddDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add electrician.");
    }
  };

  const handleEdit = async () => {
    if (!selectedElectrician) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedElectrician.id,
        name: form.name,
        specialist: form.specialist,
        workAvailability: form.workAvailability,
        qualification: form.qualification,
        email: form.email,
        address: form.address,
        hourlyRate: BigInt(form.hourlyRate || "0"),
        currency: form.currency,
        paymentMethod: form.paymentMethod,
      });
      toast.success("Electrician updated successfully!");
      setEditDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update electrician.");
    }
  };

  const handleDelete = async () => {
    if (!selectedElectrician) return;
    try {
      await removeMutation.mutateAsync(selectedElectrician.id);
      toast.success("Electrician removed.");
      setDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to remove electrician.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Electricians
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your team of technicians.
          </p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Electrician
        </Button>
      </div>

      {electricians.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No electricians yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {electricians.map((electrician) => (
            <Card
              key={String(electrician.id)}
              className="hover:border-primary/30 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    {electrician.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7"
                      onClick={() => openEditDialog(electrician)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(electrician)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {electrician.email}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {electrician.address}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <IndianRupee className="w-3.5 h-3.5 shrink-0" />₹
                  {String(electrician.hourlyRate)}/hr · {electrician.currency}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {getSpecialityLabel(electrician.specialist)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getQualificationLabel(electrician.qualification)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${electrician.isAvailable ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}`}
                  >
                    {electrician.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <ElectricianFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title="Add Electrician"
        form={form}
        setForm={setForm}
        onSubmit={handleAdd}
        isPending={addMutation.isPending}
        submitLabel="Add"
      />

      {/* Edit Dialog */}
      <ElectricianFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Electrician"
        form={form}
        setForm={setForm}
        onSubmit={handleEdit}
        isPending={updateMutation.isPending}
        submitLabel="Save Changes"
      />

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Electrician</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{selectedElectrician?.name}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ElectricianFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  form: ElectricianForm;
  setForm: React.Dispatch<React.SetStateAction<ElectricianForm>>;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
}

function ElectricianFormDialog({
  open,
  onOpenChange,
  title,
  form,
  setForm,
  onSubmit,
  isPending,
  submitLabel,
}: ElectricianFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="City / Area"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Hourly Rate (₹)</Label>
              <Input
                type="number"
                value={form.hourlyRate}
                onChange={(e) =>
                  setForm({ ...form, hourlyRate: e.target.value })
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder="INR"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Speciality *</Label>
            <Select
              value={form.specialist}
              onValueChange={(v) =>
                setForm({ ...form, specialist: v as Speciality })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Speciality.residential}>
                  Residential
                </SelectItem>
                <SelectItem value={Speciality.commercial}>
                  Commercial
                </SelectItem>
                <SelectItem value={Speciality.industrial}>
                  Industrial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Qualification *</Label>
            <Select
              value={form.qualification}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  qualification: v as ElectricianQualification,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ElectricianQualification.itiElectrician}>
                  ITI Electrician
                </SelectItem>
                <SelectItem
                  value={
                    ElectricianQualification.electronicElectricalEngineering
                  }
                >
                  Electronic Electrical Engineering
                </SelectItem>
                <SelectItem value={ElectricianQualification.eeeDiploma}>
                  EEE Diploma
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Work Availability</Label>
            <Select
              value={form.workAvailability}
              onValueChange={(v) =>
                setForm({ ...form, workAvailability: v as WorkAvailability })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={WorkAvailability.fullTime}>
                  Full Time
                </SelectItem>
                <SelectItem value={WorkAvailability.partTime}>
                  Part Time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={form.paymentMethod}
              onValueChange={(v) => setForm({ ...form, paymentMethod: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
