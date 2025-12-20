import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Download,
  Calendar,
  CheckCircle2,
  PartyPopper,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import type { TransactionDetailResponse } from "../../../types/transaction";
import { formatTime } from "../../../utils/dateUtils";
import { useState } from "react";

interface TransactionRoomCompleteProps {
  transaction: TransactionDetailResponse;
  isSeller: boolean;
  onSubmitFeedback: (rating: "positive" | "negative", review: string) => void;
}

export function TransactionRoomComplete({ transaction, isSeller, onSubmitFeedback }: TransactionRoomCompleteProps) {
  // Dynamic text based on role
  const partnerType = isSeller ? "buyer" : "seller";
  const partnerName = isSeller ? transaction.buyer.fullName : transaction.seller.fullName;

  // Get existing rating based on user role
  // If user is seller → rating they gave to buyer (transaction.ratings.seller)
  // If user is buyer → rating they gave to seller (transaction.ratings.buyer)
  const existingRating = isSeller ? transaction.ratings.seller : transaction.ratings.buyer;
  const hasRated = existingRating?.rate !== null;

  // Local state for rating form
  const [rating, setRating] = useState<"positive" | "negative" | null>(null);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback(rating, review);
      // Form will be hidden after refetch shows hasRated = true
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.success("Invoice Downloaded", {
      description: "Transaction invoice saved to your downloads.",
    });
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Success Banner */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            {/* Animated Success Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <div className="flex-1">
              <h2 className="text-3xl mb-2 text-green-500">
                Transaction Successful
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {isSeller
                  ? `The transaction is closed. Funds have been released to your account.`
                  : `The transaction is closed. Enjoy your ${transaction.product.name}!`}
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                  <PartyPopper className="h-3 w-3 mr-1" />
                  Funds Released
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice & Documents */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Invoice & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  {isSeller ? "Total Received" : "Total Paid"}
                </div>
                <div className="text-2xl text-accent">
                  ${transaction.finalPrice.toFixed(2)}
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Completed Date
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{transaction.completedAt && formatTime(transaction.completedAt)}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">
            {hasRated ? `Your Rating for ${partnerName}` : `Rate your experience with ${partnerName}`}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {hasRated 
              ? "Thank you for your feedback!" 
              : `Your feedback helps ${isSeller ? "buyers make informed decisions" : "maintain trust in the Auctionary community"}`
            }
          </p>
        </CardHeader>
        <CardContent>
          {hasRated ? (
            // Show existing rating (Read-only)
            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 rounded-2xl border-2 bg-secondary/30">
                {existingRating.rate === 1 ? (
                  <div className="flex flex-col items-center gap-3">
                    <ThumbsUp className="h-16 w-16 fill-green-500 text-green-500" />
                    <span className="text-lg font-medium text-green-500">Good Experience</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <ThumbsDown className="h-16 w-16 fill-red-500 text-red-500" />
                    <span className="text-lg font-medium text-red-500">Bad Experience</span>
                  </div>
                )}
              </div>

              {existingRating.comment && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Your Review</Label>
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-sm">{existingRating.comment}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Feedback submitted successfully</span>
              </div>
            </div>
          ) : (
            // Show rating form inline
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating Selection */}
              <div className="space-y-3">
                <div className="text-sm mb-3">
                  How was your experience? <span className="text-destructive">*</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Positive */}
                  <button
                    type="button"
                    onClick={() => setRating("positive")}
                    className={`p-6 rounded-lg border-2 transition-all text-center ${
                      rating === "positive"
                        ? "border-green-500 bg-green-500/10"
                        : "border-border hover:border-green-500/50 hover:bg-green-500/5"
                    }`}
                  >
                    <div className={`inline-flex p-4 rounded-full mb-3 ${
                      rating === "positive" ? "bg-green-500/20" : "bg-secondary"
                    }`}>
                      <ThumbsUp className={`h-8 w-8 ${
                        rating === "positive" ? "text-green-500" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className={`text-lg mb-1 ${rating === "positive" ? "text-green-500" : ""}`}>
                      Positive
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Great experience, would recommend
                    </div>
                  </button>

                  {/* Negative */}
                  <button
                    type="button"
                    onClick={() => setRating("negative")}
                    className={`p-6 rounded-lg border-2 transition-all text-center ${
                      rating === "negative"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/50 hover:bg-red-500/5"
                    }`}
                  >
                    <div className={`inline-flex p-4 rounded-full mb-3 ${
                      rating === "negative" ? "bg-red-500/20" : "bg-secondary"
                    }`}>
                      <ThumbsDown className={`h-8 w-8 ${
                        rating === "negative" ? "text-red-500" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className={`text-lg mb-1 ${rating === "negative" ? "text-red-500" : ""}`}>
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
                  placeholder={`Share details about your experience with this ${partnerType}. Your review helps other users make informed decisions...`}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground">
                  {review.length}/500 characters
                </div>
              </div>

              {/* Info Alert */}
              {rating && (
                <Alert className={`border-${rating === "positive" ? "green" : "red"}-500/30 bg-${rating === "positive" ? "green" : "red"}-500/5`}>
                  <AlertCircle className={`h-4 w-4 text-${rating === "positive" ? "green" : "red"}-500`} />
                  <AlertDescription className={`text-xs text-${rating === "positive" ? "green" : "red"}-500/90`}>
                    {rating === "positive" ? (
                      <>
                        <strong>Positive feedback (+1)</strong> will increase the {partnerType}'s reputation score and help them build trust in the community.
                      </>
                    ) : (
                      <>
                        <strong>Negative feedback (-1)</strong> will decrease the {partnerType}'s reputation score. Please provide details to help them improve.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!rating || isSubmitting}
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
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
