import { useState, useMemo } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
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
  UserPlus,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAdminUsers } from "../../../hooks/useAdminUsers";
import { useUpgradeRequests } from "../../../hooks/useUpgradeRequests";
import { Pagination } from "../../../components/common/Pagination";

// Status display mapping
const getStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending_verification: "Unverified",
    active: "Active",
    pending_upgrade: "Pending Upgrade",
    suspended: "Suspended",
  };
  return statusMap[status] || status;
};

// Format date to display format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Get initials from full name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const {
    users,
    isLoading: usersLoading,
    error: usersError,
    handleSuspendUser,
  } = useAdminUsers();

  const {
    requests,
    isLoading: requestsLoading,
    error: requestsError,
    handleApproveRequest,
    handleRejectRequest,
  } = useUpgradeRequests();

  // Filter users - optimized to cache toLowerCase results
  const filteredUsers = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    const roleLower = roleFilter.toLowerCase();
    const statusLower = statusFilter.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      const matchesRole = roleFilter === "all" || user.role === roleLower;
      const matchesStatus =
        statusFilter === "all" || user.status === statusLower;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Filter pending requests
  const pendingRequests = useMemo(() => {
    return requests.filter((req) => req.status === "pending");
  }, [requests]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, itemsPerPage]);

  // Loading skeleton for table
  const TableSkeleton = () => (
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={7} className="h-16">
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-secondary rounded" />
                <div className="h-3 w-1/4 bg-secondary rounded" />
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  // Error state component
  const ErrorState = ({ message }: { message: string }) => (
    <Card className="border-border">
      <CardContent className="p-12 text-center">
        <div className="inline-flex p-4 rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg mb-2">Error Loading Data</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </CardContent>
    </Card>
  );

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
                <div className="text-2xl mb-1">
                  {usersLoading ? "..." : users.length}
                </div>
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
                  {usersLoading
                    ? "..."
                    : users.filter((u) => u.role === "seller").length}
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
                  {usersLoading
                    ? "..."
                    : users.filter((u) => u.role === "bidder").length}
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
                <div className="text-2xl mb-1">
                  {requestsLoading ? "..." : pendingRequests.length}
                </div>
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
                    <SelectItem value="bidder">Bidder</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending_verification">
                      Unverified
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          {usersError ? (
            <ErrorState message={usersError} />
          ) : (
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reputation</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  {usersLoading ? (
                    <TableSkeleton />
                  ) : filteredUsers.length === 0 ? (
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg mb-2">No Users Found</h3>
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ||
                            roleFilter !== "all" ||
                            statusFilter !== "all"
                              ? "Try adjusting your filters"
                              : "No users available"}
                          </p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-border">
                                <AvatarFallback>
                                  {getInitials(user.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span>{user.fullName}</span>
                                  {user.reputation && user.reputation > 90 && (
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
                              className={`capitalize ${
                                user.role === "seller"
                                  ? "bg-accent/20 text-accent border-accent/50"
                                  : "bg-blue-500/20 text-blue-500 border-blue-500/50"
                              }`}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                user.status === "active"
                                  ? "bg-green-500/20 text-green-500 border-green-500/50"
                                  : user.status === "suspended"
                                  ? "bg-red-500/20 text-red-500 border-red-500/50"
                                  : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                              }`}
                            >
                              {getStatusDisplay(user.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.reputation === null ? (
                                <span className="text-xs text-muted-foreground">
                                  N/A
                                </span>
                              ) : (
                                <>
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
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
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
                                {user.status !== "suspended" && (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      handleSuspendUser(user.id, user.fullName)
                                    }
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          {!usersLoading && !usersError && filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemLabel="users"
              pageSizeOptions={[10, 20, 30, 50]}
            />
          )}
        </TabsContent>

        {/* Upgrade Requests Tab */}
        <TabsContent value="upgrade-requests" className="space-y-4">
          {requestsError ? (
            <ErrorState message={requestsError} />
          ) : requestsLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
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
                    request.status === "pending" ? "border-accent/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-border">
                              <AvatarFallback>
                                {getInitials(request.user.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {request.user.fullName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`capitalize ${
                                    request.status === "pending"
                                      ? "bg-accent/20 text-accent border-accent/50"
                                      : request.status === "approved"
                                      ? "bg-green-500/20 text-green-500 border-green-500/50"
                                      : "bg-red-500/20 text-red-500 border-red-500/50"
                                  }`}
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
                            <div>
                              Requested: {formatDate(request.createdAt)}
                            </div>
                            <div>
                              Member since: {formatDate(request.user.createdAt)}
                            </div>
                          </div>
                        </div>

                        {/* Request Details */}
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30 border border-border mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Reputation
                            </div>
                            <div className="flex items-center gap-2">
                              {request.user.reputation === null ? (
                                <span className="text-sm text-muted-foreground">
                                  N/A
                                </span>
                              ) : (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Reviews
                            </div>
                            <div className="text-sm">
                              {request.user.positiveReviews} positive /{" "}
                              {request.user.negativeReviews} negative
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                          <div className="text-xs text-muted-foreground mb-2">
                            Message
                          </div>
                          <p className="text-sm">{request.message}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {request.status === "pending" && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            onClick={() =>
                              handleApproveRequest(
                                request.id,
                                request.user.fullName
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
                              handleRejectRequest(
                                request.id,
                                request.user.fullName
                              )
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
