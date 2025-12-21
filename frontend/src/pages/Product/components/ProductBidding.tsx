import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
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
import {
  Zap,
  Users,
  Info,
  AlertTriangle,
  CheckCircle2,
  Shield,
  TrendingUp,
  Heart,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import type { AuctionInfo, UserProductStatus } from "../../../types/product";
import { notify } from "../../../utils/notify";
import { useAuth } from "../../../hooks/useAuth";

interface ProductBiddingProps {
  auction: AuctionInfo;
  userStatus?: UserProductStatus;
  onPlaceBid: (amount: number) => Promise<any>;
  onToggleWatchlist: () => void;
  isWatchlisted: boolean;
}

export function ProductBidding({
  auction,
  userStatus,
  onPlaceBid,
  onToggleWatchlist,
  isWatchlisted,
}: ProductBiddingProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [bidPlaced, setBidPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user } = useAuth();

  const currentPrice = auction.currentPrice;
  const minBid = currentPrice + auction.stepPrice;

  // Check bidder eligibility
  const checkBidderEligibility = (): { canBid: boolean; reason?: string } => {
    if (!user) {
      return { canBid: true }; // Allow non-logged in users to see bid form (will be blocked on submit)
    }

    if (auction.allowNewBidder === false) {
      const totalReviews = user.positiveReviews + user.negativeReviews;

      // Check if user has no ratings
      if (totalReviews === 0) {
        return {
          canBid: false,
          reason:
            "This auction does not allow new bidders. You must have at least one rating to participate.",
        };
      }

      // Check if user has less than 80% positive rating
      const positivePercentage = (user.positiveReviews / totalReviews) * 100;
      if (positivePercentage < 80) {
        return {
          canBid: false,
          reason: `This auction requires bidders to have at least 80% positive ratings. Your current rating is ${positivePercentage.toFixed(
            1
          )}%.`,
        };
      }
    }

    return { canBid: true };
  };

  const eligibility = checkBidderEligibility();

  const handleOpenConfirmDialog = () => {
    // Client-side check for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      notify.error("Please login to place bid");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount >= minBid) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmBid = async () => {
    const amount = parseFloat(bidAmount);
    try {
      setLoading(true);
      setShowConfirmDialog(false);
      await onPlaceBid(amount);
      setBidPlaced(true);
      setBidAmount(""); // Reset input
      setTimeout(() => setBidPlaced(false), 5000);
    } catch (err: any) {
      console.error(err);
      // Handle various error formats
      let message = "Failed to place bid";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      if (message === "API request failed" || message.includes("401")) {
        message = "You need to login to use this feature";
      }

      // Display error to user
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isOutbid = userStatus?.isOutbid || false;

  return (
    <div className="space-y-6">
      {/* Outbid Alert */}
      {isOutbid && (
        <Alert
          variant="destructive"
          className="border-destructive bg-destructive/10"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>You have been outbid!</AlertTitle>
          <AlertDescription>
            Another bidder has placed a higher bid. Place a new bid to stay in
            the auction.
          </AlertDescription>
        </Alert>
      )}

      {/* Bid Placed Success */}
      {bidPlaced && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">
            Bid Placed Successfully!
          </AlertTitle>
          <AlertDescription className="text-success/90">
            Your maximum bid has been recorded. We'll automatically bid for you
            up to your limit.
          </AlertDescription>
        </Alert>
      )}

      {/* Bidding Area */}
      <Card className="border-accent/30 shadow-lg shadow-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Current Price</CardDescription>
              <CardTitle className="text-4xl text-accent mt-1">
                ${currentPrice.toLocaleString()}
              </CardTitle>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Watchers</div>
              <div className="flex items-center gap-1 text-accent mt-1">
                <Users className="h-4 w-4" />
                <span>{auction.watchlistCount}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Proxy Bidding Info */}
          <Alert variant="warning">
            <Info className="h-5 w-5" />
            <AlertTitle>Proxy Bidding Active</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              We will automatically bid for you up to your maximum amount.
              You'll only pay slightly more than the next highest bid.
            </AlertDescription>
          </Alert>

          {/* Bid Form or Ineligibility Warning */}
          {!eligibility.canBid ? (
            <Alert
              variant="destructive"
              className="border-destructive bg-destructive/10"
            >
              <XCircle className="h-4 w-4" />
              <AlertTitle>Unable to Bid</AlertTitle>
              <AlertDescription className="text-sm">
                {eligibility.reason}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="maxBid">Your Maximum Bid</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="maxBid"
                    type="number"
                    placeholder="Enter amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="pl-7"
                    min={minBid}
                  />
                </div>
                <Button
                  onClick={handleOpenConfirmDialog}
                  disabled={
                    !bidAmount || parseFloat(bidAmount) < minBid || loading
                  }
                  className="px-8"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {loading ? "Placing Bid..." : "Place Bid"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum bid: ${minBid.toLocaleString()}
              </p>
            </div>
          )}

          {/* Buy Now Section */}
          {auction.buyNowPrice && auction.buyNowPrice > currentPrice && (
            <>
              <div className="flex items-center gap-3 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground font-medium">
                  OR BUY IMMEDIATELY
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-3 p-4 rounded-lg border-2 border-success/30 bg-success/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-success/80 mb-1">
                      Buy Now Price
                    </div>
                    <div className="text-3xl font-bold text-success">
                      ${auction.buyNowPrice.toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-success/50 text-success hover:bg-success/10"
                    onClick={() => {
                      notify.error("Buy Now feature is not available yet!");
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                </div>
                <p className="text-xs text-success/70">
                  Skip the bidding and purchase this item instantly at the Buy
                  Now price.
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Total Bids
              </div>
              <div className="text-lg text-accent">{auction.bidCount}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Starting Price
              </div>
              <div className="text-lg">
                ${auction.startPrice.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Bid Increment
              </div>
              <div className="text-lg">${auction.stepPrice}</div>
            </div>
          </div>

          {/* Secondary Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={onToggleWatchlist}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isWatchlisted ? "fill-current" : ""}`}
            />
            {isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          </Button>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="border-success/50 text-success text-xs"
        >
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified Seller
        </Badge>
        <Badge
          variant="outline"
          className="border-accent/50 text-accent text-xs"
        >
          <Shield className="h-3 w-3 mr-1" />
          Buyer Protection
        </Badge>
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          Trending Auction
        </Badge>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Bid</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Please review your bid details before confirming:</p>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Your Maximum Bid:
                  </span>
                  <span className="font-semibold text-accent text-lg">
                    ${parseFloat(bidAmount || "0").toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Price:</span>
                  <span>${currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Minimum Bid:</span>
                  <span>${minBid.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  With proxy bidding, we'll automatically bid for you up to your
                  maximum amount. You'll only pay slightly more than the next
                  highest bid.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBid}
              disabled={loading}
              className="bg-accent hover:bg-accent/90"
            >
              {loading ? "Placing Bid..." : "Confirm Bid"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
