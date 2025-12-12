import { ImageGallery } from "./ImageGallery";

interface ProductImagesProps {
  images: string[];
}

export function ProductImages({ images }: ProductImagesProps) {
  return <ImageGallery images={images} />;
}
