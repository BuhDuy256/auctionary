import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { Clock, TrendingUp, Gavel } from "lucide-react";

interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bidCount: number;
  endTime: Date;
  isHot?: boolean;
}

export function AuctionCard({
  title,
  image,
  currentBid,
  bidCount,
  endTime,
  isHot = false,
}: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
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

  return (
    <Card className="group overflow-hidden border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex-shrink-0 w-[280px]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {isHot && (
          <Badge className="absolute top-2 right-2 bg-accent text-background border-none">
            HOT
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
          <div
            className={`flex items-center gap-1.5 text-xs ${
              isUrgent ? "text-error" : "text-accent"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="font-semibold">{timeLeft}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm line-clamp-2 min-h-[2.5rem]">{title}</h3>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Current Bid</span>
            <div className="text-accent text-xl font-semibold">
              ${currentBid.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Gavel className="h-3 w-3 mr-1" />
              {bidCount} bids
            </Badge>
            {bidCount > 20 && (
              <Badge
                variant="outline"
                className="text-xs border-accent text-accent"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </div>

        <Button className="w-full">Bid Now</Button>
      </CardContent>
    </Card>
  );
}
