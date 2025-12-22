import { ChevronLeft } from "lucide-react";
import { Button, buttonVariants } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ProductListCard } from "./components/ProductListCard";
import MainLayout from "../../layouts/MainLayout";
import { useProductDetail } from "../../hooks/useProductDetail";
import { ProductHeader } from "./components/ProductHeader";
import { ProductImages } from "./components/ProductImages";
import { ProductBidding } from "./components/ProductBidding";
import { SellerCommandCenter } from "./components/SellerCommandCenter";
import { SellerCard } from "./components/SellerCard";
import { ProductTabs } from "./components/ProductTabs";
import { Link, useNavigate } from "react-router-dom";
import { formatTimeLeft } from "../../utils/time";
import { useWatchlist } from "../../hooks/useWatchlist";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../hooks/useAuth";
import type { WatchlistProduct } from "../../types/watchlist";
import type { CategoryNode } from "../../types/category";

export default function ProductDetailPage() {
  const {
    product,
    seller,
    auction,
    userStatus,
    bids,
    questions,
    loading,
    error,
    placeBid,
    appendDescription,
    appendQuestion,
    appendAnswer,
    toggleAllowNewBidder,
    rejectBidder,
  } = useProductDetail();

  const { addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();
  const { categories } = useCategories();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to generate URL with all children of a parent category
  const getParentCategoryUrl = (parentSlug: string): string => {
    const findCategory = (
      cats: CategoryNode[],
      slug: string
    ): CategoryNode | null => {
      for (const cat of cats) {
        if (cat.slug === slug) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, slug);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findCategory(categories, parentSlug);
    if (!parent || !parent.children || parent.children.length === 0) {
      return `/products?category=${parentSlug}`;
    }

    // Build URL with all children slugs
    const childSlugs = parent.children
      .map((c) => `category=${c.slug}`)
      .join("&");
    return `/products?${childSlugs}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product || !seller || !auction) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The product you are looking for does not exist."}
          </p>
          <Link to="/products" className={buttonVariants()}>
            Back to Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  const endTimeMs = new Date(auction.endTime).getTime();
  const timeLeftMs = Math.max(0, endTimeMs - Date.now());
  const timeLeft = formatTimeLeft(timeLeftMs);

  const isCurrentlyWatchlisted =
    isWatched(String(product.id)) || userStatus?.isWatchlisted || false;

  const handleToggleWatchlist = () => {
    if (!product || !auction) return;

    if (isCurrentlyWatchlisted) {
      removeFromWatchlist(String(product.id));
    } else {
      const itemToAdd: WatchlistProduct = {
        id: String(product.id),
        title: product.name,
        image: product.thumbnailUrl,
        currentBid: auction.currentPrice,
        buyNowPrice: auction.buyNowPrice,
        topBidder: auction.topBidder,
        bidCount: auction.bidCount,
        timeLeft: timeLeft,
        endTime: auction.endTime,
        status: auction.status,
        isNewArrival: false,
      };

      addToWatchlist(itemToAdd);
    }
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Home
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            <Link
              to="/products"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Products
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            {product.category.parent && (
              <>
                <Link
                  to={getParentCategoryUrl(product.category.parent.slug)}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {product.category.parent.name}
                </Link>
                <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </>
            )}
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            <span className="text-foreground truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div>
            <ProductImages images={product.images} />
          </div>

          {/* Right: Product Info & Bidding */}
          <div className="space-y-6">
            <ProductHeader
              title={product.name}
              categoryName={product.category.name}
              timeLeft={timeLeft}
              isWatchlisted={
                isWatched(String(product.id)) ||
                userStatus?.isWatchlisted ||
                false
              }
              onToggleWatchlist={handleToggleWatchlist}
            />

            <SellerCard seller={seller} />

            <Separator />

            {/* Conditional Rendering: Seller Command Center vs Product Bidding */}
            {user && seller && user.id === seller.id ? (
              <SellerCommandCenter
                auction={auction}
                onToggleAllowNewBidder={toggleAllowNewBidder}
              />
            ) : (
              <ProductBidding
                auction={auction}
                userStatus={userStatus}
                onPlaceBid={placeBid}
                onToggleWatchlist={handleToggleWatchlist}
                isWatchlisted={isCurrentlyWatchlisted}
              />
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs
          descriptions={product.descriptions}
          bids={bids}
          questions={questions}
          sellerId={seller.id}
          auctionStatus={auction.status}
          onAppendDescription={appendDescription}
          onAppendQuestion={appendQuestion}
          onAppendAnswer={appendAnswer}
          onRejectBidder={rejectBidder}
        />

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Similar Items You May Like</h2>
              <Button
                variant="ghost"
                className="text-accent hover:bg-transparent hover:scale-105"
                onClick={() =>
                  navigate(`/products?category=${product.category.slug}`)
                }
              >
                View All
                <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {product.relatedProducts.map((relatedProduct) => (
                <ProductListCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  );
}
