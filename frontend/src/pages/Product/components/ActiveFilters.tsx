import { X } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

interface ActiveFiltersProps {
  searchQuery?: string;
  selectedCategories: Array<{ id: string; name: string }>;
  onRemoveSearch: () => void;
  onRemoveCategory: (categoryId: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  searchQuery,
  selectedCategories,
  onRemoveSearch,
  onRemoveCategory,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters = searchQuery || selectedCategories.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active Filters:</span>

      {searchQuery && (
        <Badge variant="secondary" className="pl-2 pr-1 gap-1">
          Search: {searchQuery}
          <button
            onClick={onRemoveSearch}
            className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {selectedCategories.map((category) => (
        <Badge
          key={category.id}
          variant="secondary"
          className="pl-2 pr-1 gap-1"
        >
          {category.name}
          <button
            onClick={() => onRemoveCategory(category.id)}
            className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs h-7"
      >
        Clear All
      </Button>
    </div>
  );
}
