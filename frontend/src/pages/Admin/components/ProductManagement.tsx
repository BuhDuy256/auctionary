import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
  Package,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  Trash2,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Flag,
} from "lucide-react";
import { toast } from "sonner";

interface Auction {
  id: string;
  title: string;
  seller: {
    name: string;
    avatar: string;
  };
  category: string;
  currentBid: number;
  bids: number;
  views: number;
  status: "Active" | "Ended" | "Flagged" | "Removed";
  timeLeft: string;
  image: string;
  flagged?: boolean;
  flagReason?: string;
}

const auctionsData: Auction[] = [
  {
    id: "#8923",
    title: "Designer Handbag (Suspicious)",
    seller: {
      name: "Mike Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    category: "Fashion",
    currentBid: 850,
    bids: 23,
    views: 456,
    status: "Flagged",
    timeLeft: "2d 5h",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200",
    flagged: true,
    flagReason: "Counterfeit Product",
  },
  {
    id: "#8924",
    title: "Vintage Leica M6 Camera",
    seller: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    category: "Electronics",
    currentBid: 1400,
    bids: 34,
    views: 892,
    status: "Active",
    timeLeft: "1d 12h",
    image: "https://images.unsplash.com/photo-1755136979154-c491ac08dc37?w=200",
  },
  {
    id: "#8925",
    title: 'MacBook Pro 16" M3 Max',
    seller: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    category: "Electronics",
    currentBid: 2300,
    bids: 45,
    views: 1234,
    status: "Active",
    timeLeft: "3d 8h",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
  },
  {
    id: "#8926",
    title: "Rolex Submariner (Fake)",
    seller: {
      name: "Watch Seller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Watch",
    },
    category: "Fashion",
    currentBid: 3200,
    bids: 56,
    views: 2341,
    status: "Flagged",
    timeLeft: "5d 2h",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200",
    flagged: true,
    flagReason: "Fake Product",
  },
  {
    id: "#8927",
    title: "iPhone 15 Pro Max",
    seller: {
      name: "Tech Dealer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
    },
    category: "Electronics",
    currentBid: 980,
    bids: 28,
    views: 678,
    status: "Active",
    timeLeft: "6h 45m",
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=200",
  },
  {
    id: "#8928",
    title: "Sony A7IV Camera Body",
    seller: {
      name: "Emily Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    category: "Electronics",
    currentBid: 1850,
    bids: 41,
    views: 923,
    status: "Active",
    timeLeft: "4d 16h",
    image: "https://images.unsplash.com/photo-1606980227002-0f5c34f1dc3c?w=200",
  },
  {
    id: "#8929",
    title: "Limited Edition Sneakers",
    seller: {
      name: "Sneaker Head",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneaker",
    },
    category: "Fashion",
    currentBid: 650,
    bids: 19,
    views: 534,
    status: "Ended",
    timeLeft: "Ended",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
  {
    id: "#8930",
    title: 'iPad Pro 12.9" M2',
    seller: {
      name: "Alex Turner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    category: "Electronics",
    currentBid: 890,
    bids: 15,
    views: 432,
    status: "Active",
    timeLeft: "2d 3h",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200",
  },
];

export function ProductManagement() {
  const [auctions, setAuctions] = useState<Auction[]>(auctionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleRemoveAuction = (auctionId: string, title: string) => {
    setAuctions((prev) => prev.filter((auction) => auction.id !== auctionId));
    toast.success(`Auction "${title}" has been removed`);
  };

  const handleBanSeller = (sellerName: string) => {
    toast.success(`Seller "${sellerName}" has been banned`);
  };

  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch =
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || auction.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || auction.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: auctions.length,
    active: auctions.filter((a) => a.status === "Active").length,
    flagged: auctions.filter((a) => a.status === "Flagged").length,
    ended: auctions.filter((a) => a.status === "Ended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Product Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor all auctions and manage violations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground">
                  Total Auctions
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.active}</div>
                <div className="text-xs text-muted-foreground">
                  Active Auctions
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.flagged}</div>
                <div className="text-xs text-muted-foreground">
                  Flagged Items
                </div>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.ended}</div>
                <div className="text-xs text-muted-foreground">
                  Ended Auctions
                </div>
              </div>
              <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/30">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or auction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Collectibles">Collectibles</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Flagged">Flagged</SelectItem>
                <SelectItem value="Ended">Ended</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auctions Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Auctions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auction</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Bid</TableHead>
                <TableHead>Bids/Views</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAuctions.map((auction) => (
                <TableRow
                  key={auction.id}
                  className={auction.flagged ? "bg-red-500/5" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <ImageWithFallback
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm truncate">
                            {auction.title}
                          </span>
                          {auction.flagged && (
                            <Flag className="h-3 w-3 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <code className="text-xs font-mono px-2 py-0.5 rounded bg-secondary border border-border">
                          {auction.id}
                        </code>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={auction.seller.avatar} />
                        <AvatarFallback>
                          {auction.seller.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{auction.seller.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {auction.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-accent">
                      ${auction.currentBid.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {auction.bids} bids / {auction.views} views
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      {auction.status !== "Ended" && (
                        <Clock className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-muted-foreground">
                        {auction.timeLeft}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {auction.flagged && auction.flagReason ? (
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className="bg-red-500/20 text-red-500 border-red-500/50"
                        >
                          {auction.status}
                        </Badge>
                        <div className="text-xs text-red-500">
                          {auction.flagReason}
                        </div>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className={
                          auction.status === "Active"
                            ? "bg-green-500/20 text-green-500 border-green-500/50"
                            : auction.status === "Ended"
                            ? "bg-gray-500/20 text-gray-500 border-gray-500/50"
                            : "bg-red-500/20 text-red-500 border-red-500/50"
                        }
                      >
                        {auction.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="h-4 w-4 mr-2" />
                          View Reports
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Auction
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-red-500/30">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove Auction
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{auction.title}
                                "? This action cannot be undone and will notify
                                all bidders.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleRemoveAuction(auction.id, auction.title)
                                }
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Ban Seller
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-red-500/30">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ban Seller</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to ban seller "
                                {auction.seller.name}"? This will remove all
                                their active auctions and prevent them from
                                listing new items.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleBanSeller(auction.seller.name)
                                }
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Ban Seller
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
