import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import {
  Check,
  Download,
  Calendar,
  CheckCircle2,
  PartyPopper,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";

interface TransactionRoomCompleteProps {
  isSeller: boolean;
}

export function TransactionRoomComplete({ isSeller }: TransactionRoomCompleteProps) {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reviewComment, setReviewComment] = useState("");

  // Dynamic text based on role
  const partnerType = isSeller ? "buyer" : "seller";
  const partnerName = isSeller ? "Jane Doe" : "John Smith";
  const itemName = "Vintage Leica M6 Camera with 50mm Lens";

  const handleDownloadInvoice = () => {
    toast.success("Invoice Downloaded", {
      description: "Transaction invoice saved to your downloads.",
    });
  };

  const handleLike = (isLike: boolean) => {
    setLiked(isLike);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (liked === null) {
      toast.error("Rating Required", {
        description: "Please select like or dislike before submitting.",
      });
      return;
    }

    console.log("Feedback submitted:", {
      liked,
      comment: reviewComment,
    });

    toast.success("Feedback Submitted!", {
      description: `Thank you for rating your experience with ${partnerName}.`,
    });

    // Reset form
    setLiked(null);
    setReviewComment("");
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
                  : `The transaction is closed. Enjoy your ${itemName}!`}
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
                  {isSeller ? "$1,400.00" : "$1,428.00"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isSeller ? "After platform fees" : "Includes $28.00 escrow fee"}
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Completed Date
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Nov 30, 2025</span>
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
            Rate your experience with {partnerName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your feedback helps {isSeller ? "buyers make informed decisions" : "maintain trust in the Auctionary community"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            {/* Like/Dislike Buttons */}
            <div className="space-y-3">
              <Label>How was your experience?</Label>
              <div className="flex items-center justify-center gap-8">
                <button
                  type="button"
                  onClick={() => handleLike(true)}
                  className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    liked === true
                      ? "bg-green-500/10 border-green-500 scale-110"
                      : "border-border hover:border-green-500/50 hover:bg-green-500/5"
                  } ${isAnimating && liked === true ? "animate-bounce" : ""}`}
                >
                  <ThumbsUp
                    className={`h-16 w-16 transition-all ${
                      liked === true
                        ? "fill-green-500 text-green-500"
                        : "text-muted-foreground group-hover:text-green-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      liked === true ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    Good Experience
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLike(false)}
                  className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    liked === false
                      ? "bg-red-500/10 border-red-500 scale-110"
                      : "border-border hover:border-red-500/50 hover:bg-red-500/5"
                  } ${isAnimating && liked === false ? "animate-bounce" : ""}`}
                >
                  <ThumbsDown
                    className={`h-16 w-16 transition-all ${
                      liked === false
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground group-hover:text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      liked === false ? "text-red-500" : "text-muted-foreground"
                    }`}
                  >
                    Bad Experience
                  </span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Comment */}
            <div className="space-y-3">
              <Label htmlFor="review">Write a review (Optional)</Label>
              <Textarea
                id="review"
                placeholder={`Share your experience with this ${partnerType}...`}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Your review will be visible to other {isSeller ? "sellers" : "buyers"}
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
