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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { ElectricianView } from "../backend";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import StatusBadge from "../components/StatusBadge";
import {
  type JobApplication,
  useApproveElectrician,
  useApproveJobApplicationFull,
  useApprovePayment,
  useApproveWorkOrder,
  useFlagPayment,
  usePendingElectricians,
  usePendingJobApplications,
  usePendingJobApplicationsFull,
  usePendingPayments,
  usePendingWorkOrders,
  useRejectElectrician,
  useRejectJobApplication,
  useRejectJobApplicationFull,
  useRejectWorkOrder,
} from "../hooks/useQueries";
import { getQualificationLabel, getSpecialityLabel } from "../lib/helpers";
import type { WorkOrder } from "../lib/types";

export default function Verifications() {
  const { data: pendingWorkOrders = [], isLoading: woLoading } =
    usePendingWorkOrders();
  const { data: pendingElectricians = [], isLoading: elLoading } =
    usePendingElectricians();
  const { data: pendingJobApps = [] } = usePendingJobApplications();
  const { data: pendingPayments = [], isLoading: ppLoading } =
    usePendingPayments();

  const approveWO = useApproveWorkOrder();
  const rejectWO = useRejectWorkOrder();
  const approveEl = useApproveElectrician();
  const rejectEl = useRejectElectrician();
  const rejectJA = useRejectJobApplication();
  const { data: pendingJobAppsFull = [], isLoading: jaFullLoading } =
    usePendingJobApplicationsFull();
  const approveJAFull = useApproveJobApplicationFull();
  const rejectJAFull = useRejectJobApplicationFull();
  const approveP = useApprovePayment();
  const flagP = useFlagPayment();

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    type: "workOrder" | "electrician" | "jobApp" | "payment" | "jobAppFull";
    id: number | bigint;
    reason: string;
  }>({ open: false, type: "workOrder", id: 0, reason: "" });

  const openRejectDialog = (
    type: "workOrder" | "electrician" | "jobApp" | "payment" | "jobAppFull",
    id: number | bigint,
  ) => {
    setRejectDialog({ open: true, type, id, reason: "" });
  };

  const handleRejectConfirm = async () => {
    const { type, id, reason } = rejectDialog;
    try {
      if (type === "workOrder") {
        await rejectWO.mutateAsync({ id: id as number, reason });
        toast.success("Work order rejected.");
      } else if (type === "electrician") {
        await rejectEl.mutateAsync({ id: id as bigint, reason });
        toast.success("Electrician rejected.");
      } else if (type === "jobApp") {
        await rejectJA.mutateAsync({ id: id as number, reason });
        toast.success("Job application rejected.");
      } else if (type === "jobAppFull") {
        await rejectJAFull.mutateAsync({ id: id as number, reason });
        toast.success("Job application rejected.");
      } else if (type === "payment") {
        await flagP.mutateAsync({ id: id as number, reason });
        toast.success("Payment flagged.");
      }
      setRejectDialog({ open: false, type: "workOrder", id: 0, reason: "" });
    } catch (err: any) {
      toast.error(err?.message ?? "Action failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          Verifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and approve pending items across all categories.
        </p>
      </div>

      <Tabs defaultValue="jobApps">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="workOrders" className="flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" />
            Work Orders
            {pendingWorkOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingWorkOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="electricians"
            className="flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            Electricians
            {pendingElectricians.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingElectricians.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="jobApps" className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Job Applications
            {pendingJobApps.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingJobApps.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" />
            Payments
            {pendingPayments.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingPayments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Work Orders Tab */}
        <TabsContent value="workOrders">
          {woLoading ? (
            <LoadingState />
          ) : pendingWorkOrders.length === 0 ? (
            <EmptyState message="No pending work orders." />
          ) : (
            <div className="grid gap-4">
              {pendingWorkOrders.map((order) => (
                <WorkOrderVerifyCard
                  key={order.id}
                  order={order}
                  onApprove={async () => {
                    try {
                      await approveWO.mutateAsync({ id: order.id });
                      toast.success("Work order approved!");
                    } catch (err: any) {
                      toast.error(err?.message ?? "Failed to approve.");
                    }
                  }}
                  onReject={() => openRejectDialog("workOrder", order.id)}
                  isApproving={approveWO.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Electricians Tab */}
        <TabsContent value="electricians">
          {elLoading ? (
            <LoadingState />
          ) : pendingElectricians.length === 0 ? (
            <EmptyState message="No pending electrician verifications." />
          ) : (
            <div className="grid gap-4">
              {pendingElectricians.map((electrician) => (
                <ElectricianVerifyCard
                  key={String(electrician.id)}
                  electrician={electrician}
                  onApprove={async () => {
                    try {
                      await approveEl.mutateAsync({ id: electrician.id });
                      toast.success("Electrician approved!");
                    } catch (err: any) {
                      toast.error(err?.message ?? "Failed to approve.");
                    }
                  }}
                  onReject={() =>
                    openRejectDialog("electrician", electrician.id)
                  }
                  isApproving={approveEl.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Job Applications Tab */}
        <TabsContent value="jobApps">
          {jaFullLoading ? (
            <LoadingState />
          ) : pendingJobAppsFull.length === 0 ? (
            <EmptyState message="No pending job applications." />
          ) : (
            <div className="grid gap-4">
              {pendingJobAppsFull.map((app) => (
                <JobAppFullCard
                  key={app.id}
                  app={app}
                  onApprove={async () => {
                    try {
                      await approveJAFull.mutateAsync(app.id);
                      toast.success("Job application approved!");
                    } catch (err: any) {
                      toast.error(
                        err?.message ??
                          `Cannot approve: ${err?.message ?? "Failed."}`,
                      );
                    }
                  }}
                  onReject={() => openRejectDialog("jobAppFull", app.id)}
                  isApproving={approveJAFull.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          {ppLoading ? (
            <LoadingState />
          ) : pendingPayments.length === 0 ? (
            <EmptyState message="No pending payments." />
          ) : (
            <div className="grid gap-4">
              {pendingPayments.map((order) => (
                <PaymentVerifyCard
                  key={order.id}
                  order={order}
                  onApprove={async () => {
                    try {
                      await approveP.mutateAsync({ id: order.id });
                      toast.success("Payment confirmed!");
                    } catch (err: any) {
                      toast.error(err?.message ?? "Failed to confirm.");
                    }
                  }}
                  onFlag={() => openRejectDialog("payment", order.id)}
                  isApproving={approveP.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject / Flag Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) =>
          setRejectDialog({ open, type: "workOrder", id: 0, reason: "" })
        }
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {rejectDialog.type === "payment" ? "Flag Payment" : "Reject Item"}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Reason</Label>
            <Input
              value={rejectDialog.reason}
              onChange={(e) =>
                setRejectDialog({ ...rejectDialog, reason: e.target.value })
              }
              placeholder="Enter reason..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog({
                  open: false,
                  type: "workOrder",
                  id: 0,
                  reason: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={
                rejectWO.isPending ||
                rejectEl.isPending ||
                rejectJA.isPending ||
                flagP.isPending
              }
            >
              {rejectDialog.type === "payment" ? "Flag" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

interface WorkOrderVerifyCardProps {
  order: WorkOrder;
  onApprove: () => Promise<void> | void;
  onReject: () => void;
  isApproving: boolean;
}

function WorkOrderVerifyCard({
  order,
  onApprove,
  onReject,
  isApproving,
}: WorkOrderVerifyCardProps) {
  const [confirmed, setConfirmed] = React.useState(false);

  const handleApprove = async () => {
    await onApprove();
    setConfirmed(true);
  };

  return (
    <Card className="bg-white text-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">
            #{order.id} — {order.title}
          </CardTitle>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-muted-foreground">{order.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {order.location}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {order.customerEmail}
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />₹{order.paymentAmount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {confirmed ? (
            <Badge className="bg-green-500 text-white px-3 py-1 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />✓ Job Confirmed
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isApproving}
              className="text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20"
              variant="outline"
            >
              {isApproving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              )}
              Approve
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            className="text-red-400 border-red-400/30 hover:bg-red-400/10"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ElectricianVerifyCardProps {
  electrician: ElectricianView;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
}

function ElectricianVerifyCard({
  electrician,
  onApprove,
  onReject,
  isApproving,
}: ElectricianVerifyCardProps) {
  return (
    <Card className="bg-white text-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{electrician.name}</CardTitle>
          <Badge
            variant="outline"
            className="text-xs text-amber-400 border-amber-400/30"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {electrician.email}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {electrician.address}
          </span>
          <span>{getSpecialityLabel(electrician.specialist)}</span>
          <span>{getQualificationLabel(electrician.qualification)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onApprove}
            disabled={isApproving}
            className="text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20"
            variant="outline"
          >
            {isApproving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            className="text-red-400 border-red-400/30 hover:bg-red-400/10"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentVerifyCardProps {
  order: WorkOrder;
  onApprove: () => void;
  onFlag: () => void;
  isApproving: boolean;
}

function PaymentVerifyCard({
  order,
  onApprove,
  onFlag,
  isApproving,
}: PaymentVerifyCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">
            #{order.id} — {order.title}
          </CardTitle>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />₹{order.paymentAmount}
          </span>
          <span>{order.paymentMethod}</span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {order.customerEmail}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onApprove}
            disabled={isApproving}
            className="text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20"
            variant="outline"
          >
            {isApproving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            )}
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onFlag}
            className="text-amber-400 border-amber-400/30 hover:bg-amber-400/10"
          >
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Flag
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Job Application Full Card ─────────────────────────────────────────────────

function calcAge(dob: string): number {
  const d = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

interface JobAppFullCardProps {
  app: JobApplication;
  onApprove: () => Promise<void> | void;
  onReject: () => void;
  isApproving: boolean;
}

function JobAppFullCard({
  app,
  onApprove,
  onReject,
  isApproving,
}: JobAppFullCardProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const age = calcAge(app.dob);

  const handleApprove = async () => {
    await onApprove();
    setConfirmed(true);
  };

  return (
    <Card className="bg-white text-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <CardTitle className="text-base">
            #{app.id} — {app.fullName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={
                age >= 19
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }
              variant="outline"
            >
              Age: {age} yrs {age < 19 && "⚠️ Under 19"}
            </Badge>
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-400/50"
            >
              Pending
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          DOB: {app.dob} · Father: {app.fatherName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {app.gmailId}
          </span>
          <span>📱 {app.mobileNo}</span>
          <span>🎓 {app.academicQualification}</span>
          <span>💼 Exp: {app.workExperience || "N/A"}</span>
          <span>
            ⏱ {app.workingTime} hrs/day · {app.jobType}
          </span>
          <span>
            ₹{app.salaryPerMonth}/mo · ₹{app.salaryPerWeek}/wk · ₹
            {app.salaryPerDay}/day
          </span>
          {app.otherQualification && (
            <span className="col-span-2">Other: {app.otherQualification}</span>
          )}
          <span className="col-span-2 text-xs">
            <MapPin className="w-3 h-3 inline mr-1" />
            {app.addressLine1}
            {app.addressLine2 ? `, ${app.addressLine2}` : ""}
          </span>
        </div>
        {age < 19 && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Applicant is under 19 years old and cannot be approved.
          </div>
        )}
        <div className="flex items-center gap-2">
          {confirmed ? (
            <Badge className="bg-green-500 text-white px-3 py-1 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />✓ Job Confirmed
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isApproving || age < 19}
              className="text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20 disabled:opacity-50"
              variant="outline"
            >
              {isApproving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              )}
              Approve
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            className="text-red-400 border-red-400/30 hover:bg-red-400/10"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
