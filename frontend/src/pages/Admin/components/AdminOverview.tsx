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
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const statsCards = [
  {
    title: "Total Users",
    value: "12,458",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    color: "blue",
  },
  {
    title: "Active Auctions",
    value: "1,234",
    change: "+8.2%",
    trend: "up" as const,
    icon: Package,
    color: "accent",
  },
  {
    title: "New Seller Requests",
    value: "12",
    change: "+3",
    trend: "up" as const,
    icon: UserPlus,
    color: "red",
  },
  {
    title: "Total Revenue",
    value: "$842,390",
    change: "+23.1%",
    trend: "up" as const,
    icon: DollarSign,
    color: "green",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "user",
    user: "John Smith",
    action: "registered as new seller",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    type: "auction",
    user: "Sarah Johnson",
    action: 'posted new auction "Vintage Camera"',
    time: "15 minutes ago",
    status: "active",
  },
  {
    id: 3,
    type: "violation",
    user: "Mike Davis",
    action: "reported auction #8923 for fake item",
    time: "1 hour ago",
    status: "flagged",
  },
  {
    id: 4,
    type: "transaction",
    user: "Emily Chen",
    action: "completed transaction TXN-89234",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 5,
    type: "user",
    user: "Alex Turner",
    action: "upgraded to seller account",
    time: "3 hours ago",
    status: "completed",
  },
];

const flaggedAuctions = [
  {
    id: "#8923",
    product: "Designer Handbag",
    seller: "Mike Davis",
    reason: "Counterfeit Product",
    reports: 5,
    status: "Under Review",
  },
  {
    id: "#7821",
    product: "iPhone 15 Pro",
    seller: "Tech Dealer",
    reason: "Misleading Description",
    reports: 3,
    status: "Under Review",
  },
  {
    id: "#6745",
    product: "Rolex Watch",
    seller: "Watch Seller",
    reason: "Fake Product",
    reports: 8,
    status: "Action Required",
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
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
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
                  Recent Activity
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivities.map((activity) => {
                  const statusConfig = {
                    pending: { color: "yellow-500", label: "Pending" },
                    active: { color: "blue-500", label: "Active" },
                    flagged: { color: "red-500", label: "Flagged" },
                    completed: { color: "green-500", label: "Completed" },
                  };

                  const config =
                    statusConfig[activity.status as keyof typeof statusConfig];

                  return (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{activity.user}</span>
                            <Badge
                              variant="outline"
                              className={`bg-${config.color}/20 text-${config.color} border-${config.color}/50 text-xs`}
                            >
                              {config.label}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {activity.action}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {activity.time}
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

              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Reported Auctions</span>
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/50">
                    3
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Review Reports
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Disputes</span>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                    7
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Review Disputes
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

      {/* Flagged Auctions Table */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Flagged Auctions
            </CardTitle>
            <Button variant="outline" size="sm">
              View All Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auction ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <code className="text-xs font-mono px-2 py-1 rounded bg-secondary border border-border">
                      {auction.id}
                    </code>
                  </TableCell>
                  <TableCell>{auction.product}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {auction.seller}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-red-500/20 text-red-500 border-red-500/50"
                    >
                      {auction.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-accent/20 text-accent border-accent/50">
                      {auction.reports}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {auction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
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
}
