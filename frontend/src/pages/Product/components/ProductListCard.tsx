import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { Clock, Sparkles, ShoppingCart, Heart } from "lucide-react";
import { cn } from "../../../components/ui/utils";
import { Link } from "react-router-dom";
import { useWatchlist } from "../../../hooks/useWatchlist";
import type { WatchlistProduct } from "../../../types/watchlist";

export interface BidProductData {
  id: string;
  title: string;
  currentBid: number;
  topBidder: string;
  minimumBid: number;
}

interface ProductListCardProps {
  id: string;
  slug?: string;
  title: string;
  image: string;
  currentBid: number;
  buyNowPrice?: number;
  topBidder: string;
  timeLeft: string;
  isNewArrival?: boolean;
  bidCount: number;
  handleOpenBidModal: (data: BidProductData) => void;
}

export function ProductListCard({
  id,
  slug,
  title,
  image,
  currentBid,
  buyNowPrice,
  topBidder,
  timeLeft,
  isNewArrival = false,
  bidCount,
  handleOpenBidModal,
}: ProductListCardProps) {
  const productUrl = slug ? `/products/${slug}-${id}` : `/products/${id}`;
  const { addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();

  const productIdNumber = id;
  const isLove = isWatched(productIdNumber);

  const handleQuickPlaceBid = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleOpenBidModal({
      id,
      title,
      currentBid,
      topBidder,
      minimumBid: currentBid + 50,
    });
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLove) {
      removeFromWatchlist(productIdNumber);
    } else {
      addToWatchlist({
        id: productIdNumber,
        title: title,
        image: image,
        currentBid: currentBid,
        topBidder: topBidder,
        timeLeft: timeLeft,
        bidCount: bidCount,
        isNewArrival: isNewArrival,
      } as WatchlistProduct);
    }
  };

  return (
    <Card
      className={`group overflow-hidden bg-card hover:shadow-lg transition-all duration-300 ${
        isNewArrival
          ? "border-accent shadow-accent/20 glow-accent"
          : "border-border hover:border-accent/50"
      }`}
    >
      {isNewArrival && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>
      )}

      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={productUrl} className="block w-full h-full">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleWatchlist}
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/90 transition-all"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-300",
              isLove
                ? "fill-red-500 text-red-500"
                : "text-foreground/70 hover:text-red-500"
            )}
          />
        </Button>

        {isNewArrival && (
          <Badge className="absolute top-2 left-2 bg-accent text-background border-none animate-pulse pointer-events-none">
            <Sparkles className="h-3 w-3 mr-1" />
            New Arrival
          </Badge>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3 pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Top Bidder:</span>
            <span className="text-foreground">{topBidder}</span>
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
          <Button className="flex-1" size="sm" onClick={handleQuickPlaceBid}>
            Place Bid
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "border-success/50 text-success hover:bg-success/10",
              !buyNowPrice && "opacity-50"
            )}
            disabled={!buyNowPrice}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
