import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}

interface CategoryFilterProps {
  categories: CategoryNode[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
}

function CategoryTreeItem({
  category,
  selectedCategories,
  onCategoryChange,
  level = 0,
}: {
  category: CategoryNode;
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = category.children && category.children.length > 0;
  const isChecked = selectedCategories.includes(category.id);

  return (
    <div className="space-y-1">
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-card/50 transition-colors"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-amber/10 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-amber" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}

        <div className="flex items-center space-x-2 flex-1">
          <Checkbox
            id={category.id}
            checked={isChecked}
            onCheckedChange={(checked) =>
              onCategoryChange(category.id, checked as boolean)
            }
          />
          <Label
            htmlFor={category.id}
            className="text-sm cursor-pointer select-none"
          >
            {category.name}
          </Label>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              selectedCategories={selectedCategories}
              onCategoryChange={onCategoryChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoryChange}
        />
      ))}
    </div>
  );
}
