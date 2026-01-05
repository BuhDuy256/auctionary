import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import {
  TrendingUp,
  Crown,
  Ban,
  Loader2,
  MoreVertical,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";

interface BidHistoryItem {
  id: string;
  bidderId: number;
  timestamp: string;
  bidder: string;
  amount: number;
  isTopBid?: boolean;
}

interface BidHistoryProps {
  bids: BidHistoryItem[];
  isSeller?: boolean;
  auctionStatus?: string;
  currentUserId?: number;
  onRejectBidder?: (bidderId: number, reason: string) => Promise<void>;
}

export function BidHistory({
  bids,
  isSeller = false,
  auctionStatus = "active",
  currentUserId,
  onRejectBidder,
}: BidHistoryProps) {
  const navigate = useNavigate();
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    bidderId: number | null;
    bidderName: string;
  }>({
    open: false,
    bidderId: null,
    bidderName: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const showActions = isSeller && auctionStatus === "active";

  const handleRejectClick = (bidderId: number, bidderName: string) => {
    setRejectDialog({ open: true, bidderId, bidderName });
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectDialog.bidderId || !rejectionReason.trim() || !onRejectBidder)
      return;

    try {
      setIsRejecting(true);
      await onRejectBidder(rejectDialog.bidderId, rejectionReason.trim());
      notify.success("Bidder rejected successfully. Auction recalculated.");
      setRejectDialog({ open: false, bidderId: null, bidderName: "" });
      setRejectionReason("");
    } catch (error: any) {
      console.error("Failed to reject bidder:", error);
      notify.error(
        error?.response?.data?.message ||
          "Failed to reject bidder. Please try again."
      );
    } finally {
      setIsRejecting(false);
    }
  };

  const handleCancelReject = () => {
    setRejectDialog({ open: false, bidderId: null, bidderName: "" });
    setRejectionReason("");
  };

  return (
    <>
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
                {showActions && (
                  <TableHead className="text-right w-[100px]">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showActions ? 4 : 3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No bids placed yet. Be the first to bid!
                  </TableCell>
                </TableRow>
              ) : (
                bids.map((bid, index) => {
                  const isCurrentUser =
                    currentUserId && bid.bidderId === currentUserId;
                  const isTopBid = bid.isTopBid;

                  return (
                    <TableRow
                      key={bid.id}
                      className={
                        isCurrentUser
                          ? "bg-blue-500/10 hover:bg-blue-500/15 border-l-2 border-l-blue-500"
                          : isTopBid
                          ? "bg-accent/5 hover:bg-accent/10"
                          : ""
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
                          {isCurrentUser && (
                            <Badge
                              variant="outline"
                              className="border-blue-500 text-blue-500 text-xs"
                            >
                              Me
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
                      {showActions && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/users/${bid.bidderId}/profile`)
                                }
                              >
                                <User className="mr-2 h-4 w-4 group-focus:text-accent" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive group focus:text-destructive focus:bg-destructive/10"
                                onClick={() =>
                                  handleRejectClick(bid.bidderId, bid.bidder)
                                }
                              >
                                <Ban className="mr-2 h-4 w-4 group-focus:text-destructive" />
                                Reject Bidder
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reject Bidder Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={handleCancelReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bidder</DialogTitle>
            <DialogDescription>
              You are about to reject <strong>{rejectDialog.bidderName}</strong>{" "}
              from bidding on this auction. Their bids will be removed and the
              auction will be recalculated. Please provide a reason for this
              action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Suspicious bidding activity, bid manipulation, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
                disabled={isRejecting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelReject}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
