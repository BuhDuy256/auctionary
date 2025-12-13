import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemLabel?: string; // e.g., "users", "products", "requests"
  pageSizeOptions?: number[]; // Custom page size options
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemLabel = "items",
  pageSizeOptions = [10, 20, 30, 50],
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with smart ellipsis logic
  const getPageNumbers = (): (number | "ellipsis")[] => {
    // If total pages is less than or equal to 7, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    // Always show first page
    pages.push(1);

    // Scenario 1: Near start (currentPage <= 4)
    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      if (showRightEllipsis) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }
    // Scenario 2: Near end (currentPage >= totalPages - 3)
    else if (currentPage >= totalPages - 3) {
      if (showLeftEllipsis) {
        pages.push("ellipsis");
      }
      for (let i = totalPages - 4; i <= totalPages - 1; i++) {
        pages.push(i);
      }
      pages.push(totalPages);
    }
    // Scenario 3: In the middle
    else {
      if (showLeftEllipsis) {
        pages.push("ellipsis");
      }
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      if (showRightEllipsis) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-4">
      {/* Info and Controls Row */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} {itemLabel}
        </div>
        {pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Items per page:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination Controls - Centered like ProductPagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={currentPage === page ? "border-accent" : ""}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
