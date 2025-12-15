import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Check, Copy, XCircle } from "lucide-react";

interface TransactionRoomHeaderProps {
  statusBadge: {
    icon: React.ElementType;
    text: string;
    className: string;
  };
  description: string;
  transactionId: string;
  isSeller: boolean;
  currentScreen: string;
  onCancelTransaction: () => void;
}

export function TransactionRoomHeader({
  statusBadge,
  description,
  transactionId,
  isSeller,
  currentScreen,
  onCancelTransaction,
}: TransactionRoomHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelConfirm = () => {
    onCancelTransaction();
    setCancelDialogOpen(false);
  };

  const StatusIcon = statusBadge.icon;
  const showCancelButton = isSeller && currentScreen !== "transaction-room-complete";

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">Transaction Room</h1>
            <Badge className={statusBadge.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusBadge.text}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Transaction ID:</span>
            <code className="px-2 py-1 rounded bg-secondary border border-border font-mono text-xs">
              {transactionId}
            </code>
            <Button variant="ghost" size="sm" onClick={handleCopyTransactionId}>
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {showCancelButton && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setCancelDialogOpen(true)}
            className="ml-4"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Transaction
          </Button>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Transaction?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to cancel this transaction? This action cannot be undone.
              </p>
              <p className="font-medium text-destructive">
                Warning: Cancelling will result in a -1 rating for the buyer and may affect your seller reputation.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Transaction</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
