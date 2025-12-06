import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  MoreVertical,
  Eye,
} from "lucide-react";
import { useMyBids } from "../../../hooks/useMyBids";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export const ActiveBidsTab = () => {
  const { bids, isLoading } = useMyBids();

  if (isLoading) return <div>Loading active bids...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Active Bids</h2>
          <p className="text-sm text-muted-foreground">
            {bids.length} auctions you're currently bidding on
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Current Bid</TableHead>
                <TableHead className="text-right">Your Max Bid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead className="text-right">Bids</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => {
                const isLeading =
                  Number(bid.my_max_bid) >= Number(bid.current_highest_bid);
                // Note: Logic for "Leading" might be complex if multiple same bids, but simplified here.
                // Actually relying on `highest_bidder_id` from backend query would be better if I exposed current user ID here.
                // Ideally backend `getActiveBids` returns "status" field.
                // For now, assume leading if my max bid >= current highest bid.

                return (
                  <TableRow
                    key={bid.product_id}
                    className={
                      isLeading ? "bg-accent/5 hover:bg-accent/10" : ""
                    }
                  >
                    <TableCell>
                      <div className="text-sm">{bid.name}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-accent">
                        $
                        {Number(
                          bid.current_highest_bid || bid.current_price
                        ).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground">
                        ${Number(bid.my_max_bid).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isLeading ? (
                        <Badge className="bg-success/20 text-success border-success/50">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Leading
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Outbid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(bid.end_time).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {bid.bid_count}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!isLeading && (
                            <DropdownMenuItem>
                              <TrendingUp className="h-4 w-4 mr-2 focus:text-accent-foreground" />
                              Increase Bid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2 focus:text-accent-foreground" />
                            View Detail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
