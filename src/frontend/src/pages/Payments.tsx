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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  Pencil,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import {
  type PaymentStatusKind,
  type WorkOrder,
  useGetAllWorkOrders,
  useUpdateWorkOrderPayment,
} from "../hooks/useQueries";
import type { PaymentStatus } from "../lib/types";
import { formatTimestamp } from "../lib/utils";

function makePaymentStatus(
  kind: PaymentStatusKind,
  flagReason?: string,
): PaymentStatus {
  if (kind === "flagged") {
    return { __kind__: "flagged", flagged: flagReason ?? "" };
  }
  return { __kind__: kind };
}

export default function Payments() {
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const updatePaymentMutation = useUpdateWorkOrderPayment();

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    orderId: number | null;
    status: PaymentStatusKind;
    amount: string;
    flagReason: string;
  }>({
    open: false,
    orderId: null,
    status: "pending",
    amount: "",
    flagReason: "",
  });

  const totalRevenue = workOrders
    .filter((wo) => wo.paymentStatus.__kind__ === "confirmed")
    .reduce((sum, wo) => sum + wo.paymentAmount, 0);

  const pendingCount = workOrders.filter(
    (wo) => wo.paymentStatus.__kind__ === "pending",
  ).length;

  const paidCount = workOrders.filter(
    (wo) => wo.paymentStatus.__kind__ === "paid",
  ).length;

  const openEditDialog = (order: WorkOrder) => {
    setEditDialog({
      open: true,
      orderId: order.id,
      status: order.paymentStatus.__kind__ as PaymentStatusKind,
      amount: String(order.paymentAmount),
      flagReason:
        order.paymentStatus.__kind__ === "flagged"
          ? (order.paymentStatus.flagged ?? "")
          : "",
    });
  };

  const handleSave = async () => {
    if (editDialog.orderId === null) return;
    try {
      await updatePaymentMutation.mutateAsync({
        id: editDialog.orderId,
        paymentStatus: makePaymentStatus(
          editDialog.status,
          editDialog.flagReason,
        ),
        paymentAmount: Number(editDialog.amount),
      });
      toast.success("Payment updated successfully!");
      setEditDialog({
        open: false,
        orderId: null,
        status: "pending",
        amount: "",
        flagReason: "",
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update payment.");
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
          <IndianRupee className="w-8 h-8 text-primary" />
          Payments
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all service payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{totalRevenue}
                </p>
                <p className="text-xs text-muted-foreground">
                  Confirmed Revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Pending Payments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <IndianRupee className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {paidCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Paid (Awaiting Confirmation)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      {workOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <IndianRupee className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No payments to display.</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Payments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id} — {order.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatTimestamp(order.createdAt)} ·{" "}
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        ₹{order.paymentAmount}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(order)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) =>
          setEditDialog({
            open,
            orderId: null,
            status: "pending",
            amount: "",
            flagReason: "",
          })
        }
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>
              Update the payment status and amount.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={editDialog.status}
                onValueChange={(v) =>
                  setEditDialog({
                    ...editDialog,
                    status: v as PaymentStatusKind,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editDialog.status === "flagged" && (
              <div className="space-y-2">
                <Label>Flag Reason</Label>
                <Input
                  value={editDialog.flagReason}
                  onChange={(e) =>
                    setEditDialog({ ...editDialog, flagReason: e.target.value })
                  }
                  placeholder="Reason for flagging..."
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={editDialog.amount}
                onChange={(e) =>
                  setEditDialog({ ...editDialog, amount: e.target.value })
                }
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setEditDialog({
                  open: false,
                  orderId: null,
                  status: "pending",
                  amount: "",
                  flagReason: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updatePaymentMutation.isPending}
            >
              {updatePaymentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
