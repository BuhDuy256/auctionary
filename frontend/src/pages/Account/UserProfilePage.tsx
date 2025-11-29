import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  Shield,
  Star,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Gavel,
  Trophy,
  ShoppingBag,
  Settings,
  Edit,
  FileEdit,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";
import { WatchlistCard } from "../../components/auction/WatchlistCard";
import MainLayout from "../../layouts/MainLayout";

// Mock data
const watchlistItems = [
  {
    id: "1",
    title: "Vintage Rolex Submariner Watch",
    image:
      "https://images.unsplash.com/photo-1763672087522-ab306ef0089d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzY0MTc0NTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 8500,
    timeLeft: "2h 15m",
    bidCount: 42,
    isActive: true,
  },
  {
    id: "2",
    title: "Gaming PC Setup RTX 4090",
    image:
      "https://images.unsplash.com/photo-1614179524071-e1ab49a0a0cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cHxlbnwxfHx8fDE3NjQwODc0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 2800,
    timeLeft: "5h 42m",
    bidCount: 28,
    isActive: true,
  },
  {
    id: "3",
    title: "Antique Victorian Furniture Set",
    image:
      "https://images.unsplash.com/photo-1544691560-fc2053d97726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZnVybml0dXJlfGVufDF8fHx8MTc2NDE3NDU0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 1200,
    timeLeft: "Ended",
    bidCount: 15,
    isActive: false,
  },
  {
    id: "4",
    title: "Rare Collectible Gold Coins",
    image:
      "https://images.unsplash.com/photo-1761077163072-5318ea62ff02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMGNvaW5zfGVufDF8fHx8MTc2NDE0MDY5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 4200,
    timeLeft: "1d 3h",
    bidCount: 67,
    isActive: true,
  },
];

const activeBids = [
  {
    id: "1",
    title: "Vintage Leica M6 Camera",
    currentBid: 1350,
    yourMaxBid: 1500,
    status: "leading",
    endTime: "2h 15m",
    bids: 23,
  },
  {
    id: "2",
    title: "Sony A7 IV Professional Camera",
    currentBid: 2250,
    yourMaxBid: 2200,
    status: "outbid",
    endTime: "5h 42m",
    bids: 31,
  },
  {
    id: "3",
    title: "Gaming Laptop RTX 4080",
    currentBid: 2100,
    yourMaxBid: 2300,
    status: "leading",
    endTime: "1d 3h",
    bids: 28,
  },
  {
    id: "4",
    title: "Custom Mechanical Keyboard",
    currentBid: 680,
    yourMaxBid: 650,
    status: "outbid",
    endTime: "8h 20m",
    bids: 48,
  },
];

const wonAuctions = [
  {
    id: "1",
    title: "Vintage Leica M6 Camera with 50mm Lens",
    finalPrice: 1350,
    wonDate: "Nov 26, 2025",
    status: "In Progress",
    transactionId: "AUC-2025-1126-7834",
  },
  {
    id: "2",
    title: "Professional Studio Headphones",
    finalPrice: 285,
    wonDate: "Nov 20, 2025",
    status: "Completed",
    transactionId: "AUC-2025-1120-3421",
  },
  {
    id: "3",
    title: "Vintage Tube Radio 1950s",
    finalPrice: 420,
    wonDate: "Nov 15, 2025",
    status: "Completed",
    transactionId: "AUC-2025-1115-9876",
  },
];

const myListings = [
  {
    id: "1",
    title: 'MacBook Pro 16" M3 Max 1TB',
    currentBid: 2800,
    startingPrice: 2500,
    views: 1247,
    bids: 38,
    endDate: "Nov 28, 2025",
    status: "Active",
  },
  {
    id: "2",
    title: "Canon EOS R6 Mark II + Lens",
    currentBid: 2400,
    startingPrice: 2000,
    views: 856,
    bids: 25,
    endDate: "Nov 29, 2025",
    status: "Active",
  },
  {
    id: "3",
    title: "Rare Vinyl Record Collection",
    currentBid: 0,
    startingPrice: 1500,
    views: 342,
    bids: 0,
    endDate: "Dec 02, 2025",
    status: "No Bids",
  },
];

export default function UserProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("Alex Hunter");
  const [email, setEmail] = useState("alex.hunter@example.com");

  return (
    <MainLayout>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-border bg-gradient-to-r from-amber/5 via-transparent to-transparent">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-amber/30">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                    <AvatarFallback>AH</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl mb-1">Alex Hunter</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span>alex.hunter@example.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-amber/50 text-amber"
                      >
                        <Star className="h-3 w-3 mr-1 fill-amber" />
                        Premium Member
                      </Badge>
                      <Badge variant="secondary">Member since 2023</Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 ml-auto">
                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span className="text-2xl text-green-500">98%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Positive Rating
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span className="text-2xl">247</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span className="text-2xl">5</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Dislikes
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Trophy className="h-4 w-4 text-amber" />
                        <span className="text-2xl text-amber">42</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Auctions Won
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="watchlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="watchlist">
              <Heart className="h-4 w-4 mr-2" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="active-bids">
              <Gavel className="h-4 w-4 mr-2" />
              Active Bids
            </TabsTrigger>
            <TabsTrigger value="won">
              <Trophy className="h-4 w-4 mr-2" />
              Won Auctions
            </TabsTrigger>
            <TabsTrigger value="selling">
              <ShoppingBag className="h-4 w-4 mr-2" />
              My Selling
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl mb-1">My Watchlist</h2>
                <p className="text-sm text-muted-foreground">
                  {watchlistItems.length} items you're watching
                </p>
              </div>
              <Button variant="outline">Clear All</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {watchlistItems.map((item) => (
                <WatchlistCard key={item.id} {...item} />
              ))}
            </div>
          </TabsContent>

          {/* Active Bids Tab */}
          <TabsContent value="active-bids" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl mb-1">Active Bids</h2>
                <p className="text-sm text-muted-foreground">
                  {activeBids.length} auctions you're currently bidding on
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card hover:bg-card">
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Current Bid</TableHead>
                      <TableHead className="text-right">Your Max Bid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time Left</TableHead>
                      <TableHead className="text-right">Bids</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBids.map((bid) => (
                      <TableRow
                        key={bid.id}
                        className={
                          bid.status === "leading"
                            ? "bg-amber/5 hover:bg-amber/10"
                            : ""
                        }
                      >
                        <TableCell>
                          <div className="text-sm">{bid.title}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-amber">
                            ${bid.currentBid.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-muted-foreground">
                            ${bid.yourMaxBid.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {bid.status === "leading" ? (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Leading
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Outbid
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{bid.endTime}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {bid.bids}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={
                              bid.status === "leading" ? "outline" : "default"
                            }
                          >
                            {bid.status === "leading" ? "View" : "Increase Bid"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Won Auctions Tab */}
          <TabsContent value="won" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl mb-1">Won Auctions</h2>
                <p className="text-sm text-muted-foreground">
                  Your auction win history
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card hover:bg-card">
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Final Price</TableHead>
                      <TableHead>Won Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wonAuctions.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell>
                          <div className="text-sm">{auction.title}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-amber">
                            ${auction.finalPrice.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {auction.wonDate}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-muted-foreground">
                            {auction.transactionId}
                          </span>
                        </TableCell>
                        <TableCell>
                          {auction.status === "Completed" ? (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge className="bg-amber/20 text-amber border-amber/50">
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            View Transaction
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Selling Tab */}
          <TabsContent value="selling" className="space-y-4">
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
                      <TableHead className="text-right">
                        Starting Price
                      </TableHead>
                      <TableHead className="text-right">Current Bid</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Bids</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myListings.map((listing) => (
                      <TableRow
                        key={listing.id}
                        className={
                          listing.status === "Active" && listing.bids > 0
                            ? "bg-amber/5"
                            : ""
                        }
                      >
                        <TableCell>
                          <div className="text-sm">{listing.title}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-muted-foreground">
                            ${listing.startingPrice.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {listing.currentBid > 0 ? (
                            <span className="text-amber">
                              ${listing.currentBid.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{listing.views.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-muted-foreground">
                            {listing.bids}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {listing.endDate}
                          </span>
                        </TableCell>
                        <TableCell>
                          {listing.status === "Active" ? (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber/50 text-amber"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              No Bids
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileEdit className="h-3 w-3 mr-1" />
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-1">Account Settings</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account information and security
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Edit Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-amber" />
                    Edit Profile
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <Separator />

                  <Button className="w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Separator />

                  <Button className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Settings */}
            <Card className="border-amber/30 bg-amber/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>
                  Additional security options and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div>
                    <div className="text-sm mb-1">
                      Two-Factor Authentication
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div>
                    <div className="text-sm mb-1">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">
                      Receive updates about your auctions and bids
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div>
                    <div className="text-sm mb-1">Privacy Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Control who can see your activity
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </MainLayout>
  );
}
