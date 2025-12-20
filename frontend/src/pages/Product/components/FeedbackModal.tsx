import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Separator } from "../../../components/ui/separator";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  CheckCircle2,
  AlertCircle,
  Award,
  TrendingUp,
  Package,
  MessageSquare,
} from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: FeedbackData) => void;
  partnerType: "seller" | "buyer";
  partnerName: string;
  transactionId: string;
}

export interface FeedbackData {
  rating: "positive" | "negative" | null;
  review: string;
}

export function FeedbackModal({
  open,
  onOpenChange,
  onSubmit,
  partnerType,
  partnerName,
  transactionId,
}: FeedbackModalProps) {
  const [rating, setRating] = useState<"positive" | "negative" | null>(null);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) return;

    onSubmit({
      rating,
      review,
    });

    setSubmitted(true);

    // Reset after a delay
    setTimeout(() => {
      setRating(null);
      setReview("");
      setSubmitted(false);
      onOpenChange(false);
    }, 2000);
  };

  // Success state
  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-green-500/30">
          <div className="text-center py-8 space-y-4">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/30">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl">Feedback Submitted!</h2>
              <p className="text-muted-foreground">
                Thank you for helping improve our community
              </p>
            </div>

            <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
              <Award className="h-3 w-3 mr-1" />
              Reputation Updated
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-amber/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber/10 border border-amber/30">
              <Star className="h-5 w-5 text-amber" />
            </div>
            <DialogTitle className="text-2xl">Rate Your Experience</DialogTitle>
          </div>
          <DialogDescription>
            Help us build a trustworthy community by rating your transaction
            partner
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Partner Info */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-amber/30">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Seller" />
                  <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm mb-1">
                    {partnerType === "seller" ? "Seller" : "Buyer"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{partnerName}</span>
                    <Badge
                      variant="outline"
                      className="border-amber/50 text-amber text-xs"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">
                  Transaction ID
                </div>
                <code className="text-xs font-mono px-2 py-1 rounded bg-background border border-border">
                  {transactionId}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-3 w-3" />
                <span>Vintage Leica M6</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>$1,400</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rating Selection */}
          <div className="space-y-3">
            <div className="text-sm mb-3">
              How was your experience?{" "}
              <span className="text-destructive">*</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Positive */}
              <button
                type="button"
                onClick={() => {
                  setRating("positive");
                }}
                className={`p-6 rounded-lg border-2 transition-all text-center ${
                  rating === "positive"
                    ? "border-green-500 bg-green-500/10"
                    : "border-border hover:border-green-500/50 hover:bg-green-500/5"
                }`}
              >
                <div
                  className={`inline-flex p-4 rounded-full mb-3 ${
                    rating === "positive" ? "bg-green-500/20" : "bg-secondary"
                  }`}
                >
                  <ThumbsUp
                    className={`h-8 w-8 ${
                      rating === "positive"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div
                  className={`text-lg mb-1 ${
                    rating === "positive" ? "text-green-500" : ""
                  }`}
                >
                  Positive
                </div>
                <div className="text-xs text-muted-foreground">
                  Great experience, would recommend
                </div>
              </button>

              {/* Negative */}
              <button
                type="button"
                onClick={() => {
                  setRating("negative");
                }}
                className={`p-6 rounded-lg border-2 transition-all text-center ${
                  rating === "negative"
                    ? "border-red-500 bg-red-500/10"
                    : "border-border hover:border-red-500/50 hover:bg-red-500/5"
                }`}
              >
                <div
                  className={`inline-flex p-4 rounded-full mb-3 ${
                    rating === "negative" ? "bg-red-500/20" : "bg-secondary"
                  }`}
                >
                  <ThumbsDown
                    className={`h-8 w-8 ${
                      rating === "negative"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div
                  className={`text-lg mb-1 ${
                    rating === "negative" ? "text-red-500" : ""
                  }`}
                >
                  Negative
                </div>
                <div className="text-xs text-muted-foreground">
                  Issues encountered, needs improvement
                </div>
              </button>
            </div>
          </div>

          {/* Written Review */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber" />
              <div className="text-sm">Write a review (Optional)</div>
            </div>
            <Textarea
              placeholder="Share details about your experience with this seller. Your review helps other buyers make informed decisions..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {review.length}/500 characters
            </div>
          </div>

          {/* Info Alert */}
          {rating && (
            <Alert
              className={`border-${
                rating === "positive" ? "green" : "red"
              }-500/30 bg-${rating === "positive" ? "green" : "red"}-500/5`}
            >
              <AlertCircle
                className={`h-4 w-4 text-${
                  rating === "positive" ? "green" : "red"
                }-500`}
              />
              <AlertDescription
                className={`text-xs text-${
                  rating === "positive" ? "green" : "red"
                }-500/90`}
              >
                {rating === "positive" ? (
                  <>
                    <strong>Positive feedback (+1)</strong> will increase the
                    seller's reputation score and help them build trust in the
                    community.
                  </>
                ) : (
                  <>
                    <strong>Negative feedback (-1)</strong> will decrease the
                    seller's reputation score. Please provide details to help
                    them improve.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!rating}
            >
              {rating === "positive" ? (
                <>
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Submit Positive Feedback (+1)
                </>
              ) : rating === "negative" ? (
                <>
                  <ThumbsDown className="mr-2 h-5 w-5" />
                  Submit Negative Feedback (-1)
                </>
              ) : (
                <>Submit Feedback</>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-center text-muted-foreground">
            Your feedback is public and will be visible on the {partnerType}'s
            profile. Both parties can view each other's ratings.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
