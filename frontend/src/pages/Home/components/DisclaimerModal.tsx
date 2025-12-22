import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";

interface DisclaimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisclaimerModal({ open, onOpenChange }: DisclaimerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="h-6 w-6 text-accent" />
            Important Notice - Academic Project
          </DialogTitle>
          <DialogDescription className="text-base">
            This platform is a school project for educational purposes only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Main Warning */}
          <Alert
            variant="destructive"
            className="border-destructive bg-destructive/5"
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base ml-2">
              <strong>This is NOT a real auction platform.</strong> All
              products, transactions, payments, and user interactions are
              simulated for demonstration purposes only.
            </AlertDescription>
          </Alert>

          {/* What This Means */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-accent" />
              What This Means
            </h3>
            <ul className="space-y-2 ml-6 text-sm text-muted-foreground list-disc">
              <li>
                <strong>No Real Transactions:</strong> All bids, purchases, and
                financial transactions are fictional. No actual money is
                exchanged.
              </li>
              <li>
                <strong>Simulated Products:</strong> All product listings are
                for demonstration purposes. You will not receive any physical or
                digital items.
              </li>
              <li>
                <strong>Test Data:</strong> User accounts, bids, and auction
                history may be reset or deleted at any time without notice.
              </li>
              <li>
                <strong>No Legal Obligations:</strong> No contracts or legal
                agreements are formed through this platform.
              </li>
            </ul>
          </div>

          {/* Important Notices */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Important Notices
            </h3>
            <ul className="space-y-2 ml-6 text-sm text-muted-foreground list-disc">
              <li>
                <strong>Educational Purpose:</strong> This project demonstrates
                web development skills and auction platform mechanics.
              </li>
              <li>
                <strong>Privacy:</strong> While this is a test platform, please
                do not share sensitive personal information.
              </li>
              <li>
                <strong>Data Security:</strong> Use test credentials only. Do
                not reuse passwords from your real accounts.
              </li>
              <li>
                <strong>Feedback Welcome:</strong> This platform is continuously
                being improved. Feel free to explore and provide feedback!
              </li>
            </ul>
          </div>

          {/* Acknowledgment */}
          <Alert className="bg-muted">
            <Info className="h-4 w-4" />
            <AlertDescription className="ml-2">
              By using this platform, you acknowledge that this is an academic
              project and understand that all activities are simulated for
              educational purposes only.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="default"
            onClick={() => onOpenChange(false)}
            className="min-w-[120px]"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
