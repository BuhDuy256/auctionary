import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Star } from "lucide-react";
import type { SellerInfo } from "../../../types/product";

interface SellerCardProps {
  seller: SellerInfo;
}

export function SellerCard({ seller }: SellerCardProps) {
  // Calculate stars based on rating (0-5)
  // Assuming rating.average is 0-5. If it's percentage, adjust accordingly.
  // The user said: "The star = Positive Reviews Ratio * 5"
  // But the backend returns `rating: { average, totalReviews, positivePercentage }`
  // Let's use `rating.average` if available, or calculate from positivePercentage.

  const stars = Math.round(
    seller.rating.average || (seller.rating.positivePercentage / 100) * 5
  );

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12 border-2 border-border">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.name}`}
        />
        <AvatarFallback>
          {seller.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="text-sm">
          Sold by <span className="text-accent">{seller.name}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= stars
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({seller.rating.totalReviews} reviews)
          </span>
          <Badge
            variant="outline"
            className="text-xs border-success/50 text-success"
          >
            {seller.rating.positivePercentage}% Positive
          </Badge>
        </div>
      </div>
    </div>
  );
}
