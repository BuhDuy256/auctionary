import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ProductListCard } from "../../components/auction/ProductListCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CategoryFilter } from "../../components/auction/CategoryFilter";
import { Separator } from "../../components/ui/separator";
import { Slider } from "../../components/ui/slider";

// Category tree structure
const categories = [
  {
    id: "electronics",
    name: "Electronics",
    children: [
      { id: "laptops", name: "Laptops" },
      { id: "phones", name: "Phones" },
      { id: "tablets", name: "Tablets" },
      { id: "cameras", name: "Cameras" },
    ],
  },
  {
    id: "collectibles",
    name: "Collectibles",
    children: [
      { id: "vintage", name: "Vintage Items" },
      { id: "art", name: "Art & Prints" },
      { id: "memorabilia", name: "Memorabilia" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    children: [
      { id: "watches", name: "Watches" },
      { id: "sneakers", name: "Sneakers" },
      { id: "accessories", name: "Accessories" },
    ],
  },
  {
    id: "home",
    name: "Home & Garden",
    children: [
      { id: "furniture", name: "Furniture" },
      { id: "appliances", name: "Appliances" },
      { id: "decor", name: "Decor" },
    ],
  },
];

// Mock product data
const products = [
  {
    id: "1",
    title: "Apple iPhone 15 Pro Max 256GB - Titanium Blue",
    image:
      "https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlfGVufDF8fHx8MTc2NDA5NzYyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 950,
    buyNowPrice: 1299,
    topBidder: "****Huy",
    timeLeft: "2h 15m",
    bidCount: 23,
    isNewArrival: true,
    listedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "2",
    title: 'iPad Pro 12.9" M2 Chip 512GB Space Gray',
    image:
      "https://images.unsplash.com/photo-1714071803623-9594e3b77862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzY0MDgzODA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 780,
    buyNowPrice: 1099,
    topBidder: "****Mar",
    timeLeft: "5h 42m",
    bidCount: 18,
    isNewArrival: false,
    listedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Sony Alpha A7 IV Mirrorless Camera Body",
    image:
      "https://images.unsplash.com/photo-1603208234872-619ffa1209cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY2FtZXJhfGVufDF8fHx8MTc2NDEzODk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 2100,
    topBidder: "****Chen",
    timeLeft: "1d 3h",
    bidCount: 31,
    isNewArrival: false,
    listedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Apple Watch Ultra 2 GPS + Cellular 49mm",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNofGVufDF8fHx8MTc2NDEzOTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 650,
    buyNowPrice: 849,
    topBidder: "****Kim",
    timeLeft: "8h 20m",
    bidCount: 42,
    isNewArrival: true,
    listedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
  },
  {
    id: "5",
    title: "AirPods Pro 2nd Gen with MagSafe Charging",
    image:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzY0MTY1MTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 180,
    buyNowPrice: 249,
    topBidder: "****Lee",
    timeLeft: "12h 5m",
    bidCount: 15,
    isNewArrival: false,
    listedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "PlayStation 5 Console Disc Version + Controller",
    image:
      "https://images.unsplash.com/photo-1604846887565-640d2f52d564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlfGVufDF8fHx8MTc2NDA1NzI0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 420,
    buyNowPrice: 549,
    topBidder: "****Park",
    timeLeft: "3h 30m",
    bidCount: 27,
    isNewArrival: true,
    listedAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
  },
  {
    id: "7",
    title: 'MacBook Pro 16" M3 Max 1TB SSD Silver',
    image:
      "https://images.unsplash.com/photo-1640955014216-75201056c829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3B8ZW58MXx8fHwxNzY0MTUzNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 2800,
    topBidder: "****Wong",
    timeLeft: "2d 5h",
    bidCount: 38,
    isNewArrival: false,
    listedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "8",
    title: "Samsung Galaxy S24 Ultra 512GB Titanium",
    image:
      "https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlfGVufDF8fHx8MTc2NDA5NzYyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 880,
    buyNowPrice: 1199,
    topBidder: "****Tran",
    timeLeft: "6h 45m",
    bidCount: 19,
    isNewArrival: false,
    listedAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
  },
  {
    id: "9",
    title: "Canon EOS R6 Mark II Camera + 24-105mm Lens",
    image:
      "https://images.unsplash.com/photo-1603208234872-619ffa1209cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY2FtZXJhfGVufDF8fHx8MTc2NDEzODk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    currentBid: 2400,
    topBidder: "****Minh",
    timeLeft: "1d 8h",
    bidCount: 25,
    isNewArrival: true,
    listedAt: new Date(Date.now() - 7 * 60 * 1000), // 7 minutes ago
  },
];

export default function ProductListPage() {
  const [searchTags, setSearchTags] = useState(["iPhone", "Smartphones"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "phones",
  ]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("time-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleCategoryChange = (categoryIds: string[], checked: boolean) => {
    if (checked) {
      // Add all IDs
      setSelectedCategories([
        ...selectedCategories,
        ...categoryIds.filter((id) => !selectedCategories.includes(id)),
      ]);
    } else {
      // Remove all IDs
      setSelectedCategories(
        selectedCategories.filter((id) => !categoryIds.includes(id))
      );
    }
  };

  const removeSearchTag = (tag: string) => {
    setSearchTags(searchTags.filter((t) => t !== tag));
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <MainLayout>
      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Filters Card */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <SlidersHorizontal className="h-5 w-5 text-accent" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm mb-3">Categories</h3>
                    <CategoryFilter
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onCategoryChange={handleCategoryChange}
                    />
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm">Price Range</h3>
                      <span className="text-xs text-accent">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={5000}
                      step={50}
                      className="py-4"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>$5,000</span>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([0, 5000]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Active Listings
                    </span>
                    <span className="text-accent">1,247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New Today</span>
                    <span className="text-success">83</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ending Soon</span>
                    <span className="text-destructive">42</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="mb-6 space-y-4">
              {/* Search Tags & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {searchTags.length > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground">
                        Active Filters:
                      </span>
                      {searchTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="pl-2 pr-1 gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeSearchTag(tag)}
                            className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchTags([])}
                        className="text-xs h-7"
                      >
                        Clear All
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time-desc">
                        Time: Ending Soon
                      </SelectItem>
                      <SelectItem value="time-asc">
                        Time: Newly Listed
                      </SelectItem>
                      <SelectItem value="price-asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="bids-desc">Most Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground">
                    {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, products.length)}
                  </span>{" "}
                  of <span className="text-foreground">{products.length}</span>{" "}
                  results
                </p>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {displayedProducts.map((product) => (
                <ProductListCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "border-accent" : ""}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
