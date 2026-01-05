import { useState, useMemo } from "react";
import { useRatings } from "../../../hooks/useRatings";
import { useOtherUserRatings } from "../../../hooks/useOtherUserRatings";
import {
  Loader2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Pagination } from "../../../components/common/Pagination";
import type { RatingItem } from "../../../types/user";
import { Link } from "react-router-dom";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

interface RatingCardProps {
  rating: RatingItem;
}

const RatingCard = ({ rating }: RatingCardProps) => {
  const isPositive = rating.rating === 1;

  return (
    <Card className="border-border hover:border-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Reviewer Avatar */}
          <Avatar className="h-12 w-12 border-2 border-border flex-shrink-0">
            <AvatarFallback className="bg-accent/10 text-accent font-semibold">
              {getInitials(rating.reviewer.fullName)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {rating.reviewer.fullName}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      isPositive
                        ? "bg-green-500/20 text-green-500 border-green-500/50"
                        : "bg-red-500/20 text-red-500 border-red-500/50"
                    }`}
                  >
                    {isPositive ? (
                      <>
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Positive
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Negative
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(rating.completedAt || rating.transactionDate)} •{" "}
                  <span className="capitalize">{rating.userRole}</span> in this
                  transaction
                </div>
              </div>
              <div className="text-sm font-medium text-accent">
                {formatPrice(rating.finalPrice)}
              </div>
            </div>

            {/* Comment */}
            {rating.comment && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{rating.comment}</p>
                </div>
              </div>
            )}

            {/* Product Info */}
            <Link
              to={`/products/${rating.product.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              {rating.product.thumbnailUrl && (
                <img
                  src={rating.product.thumbnailUrl}
                  alt={rating.product.name}
                  className="h-12 w-12 rounded object-cover border border-border"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                  {rating.product.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Transaction #{rating.transactionId}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RatingsTabProps {
  userId?: number;
}

export const RatingsTab = ({ userId }: RatingsTabProps = {}) => {
  // Use different hooks based on whether viewing own or other user's ratings
  const ownRatings = useRatings("all");
  const otherRatings = useOtherUserRatings(userId!, "all");

  const { ratings, summary, isLoading, error } = userId
    ? otherRatings
    : ownRatings;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Client-side pagination
  const paginatedRatings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ratings.slice(startIndex, endIndex);
  }, [ratings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(ratings.length / itemsPerPage);

  // Reset to page 1 when items per page changes
  useMemo(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  if (isLoading && ratings.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading ratings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Summary */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl mb-1">{userId ? "Ratings" : "My Ratings"}</h2>
          <p className="text-sm text-muted-foreground">
            {ratings.length} {ratings.length === 1 ? "rating" : "ratings"}{" "}
            received
          </p>
        </div>
        {ratings.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-500">
                  {summary.totalPositive}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Positive</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold text-red-500">
                  {summary.totalNegative}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Negative</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-2xl font-bold text-accent">
                  {summary.positivePercentage}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Positive</div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {ratings.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border">
            <Star className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No ratings yet</h3>
            <p>
              Complete transactions to start receiving ratings from other users.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Ratings List */}
          <div className="space-y-3">
            {paginatedRatings.map((rating) => (
              <RatingCard key={rating.transactionId} rating={rating} />
            ))}
          </div>

          {/* Pagination */}
          {ratings.length > 10 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={ratings.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemLabel="ratings"
              pageSizeOptions={[10, 20, 30, 50]}
            />
          )}
        </>
      )}
    </div>
  );
};
