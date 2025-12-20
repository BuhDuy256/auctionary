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
import {
  Download,
  Calendar,
  CheckCircle2,
  PartyPopper,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import type { TransactionDetailResponse } from "../../../types/transaction";
import { formatTime } from "../../../utils/dateUtils";

interface TransactionRoomCompleteProps {
  transaction: TransactionDetailResponse;
  isSeller: boolean;
  onOpenFeedback: () => void;
}

export function TransactionRoomComplete({ transaction, isSeller, onOpenFeedback }: TransactionRoomCompleteProps) {
  // Dynamic text based on role
  const partnerType = isSeller ? "buyer" : "seller";
  const partnerName = isSeller ? transaction.buyer.fullName : transaction.seller.fullName;

  // Get existing rating based on user role
  const existingRating = isSeller ? transaction.ratings.seller : transaction.ratings.buyer;
  const hasRated = existingRating.rate !== null;

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
            // Show rating form
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-accent/5 border border-accent/30 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Share your experience to help the community make better decisions
                </p>
                <Button onClick={onOpenFeedback} size="lg" className="w-full max-w-md">
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Rate {partnerType === "buyer" ? "Buyer" : "Seller"} Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
