import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Mail,
  Star,
  MapPin,
  CircleUserRound,
  ThumbsUp,
  ThumbsDown,
  Trophy,
} from "lucide-react";
import type { User, UserStats } from "../../../types/user";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface ProfileHeaderProps {
  user: User | null;
  stats: UserStats | null;
}

export const ProfileHeader = ({ user, stats }: ProfileHeaderProps) => {
  if (!user) return null;

  // Derive display role from roles array (e.g., show highest priority role or just the first one)
  const displayRole =
    user.roles && user.roles.length > 0 ? user.roles[0] : "Member";

  // Use 'admin' or 'seller' as premium-like indicators if needed, or just display the role.
  // User requested: "The premium member will the replaced with the badge which has user role on it"
  const roleBadgeColor =
    displayRole === "admin"
      ? "bg-red-500/10 text-red-500 border-red-500/50"
      : displayRole === "seller"
      ? "bg-accent/10 text-accent border-accent"
      : "bg-blue-500/20 text-blue-500 border-blue-500/50";

  return (
    <div className="mb-8">
      <Card className="border-border bg-gradient-to-r from-accent/5 via-transparent to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Replacement & Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-accent/30 bg-background">
                <AvatarFallback className="bg-transparent">
                  <CircleUserRound className="h-full w-full text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl mb-1">{user.fullName}</h1>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.address || "No address provided"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`capitalize ${roleBadgeColor}`}
                  >
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {displayRole}
                  </Badge>
                  <Badge variant="secondary">
                    Member since {new Date(user.createdAt).getFullYear()}
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
                      {stats?.rating || 0}%
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
                    <span className="text-2xl">{stats?.likes || 0}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <ThumbsDown className="h-4 w-4 text-destructive" />
                    <span className="text-2xl">{stats?.dislikes || 0}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Dislikes</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span className="text-2xl text-accent">
                      {stats?.auctionsWon || 0}
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
  );
};
