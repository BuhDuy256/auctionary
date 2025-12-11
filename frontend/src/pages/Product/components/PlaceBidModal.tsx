import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Separator } from "../../../components/ui/separator";
import {
  Gavel,
  Info,
  TrendingUp,
  Zap,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface PlaceBidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
  topBidder: string;
  currentBid: number;
  minimumBid: number;
  onSubmitBid: (maxBid: number) => void;
  isSubmitting?: boolean;
}

export function PlaceBidModal({
  open,
  onOpenChange,
  productId,
  productTitle,
  topBidder,
  currentBid,
  minimumBid,
  onSubmitBid,
  isSubmitting = false,
}: PlaceBidModalProps) {
  const [maxBid, setMaxBid] = useState("");
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const handleBidChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setMaxBid(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bidAmount = parseFloat(maxBid);

    if (!maxBid || isNaN(bidAmount)) {
      setError("Please enter a valid bid amount");
      return;
    }

    if (bidAmount < minimumBid) {
      setError(`Your bid must be at least $${minimumBid.toLocaleString()}`);
      return;
    }

    if (bidAmount <= currentBid) {
      setError(
        `Your bid must be higher than the current bid of $${currentBid.toLocaleString()}`
      );
      return;
    }

    console.log("Placing bid for product: ", productId);
    onSubmitBid(bidAmount);
  };

  const quickBidAmounts = [currentBid + 50, currentBid + 100, currentBid + 200];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-accent/30 max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <Gavel className="h-5 w-5 text-accent" />
              </div>
              <DialogTitle className="text-2xl">{productTitle}</DialogTitle>
            </div>
            <DialogDescription>
              Place a bid to become the new owner
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Bid Display */}
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Current Bid
                  </div>
                  <div className="text-2xl text-accent flex items-center gap-1">
                    <DollarSign className="h-5 w-5" />
                    {currentBid.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">
                    Minimum Bid
                  </div>
                  <div className="text-lg">${minimumBid.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {topBidder !== "No bids yet" && <span>Top bidder:</span>}
              <span className="font-medium text-foreground">{topBidder}</span>
            </div>

            {/* Max Bid Input - HIGHLIGHTED */}
            <div className="space-y-3">
              <Label
                htmlFor="maxBid"
                className="text-base flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-accent" />
                Your Maximum Bid
              </Label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                  $
                </div>
                <Input
                  id="maxBid"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={maxBid}
                  onChange={(e) => handleBidChange(e.target.value)}
                  className={`h-14 pl-10 pr-4 text-xl border-2 ${
                    error
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-accent/50 focus-visible:ring-accent focus-visible:border-accent bg-accent/5"
                  }`}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Quick Bid Buttons */}
              <div className="flex gap-2">
                {quickBidAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex-1 border-accent/30 hover:bg-accent/10 hover:border-accent"
                    onClick={() => {
                      setMaxBid(amount.toString());
                      setError("");
                    }}
                  >
                    ${amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Proxy Bidding Explanation */}
            <div className="border border-accent/30 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="w-full flex items-center justify-between p-3 bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-accent" />
                  <span className="text-accent text-sm font-medium">
                    How Proxy Bidding Works
                  </span>
                </div>
                {/* Mũi tên chỉ xuống/lên tùy trạng thái */}
                <span className="text-accent text-xs">
                  {showInfo ? "Hide" : "Show"}
                </span>
              </button>

              {showInfo && (
                <div className="p-3 bg-accent/5 border-t border-accent/30">
                  <ul className="text-xs text-accent/90 space-y-2 list-disc pl-4">
                    <li>
                      We'll automatically place bids on your behalf up to your
                      maximum amount
                    </li>
                    <li>You'll only pay the minimum amount needed to win</li>
                    <li>
                      We'll automatically counter-bid if someone outbids you
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Bid Summary */}
            {maxBid && !error && parseFloat(maxBid) > currentBid && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-2">
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>You will be the leading bidder</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Your initial bid will be ${minimumBid.toLocaleString()}, and
                  we'll automatically increase it up to $
                  {parseFloat(maxBid).toLocaleString()} if needed.
                </div>
              </div>
            )}

            {/* Submit Button */}
          </form>
        </div>
        <div className="space-y-2 px-6 mb-2">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!maxBid || !!error || isSubmitting}
          >
            <Gavel className="mr-2 h-5 w-5" />
            {isSubmitting ? "Placing Bid..." : "Confirm Bid"}
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
      </DialogContent>
    </Dialog>
  );
}
