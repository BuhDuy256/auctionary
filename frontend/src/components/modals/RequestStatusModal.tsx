import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Clock, XCircle, Calendar, MessageSquare } from "lucide-react";
import type { UpgradeRequest } from "../../types/upgradeRequest";

interface RequestStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: UpgradeRequest | null;
  onCancel: () => Promise<boolean>;
  isCancelling?: boolean;
}

export function RequestStatusModal({
  open,
  onOpenChange,
  request,
  onCancel,
  isCancelling = false,
}: RequestStatusModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelRequest = async () => {
    const success = await onCancel();
    if (success) {
      setShowCancelConfirm(false);
      onOpenChange(false);
    }
  };

  if (!request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = () => {
    switch (request.status) {
      case "pending":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      case "approved":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "rejected":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "expired":
        return "text-gray-500 bg-gray-500/10 border-gray-500/30";
      case "cancelled":
        return "text-gray-500 bg-gray-500/10 border-gray-500/30";
      default:
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-accent/30">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <DialogTitle className="text-2xl">
                Upgrade Request Status
              </DialogTitle>
            </div>
            <DialogDescription>
              View your current seller upgrade request details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor()}`}
              >
                {request.status}
              </span>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted:</span>
                </div>
                <span className="font-medium">
                  {formatDate(request.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Expires:</span>
                </div>
                <span className="font-medium">
                  {formatDate(request.expiresAt)}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Your Message:</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary border border-border">
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                  {request.message}
                </p>
              </div>
            </div>

            {/* Info Box */}
            {request.status === "pending" && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-xs text-yellow-500/90">
                  <strong>Pending Review:</strong> Your request is currently
                  being reviewed by our admin team. You will be notified once a
                  decision is made.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {request.status === "pending" && (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isCancelling}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isCancelling ? "Cancelling..." : "Cancel Request"}
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Upgrade Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your seller upgrade request? You
              will be able to submit a new request after cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep Request
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRequest}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
