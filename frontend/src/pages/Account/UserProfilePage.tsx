import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
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
  ThumbsUp,
  ThumbsDown,
  Heart,
  Gavel,
  Trophy,
  ShoppingBag,
  Settings,
  Edit,
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
  CircleUserRound,
} from "lucide-react";
import { WatchlistCard } from "../../components/auction/WatchlistCard";
import MainLayout from "../../layouts/MainLayout";
import * as userService from "../../services/userService";
import type {
  UserProfile,
  WatchlistItem,
  ActiveBidItem,
  WonAuctionItem,
  MyListingItem,
} from "../../types/user";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tab Data States
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [activeBids, setActiveBids] = useState<ActiveBidItem[]>([]);
  const [wonAuctions, setWonAuctions] = useState<WonAuctionItem[]>([]);
  const [myListings, setMyListings] = useState<MyListingItem[]>([]);

  // Form States
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currentPasswordForUpdate, setCurrentPasswordForUpdate] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchTabData();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setDisplayName(data.fullName);
      setEmail(data.email);
      setAddress(data.address || "");
    } catch (error) {
      console.error("Failed to fetch profile", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTabData = async () => {
    try {
      const [watchlistData, bidsData, wonData, listingsData] =
        await Promise.all([
          userService.getWatchlist(),
          userService.getActiveBids(),
          userService.getWonAuctions(),
          userService.getMyListings(),
        ]);
      setWatchlist(watchlistData);
      setActiveBids(bidsData);
      setWonAuctions(wonData);
      setMyListings(listingsData);
    } catch (error) {
      console.error("Failed to fetch tab data", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentPasswordForUpdate) {
      toast.error("Please enter your current password to save changes");
      return;
    }

    try {
      await userService.updateProfile({
        fullName: displayName,
        email,
        address,
        currentPassword: currentPasswordForUpdate,
      });
      toast.success("Profile updated successfully");
      setCurrentPasswordForUpdate("");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (!profile) return null;

  const ratingPercentage =
    profile.stats.positiveRatings + profile.stats.negativeRatings > 0
      ? Math.round(
          (profile.stats.positiveRatings /
            (profile.stats.positiveRatings + profile.stats.negativeRatings)) *
            100
        )
      : 0;

  return (
    <MainLayout>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-border bg-gradient-to-r from-accent/5 via-transparent to-transparent">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-accent/30 bg-background">
                    <AvatarFallback className="bg-transparent">
                      <CircleUserRound className="h-full w-full text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl mb-1">{profile.fullName}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {profile.roles.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className="border-accent/50 text-accent capitalize"
                        >
                          {role}
                        </Badge>
                      ))}
                      <Badge variant="secondary">
                        Member since {new Date(profile.createdAt).getFullYear()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 ml-auto">
                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <ThumbsUp className="h-4 w-4 text-success" />
                        <span className="text-2xl text-success">
                          {ratingPercentage}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Positive Rating
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <ThumbsUp className="h-4 w-4 text-success" />
                        <span className="text-2xl">
                          {profile.stats.positiveRatings}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Positives
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <ThumbsDown className="h-4 w-4 text-destructive" />
                        <span className="text-2xl">
                          {profile.stats.negativeRatings}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Negatives
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Trophy className="h-4 w-4 text-accent" />
                        <span className="text-2xl text-accent">
                          {profile.stats.auctionsWon}
                        </span>
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
                  {watchlist.length} items you're watching
                </p>
              </div>
              <Button variant="outline">Clear All</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {watchlist.map((item) => (
                <WatchlistCard
                  key={item.id}
                  {...item}
                  image={item.imageUrl}
                  timeLeft={new Date(item.endTime).toLocaleDateString()}
                />
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
                            ? "bg-accent/5 hover:bg-accent/10"
                            : ""
                        }
                      >
                        <TableCell>
                          <div className="text-sm">{bid.title}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-accent">
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
                            <Badge className="bg-success/20 text-success border-success/50">
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
                            <span>
                              {new Date(bid.endTime).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {bid.bidCount}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              disabled={bid.status === "leading"}
                            >
                              Increase Bid
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
                          <span className="text-accent">
                            ${auction.finalPrice.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(auction.wonDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success/20 text-success border-success/50">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {auction.status}
                          </Badge>
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
                          listing.status === "active" && listing.bidCount > 0
                            ? "bg-accent/5"
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
                            <span className="text-accent">
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
                            {listing.bidCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(listing.endTime).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {listing.status === "active" ? (
                            <Badge className="bg-success/20 text-success border-success/50">
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-accent/50 text-accent"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {listing.status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
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
                    <User className="h-5 w-5 text-accent" />
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
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPasswordUpdate">
                      Current Password (Required to save)
                    </Label>
                    <Input
                      id="currentPasswordUpdate"
                      type="password"
                      value={currentPasswordForUpdate}
                      onChange={(e) =>
                        setCurrentPasswordForUpdate(e.target.value)
                      }
                      placeholder="Enter current password"
                    />
                  </div>

                  <Separator />

                  <Button className="w-full" onClick={handleUpdateProfile}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-accent" />
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
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
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
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Separator />

                  <Button className="w-full" onClick={handleChangePassword}>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Settings */}
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
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
