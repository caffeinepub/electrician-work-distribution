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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import {
  type WorkOrder,
  useAssignElectricianToWorkOrder,
  useGetAllElectricians,
  useGetAllWorkOrders,
  useUpdateWorkOrderStatus,
} from "../hooks/useQueries";

export default function WorkOrders() {
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const { data: electricians = [] } = useGetAllElectricians();
  const updateStatusMutation = useUpdateWorkOrderStatus();
  const assignMutation = useAssignElectricianToWorkOrder();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(
    null,
  );
  const [selectedElectricianId, setSelectedElectricianId] =
    useState<string>("");

  const allOrders = workOrders;
  const pendingOrders = workOrders.filter(
    (wo) => wo.status === "open" && wo.verificationStatus === "pending",
  );
  const assignmentQueue = workOrders.filter(
    (wo) =>
      wo.status === "open" &&
      (wo.applicationStatus === "verifiedPendingAssignment" ||
        wo.verificationStatus === "approved"),
  );
  const activeOrders = workOrders.filter((wo) => wo.status === "inProgress");

  const openAssignDialog = (workOrderId: number) => {
    setSelectedWorkOrderId(workOrderId);
    setSelectedElectricianId("");
    setAssignDialogOpen(true);
  };

  const handleAssignWorker = async () => {
    if (!selectedWorkOrderId || !selectedElectricianId) {
      toast.error("Please select an electrician.");
      return;
    }
    try {
      await assignMutation.mutateAsync({
        workOrderId: selectedWorkOrderId,
        electricianId: BigInt(selectedElectricianId),
      });
      toast.success("Worker assigned successfully!");
      setAssignDialogOpen(false);
      setSelectedWorkOrderId(null);
      setSelectedElectricianId("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to assign worker.");
    }
  };

  const handleStatusChange = async (
    id: number,
    status: WorkOrder["status"],
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success(`Order status updated to ${status}.`);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update status.");
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-primary" />
          Work Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and assign service requests.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All Orders
            <Badge variant="secondary" className="ml-2 text-xs">
              {allOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="verify">
            Verify Application
            <Badge variant="secondary" className="ml-2 text-xs">
              {pendingOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assign">
            Assignment Queue
            <Badge variant="secondary" className="ml-2 text-xs">
              {assignmentQueue.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeOrders.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="all">
          {allOrders.length === 0 ? (
            <EmptyState message="No work orders found." />
          ) : (
            <div className="grid gap-4">
              {allOrders.map((order) => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  electricians={electricians}
                  onAssign={openAssignDialog}
                  onStatusChange={handleStatusChange}
                  showAssignButton={order.status === "open"}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Verify Application Tab */}
        <TabsContent value="verify">
          {pendingOrders.length === 0 ? (
            <EmptyState message="No pending applications to verify." />
          ) : (
            <div className="grid gap-4">
              {pendingOrders.map((order) => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  electricians={electricians}
                  onAssign={openAssignDialog}
                  onStatusChange={handleStatusChange}
                  showAssignButton={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Assignment Queue Tab */}
        <TabsContent value="assign">
          {assignmentQueue.length === 0 ? (
            <EmptyState message="No orders in the assignment queue." />
          ) : (
            <div className="grid gap-4">
              {assignmentQueue.map((order) => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  electricians={electricians}
                  onAssign={openAssignDialog}
                  onStatusChange={handleStatusChange}
                  showAssignButton={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Active Tab */}
        <TabsContent value="active">
          {activeOrders.length === 0 ? (
            <EmptyState message="No active orders." />
          ) : (
            <div className="grid gap-4">
              {activeOrders.map((order) => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  electricians={electricians}
                  onAssign={openAssignDialog}
                  onStatusChange={handleStatusChange}
                  showAssignButton={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Assign Worker Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Assign Worker
            </DialogTitle>
            <DialogDescription>
              Select an electrician to assign to this work order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Electrician</Label>
              <Select
                value={selectedElectricianId}
                onValueChange={setSelectedElectricianId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an electrician..." />
                </SelectTrigger>
                <SelectContent>
                  {electricians.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No electricians available
                    </SelectItem>
                  ) : (
                    electricians.map((e) => (
                      <SelectItem key={String(e.id)} value={String(e.id)}>
                        <div className="flex flex-col">
                          <span className="font-medium">{e.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {e.specialist} •{" "}
                            {e.isAvailable ? (
                              <span className="text-green-500">Available</span>
                            ) : (
                              <span className="text-red-400">Unavailable</span>
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedElectricianId && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                {(() => {
                  const e = electricians.find(
                    (el) => String(el.id) === selectedElectricianId,
                  );
                  if (!e) return null;
                  return (
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-foreground">{e.name}</p>
                      <p className="text-muted-foreground">{e.email}</p>
                      <p className="text-muted-foreground">{e.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {e.specialist}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${e.isAvailable ? "text-green-500 border-green-500/30" : "text-red-400 border-red-400/30"}`}
                        >
                          {e.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              disabled={assignMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignWorker}
              disabled={assignMutation.isPending || !selectedElectricianId}
            >
              {assignMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Worker
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WorkOrderCardProps {
  order: WorkOrder;
  electricians: any[];
  onAssign: (id: number) => void;
  onStatusChange: (id: number, status: WorkOrder["status"]) => void;
  showAssignButton: boolean;
}

function WorkOrderCard({
  order,
  electricians,
  onAssign,
  onStatusChange,
  showAssignButton,
}: WorkOrderCardProps) {
  const assignedElectrician = order.issuedElectrician
    ? electricians.find((e) => Number(e.id) === order.issuedElectrician)
    : null;

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight">
              #{order.id} — {order.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {order.description}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
            <PriorityBadge priority={order.priority} />
            <StatusBadge status={order.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {order.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            {order.customerEmail}
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            {order.customerContactNumber}
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 shrink-0" />₹
            {order.paymentAmount} —{" "}
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {assignedElectrician && (
          <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
            <UserCheck className="w-4 h-4 text-green-500 shrink-0" />
            <span className="text-green-400 font-medium">
              Assigned to: {assignedElectrician.name}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {order.verificationStatus === "approved" && (
              <Badge
                variant="outline"
                className="text-xs text-green-400 border-green-400/30"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {order.verificationStatus === "pending" && (
              <Badge
                variant="outline"
                className="text-xs text-amber-400 border-amber-400/30"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Pending Verification
              </Badge>
            )}
            {order.applicationStatus === "verifiedPendingAssignment" && (
              <Badge
                variant="outline"
                className="text-xs text-blue-400 border-blue-400/30"
              >
                Ready to Assign
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {order.status === "inProgress" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(order.id, "completed")}
                className="text-green-400 border-green-400/30 hover:bg-green-400/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Complete
              </Button>
            )}
            {order.status === "open" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(order.id, "cancelled")}
                className="text-red-400 border-red-400/30 hover:bg-red-400/10"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
            )}
            {showAssignButton && !order.issuedElectrician && (
              <Button
                size="sm"
                onClick={() => onAssign(order.id)}
                className="font-semibold"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Assign Worker
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <ClipboardList className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
