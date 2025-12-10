import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";

interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  children?: CategoryNode[];
}

interface CategoryFilterProps {
  categories: CategoryNode[];
  selectedCategories: string[];
  onCategoryChange: (categorySlugs: string[], checked: boolean) => void;
}

interface CategoryState {
  checked: boolean;
  indeterminate: boolean;
}

function calculateCategoryState(
  category: CategoryNode,
  selectedCategories: string[]
): CategoryState {
  const hasChildren = category.children && category.children.length > 0;

  console.log("Calculating state for:", category.name, "slug:", category.slug, "selected:", selectedCategories);

  if (!hasChildren) {
    // Leaf node - simple checked state
    const isChecked = selectedCategories.includes(category.slug);
    console.log("  Leaf node, checked:", isChecked);
    return {
      checked: isChecked,
      indeterminate: false,
    };
  }

  // Parent node - calculate based on children selection
  const checkedChildren = category.children!.filter((child) =>
    selectedCategories.includes(child.slug)
  );
  console.log("  Parent node, checked children:", checkedChildren.length, "/", category.children!.length);

  if (checkedChildren.length === 0) {
    return { checked: false, indeterminate: false };
  } else if (checkedChildren.length === category.children!.length) {
    return { checked: true, indeterminate: false };
  } else {
    return { checked: false, indeterminate: true };
  }
}

function CategoryTreeItem({
  category,
  selectedCategories,
  onCategoryChange,
  level = 0,
}: {
  category: CategoryNode;
  selectedCategories: string[];
  onCategoryChange: (categorySlugs: string[], checked: boolean) => void;
  level?: number;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(level === 0);

  // Calculate state
  const state = calculateCategoryState(category, selectedCategories);

  // Handle click based on node type
  const handleToggle = (checked: boolean) => {
    if (hasChildren) {
      // Parent: Toggle all children slugs
      const childSlugs = category.children!.map((c) => c.slug);
      onCategoryChange(childSlugs, checked);
    } else {
      // Child: Toggle only this slug
      onCategoryChange([category.slug], checked);
    }
  };

  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-card/50 transition-colors ${
          level > 0 ? "border-l-2 border-muted" : ""
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-accent/10 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-accent" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}

        <div className="flex items-center space-x-2 flex-1">
          <Checkbox
            id={category.id}
            checked={state.checked}
            indeterminate={state.indeterminate}
            onCheckedChange={handleToggle}
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
