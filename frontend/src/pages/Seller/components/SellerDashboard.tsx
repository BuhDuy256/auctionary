import { useState, useMemo } from "react";
import { useSellerDashboard } from "../../../hooks/useSellerDashboard";
import { formatRelativeTime, calculateTimeLeft } from "../../../utils/date";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
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
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
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
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { ProductStatus } from "../../../types/seller";
import { useNavigate } from "react-router-dom";

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
    case "pending":
      return (
        <Badge className="bg-info/20 text-info border-info/50">Pending</Badge>
      );
    default:
      return null;
  }
};

export function SellerDashboard({ onCreateAuction }: SellerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<ProductStatus[]>([
    "active",
    "sold",
    "expired",
    "removed",
  ]); // All selected by default

  // Sort state
  type SortColumn =
    | "id"
    | "title"
    | "category"
    | "startPrice"
    | "currentPrice"
    | "bidCount"
    | "endTime"
    | "createdAt"
    | null;
  type SortDirection = "asc" | "desc" | null;
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  // Available statuses with labels
  const statuses: { value: ProductStatus; label: string; count: number }[] =
    useMemo(() => {
      if (!data?.listings) return [];
      return [
        {
          value: "active",
          label: "Active",
          count: data.listings.filter((item) => item.status === "active")
            .length,
        },
        {
          value: "sold",
          label: "Sold",
          count: data.listings.filter((item) => item.status === "sold").length,
        },
        {
          value: "expired",
          label: "Expired",
          count: data.listings.filter((item) => item.status === "expired")
            .length,
        },
        {
          value: "removed",
          label: "Removed",
          count: data.listings.filter((item) => item.status === "removed")
            .length,
        },
      ];
    }, [data]);

  // Handle status toggle
  const toggleStatus = (status: ProductStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Handle select/clear all
  const selectAllStatuses = () => {
    setSelectedStatuses(statuses.map((s) => s.value));
  };

  const clearAllStatuses = () => {
    setSelectedStatuses([]);
  };

  // Remove individual status filter
  const removeStatusFilter = (status: ProductStatus) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };

  // Filter listings based on search query and selected statuses
  const filteredListings = useMemo(() => {
    if (!data?.listings) return [];
    return data.listings.filter((item) => {
      // Status filter
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
      // Search filter
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [data, searchQuery, selectedStatuses]);

  // Handle column sort click (3-state cycle: asc → desc → default)
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc → desc → null (default)
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort filtered listings
  const sortedListings = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      // Default sort by ID
      return [...filteredListings].sort((a, b) => a.id - b.id);
    }

    return [...filteredListings].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "category":
          aValue = a.categoryName.toLowerCase();
          bValue = b.categoryName.toLowerCase();
          break;
        case "startPrice":
          aValue = a.startPrice;
          bValue = b.startPrice;
          break;
        case "currentPrice":
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case "bidCount":
          aValue = a.bidCount;
          bValue = b.bidCount;
          break;
        case "endTime":
          aValue = new Date(a.endTime).getTime();
          bValue = new Date(b.endTime).getTime();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredListings, sortColumn, sortDirection]);

  // Helper to render sort icon
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-3 w-3" />;
    }
    return <ArrowDown className="ml-1 h-3 w-3" />;
  };

  const navigate = useNavigate();

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

              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Status
                    {selectedStatuses.length > 0 &&
                      selectedStatuses.length < 4 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 h-5 min-w-5 px-1"
                        >
                          {selectedStatuses.length}
                        </Badge>
                      )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    Filter by Status
                  </div>
                  <div className="px-2 py-1 space-y-1">
                    {statuses.map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center space-x-2 py-1.5 px-2 rounded-sm hover:bg-accent/20 cursor-pointer"
                        onClick={() => toggleStatus(status.value)}
                      >
                        <Checkbox
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={() => toggleStatus(status.value)}
                        />
                        <label className="flex-1 text-sm cursor-pointer">
                          {status.label}
                          <span className="ml-1 text-muted-foreground">
                            ({status.count})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="border-t px-2 py-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={selectAllStatuses}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={clearAllStatuses}
                    >
                      Clear All
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filters Pills */}
          {selectedStatuses.length > 0 && selectedStatuses.length < 4 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedStatuses.map((status) => (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {statuses.find((s) => s.value === status)?.label}
                    <button
                      onClick={() => removeStatusFilter(status)}
                      className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  onClick={clearAllStatuses}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead
                    className={`w-[80px] cursor-pointer select-none transition-colors ${
                      sortColumn === "id"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      ID
                      {renderSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`cursor-pointer select-none transition-colors ${
                      sortColumn === "title"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Product
                      {renderSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`cursor-pointer select-none transition-colors ${
                      sortColumn === "category"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {renderSortIcon("category")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`text-right cursor-pointer select-none transition-colors ${
                      sortColumn === "startPrice"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("startPrice")}
                  >
                    <div className="flex items-center justify-end">
                      Start Price
                      {renderSortIcon("startPrice")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`text-right cursor-pointer select-none transition-colors ${
                      sortColumn === "currentPrice"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("currentPrice")}
                  >
                    <div className="flex items-center justify-end">
                      Current Bid
                      {renderSortIcon("currentPrice")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`text-center cursor-pointer select-none transition-colors ${
                      sortColumn === "bidCount"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("bidCount")}
                  >
                    <div className="flex items-center justify-center">
                      Bids
                      {renderSortIcon("bidCount")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`cursor-pointer select-none transition-colors ${
                      sortColumn === "endTime"
                        ? "bg-accent/30 font-semibold"
                        : "hover:bg-accent/20"
                    }`}
                    onClick={() => handleSort("endTime")}
                  >
                    <div className="flex items-center">
                      Time Left
                      {renderSortIcon("endTime")}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedListings.map((item) => (
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
                          <DropdownMenuItem
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
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
