import { Card, CardContent } from "../../../components/ui/card";

export function AuctionCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card border-border w-[280px] max-w-[300px] flex-shrink-0">
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden bg-secondary animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3">
          <div className="h-4 w-20 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Top Bidder */}
        <div className="h-3 bg-muted-foreground/20 rounded w-1/2 animate-pulse"></div>

        {/* Divider */}
        <div className="pt-2 border-t border-border space-y-2">
          {/* Current Bid */}
          <div className="flex items-baseline justify-between">
            <div className="h-3 bg-muted-foreground/20 rounded w-16 animate-pulse"></div>
            <div className="h-5 bg-muted-foreground/20 rounded w-20 animate-pulse"></div>
          </div>

          {/* Buy Now Price */}
          <div className="flex items-baseline justify-between">
            <div className="h-3 bg-muted-foreground/20 rounded w-12 animate-pulse"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-16 animate-pulse"></div>
          </div>

          {/* Bids */}
          <div className="flex items-baseline justify-between">
            <div className="h-3 bg-muted-foreground/20 rounded w-8 animate-pulse"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-8 animate-pulse"></div>
          </div>
        </div>

        {/* Button */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-8 bg-muted-foreground/20 rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
