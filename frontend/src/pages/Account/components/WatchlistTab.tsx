import { Button } from "../../../components/ui/button";
import { WatchlistCard } from "./WatchlistCard";
import { useWatchlist } from "../../../hooks/useWatchlist";
import { Loader2, Trash2, HeartCrack } from "lucide-react";
import type { WatchlistProduct } from "../../../types/watchlist";

export const WatchlistTab = () => {
  const { watchlist, isLoading, removeFromWatchlist } = useWatchlist();

  const handleRemove = async (item: WatchlistProduct) => {
    await removeFromWatchlist(item);
  };

  const handleClearAll = () => {};

  if (isLoading && watchlist.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading watchlist...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">My Watchlist</h2>
          <p className="text-sm text-muted-foreground">
            {watchlist.length} items you're watching
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleClearAll}
          disabled={watchlist.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      {watchlist.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border">
            <HeartCrack className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Your watchlist is empty</h3>
            <p>Start exploring auctions and save your favorites here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {watchlist.map((item) => (
            <WatchlistCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              currentBid={Number(item.currentBid)}
              timeLeft={item.timeLeft}
              bidCount={item.bidCount}
              isActive={!(item.timeLeft === "Ended")}
              onRemove={() => handleRemove(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
