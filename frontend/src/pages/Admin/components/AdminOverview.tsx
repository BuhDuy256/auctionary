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
  Clock,
  CheckCircle2,
  Activity,
  Gavel,
  AlertCircle,
} from "lucide-react";
import { useAdminOverview } from "../../../hooks/useAdminOverview";
import { formatRelativeTime } from "../../../utils/date";
import { useNavigate } from "react-router-dom";

export function AdminOverview() {
  const { data, isLoading, error, refetch } = useAdminOverview();
  const navigate = useNavigate();

  // Stats card configuration
  const statsCards = [
    {
      title: "Total Bidders",
      value: data?.stats.totalBidders ?? 0,
      icon: Gavel,
      color: "blue",
    },
    {
      title: "Total Sellers",
      value: data?.stats.totalSellers ?? 0,
      icon: Users,
      color: "red",
    },
    {
      title: "Total Auctions",
      value: data?.stats.totalAuctions ?? 0,
      icon: Package,
      color: "accent",
    },
    {
      title: "Total Revenue",
      value: data?.stats.totalRevenue ?? 0,
      icon: DollarSign,
      color: "green",
      isRevenue: true,
    },
  ];

  // Loading skeleton for stats cards
  const StatsCardSkeleton = () => (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4 animate-pulse">
          <div className="h-12 w-12 rounded-lg bg-secondary" />
        </div>
        <div className="h-8 w-20 bg-secondary rounded mb-1 animate-pulse" />
        <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
      </CardContent>
    </Card>
  );

  // Loading skeleton for recent auctions
  const AuctionSkeleton = () => (
    <div className="p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex gap-2 flex-1">
          <div className="w-12 h-12 rounded bg-secondary" />
          <div className="flex flex-col justify-center gap-2 flex-1">
            <div className="h-4 w-1/2 bg-secondary rounded" />
            <div className="h-3 w-1/3 bg-secondary rounded" />
          </div>
        </div>
        <div className="h-3 w-20 bg-secondary rounded ml-4" />
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor platform activity and manage operations
          </p>
        </div>
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg mb-2">Error Loading Overview</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={refetch}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))
          : statsCards.map((stat) => {
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
                    <div className="text-2xl mb-1">
                      {isLoading
                        ? "---"
                        : stat.isRevenue
                        ? `$${stat.value.toLocaleString()}`
                        : stat.value.toLocaleString()}
                    </div>
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
              {isLoading ? (
                <div className="divide-y divide-border">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AuctionSkeleton key={i} />
                  ))}
                </div>
              ) : data?.recentAuctions && data.recentAuctions.length > 0 ? (
                <div className="divide-y divide-border">
                  {data.recentAuctions.map((auction) => (
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
                          {formatRelativeTime(auction.time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No recent auctions found
                </div>
              )}
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
                    {isLoading ? "---" : data?.pendingApprovals.sellerRequests}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={
                    isLoading ||
                    !data ||
                    data.pendingApprovals.sellerRequests === 0
                  }
                  onClick={() =>
                    navigate("/admin", {
                      state: { defaultTab: "upgrade-requests" },
                    })
                  }
                >
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
              {isLoading ? (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between animate-pulse"
                    >
                      <div className="h-4 w-24 bg-secondary rounded" />
                      <div className="h-5 w-20 bg-secondary rounded" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Database</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                      {data?.systemStatus.database === "operational"
                        ? "Operational"
                        : data?.systemStatus.database}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Gateway
                    </span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                      {data?.systemStatus.paymentGateway === "operational"
                        ? "Operational"
                        : data?.systemStatus.paymentGateway}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email Service</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                      {data?.systemStatus.emailService === "operational"
                        ? "Operational"
                        : data?.systemStatus.emailService}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">API</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50 text-xs">
                      {data?.systemStatus.api === "operational"
                        ? "Operational"
                        : data?.systemStatus.api}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
