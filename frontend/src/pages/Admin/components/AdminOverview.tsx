import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Users,
  Package,
  DollarSign,
  UserPlus,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";

const statsCards = [
  {
    title: "Total Users",
    value: "12,458",
    icon: Users,
    color: "blue",
  },
  {
    title: "Active Auctions",
    value: "1,234",
    icon: Package,
    color: "accent",
  },
  {
    title: "New Seller Requests",
    value: "12",
    icon: UserPlus,
    color: "red",
  },
  {
    title: "Total Revenue",
    value: "$842,390",
    icon: DollarSign,
    color: "green",
  },
];

const recentAuctions = [
  {
    id: 1,
    title: "Apple Watch Series 6",
    category: "Electronics",
    thumbnail:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&h=200&q=80",
    seller: "John Doe",
    time: "2 minutes ago",
  },
  {
    id: 2,
    title: "Vintage Film Camera",
    category: "Collectibles",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&h=200&q=80",
    seller: "Jane Smith",
    time: "15 minutes ago",
  },
  {
    id: 3,
    title: "Leather Designer Bag",
    category: "Fashion",
    thumbnail:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&h=200&q=80",
    seller: "Alice Johnson",
    time: "30 minutes ago",
  },
  {
    id: 4,
    title: "Rare Coin Collection",
    category: "Collectibles",
    thumbnail:
      "https://images.unsplash.com/photo-1620189507195-68309c04c0a6?auto=format&fit=crop&w=200&h=200&q=80",
    seller: "Bob Williams",
    time: "1 hour ago",
  },
  {
    id: 5,
    title: "Fender Electric Guitar",
    category: "Music Instruments",
    thumbnail:
      "https://images.unsplash.com/photo-1550985543-f4423c9d7481?auto=format&fit=crop&w=200&h=200&q=80",
    seller: "Charlie Brown",
    time: "2 hours ago",
  },
];

export function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor platform activity and manage operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-500/10 border-blue-500/30 text-blue-500",
            accent: "bg-accent/10 border-accent/30 text-accent",
            red: "bg-red-500/10 border-red-500/30 text-red-500",
            green: "bg-green-500/10 border-green-500/30 text-green-500",
          };

          return (
            <Card key={stat.title} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg border ${
                      colorClasses[stat.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.title}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Newest Auctions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentAuctions.map((auction) => {
                  return (
                    <div
                      key={auction.id}
                      className="p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-1">
                            <img
                              src={auction.thumbnail}
                              alt={auction.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex flex-col justify-center">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{auction.title}</span>
                                <Badge className="bg-accent/20 text-accent border-accent/50">
                                  {auction.category}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {auction.seller}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {auction.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Seller Requests</span>
                  <Badge className="bg-accent/20 text-accent border-accent/50">
                    12
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Review Requests
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Gateway</span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email Service</span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API</span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                  Operational
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
