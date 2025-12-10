import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { Step1Data, Step2Data } from "../../../types/product";
import {
  DollarSign,
  TrendingUp,
  Zap,
  Clock,
  ArrowLeft,
  Check,
  Info,
  AlertCircle,
  Sparkles,
  FileText,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface PostAuctionStep2Props {
  step1Data: Step1Data;
  onBack: () => void;
  onSubmit: (data: Step2Data) => void;
  isLoading?: boolean;
}

const durations = [
  { label: "1 Day", value: 1 },
  { label: "3 Days", value: 3 },
  { label: "5 Days", value: 5 },
  { label: "7 Days", value: 7 },
  { label: "10 Days", value: 10 },
  { label: "14 Days", value: 14 },
];

export function PostAuctionStep2({
  step1Data,
  onBack,
  onSubmit,
  isLoading = false,
}: PostAuctionStep2Props) {
  const [startingPrice, setStartingPrice] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [duration, setDuration] = useState("7");
  const [description, setDescription] = useState("");
  const [autoExtend, setAutoExtend] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePriceChange = (
    value: string,
    setter: (value: string) => void,
    field: string
  ) => {
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setter(value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const startPrice = parseFloat(startingPrice);
    const increment = parseFloat(bidIncrement);
    const buyPrice = parseFloat(buyNowPrice);

    if (!startingPrice || isNaN(startPrice) || startPrice < 1) {
      newErrors.startingPrice = "Starting price must be at least $1";
    }

    if (!bidIncrement || isNaN(increment) || increment < 1) {
      newErrors.bidIncrement = "Bid increment must be at least $1";
    }

    if (buyNowPrice && !isNaN(buyPrice) && buyPrice <= startPrice) {
      newErrors.buyNowPrice =
        "Buy now price must be higher than starting price";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        startingPrice: parseFloat(startingPrice),
        bidIncrement: parseFloat(bidIncrement),
        buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : undefined,
        duration: parseInt(duration),
        description,
        autoExtend,
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
            Step 2 of 2: Pricing & Description
          </p>
        </div>
        <Badge className="bg-accent/20 text-accent border-accent/50">
          Step 2/2
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">
            <Check className="h-4 w-4" />
          </div>
          <div className="flex-1 h-1 bg-accent" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">
            2
          </div>
          <div className="flex-1 h-1 bg-accent" />
        </div>
      </div>

      {/* Quick Summary */}
      <Card className="border-border bg-secondary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-secondary border border-border flex items-center justify-center">
              {step1Data.images.length > 0 ? (
                <img
                  src={URL.createObjectURL(step1Data.images[0])}
                  alt="Product"
                  className="w-full h-full object-cover rounded-lg"
                  onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                />
              ) : (
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm mb-1">{step1Data.productName}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {step1Data.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {step1Data.images.length} images
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Card */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <div className="p-2 rounded-lg bg-accent/10">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg">Auction Pricing</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Starting Price */}
            <div className="space-y-2">
              <Label htmlFor="startingPrice" className="text-sm">
                Starting Price <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </div>
                <Input
                  id="startingPrice"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={startingPrice}
                  onChange={(e) =>
                    handlePriceChange(
                      e.target.value,
                      setStartingPrice,
                      "startingPrice"
                    )
                  }
                  className={`h-11 pl-7 ${
                    errors.startingPrice
                      ? "border-destructive"
                      : "border-accent/30 focus-visible:ring-accent"
                  }`}
                />
              </div>
              {errors.startingPrice && (
                <p className="text-xs text-destructive">
                  {errors.startingPrice}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum opening bid
              </p>
            </div>

            {/* Bid Increment */}
            <div className="space-y-2">
              <Label
                htmlFor="bidIncrement"
                className="text-sm flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-accent" />
                Bid Increment <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </div>
                <Input
                  id="bidIncrement"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={bidIncrement}
                  onChange={(e) =>
                    handlePriceChange(
                      e.target.value,
                      setBidIncrement,
                      "bidIncrement"
                    )
                  }
                  className={`h-11 pl-7 ${
                    errors.bidIncrement
                      ? "border-destructive"
                      : "border-accent/30 focus-visible:ring-accent"
                  }`}
                />
              </div>
              {errors.bidIncrement && (
                <p className="text-xs text-destructive">
                  {errors.bidIncrement}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum increase per bid
              </p>
            </div>

            {/* Buy Now Price */}
            <div className="space-y-2">
              <Label
                htmlFor="buyNowPrice"
                className="text-sm flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-accent" />
                Buy Now Price (Optional)
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </div>
                <Input
                  id="buyNowPrice"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={buyNowPrice}
                  onChange={(e) =>
                    handlePriceChange(
                      e.target.value,
                      setBuyNowPrice,
                      "buyNowPrice"
                    )
                  }
                  className={`h-11 pl-7 ${
                    errors.buyNowPrice ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.buyNowPrice && (
                <p className="text-xs text-destructive">{errors.buyNowPrice}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Skip bidding, instant purchase
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-sm flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-accent" />
                Auction Duration <span className="text-destructive">*</span>
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.value} value={d.value.toString()}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How long the auction runs
              </p>
            </div>

            {/* Auto Extend */}
            <div className="md:col-span-2 flex items-start space-x-3 p-4 rounded-lg border border-border bg-secondary/30">
              <Checkbox
                id="autoExtend"
                checked={autoExtend}
                onCheckedChange={(checked) => setAutoExtend(checked as boolean)}
              />
              <div className="flex-1">
                <label
                  htmlFor="autoExtend"
                  className="text-sm cursor-pointer font-medium"
                >
                  Auto-extend Auction
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  If a bid is placed in the last 5 minutes, the auction end time
                  will automatically extend by 10 minutes.
                </p>
              </div>
            </div>
          </div>

          <Alert className="border-accent/30 bg-accent/5">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs text-accent/90">
              <strong>Pricing Tip:</strong> Research similar items to set
              competitive prices. Consider market demand and item condition.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <div className="p-2 rounded-lg bg-accent/10">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg">Product Description</h3>
          </div>

          {/* WYSIWYG Editor */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Detailed Description <span className="text-destructive">*</span>
            </Label>

            <div className="h-64 mb-12">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(content) => {
                  setDescription(content);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                className="h-full"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>

            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Summary */}
      {startingPrice && bidIncrement && description.trim().length > 0 && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-success/20">
                <Check className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-success mb-2">Ready to Publish</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <div>
                    Starting: ${parseFloat(startingPrice).toLocaleString()}
                  </div>
                  <div>
                    Increment: ${parseFloat(bidIncrement).toLocaleString()}
                  </div>
                  <div>Duration: {duration} days</div>
                  {buyNowPrice && (
                    <div>
                      Buy Now: ${parseFloat(buyNowPrice).toLocaleString()}
                    </div>
                  )}
                  <div>Auto Extend: {autoExtend ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning */}
      <Alert className="border-accent/30 bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">
          Review Before Publishing
        </AlertTitle>
        <AlertDescription className="text-xs text-accent/90">
          Once published, you cannot modify auction pricing or duration. You can
          update the description and images.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product Info
        </Button>

        <Button type="submit" size="lg" isLoading={isLoading}>
          {isLoading ? "Publishing..." : "Publish Auction"}
        </Button>
      </div>
    </form>
  );
}
