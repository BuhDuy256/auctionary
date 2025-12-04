import MainLayout from "../../layouts/MainLayout";
import { Button } from "../../components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { ActiveFilters } from "./components/ActiveFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ProductListCard } from "./components/ProductListCard";
import { ProductFilters } from "./components/ProductFilters";
import { ProductPagination } from "./components/ProductPagination";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

export default function ProductListPage() {
  const {
    products,
    loading: productsLoading,
    pagination,
    priceRange,
    setPriceRange,
    searchQuery,
    categorySlugs,
    sortParam,
    handleCategoryChange,
    handleRemoveSearch,
    handleRemoveCategory,
    handleClearAllFilters,
    handleSortChange,
    handlePageChange,
  } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
    selectedCategoriesWithNames,
  } = useCategories(categorySlugs);

  const handleResetFilters = () => {
    handleClearAllFilters();
    setPriceRange([0, 5000]);
  };

  return (
    <MainLayout>
      {/* Loading Overlay */}
      {productsLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <ProductFilters
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategories={categorySlugs}
            priceRange={priceRange}
            disabled={productsLoading}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={setPriceRange}
            onResetFilters={handleResetFilters}
          />

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="mb-6 space-y-4">
              {/* Active Filters & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1">
                  {(searchQuery || categorySlugs.length > 0) && (
                    <ActiveFilters
                      searchQuery={searchQuery}
                      selectedCategories={selectedCategoriesWithNames}
                      onRemoveSearch={handleRemoveSearch}
                      onRemoveCategory={handleRemoveCategory}
                      onClearAll={handleClearAllFilters}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <Select
                    value={sortParam}
                    onValueChange={handleSortChange}
                    disabled={productsLoading}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="endTime:asc">
                        Time: Ending Soon
                      </SelectItem>
                      <SelectItem value="createdAt:desc">
                        Time: Newly Listed
                      </SelectItem>
                      <SelectItem value="price:asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price:desc">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="bidCount:desc">Most Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground">
                    {(pagination.page - 1) * pagination.limit + 1}-
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="text-foreground">{pagination.total}</span>{" "}
                  results
                </p>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Product Grid */}
            {productsLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductListCard key={product.id} {...product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <ProductPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              disabled={productsLoading}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
