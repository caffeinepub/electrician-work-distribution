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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  Pencil,
  PlusCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import {
  type CashTransfer,
  type PaymentStatusKind,
  type WorkOrder,
  useAddCashTransfer,
  useGetAllWorkOrders,
  useGetCashTransfers,
  useUpdateWorkOrderPayment,
} from "../hooks/useQueries";
import { formatTimestamp } from "../lib/helpers";
import type { PaymentStatus } from "../lib/types";

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

  const { data: cashTransfers = [] } = useGetCashTransfers();
  const addCashTransfer = useAddCashTransfer();

  const [transferDialog, setTransferDialog] = React.useState<{
    open: boolean;
    amount: string;
    note: string;
    transferType: "incoming" | "outgoing";
    upiId: string;
    status: "completed" | "pending";
  }>({
    open: false,
    amount: "",
    note: "",
    transferType: "incoming",
    upiId: "8015393383@fam",
    status: "completed",
  });

  const totalIncoming = cashTransfers
    .filter((t) => t.transferType === "incoming" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const totalOutgoing = cashTransfers
    .filter((t) => t.transferType === "outgoing" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncoming - totalOutgoing;

  const handleAddTransfer = async () => {
    if (!transferDialog.amount || Number(transferDialog.amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    try {
      await addCashTransfer.mutateAsync({
        amount: Number(transferDialog.amount),
        note: transferDialog.note,
        date: new Date().toISOString(),
        transferType: transferDialog.transferType,
        upiId: transferDialog.upiId,
        status: transferDialog.status,
      });
      toast.success("Transfer recorded!");
      setTransferDialog({
        open: false,
        amount: "",
        note: "",
        transferType: "incoming",
        upiId: "8015393383@fam",
        status: "completed",
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to record transfer.");
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

      <Tabs defaultValue="payments">
        <TabsList className="mb-6">
          <TabsTrigger value="payments" data-ocid="payments.tab">
            All Payments
          </TabsTrigger>
          <TabsTrigger value="cash" data-ocid="cash.tab">
            Cash Transfer History
          </TabsTrigger>
        </TabsList>

        {/* All Payments Tab */}
        <TabsContent value="payments">
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
        </TabsContent>

        {/* Cash Transfer History Tab */}
        <TabsContent value="cash">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <ArrowDownCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{totalIncoming}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Incoming
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <ArrowUpCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{totalOutgoing}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Outgoing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <IndianRupee
                    className={`w-8 h-8 ${netBalance >= 0 ? "text-blue-500" : "text-red-500"}`}
                  />
                  <div>
                    <p
                      className={`text-2xl font-bold ${netBalance >= 0 ? "text-blue-600" : "text-red-600"}`}
                    >
                      ₹{netBalance}
                    </p>
                    <p className="text-xs text-muted-foreground">Net Balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Transfer Records</h2>
            <Button
              onClick={() =>
                setTransferDialog({ ...transferDialog, open: true })
              }
              data-ocid="cash.open_modal_button"
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Record Transfer
            </Button>
          </div>

          {cashTransfers.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="cash.empty_state"
            >
              <IndianRupee className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No cash transfers recorded yet.
              </p>
            </div>
          ) : (
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="cash.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>UPI ID</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cashTransfers.map((t) => (
                        <TableRow key={t.id} data-ocid="cash.row">
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(t.date).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                t.transferType === "incoming"
                                  ? "text-green-700 border-green-400/50 bg-green-50"
                                  : "text-red-700 border-red-400/50 bg-red-50"
                              }
                            >
                              {t.transferType === "incoming" ? (
                                <ArrowDownCircle className="w-3 h-3 mr-1 inline" />
                              ) : (
                                <ArrowUpCircle className="w-3 h-3 mr-1 inline" />
                              )}
                              {t.transferType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₹{t.amount}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {t.note || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {t.upiId || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                t.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {t.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Record Transfer Dialog */}
      <Dialog
        open={transferDialog.open}
        onOpenChange={(open) => setTransferDialog({ ...transferDialog, open })}
        data-ocid="cash.dialog"
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Cash Transfer</DialogTitle>
            <DialogDescription>
              Record an incoming or outgoing cash transfer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Transfer Type</Label>
              <Select
                value={transferDialog.transferType}
                onValueChange={(v) =>
                  setTransferDialog({
                    ...transferDialog,
                    transferType: v as "incoming" | "outgoing",
                  })
                }
              >
                <SelectTrigger data-ocid="cash.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={transferDialog.amount}
                onChange={(e) =>
                  setTransferDialog({
                    ...transferDialog,
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount"
                min="0"
                data-ocid="cash.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Input
                value={transferDialog.note}
                onChange={(e) =>
                  setTransferDialog({ ...transferDialog, note: e.target.value })
                }
                placeholder="Optional note"
                data-ocid="cash.textarea"
              />
            </div>
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <Input
                value={transferDialog.upiId}
                onChange={(e) =>
                  setTransferDialog({
                    ...transferDialog,
                    upiId: e.target.value,
                  })
                }
                data-ocid="cash.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={transferDialog.status}
                onValueChange={(v) =>
                  setTransferDialog({
                    ...transferDialog,
                    status: v as "completed" | "pending",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setTransferDialog({ ...transferDialog, open: false })
              }
              data-ocid="cash.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTransfer}
              disabled={addCashTransfer.isPending}
              data-ocid="cash.submit_button"
            >
              {addCashTransfer.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
