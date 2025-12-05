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
  Zap,
  Users,
  Info,
  AlertTriangle,
  CheckCircle2,
  Shield,
  TrendingUp,
  Heart,
} from "lucide-react";
import type { AuctionInfo, UserProductStatus } from "../../../types/product";

interface ProductBiddingProps {
  auction: AuctionInfo;
  userStatus?: UserProductStatus;
  onPlaceBid: (amount: number) => void;
  onToggleWatchlist: () => void;
}

export function ProductBidding({
  auction,
  userStatus,
  onPlaceBid,
  onToggleWatchlist,
}: ProductBiddingProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [bidPlaced, setBidPlaced] = useState(false); // Local state for UI feedback

  const currentPrice = auction.currentPrice;
  const minBid = currentPrice + auction.stepPrice;

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount >= minBid) {
      onPlaceBid(amount);
      setBidPlaced(true);
      setTimeout(() => setBidPlaced(false), 5000);
    }
  };

  const isWatchlisted = userStatus?.isWatchlisted || false;
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
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
            <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm mb-1">Proxy Bidding Active</div>
              <p className="text-xs text-muted-foreground">
                We will automatically bid for you up to your maximum amount.
                You'll only pay slightly more than the next highest bid.
              </p>
            </div>
          </div>

          {/* Bid Form */}
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
                onClick={handlePlaceBid}
                disabled={!bidAmount || parseFloat(bidAmount) < minBid}
                className="px-8"
              >
                <Zap className="mr-2 h-4 w-4" />
                Place Bid
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum bid: ${minBid.toLocaleString()}
            </p>
          </div>

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
    </div>
  );
}
