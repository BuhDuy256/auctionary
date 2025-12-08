import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../ImageWithFallback";
import { Heart, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface WatchlistCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  timeLeft: string;
  bidCount: number;
  isActive: boolean;
  // Props mới để xử lý xóa
  onRemove: () => void;
}

export function WatchlistCard({
  id,
  title,
  image,
  currentBid,
  timeLeft,
  bidCount,
  isActive,
  onRemove,
}: WatchlistCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/products/${id}`}>
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Nút Tim luôn đỏ. Bấm vào là gọi onRemove */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Ngăn click lan ra ngoài
            onRemove();
          }}
          className="absolute h-8 w-8 top-2 right-2 bg-background/80 backdrop-blur hover:bg-background z-10 rounded-full"
        >
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        </Button>

        {!isActive && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            Ended
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm line-clamp-2 min-h-[2.5rem]">{title}</h3>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Current Bid</span>
            <div
              className={`text-lg ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              ${currentBid.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{bidCount} bids</span>
            </div>
          </div>
        </div>

        {isActive ? (
          <Button className="w-full" size="sm">
            Place Bid
          </Button>
        ) : (
          <Button variant="outline" className="w-full" size="sm" disabled>
            Auction Ended
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
