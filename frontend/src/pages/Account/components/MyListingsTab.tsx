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
  Edit,
  FileEdit,
  AlertCircle,
  Sparkles,
  MoreVertical,
} from "lucide-react";
import { useMyListings } from "../../../hooks/useMyListings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export const MyListingsTab = () => {
  const { listings, isLoading } = useMyListings();

  if (isLoading) return <div>Loading listings...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">My Listings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your active and past listings
          </p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Post New Auction
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Starting Price</TableHead>
                <TableHead className="text-right">Current Bid</TableHead>
                <TableHead className="text-right">Bids</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow
                  key={listing.product_id}
                  className={
                    listing.status === "active" && listing.bid_count > 0
                      ? "bg-accent/5"
                      : ""
                  }
                >
                  <TableCell>
                    <div className="text-sm">{listing.name}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      ${Number(listing.start_price).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(listing.current_price) > 0 ? (
                      <span className="text-accent">
                        ${Number(listing.current_price).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {listing.bid_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(listing.end_time).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {listing.status === "active" ? (
                      <Badge className="bg-success/20 text-success border-success/50">
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-accent/50 text-accent"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {listing.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2 focus:text-accent-foreground" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileEdit className="h-4 w-4 mr-2 focus:text-accent-foreground" />
                            Update
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
