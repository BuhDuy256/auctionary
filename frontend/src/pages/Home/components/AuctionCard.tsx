import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../components/ui/utils";

interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  buyNowPrice: number | null;
  seller: string;
  topBidder: string | null;
  bidCount: number;
  endTime: string; // ISO 8601 timestamp
  isHot?: boolean;
}

export function AuctionCard({
  id,
  title,
  image,
  currentBid,
  buyNowPrice,
  seller,
  topBidder,
  bidCount,
  endTime,
  isHot = false,
}: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft("ENDED");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Mark as urgent if less than 1 hour left
      setIsUrgent(hours < 1);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const productUrl = `/products/${id}`;

  return (
    <Card className="group overflow-hidden border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex-shrink-0 w-[280px] max-w-[300px]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={productUrl} className="block w-full h-full">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {isHot && (
          <Badge className="absolute top-2 right-2 bg-accent text-background border-none z-10">
            HOT
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3 pointer-events-none">
          <div
            className={`flex items-center gap-1.5 text-xs ${
              isUrgent ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{timeLeft}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link to={productUrl}>
            <h3 className="text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-accent transition-colors">
              {title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span>Seller:</span>
            <span className="text-foreground">{seller}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Top Bidder:</span>
            <span className="text-foreground">{topBidder || "None"}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Current Bid</span>
            <div className="text-accent text-lg">
              ${currentBid.toLocaleString()}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            {buyNowPrice ? (
              <span className="text-xs text-muted-foreground">Buy Now</span>
            ) : (
              <span className="text-xs text-muted-foreground opacity-50">
                Buy Now
              </span>
            )}

            <div
              className={cn(
                "text-success text-sm",
                !buyNowPrice && "opacity-50"
              )}
            >
              {buyNowPrice ? "$" + buyNowPrice.toLocaleString() : "---"}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Bids</span>
            <div className="text-foreground">{bidCount}</div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={productUrl} className="flex-1">
            <Button className="w-full" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Product
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
