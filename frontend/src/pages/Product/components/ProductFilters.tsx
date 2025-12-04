import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { CategoryFilter } from "./CategoryFilter";
import { Separator } from "../../../components/ui/separator";
import { Slider } from "../../../components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import type { CategoryNode } from "../../../types/category";

interface ProductFiltersProps {
  categories: CategoryNode[];
  categoriesLoading: boolean;
  selectedCategories: string[];
  priceRange: number[];
  disabled: boolean;
  onCategoryChange: (categoryIds: string[], checked: boolean) => void;
  onPriceRangeChange: (value: number[]) => void;
  onResetFilters: () => void;
}

export function ProductFilters({
  categories,
  categoriesLoading,
  selectedCategories,
  priceRange,
  disabled,
  onCategoryChange,
  onPriceRangeChange,
  onResetFilters,
}: ProductFiltersProps) {
  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div
        className="sticky top-24 space-y-6"
        style={{
          pointerEvents: disabled ? "none" : "auto",
          opacity: disabled ? 0.6 : 1,
        }}
      >
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
              {categoriesLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading categories...
                </div>
              ) : (
                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={onCategoryChange}
                />
              )}
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
                onValueChange={onPriceRangeChange}
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
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Listings</span>
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
  );
}
