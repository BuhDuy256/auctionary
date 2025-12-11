import { ProductListCard, type BidProductData } from "./ProductListCard";
import type { Product } from "../../../types/product";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  handleOpenBidModal: (data: BidProductData) => void;
}

export function ProductGrid({
  products,
  loading,
  handleOpenBidModal,
}: ProductGridProps) {
  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {products.map((product) => (
        <ProductListCard
          key={product.id}
          {...product}
          handleOpenBidModal={handleOpenBidModal}
        />
      ))}
    </div>
  );
}
