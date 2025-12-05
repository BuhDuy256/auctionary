import { ImageGallery } from "../../../components/auction/ImageGallery";

interface ProductImagesProps {
  images: string[];
}

export function ProductImages({ images }: ProductImagesProps) {
  return <ImageGallery images={images} />;
}
