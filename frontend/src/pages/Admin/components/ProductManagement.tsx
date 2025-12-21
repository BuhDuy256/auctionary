import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
  Package,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAdminProducts } from "../../../hooks/useAdminProducts";
import { useCountdown } from "../../../hooks/useCountdown";
import { Pagination } from "../../../components/common/Pagination";
import { useNavigate } from "react-router-dom";

// Helper: Get status badge className
const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-500 border-green-500/50";
    case "sold":
      return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    case "expired":
      return "bg-gray-500/20 text-gray-500 border-gray-500/50";
    case "pending":
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    case "removed":
      return "bg-red-500/20 text-red-500 border-red-500/50";
    default:
      return "bg-gray-500/20 text-gray-500 border-gray-500/50";
  }
};

// Helper: Get status display text
const getStatusDisplayText = (status: string): string => {
  switch (status) {
    case "active":
      return "Active";
    case "sold":
      return "Sold";
    case "expired":
      return "Expired";
    case "pending":
      return "Pending";
    case "removed":
      return "Removed";
    default:
      return status;
  }
};

// ProductRow component - Extracted to fix React Hooks violation
// Must be separate component to use useCountdown hook (hooks cannot be called in loops)
interface ProductRowProps {
  product: any; // AdminProduct type
  onRemove: (id: number, title: string) => void;
}

const ProductRow = ({ product, onRemove }: ProductRowProps) => {
  // Use countdown hook for real-time updates (must be at component top level)
  const { timeLeft } = useCountdown(product.endTime);
  const navigate = useNavigate();

  return (
    <TableRow key={product.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
            <ImageWithFallback
              src={product.thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm truncate">{product.title}</span>
            </div>
            <code className="text-xs font-mono px-2 py-0.5 rounded bg-secondary border border-border">
              #{product.id}
            </code>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm">{product.seller.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {product.category.name}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-accent">
          ${product.currentBid.toLocaleString()}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">{product.bids} bids</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          {product.status !== "expired" && product.status !== "sold" && (
            <Clock className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-muted-foreground">{timeLeft}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`capitalize ${getStatusBadgeClass(product.status)}`}
        >
          {getStatusDisplayText(product.status)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="group"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <Eye className="h-4 w-4 mr-2 group-focus:text-accent-foreground" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* TODO: Future enhancement - Add message input modal before removing */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive group focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2 group-focus:text-destructive" />
                  Remove Product
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-red-500/30">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove "{product.title}"? This
                    action cannot be undone and will notify the seller.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onRemove(product.id, product.title)}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export function ProductManagement() {
  const {
    products,
    allProducts,
    stats,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    handleRemoveProduct,
    refetch,
  } = useAdminProducts();

  // Get unique categories from all products for dropdown
  const uniqueCategories = Array.from(
    new Set(
      allProducts.map((p) =>
        JSON.stringify({ id: p.category.id, name: p.category.name })
      )
    )
  ).map((str) => JSON.parse(str));

  // Loading skeleton
  const TableSkeleton = () => (
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={7} className="h-16">
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-12 w-12 rounded-lg bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-secondary rounded" />
                <div className="h-3 w-1/4 bg-secondary rounded" />
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Product Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor all auctions and manage violations
          </p>
        </div>
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg mb-2">Error Loading Products</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={refetch}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Product Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor all auctions and manage violations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {isLoading ? "..." : stats.total}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Products
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {isLoading ? "..." : stats.active}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active Auctions
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {isLoading ? "..." : stats.sold}
                </div>
                <div className="text-xs text-muted-foreground">Sold Items</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {isLoading ? "..." : stats.expired}
                </div>
                <div className="text-xs text-muted-foreground">
                  Expired Auctions
                </div>
              </div>
              <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/30">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {isLoading ? "..." : stats.removed}
                </div>
                <div className="text-xs text-muted-foreground">
                  Removed Items
                </div>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or product ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Bid</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>Time Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableSkeleton />
            </Table>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg mb-2">No Products Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ||
                categoryFilter !== "all" ||
                statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No products available in the system"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Bid</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>Time Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onRemove={handleRemoveProduct}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && !error && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemLabel="products"
          pageSizeOptions={[10, 20, 30, 50]}
        />
      )}
    </div>
  );
}
