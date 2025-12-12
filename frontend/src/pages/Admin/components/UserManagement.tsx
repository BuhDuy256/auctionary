import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
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
  Users,
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Bidder" | "Seller";
  status: "Active" | "Suspended" | "Pending";
  joined: string;
  totalBids?: number;
  totalSales?: number;
  reputation: number;
  avatar: string;
}

interface UpgradeRequest {
  id: string;
  user: User;
  requestDate: string;
  businessName: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
}

const allUsers: User[] = [
  {
    id: "U001",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "Seller",
    status: "Active",
    joined: "Nov 15, 2024",
    totalSales: 234,
    reputation: 98,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "U002",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    role: "Bidder",
    status: "Active",
    joined: "Oct 22, 2024",
    totalBids: 156,
    reputation: 92,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "U003",
    name: "Mike Davis",
    email: "mike.davis@email.com",
    role: "Seller",
    status: "Suspended",
    joined: "Sep 10, 2024",
    totalSales: 45,
    reputation: 45,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: "U004",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    role: "Bidder",
    status: "Active",
    joined: "Nov 20, 2024",
    totalBids: 89,
    reputation: 95,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: "U005",
    name: "Alex Turner",
    email: "alex.turner@email.com",
    role: "Seller",
    status: "Active",
    joined: "Aug 5, 2024",
    totalSales: 178,
    reputation: 88,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
];

const upgradeRequests: UpgradeRequest[] = [
  {
    id: "UR001",
    user: {
      id: "U006",
      name: "David Wilson",
      email: "david.w@email.com",
      role: "Bidder",
      status: "Pending",
      joined: "Nov 24, 2024",
      totalBids: 45,
      reputation: 87,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    requestDate: "Nov 25, 2024",
    businessName: "Wilson's Vintage Cameras",
    description:
      "I specialize in selling vintage cameras and photography equipment. I have 10+ years of experience in the industry.",
    status: "Pending",
  },
  {
    id: "UR002",
    user: {
      id: "U007",
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      role: "Bidder",
      status: "Pending",
      joined: "Nov 23, 2024",
      totalBids: 67,
      reputation: 91,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    requestDate: "Nov 24, 2024",
    businessName: "Luxury Watch Dealer",
    description:
      "Authorized dealer of luxury watches. Looking to expand my business on this platform.",
    status: "Pending",
  },
  {
    id: "UR003",
    user: {
      id: "U008",
      name: "Robert Brown",
      email: "robert.b@email.com",
      role: "Bidder",
      status: "Pending",
      joined: "Nov 22, 2024",
      totalBids: 23,
      reputation: 78,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    requestDate: "Nov 23, 2024",
    businessName: "Tech Reseller Pro",
    description:
      "Experienced tech reseller with verified supplier relationships.",
    status: "Pending",
  },
];

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState(upgradeRequests);

  const handleApproveRequest = (requestId: string, userName: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "Approved" as const } : req
      )
    );
    toast.success(`Approved seller request for ${userName}!`);
  };

  const handleRejectRequest = (requestId: string, userName: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "Rejected" as const } : req
      )
    );
    toast.error(`Rejected seller request for ${userName}`);
  };

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingRequests = requests.filter((req) => req.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage users, roles, and seller upgrade requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{allUsers.length}</div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {allUsers.filter((u) => u.role === "Seller").length}
                </div>
                <div className="text-xs text-muted-foreground">Sellers</div>
              </div>
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {allUsers.filter((u) => u.role === "Bidder").length}
                </div>
                <div className="text-xs text-muted-foreground">Bidders</div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{pendingRequests.length}</div>
                <div className="text-xs text-muted-foreground">
                  Pending Requests
                </div>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <Clock className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all-users" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="upgrade-requests" className="relative">
            Upgrade Requests
            {pendingRequests.length > 0 && (
              <Badge className="ml-2 bg-red-500/20 text-red-500 border-red-500/50 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* All Users Tab */}
        <TabsContent value="all-users" className="space-y-4">
          {/* Filters */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Bidder">Bidder</SelectItem>
                    <SelectItem value="Seller">Seller</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-border">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{user.name}</span>
                              {user.reputation > 90 && (
                                <Shield className="h-3 w-3 text-accent" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.role === "Seller"
                              ? "bg-accent/20 text-accent border-accent/50"
                              : "bg-blue-500/20 text-blue-500 border-blue-500/50"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "Active"
                              ? "bg-green-500/20 text-green-500 border-green-500/50"
                              : "bg-red-500/20 text-red-500 border-red-500/50"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.role === "Seller"
                            ? `${user.totalSales} sales`
                            : `${user.totalBids} bids`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                user.reputation > 80
                                  ? "bg-green-500"
                                  : user.reputation > 60
                                  ? "bg-accent"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${user.reputation}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {user.reputation}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.joined}
                        </span>
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upgrade Requests Tab */}
        <TabsContent value="upgrade-requests" className="space-y-4">
          {requests.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
                  <UserPlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg mb-2">No Upgrade Requests</h3>
                <p className="text-sm text-muted-foreground">
                  There are currently no pending seller upgrade requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card
                  key={request.id}
                  className={`border-border ${
                    request.status === "Pending" ? "border-accent/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-border">
                              <AvatarImage src={request.user.avatar} />
                              <AvatarFallback>
                                {request.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {request.user.name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={
                                    request.status === "Pending"
                                      ? "bg-accent/20 text-accent border-accent/50"
                                      : request.status === "Approved"
                                      ? "bg-green-500/20 text-green-500 border-green-500/50"
                                      : "bg-red-500/20 text-red-500 border-red-500/50"
                                  }
                                >
                                  {request.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {request.user.email}
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-sm text-muted-foreground">
                            <div>Requested: {request.requestDate}</div>
                            <div>Member since: {request.user.joined}</div>
                          </div>
                        </div>

                        {/* Request Details */}
                        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/30 border border-border mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Business Name
                            </div>
                            <div className="text-sm">
                              {request.businessName}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Current Activity
                            </div>
                            <div className="text-sm">
                              {request.user.totalBids} bids placed
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Reputation
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{
                                    width: `${request.user.reputation}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm">
                                {request.user.reputation}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                          <div className="text-xs text-muted-foreground mb-2">
                            Description
                          </div>
                          <p className="text-sm">{request.description}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {request.status === "Pending" && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            onClick={() =>
                              handleApproveRequest(
                                request.id,
                                request.user.name
                              )
                            }
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleRejectRequest(request.id, request.user.name)
                            }
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
