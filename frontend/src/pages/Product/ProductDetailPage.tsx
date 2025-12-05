import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ProductListCard } from "./components/ProductListCard";
import MainLayout from "../../layouts/MainLayout";
import { useProductDetail } from "../../hooks/useProductDetail";
import { ProductHeader } from "./components/ProductHeader";
import { ProductImages } from "./components/ProductImages";
import { ProductBidding } from "./components/ProductBidding";
import { SellerCard } from "./components/SellerCard";
import { ProductTabs } from "./components/ProductTabs";
import { Link } from "react-router-dom";

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
  } = useProductDetail();

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

  // Calculate time left (mock logic for now, should use auction.endTime)
  // In a real app, use a countdown hook
  const timeLeft = "2d 5h";

  const handleToggleWatchlist = () => {
    // TODO: Implement watchlist toggle logic
    console.log("Toggle watchlist");
  };

  const handlePlaceBid = (amount: number) => {
    // TODO: Implement place bid logic
    console.log("Place bid:", amount);
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
                  to={`/products?category=${product.category.parent.slug}`}
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
              timeLeft={timeLeft}
              isWatchlisted={userStatus?.isWatchlisted || false}
              onToggleWatchlist={handleToggleWatchlist}
            />

            <SellerCard seller={seller} />

            <Separator />

            <ProductBidding
              auction={auction}
              userStatus={userStatus}
              onPlaceBid={handlePlaceBid}
              onToggleWatchlist={handleToggleWatchlist}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs
          description={product.overview}
          bids={bids}
          questions={questions}
        />

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Similar Items You May Like</h2>
              <Link
                to={`/products?category=${product.category.slug}`}
                className={buttonVariants({
                  variant: "ghost",
                  className: "text-accent",
                })}
              >
                View All
                <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
              </Link>
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
