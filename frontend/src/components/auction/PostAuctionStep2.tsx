import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Step1Data } from "../auction/PostAuctionStep1";
import {
  DollarSign,
  TrendingUp,
  Zap,
  Clock,
  ArrowLeft,
  Check,
  Info,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface PostAuctionStep2Props {
  step1Data: Step1Data;
  onBack: () => void;
  onSubmit: (data: AuctionData) => void;
}

export interface AuctionData extends Step1Data {
  startingPrice: number;
  bidIncrement: number;
  buyNowPrice: number;
  duration: number;
  description: string;
  condition: string;
  shipping: string;
  returns: boolean;
}

const durations = [
  { label: "1 Day", value: 1 },
  { label: "3 Days", value: 3 },
  { label: "5 Days", value: 5 },
  { label: "7 Days", value: 7 },
  { label: "10 Days", value: 10 },
  { label: "14 Days", value: 14 },
];

const conditions = [
  "New",
  "Like New",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "For Parts",
];

export function PostAuctionStep2({
  step1Data,
  onBack,
  onSubmit,
}: PostAuctionStep2Props) {
  const [startingPrice, setStartingPrice] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [duration, setDuration] = useState("7");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [shipping, setShipping] = useState("");
  const [returns, setReturns] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simple WYSIWYG state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

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

  const applyFormatting = (format: "bold" | "italic" | "bullet" | "link") => {
    const textarea = document.getElementById(
      "description"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    let newText = description;
    let newCursorPos = start;

    switch (format) {
      case "bold":
        newText =
          description.substring(0, start) +
          `**${selectedText}**` +
          description.substring(end);
        newCursorPos = end + 4;
        setIsBold(!isBold);
        break;
      case "italic":
        newText =
          description.substring(0, start) +
          `*${selectedText}*` +
          description.substring(end);
        newCursorPos = end + 2;
        setIsItalic(!isItalic);
        break;
      case "bullet":
        newText =
          description.substring(0, start) +
          `\n• ${selectedText}` +
          description.substring(end);
        newCursorPos = end + 3;
        break;
      case "link":
        newText =
          description.substring(0, start) +
          `[${selectedText}](url)` +
          description.substring(end);
        newCursorPos = end + 7;
        break;
    }

    setDescription(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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

    if (!condition) {
      newErrors.condition = "Please select item condition";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!shipping.trim()) {
      newErrors.shipping = "Shipping information is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...step1Data,
        startingPrice: parseFloat(startingPrice),
        bidIncrement: parseFloat(bidIncrement),
        buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : 0,
        duration: parseInt(duration),
        description,
        condition,
        shipping,
        returns,
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
        <Badge className="bg-amber/20 text-amber border-amber/50">
          Step 2/2
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center text-sm">
            <Check className="h-4 w-4" />
          </div>
          <div className="flex-1 h-1 bg-amber" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center text-sm">
            2
          </div>
          <div className="flex-1 h-1 bg-amber" />
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
            <div className="p-2 rounded-lg bg-amber/10">
              <DollarSign className="h-5 w-5 text-amber" />
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
                      : "border-amber/30 focus-visible:ring-amber"
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
                <TrendingUp className="h-4 w-4 text-amber" />
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
                      : "border-amber/30 focus-visible:ring-amber"
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
                <Zap className="h-4 w-4 text-amber" />
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
                <Clock className="h-4 w-4 text-amber" />
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
          </div>

          <Alert className="border-amber/30 bg-amber/5">
            <Info className="h-4 w-4 text-amber" />
            <AlertDescription className="text-xs text-amber/90">
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
            <div className="p-2 rounded-lg bg-amber/10">
              <Bold className="h-5 w-5 text-amber" />
            </div>
            <h3 className="text-lg">Product Description</h3>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm">
              Item Condition <span className="text-destructive">*</span>
            </Label>
            <Select
              value={condition}
              onValueChange={(value) => {
                setCondition(value);
                setErrors((prev) => ({ ...prev, condition: "" }));
              }}
            >
              <SelectTrigger
                className={`h-11 ${
                  errors.condition ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-xs text-destructive">{errors.condition}</p>
            )}
          </div>

          {/* WYSIWYG Editor */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Detailed Description <span className="text-destructive">*</span>
            </Label>

            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border border-border rounded-t-lg bg-secondary/30">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={isBold ? "bg-amber/20 text-amber" : ""}
                onClick={() => applyFormatting("bold")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={isItalic ? "bg-amber/20 text-amber" : ""}
                onClick={() => applyFormatting("italic")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormatting("bullet")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyFormatting("link")}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Textarea */}
            <Textarea
              id="description"
              rows={10}
              placeholder="Describe your item in detail. Include features, specifications, condition details, and anything else buyers should know..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className={`resize-none rounded-t-none ${
                errors.description ? "border-destructive" : ""
              }`}
            />
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {description.length}/5000 characters (minimum 50)
              </p>
            )}
          </div>

          {/* Shipping Info */}
          <div className="space-y-2">
            <Label htmlFor="shipping" className="text-sm">
              Shipping Information <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shipping"
              placeholder="e.g., Free shipping, Ships within 2 business days"
              value={shipping}
              onChange={(e) => {
                setShipping(e.target.value);
                setErrors((prev) => ({ ...prev, shipping: "" }));
              }}
              className={`h-11 ${errors.shipping ? "border-destructive" : ""}`}
            />
            {errors.shipping && (
              <p className="text-xs text-destructive">{errors.shipping}</p>
            )}
          </div>

          {/* Returns */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border bg-secondary/30">
            <Checkbox
              id="returns"
              checked={returns}
              onCheckedChange={(checked) => setReturns(checked as boolean)}
            />
            <div className="flex-1">
              <label htmlFor="returns" className="text-sm cursor-pointer">
                Accept returns
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                30-day return policy increases buyer confidence
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Summary */}
      {startingPrice &&
        bidIncrement &&
        description.length >= 50 &&
        condition && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-500 mb-2">
                    Ready to Publish
                  </p>
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Warning */}
      <Alert className="border-amber/30 bg-amber/5">
        <AlertCircle className="h-4 w-4 text-amber" />
        <AlertTitle className="text-amber">Review Before Publishing</AlertTitle>
        <AlertDescription className="text-xs text-amber/90">
          Once published, you cannot modify auction pricing or duration. You can
          update the description and images.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product Info
        </Button>

        <Button type="submit" size="lg">
          <Check className="mr-2 h-4 w-4" />
          Publish Auction
        </Button>
      </div>
    </form>
  );
}
