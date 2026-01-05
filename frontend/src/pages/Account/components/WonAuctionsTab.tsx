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
import { CheckCircle2, Clock, Package, XCircle } from "lucide-react";
import { useMyWonAuctions } from "../../../hooks/useMyWonAuctions";
import { useOtherUserWonAuctions } from "../../../hooks/useOtherUserWonAuctions";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../../../components/ImageWithFallback";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-success/20 text-success border-success/50">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">
          <Package className="h-3 w-3 mr-1" />
          Delivered
        </Badge>
      );
    default:
      return (
        <Badge className="bg-accent/20 text-accent border-accent/50">
          <Clock className="h-3 w-3 mr-1" />
          {status.replace(/_/g, " ")}
        </Badge>
      );
  }
};

interface WonAuctionsTabProps {
  userId?: number;
}

export const WonAuctionsTab = ({ userId }: WonAuctionsTabProps = {}) => {
  const navigate = useNavigate();

  // Use different hooks based on whether viewing own or other user's auctions
  const ownAuctions = useMyWonAuctions();
  const otherAuctions = useOtherUserWonAuctions(userId!);

  const { wonAuctions, isLoading } = userId
    ? {
        wonAuctions: otherAuctions.auctions,
        isLoading: otherAuctions.isLoading,
      }
    : {
        wonAuctions: ownAuctions.wonAuctions,
        isLoading: ownAuctions.isLoading,
      };

  if (isLoading) return <div>Loading won auctions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Won Auctions</h2>
          <p className="text-sm text-muted-foreground">
            Your auction win history
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Final Price</TableHead>
                <TableHead>Won Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wonAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <ImageWithFallback
                          src={auction.thumbnail_url || ""}
                          alt={auction.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm">{auction.product_name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-accent">
                      ${Number(auction.final_price).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(auction.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-muted-foreground">
                      AUC-{auction.id}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(auction.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/transactions/${auction.id}`)}
                    >
                      View Transaction
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
