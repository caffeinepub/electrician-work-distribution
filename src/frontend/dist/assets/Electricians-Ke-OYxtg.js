import { c as createLucideIcon, r as reactExports, E as ElectricianQualification, W as WorkAvailability, o as Speciality, j as jsxRuntimeExports, f as LoaderCircle, U as Users, b as Button, d as ue, L as Label, I as Input } from "./index-CojzdrZl.js";
import { B as Badge } from "./badge-Bk4E2kyK.js";
import { k as useGetAllElectricians, n as useAddElectrician, o as useUpdateElectrician, p as useRemoveElectrician, C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./useQueries-DY1f8-wB.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-DfbYWFlN.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CDxMV-SM.js";
import { d as getSpecialityLabel, e as getQualificationLabel } from "./helpers-BNKG4l1e.js";
import { P as Pencil } from "./pencil-DfAhhp2o.js";
import { M as Mail } from "./mail-R52affIC.js";
import { M as MapPin } from "./map-pin-DbUMEA64.js";
import { I as IndianRupee } from "./indian-rupee-ndInwIL2.js";
import "./index-4434lWAG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const DEFAULT_FORM = {
  name: "",
  specialist: Speciality.residential,
  workAvailability: WorkAvailability.fullTime,
  qualification: ElectricianQualification.itiElectrician,
  email: "",
  address: "",
  hourlyRate: "0",
  currency: "INR",
  paymentMethod: "cash"
};
function Electricians() {
  const { data: electricians = [], isLoading } = useGetAllElectricians();
  const addMutation = useAddElectrician();
  const updateMutation = useUpdateElectrician();
  const removeMutation = useRemoveElectrician();
  const [addDialogOpen, setAddDialogOpen] = reactExports.useState(false);
  const [editDialogOpen, setEditDialogOpen] = reactExports.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [selectedElectrician, setSelectedElectrician] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  const openAddDialog = () => {
    setForm(DEFAULT_FORM);
    setAddDialogOpen(true);
  };
  const openEditDialog = (electrician) => {
    setSelectedElectrician(electrician);
    setForm({
      name: electrician.name,
      specialist: electrician.specialist,
      workAvailability: electrician.workAvailability,
      qualification: electrician.qualification,
      email: electrician.email,
      address: electrician.address,
      hourlyRate: String(electrician.hourlyRate),
      currency: electrician.currency,
      paymentMethod: electrician.paymentMethod
    });
    setEditDialogOpen(true);
  };
  const openDeleteDialog = (electrician) => {
    setSelectedElectrician(electrician);
    setDeleteDialogOpen(true);
  };
  const handleAdd = async () => {
    if (!form.name.trim()) {
      ue.error("Name is required.");
      return;
    }
    if (!form.qualification) {
      ue.error("Qualification is required.");
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
        paymentMethod: form.paymentMethod
      });
      ue.success("Electrician added successfully!");
      setAddDialogOpen(false);
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to add electrician.");
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
        paymentMethod: form.paymentMethod
      });
      ue.success("Electrician updated successfully!");
      setEditDialogOpen(false);
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to update electrician.");
    }
  };
  const handleDelete = async () => {
    if (!selectedElectrician) return;
    try {
      await removeMutation.mutateAsync(selectedElectrician.id);
      ue.success("Electrician removed.");
      setDeleteDialogOpen(false);
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to remove electrician.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-primary" }),
          "Electricians"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage your team of technicians." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openAddDialog, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        "Add Electrician"
      ] })
    ] }),
    electricians.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No electricians yet. Add your first one!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: electricians.map((electrician) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "hover:border-primary/30 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: electrician.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "w-7 h-7",
                  onClick: () => openEditDialog(electrician),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "w-7 h-7 text-destructive hover:text-destructive",
                  onClick: () => openDeleteDialog(electrician),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 shrink-0" }),
              electrician.email
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 shrink-0" }),
              electrician.address
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5 shrink-0" }),
              "₹",
              String(electrician.hourlyRate),
              "/hr · ",
              electrician.currency
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: getSpecialityLabel(electrician.specialist) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: getQualificationLabel(electrician.qualification) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${electrician.isAvailable ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}`,
                  children: electrician.isAvailable ? "Available" : "Unavailable"
                }
              )
            ] })
          ] })
        ]
      },
      String(electrician.id)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ElectricianFormDialog,
      {
        open: addDialogOpen,
        onOpenChange: setAddDialogOpen,
        title: "Add Electrician",
        form,
        setForm,
        onSubmit: handleAdd,
        isPending: addMutation.isPending,
        submitLabel: "Add"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ElectricianFormDialog,
      {
        open: editDialogOpen,
        onOpenChange: setEditDialogOpen,
        title: "Edit Electrician",
        form,
        setForm,
        onSubmit: handleEdit,
        isPending: updateMutation.isPending,
        submitLabel: "Save Changes"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Remove Electrician" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Are you sure you want to remove",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: selectedElectrician == null ? void 0 : selectedElectrician.name }),
          "? This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDeleteDialogOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            onClick: handleDelete,
            disabled: removeMutation.isPending,
            children: [
              removeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
              "Remove"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function ElectricianFormDialog({
  open,
  onOpenChange,
  title,
  form,
  setForm,
  onSubmit,
  isPending,
  submitLabel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: form.name,
            onChange: (e) => setForm({ ...form, name: e.target.value }),
            placeholder: "Full name"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "email",
            value: form.email,
            onChange: (e) => setForm({ ...form, email: e.target.value }),
            placeholder: "email@example.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: form.address,
            onChange: (e) => setForm({ ...form, address: e.target.value }),
            placeholder: "City / Area"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Hourly Rate (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: form.hourlyRate,
              onChange: (e) => setForm({ ...form, hourlyRate: e.target.value }),
              min: "0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Currency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.currency,
              onChange: (e) => setForm({ ...form, currency: e.target.value }),
              placeholder: "INR"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Speciality *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.specialist,
            onValueChange: (v) => setForm({ ...form, specialist: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Speciality.residential, children: "Residential" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Speciality.commercial, children: "Commercial" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Speciality.industrial, children: "Industrial" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Qualification *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.qualification,
            onValueChange: (v) => setForm({
              ...form,
              qualification: v
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ElectricianQualification.itiElectrician, children: "ITI Electrician" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectItem,
                  {
                    value: ElectricianQualification.electronicElectricalEngineering,
                    children: "Electronic Electrical Engineering"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ElectricianQualification.eeeDiploma, children: "EEE Diploma" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Work Availability" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.workAvailability,
            onValueChange: (v) => setForm({ ...form, workAvailability: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: WorkAvailability.fullTime, children: "Full Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: WorkAvailability.partTime, children: "Part Time" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Method" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.paymentMethod,
            onValueChange: (v) => setForm({ ...form, paymentMethod: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "upi", children: "UPI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bank", children: "Bank Transfer" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => onOpenChange(false),
          disabled: isPending,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSubmit, disabled: isPending, children: [
        isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
        submitLabel
      ] })
    ] })
  ] }) });
}
export {
  Electricians as default
};
