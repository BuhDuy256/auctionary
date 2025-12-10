import { useState, useMemo } from "react";
import { useSellerDashboard } from "../../hooks/useSellerDashboard";
import { formatRelativeTime, calculateTimeLeft } from "../../utils/date";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ImageWithFallback } from "../ImageWithFallback";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import type { ProductStatus } from "../../types/seller";

interface SellerDashboardProps {
  onCreateAuction: () => void;
}
const subscription = {
  plan: "Basic Seller",
  status: "active",
  expiryDate: "2025-03-25",
  daysLeft: 2,
};

const getStatusBadge = (status: ProductStatus) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-success/20 text-success border-success/50">
          Active
        </Badge>
      );
    case "removed":
      return (
        <Badge className="bg-destructive/20 text-destructive border-destructive/50">
          Removed
        </Badge>
      );
    case "sold":
      return (
        <Badge className="bg-accent/20 text-accent border-accent/50">
          Sold
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Expired
        </Badge>
      );
    default:
      return null;
  }
};

export function SellerDashboard({ onCreateAuction }: SellerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, error } = useSellerDashboard();

  // Transform stats data for UI display
  const sellerStats = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Active Auctions",
        value: data.stats.activeAuctions.toString(),
        icon: Package,
        color: "text-accent",
      },
      {
        label: "Total Bids",
        value: data.stats.totalBids.toString(),
        icon: TrendingUp,
        color: "text-success",
      },
      {
        label: "Total Revenue",
        value: `$${data.stats.totalRevenue.toLocaleString()}`,
        icon: DollarSign,
        color: "text-accent",
      },
      {
        label: "Avg. Bid Time",
        value: `${data.stats.avgBidTime.toFixed(1)} days`,
        icon: Clock,
        color: "text-info",
      },
    ];
  }, [data]);

  // Filter listings based on search query
  const filteredListings = useMemo(() => {
    if (!data?.listings) return [];
    if (!searchQuery) return data.listings;
    return data.listings.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your auctions and track performance
          </p>
        </div>
        <Button size="lg" onClick={onCreateAuction}>
          <Plus className="mr-2 h-5 w-5" />
          Create New Auction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sellerStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Listings Table */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Listings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Start Price</TableHead>
                  <TableHead className="text-right">Current Bid</TableHead>
                  <TableHead className="text-center">Bids</TableHead>
                  <TableHead>Time Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-border hover:bg-secondary/30"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      AUC-{item.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <ImageWithFallback
                            src={item.thumbnailUrl || ""}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm truncate max-w-xs">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatRelativeTime(item.createdAt)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.startPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.currentPrice > 0 ? (
                        <span className="text-accent">
                          ${item.currentPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No bids</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{item.bidCount}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        {calculateTimeLeft(item.endTime) !== "Ended" && (
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span>{calculateTimeLeft(item.endTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-w-48">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4 focus:text-accent-foreground" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            Delete Auction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Trạng Thái Gói & Gia Hạn (Đã bỏ giới hạn bài đăng) */}
        <Card className="border-border lg:col-span-1 bg-secondary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Subscription</CardTitle>
              <Badge
                variant="outline"
                className="bg-accent/10 text-accent border-accent/20"
              >
                {subscription.plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 1. Ngày hết hạn */}
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Valid Until
              </span>
              <span
                className={`text-sm font-medium ${
                  subscription.daysLeft <= 7 ? "text-orange-500" : ""
                }`}
              >
                {new Date(subscription.expiryDate).toLocaleDateString()}
              </span>
            </div>

            {/* 3. Logic hiển thị nút bấm hành động */}
            <div className="pt-2">
              {subscription.daysLeft <= 0 ? (
                // Case 1: Đã hết hạn -> Cảnh báo Đỏ
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-destructive text-xs font-medium mb-2">
                    <AlertTriangle className="h-4 w-4" /> Plan Expired
                  </div>
                  <Button size="sm" variant="destructive" className="w-full">
                    Reactivate Plan
                  </Button>
                </div>
              ) : subscription.daysLeft <= 2 ? (
                // Case 2: Sắp hết hạn -> Cảnh báo Vàng
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-600 text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Expires in{" "}
                      {subscription.daysLeft} days
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-yellow-600/30 text-yellow-600"
                  >
                    Renew Now
                  </Button>
                </div>
              ) : (
                // Case 3: Còn hạn dài -> Thông báo Xanh
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Account is in good
                  standing
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Tips (Giữ nguyên) */}
        <Card className="border-border lg:col-span-2 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-lg">Selling Tips</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Auctions ending on <strong>Sunday evenings</strong> tend to get
                20% more bids.
              </li>
              <li>
                Adding at least <strong>5 high-quality photos</strong> increases
                trust significantly.
              </li>
              <li>
                Responding to questions within 1 hour boosts your seller rating.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
