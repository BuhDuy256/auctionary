import { useState } from "react";
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
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";

interface SellerDashboardProps {
  onCreateAuction: () => void;
}

const sellerStats = [
  {
    label: "Active Auctions",
    value: "8",
    change: "+2 this week",
    icon: Package,
    color: "text-amber",
  },
  {
    label: "Total Bids",
    value: "247",
    change: "+45 today",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+$2,100 this month",
    icon: DollarSign,
    color: "text-amber",
  },
  {
    label: "Avg. Bid Time",
    value: "2.5 days",
    change: "-0.3 days",
    icon: Clock,
    color: "text-blue-500",
  },
];

const sellingItems = [
  {
    id: "AUC-1001",
    image:
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHByb2R1Y3R8ZW58MXx8fHwxNzY0MTYxNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Luxury Swiss Chronograph Watch",
    category: "Watches",
    startPrice: 1000,
    currentBid: 4500,
    bids: 45,
    views: 1247,
    timeLeft: "2h 15m",
    status: "active",
    listed: "3 days ago",
  },
  {
    id: "AUC-1002",
    image:
      "https://images.unsplash.com/photo-1607720844146-7351a68014c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwY2xvc2V1cHxlbnwxfHx8fDE3NjQxNzU3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Premium Noise-Cancelling Headphones",
    category: "Electronics",
    startPrice: 200,
    currentBid: 380,
    bids: 28,
    views: 892,
    timeLeft: "1d 4h",
    status: "active",
    listed: "2 days ago",
  },
  {
    id: "AUC-1003",
    image:
      "https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNuZWFrZXJzJTIwd2hpdGV8ZW58MXx8fHwxNzY0MTQwMDU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Limited Edition Designer Sneakers",
    category: "Fashion",
    startPrice: 500,
    currentBid: 850,
    bids: 32,
    views: 1534,
    timeLeft: "3h 42m",
    status: "active",
    listed: "5 days ago",
  },
  {
    id: "AUC-1004",
    image:
      "https://images.unsplash.com/photo-1431068799455-80bae0caf685?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY0MDcwNTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Professional DSLR Camera Kit",
    category: "Cameras",
    startPrice: 800,
    currentBid: 0,
    bids: 0,
    views: 234,
    timeLeft: "6d 12h",
    status: "pending",
    listed: "12 hours ago",
  },
  {
    id: "AUC-998",
    image:
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHByb2R1Y3R8ZW58MXx8fHwxNzY0MTYxNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Vintage Rolex Submariner",
    category: "Watches",
    startPrice: 5000,
    currentBid: 8200,
    bids: 67,
    views: 3421,
    timeLeft: "Ended",
    status: "sold",
    listed: "10 days ago",
  },
  {
    id: "AUC-995",
    image:
      "https://images.unsplash.com/photo-1607720844146-7351a68014c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwY2xvc2V1cHxlbnwxfHx8fDE3NjQxNzU3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Studio Monitor Headphones",
    category: "Electronics",
    startPrice: 150,
    currentBid: 0,
    bids: 0,
    views: 89,
    timeLeft: "Ended",
    status: "unsold",
    listed: "8 days ago",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
          Active
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">
          Pending
        </Badge>
      );
    case "sold":
      return (
        <Badge className="bg-amber/20 text-amber border-amber/50">Sold</Badge>
      );
    case "unsold":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Unsold
        </Badge>
      );
    default:
      return null;
  }
};

export function SellerDashboard({ onCreateAuction }: SellerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

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
                <div className="text-xs text-muted-foreground">
                  {stat.change}
                </div>
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
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead>Time Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellingItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-border hover:bg-secondary/30"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm truncate max-w-xs">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.listed}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.startPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.currentBid > 0 ? (
                        <span className="text-amber">
                          ${item.currentBid.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No bids</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{item.bids}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span>{item.views}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        {item.timeLeft !== "Ended" && (
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span>{item.timeLeft}</span>
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
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {item.status === "active" && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Auction
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
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

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-amber/30 bg-amber/5 cursor-pointer hover:bg-amber/10 transition-colors">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber/20">
              <CheckCircle2 className="h-6 w-6 text-amber" />
            </div>
            <div>
              <div className="text-sm mb-1">Pending Actions</div>
              <div className="text-xs text-muted-foreground">
                3 items need attention
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border cursor-pointer hover:bg-secondary/30 transition-colors">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <div className="text-sm mb-1">Performance Report</div>
              <div className="text-xs text-muted-foreground">
                View analytics
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border cursor-pointer hover:bg-secondary/30 transition-colors">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary">
              <AlertCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm mb-1">Messages</div>
              <div className="text-xs text-muted-foreground">
                5 unread messages
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
