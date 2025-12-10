import { useState, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Upload,
  X,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
} from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";
import type { Step1Data } from "../../../types/product";

interface PostAuctionStep1Props {
  onNext: (data: Step1Data) => void;
  onBack: () => void;
}

const MIN_CHAR = 3;

export function PostAuctionStep1({ onNext, onBack }: PostAuctionStep1Props) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(""); // Stores name for display
  const [categoryId, setCategoryId] = useState(""); // Stores ID for backend
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const { categories, loading: loadingCategories } = useCategories();

  const subCategories = useMemo(() => {
    if (!categoryId) return [];
    const parent = categories.find((c) => c.id === categoryId);
    return parent?.children || [];
  }, [categoryId, categories]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    if (!productName || !category || !subCategory) {
      setErrors((prev) => ({
        ...prev,
        images:
          "Please fill in Product Name, Category, and Sub-category first.",
      }));
      return;
    }

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (newFiles.length === 0) return;

    if (images.length + newFiles.length > 10) {
      setErrors((prev) => ({ ...prev, images: "Maximum 10 images allowed" }));
      return;
    }

    // LOCAL PREVIEW LOGIC: Just add files to state
    setImages((prev) => [...prev, ...newFiles]);
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
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    } else if (productName.trim().length < MIN_CHAR) {
      newErrors.productName =
        "Product name must be at least " + String(MIN_CHAR) + " characters";
    }

    if (!category || !categoryId) {
      newErrors.category = "Please select a category";
    }

    if (!subCategory || !subCategoryId) {
      newErrors.subCategory = "Please select a sub-category";
    }

    if (images.length < 3) {
      newErrors.images = "Please upload at least 3 product images";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext({
        productName,
        category,
        categoryId,
        subCategory,
        subCategoryId,
        images,
      });
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
        <Badge className="bg-accent/20 text-accent border-accent/50">
          Step 1/2
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">
            1
          </div>
          <div className="flex-1 h-1 bg-accent" />
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
            <div className="p-2 rounded-lg bg-accent/10">
              <ImageIcon className="h-5 w-5 text-accent" />
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
                {productName.length}/200 characters (minimum {MIN_CHAR})
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Parent Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  const selected = categories.find((c) => c.id === value);
                  setCategoryId(value);
                  setCategory(selected?.name || "");
                  setSubCategoryId("");
                  setSubCategory("");
                  setErrors((prev) => ({ ...prev, category: "" }));
                }}
              >
                <SelectTrigger
                  className={`h-11 ${
                    errors.category ? "border-destructive" : ""
                  }`}
                  disabled={loadingCategories}
                >
                  <SelectValue
                    placeholder={
                      loadingCategories ? "Loading..." : "Select a category"
                    }
                  >
                    {category || "Select a category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Sub Category */}
            <div className="space-y-2">
              <Label htmlFor="subCategory" className="text-sm">
                Sub-Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={subCategoryId}
                onValueChange={(value) => {
                  const selected = subCategories.find((c) => c.id === value);
                  setSubCategoryId(value);
                  setSubCategory(selected?.name || "");
                  setErrors((prev) => ({ ...prev, subCategory: "" }));
                }}
                disabled={!categoryId}
              >
                <SelectTrigger
                  className={`h-11 ${
                    errors.subCategory ? "border-destructive" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a sub-category">
                    {subCategory || "Select a sub-category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subCategory && (
                <p className="text-xs text-destructive">{errors.subCategory}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Card */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Upload className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg">Product Images</h3>
            </div>
            <Badge variant="outline">{images.length}/10 images</Badge>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg transition-all ${
              dragActive
                ? "border-accent bg-accent/10"
                : errors.images
                ? "border-destructive bg-destructive/5"
                : "border-border hover:border-accent/50 hover:bg-accent/5"
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
              disabled={
                images.length >= 10 || !productName || !category || !subCategory
              }
            />
            <div className="p-12 text-center">
              <div className="p-4 rounded-full bg-secondary/50 w-fit mx-auto mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-2">
                Drag and drop images here, or{" "}
                <span className="text-accent">click to browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or WEBP (Min 3, Max 10 images, 5MB each)
              </p>
              {!(productName && category && subCategory) && (
                <p className="text-xs text-destructive mt-2 font-medium">
                  Enter Details & Category to Enable Upload
                </p>
              )}
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
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-border group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} // Clean up memory after load
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-accent/90 backdrop-blur border-0 text-xs">
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

          <Alert className="border-accent/30 bg-accent/5">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs text-accent/90">
              <strong>Tips for great photos:</strong> Use clear, well-lit images
              from multiple angles. The first image will be used as the primary
              listing photo.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Summary */}
      {productName && category && subCategory && images.length >= 3 && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/20">
              <Check className="h-4 w-4 text-success" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-success mb-1">Step 1 Complete</p>
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
