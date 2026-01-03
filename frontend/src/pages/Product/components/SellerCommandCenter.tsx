import { useState } from "react";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { Switch } from "../../../components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Users, DollarSign, TrendingUp, Zap, Info } from "lucide-react";
import type { AuctionInfo } from "../../../types/product";
import { notify } from "../../../utils/notify";

import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface SellerCommandCenterProps {
  auction: AuctionInfo;
  onToggleAllowNewBidder: (value: boolean) => Promise<void>;
  transactionId?: number;
}

export function SellerCommandCenter({
  auction,
  onToggleAllowNewBidder,
  transactionId,
}: SellerCommandCenterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleToggleAllowNewBidder = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      await onToggleAllowNewBidder(checked);
      notify.success(
        checked
          ? "New bidders are now allowed"
          : "Only bidders with ratings can participate"
      );
    } catch (err: any) {
      console.error(err);
      notify.error("Failed to update settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const isSold = auction.status === "sold";
  const isEnded = auction.endTime < new Date().toISOString();
  const isExpiredNoBids = isEnded && auction.bidCount === 0;
  const showTransaction = (isSold || isEnded) && auction.bidCount > 0;

  return (
    <div className="space-y-6">
      {/* Command Center Card */}
      <Card className="border-accent/30 shadow-lg shadow-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Current Price</CardDescription>
              <CardTitle className="text-4xl text-accent mt-1">
                ${auction.currentPrice.toLocaleString()}
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
          {/* Info Banner */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
            <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm mb-1">Seller Command Center</div>
              <p className="text-xs text-muted-foreground">
                Monitor your auction performance and manage bidder settings.
              </p>
            </div>
          </div>

          <Separator />

          {/* Expired Auction Alert (No Bids) */}
          {isExpiredNoBids && (
            <>
              <div className="space-y-4">
                <Alert className="border-muted-foreground bg-muted/20">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <AlertTitle className="text-muted-foreground">
                    Auction Expired
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    This auction has ended with no bids. You can create a new
                    auction or adjust your listing strategy.
                  </AlertDescription>
                </Alert>
              </div>
              <Separator />
            </>
          )}

          {/* Transaction Access for Ended/Sold Auctions with Winner */}
          {showTransaction && (
            <>
              <div className="space-y-4">
                <Alert className="border-success bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <AlertTitle className="text-success">
                    Auction Completed
                  </AlertTitle>
                  <AlertDescription className="text-success">
                    This auction has ended. Please proceed to the transaction
                    room to manage the sale.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() =>
                    transactionId && navigate(`/transactions/${transactionId}`)
                  }
                  disabled={!transactionId}
                  className="w-full bg-success hover:bg-success/90 text-white"
                  size="lg"
                >
                  {transactionId
                    ? "Go to Transaction Room"
                    : "Processing Transaction..."}
                  {transactionId && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
              <Separator />
            </>
          )}

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

          <Separator />

          {/* Seller Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Auction Settings</h3>

            {/* Allow New Bidders Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex-1">
                <Label
                  htmlFor="allow-new-bidders"
                  className="text-sm cursor-pointer font-medium"
                >
                  Allow New Bidders
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  When enabled, bidders with no ratings (0 positive and 0
                  negative) can place bids. When disabled, only bidders with at
                  least 80% positive ratings can participate.
                </p>
              </div>
              <Switch
                id="allow-new-bidders"
                checked={auction.allowNewBidder ?? false}
                onCheckedChange={handleToggleAllowNewBidder}
                disabled={isUpdating}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm mb-2">
            <strong>Current Top Bidder:</strong> {auction.topBidder}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Auto-extend: {auction.autoExtend ? "On" : "Off"}</span>
            </div>
            {auction.buyNowPrice && (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Buy Now: ${auction.buyNowPrice.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
