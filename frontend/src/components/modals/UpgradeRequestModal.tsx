import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { TrendingUp, AlertCircle } from "lucide-react";

interface UpgradeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (message: string) => Promise<boolean>;
  isSubmitting?: boolean;
}

const DEFAULT_MESSAGE =
  "I would like to upgrade my account to become a seller on this platform. Thank you for your consideration.";
const MIN_LENGTH = 20;
const MAX_LENGTH = 500;

export function UpgradeRequestModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: UpgradeRequestModalProps) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [error, setError] = useState("");

  const handleMessageChange = (value: string) => {
    setMessage(value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (message.trim().length < MIN_LENGTH) {
      setError(`Message must be at least ${MIN_LENGTH} characters`);
      return;
    }

    if (message.trim().length > MAX_LENGTH) {
      setError(`Message must not exceed ${MAX_LENGTH} characters`);
      return;
    }

    // Submit request
    const success = await onSubmit(message.trim());
    if (success) {
      // Close modal and reset message
      onOpenChange(false);
      setMessage(DEFAULT_MESSAGE);
      setError("");
    }
  };

  const charCount = message.trim().length;
  const charCountColor =
    charCount < MIN_LENGTH
      ? "text-destructive"
      : charCount > MAX_LENGTH
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-accent/30">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <DialogTitle className="text-2xl">Upgrade to Seller</DialogTitle>
          </div>
          <DialogDescription>
            Request to upgrade your account to become a seller on our platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-base">
              Request Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder={DEFAULT_MESSAGE}
              className={`min-h-[150px] ${
                error
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-accent/50 focus-visible:ring-accent focus-visible:border-accent"
              }`}
              disabled={isSubmitting}
            />

            {/* Character Count */}
            <div className="flex items-center justify-between text-xs">
              <span className={charCountColor}>
                {charCount} / {MAX_LENGTH} characters
              </span>
              {charCount < MIN_LENGTH && (
                <span className="text-muted-foreground">
                  (Minimum {MIN_LENGTH} required)
                </span>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-xs text-muted-foreground">
              <strong className="text-accent">Note:</strong> Your request will
              be reviewed by our admin team. You will be notified once your
              request is processed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={
                charCount < MIN_LENGTH || charCount > MAX_LENGTH || isSubmitting
              }
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
