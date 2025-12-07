import { Heart, Gavel, Trophy, Settings } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import MainLayout from "../../layouts/MainLayout";
import { useProfile } from "../../hooks/useProfile";
import { ProfileHeader } from "./components/ProfileHeader";
import { WatchlistTab } from "./components/WatchlistTab";
import { ActiveBidsTab } from "./components/ActiveBidsTab";
import { WonAuctionsTab } from "./components/WonAuctionsTab";
import { SettingsTab } from "./components/SettingsTab";

export default function UserProfilePage() {
  const { user, stats, isLoading } = useProfile();

  if (isLoading && !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          Loading profile...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} stats={stats} />

        {/* Navigation Tabs */}
        <Tabs defaultValue="watchlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
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
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist">
            <WatchlistTab />
          </TabsContent>

          {/* Active Bids Tab */}
          <TabsContent value="active-bids">
            <ActiveBidsTab />
          </TabsContent>

          {/* Won Auctions Tab */}
          <TabsContent value="won">
            <WonAuctionsTab />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </MainLayout>
  );
}
