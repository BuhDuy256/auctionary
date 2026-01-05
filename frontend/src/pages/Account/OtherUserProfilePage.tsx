import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Trophy, Star } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import { useOtherUserProfile } from "../../hooks/useOtherUserProfile";
import { ProfileHeader } from "./components/ProfileHeader";
import { WonAuctionsTab } from "./components/WonAuctionsTab";
import { RatingsTab } from "./components/RatingsTab";

export default function OtherUserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = parseInt(id || "0");
  const { profile, isLoading, error } = useOtherUserProfile(userId);

  // Redirect to own profile if viewing self
  useEffect(() => {
    if (user && userId === user.id) {
      navigate("/profile", { replace: true });
    }
  }, [user, userId, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          Loading profile...
        </div>
      </MainLayout>
    );
  }

  if (error === "USER_NOT_FOUND") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-muted-foreground">This user does not exist.</p>
        </div>
      </MainLayout>
    );
  }

  if (error === "PROFILE_UNAVAILABLE") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-2">Profile Unavailable</h1>
          <p className="text-muted-foreground">
            This user profile is not available for viewing.
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-destructive">
          Failed to load profile
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader
          user={profile.user as any}
          stats={profile.stats}
          isOwnProfile={false}
        />

        {/* Navigation Tabs - Only Won Auctions and Ratings */}
        <Tabs defaultValue="ratings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="won">
              <Trophy className="h-4 w-4 mr-2" />
              Won Auctions
            </TabsTrigger>
            <TabsTrigger value="ratings">
              <Star className="h-4 w-4 mr-2" />
              Ratings
            </TabsTrigger>
          </TabsList>

          {/* Won Auctions Tab */}
          <TabsContent value="won">
            <WonAuctionsTab userId={userId} />
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <RatingsTab userId={userId} />
          </TabsContent>
        </Tabs>
      </main>
    </MainLayout>
  );
}
