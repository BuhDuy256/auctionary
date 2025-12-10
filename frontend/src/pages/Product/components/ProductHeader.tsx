import { Badge } from "../../../components/ui/badge";
import { Clock, Heart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";

interface ProductHeaderProps {
  title: string;
  categoryName: string,
  timeLeft: string; // This should be calculated from endTime
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

export function ProductHeader({
  title,
  categoryName,
  timeLeft,
  isWatchlisted,
  onToggleWatchlist,
}: ProductHeaderProps) {
  // TODO: Implement real countdown logic based on endTime timestamp

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl">{title}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleWatchlist}
          className={isWatchlisted ? "text-destructive" : ""}
        >
          <Heart className={`h-5 w-5 ${isWatchlisted ? "fill-red-500" : ""}`} />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Badge variant="secondary">{categoryName}</Badge>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-accent" />
          <span>
            Ends in <span className="text-accent">{timeLeft}</span>
          </span>
        </div>
      </div>

      <Separator className="my-4" />
    </div>
  );
}
