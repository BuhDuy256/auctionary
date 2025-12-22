import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  BookA,
  DollarSign,
  Gavel,
  LogIn,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ProductListCard } from "../Product/components/ProductListCard";
import { AuctionCardSkeleton } from "./components/AuctionCardSkeleton";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { useAuth } from "../../hooks/useAuth";
import { usePermission } from "../../hooks/usePermission";
import { useNavigate } from "react-router-dom";
import { useHomeSections } from "../../hooks/useHomeSections";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { hasRole } = usePermission();
  const navigate = useNavigate();
  const { sections, isLoading, error, refetch } = useHomeSections();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02ek00OCAzNmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZjk5MDAiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <Badge
              className="mb-4 border-accent/50 bg-accent/10 text-accent"
              variant="outline"
            >
              <Zap className="mr-1 h-3 w-3" />
              Secure Trading Platform
            </Badge>
            <h1 className="text-5xl mb-4">
              Discover Rare Items.
              <br />
              <span className="text-accent">Bid with Confidence.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Join the most secure anonymous auction platform. Browse exclusive
              listings, place tactical bids, and win items you've been searching
              for.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="text-base"
                onClick={() => setIsDisclaimerOpen(true)}
              >
                <ShieldAlert className="mr-2 h-5 w-5" />
                Important Notice
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base"
                onClick={() => navigate("/products")}
              >
                Browse Categories
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Section A: Ending Soon */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                <Zap className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl">Ending Soon</h2>
                <p className="text-sm text-muted-foreground">
                  Last chance to bid on these items
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-accent hover:bg-transparent hover:scale-105"
              onClick={() => navigate("/products?sort=endTime:asc")}
            >
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AuctionCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : sections?.endingSoon && sections.endingSoon.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {sections.endingSoon.map((auction) => (
                  <div key={auction.id} className="flex-shrink-0 w-[280px]">
                    <ProductListCard
                      {...auction}
                      isNewArrival={auction.isHot}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No auctions ending soon. Check back later!" />
            )}
          </div>
        </section>

        {/* Section B: Most Active */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl">Most Active</h2>
                <p className="text-sm text-muted-foreground">
                  Items with the highest bidding activity
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-accent hover:bg-transparent hover:scale-105"
              onClick={() => navigate("/products?sort=bidCount:desc")}
            >
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AuctionCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : sections?.mostActive && sections.mostActive.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {sections.mostActive.map((auction) => (
                  <div key={auction.id} className="flex-shrink-0 w-[280px]">
                    <ProductListCard
                      {...auction}
                      isNewArrival={auction.isHot}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No active auctions at the moment." />
            )}
          </div>
        </section>

        {/* Section C: Highest Price */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 border border-success/30">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <h2 className="text-2xl">Highest Price</h2>
                <p className="text-sm text-muted-foreground">
                  Premium items with top dollar bids
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-accent hover:bg-transparent hover:scale-105"
              onClick={() => navigate("/products?sort=price:desc")}
            >
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AuctionCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : sections?.highestPrice && sections.highestPrice.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {sections.highestPrice.map((auction) => (
                  <div key={auction.id} className="flex-shrink-0 w-[280px]">
                    <ProductListCard
                      {...auction}
                      isNewArrival={auction.isHot}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No high-value auctions available right now." />
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-card p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02ek00OCAzNmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZjk5MDAiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>

          {!isAuthenticated ? (
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <UserPlus className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl mb-4">New to Auctionary?</h2>
              <p className="text-muted-foreground mb-6">
                Sign up now to start bidding on exclusive items. Join our
                community and find your next treasure today!
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="text-base"
                  onClick={() => navigate("/signup")}
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign Up Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Log In
                </Button>
              </div>
            </div>
          ) : hasRole("seller") ? (
            /* CASE 2: ĐÃ ĐĂNG NHẬP + LÀ SELLER */
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <BookA className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl mb-4">Got something unique to sell?</h2>
              <p className="text-muted-foreground mb-6">
                Keep your inventory fresh! Create a new listing now and attract
                more bidders to your shop.
              </p>
              <Button
                size="lg"
                className="text-base"
                onClick={() => navigate("/under-development")}
              >
                <Gavel className="mr-2 h-5 w-5" />
                Create New Auction
              </Button>
            </div>
          ) : (
            /* CASE 3: ĐÃ ĐĂNG NHẬP + CHỈ LÀ BIDDER (Mời nâng cấp) */
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl mb-4">Ready to Start Selling?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of sellers on Auctionary. List your items, reach
                a global audience, and get paid securely through our escrow
                system.
              </p>
              <Button
                size="lg"
                className="text-base"
                onClick={() => navigate("/under-development")}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Become a Seller Today
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        open={isDisclaimerOpen}
        onOpenChange={setIsDisclaimerOpen}
      />
    </MainLayout>
  );
}
