import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Upload,
  X,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
} from "lucide-react";

interface PostAuctionStep1Props {
  onNext: (data: Step1Data) => void;
  onBack: () => void;
}

export interface Step1Data {
  productName: string;
  category: string;
  images: File[];
}

const categories = [
  "Electronics",
  "Watches",
  "Cameras",
  "Furniture",
  "Fashion",
  "Jewelry",
  "Gaming",
  "Art",
  "Collectibles",
  "Home & Garden",
  "Sports",
  "Musical Instruments",
];

export function PostAuctionStep1({ onNext, onBack }: PostAuctionStep1Props) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && images.length + 1 <= 10
    );

    if (newFiles.length === 0) return;

    setImages((prev) => [...prev, ...newFiles].slice(0, 10));

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    } else if (productName.trim().length < 10) {
      newErrors.productName = "Product name must be at least 10 characters";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (images.length === 0) {
      newErrors.images = "Please upload at least one product image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext({ productName, category, images });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Create New Auction</h2>
          <p className="text-sm text-muted-foreground">
            Step 1 of 2: Product Information
          </p>
        </div>
        <Badge className="bg-amber/20 text-amber border-amber/50">
          Step 1/2
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center text-sm">
            1
          </div>
          <div className="flex-1 h-1 bg-amber" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-sm text-muted-foreground">
            2
          </div>
          <div className="flex-1 h-1 bg-secondary" />
        </div>
      </div>

      {/* Product Details Card */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <div className="p-2 rounded-lg bg-amber/10">
              <ImageIcon className="h-5 w-5 text-amber" />
            </div>
            <h3 className="text-lg">Product Details</h3>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="e.g., Vintage Leica M6 Camera with 50mm Lens"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setErrors((prev) => ({ ...prev, productName: "" }));
              }}
              className={`h-11 ${
                errors.productName ? "border-destructive" : ""
              }`}
            />
            {errors.productName ? (
              <p className="text-xs text-destructive">{errors.productName}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {productName.length}/200 characters (minimum 10)
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setErrors((prev) => ({ ...prev, category: "" }));
              }}
            >
              <SelectTrigger
                className={`h-11 ${
                  errors.category ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Card */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber/10">
                <Upload className="h-5 w-5 text-amber" />
              </div>
              <h3 className="text-lg">Product Images</h3>
            </div>
            <Badge variant="outline">{images.length}/10 images</Badge>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg transition-all ${
              dragActive
                ? "border-amber bg-amber/10"
                : errors.images
                ? "border-destructive bg-destructive/5"
                : "border-border hover:border-amber/50 hover:bg-amber/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={images.length >= 10}
            />
            <div className="p-12 text-center">
              <div className="p-4 rounded-full bg-secondary/50 w-fit mx-auto mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-2">
                Drag and drop images here, or{" "}
                <span className="text-amber">click to browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or WEBP (Max 10 images, 5MB each)
              </p>
            </div>
          </div>

          {errors.images && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                {errors.images}
              </AlertDescription>
            </Alert>
          )}

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-border group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-amber/90 backdrop-blur border-0 text-xs">
                      Primary
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Alert className="border-amber/30 bg-amber/5">
            <Info className="h-4 w-4 text-amber" />
            <AlertDescription className="text-xs text-amber/90">
              <strong>Tips for great photos:</strong> Use clear, well-lit images
              from multiple angles. The first image will be used as the primary
              listing photo.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Summary */}
      {productName && category && images.length > 0 && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/20">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-green-500 mb-1">Step 1 Complete</p>
              <p className="text-xs text-muted-foreground">
                You're ready to move to pricing and description
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Button type="submit" size="lg">
          Continue to Pricing
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
