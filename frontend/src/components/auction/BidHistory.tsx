import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { TrendingUp, Crown } from "lucide-react";

interface BidHistoryItem {
  id: string;
  timestamp: string;
  bidder: string;
  amount: number;
  isTopBid?: boolean;
}

interface BidHistoryProps {
  bids: BidHistoryItem[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-muted-foreground">
          {bids.length} {bids.length === 1 ? "bid" : "bids"} placed
        </h3>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              <TableHead className="w-[180px]">Time</TableHead>
              <TableHead>Bidder</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  No bids placed yet. Be the first to bid!
                </TableCell>
              </TableRow>
            ) : (
              bids.map((bid, index) => (
                <TableRow
                  key={bid.id}
                  className={
                    bid.isTopBid ? "bg-accent/5 hover:bg-accent/10" : ""
                  }
                >
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(bid.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{bid.bidder}</span>
                      {bid.isTopBid && (
                        <Badge
                          variant="outline"
                          className="border-accent text-accent text-xs"
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          Top Bid
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={`${
                          bid.isTopBid ? "text-accent" : "text-foreground"
                        }`}
                      >
                        ${bid.amount.toLocaleString()}
                      </span>
                      {index < bids.length - 1 &&
                        bids[index + 1].amount < bid.amount && (
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
