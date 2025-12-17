import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Check,
  Clock,
  Shield,
  Upload,
  X,
  Image as ImageIcon,
  PackageCheck,
  Truck,
  Info,
  Loader2,
} from "lucide-react";

interface TransactionRoomShippingProps {
  isSeller: boolean;
  onShippingProof: (file: File) => void;
}

export function TransactionRoomShipping({
  isSeller,
  onShippingProof,
}: TransactionRoomShippingProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingProof, setShippingProof] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return;
    }

    setShippingProof(file);
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

  const removeImage = () => {
    setShippingProof(null);
  };

  const handleSubmit = () => {
    if (shippingProof) {
      onShippingProof(shippingProof);
    }
  };

  // SELLER VIEW
  if (isSeller) {
    return (
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Confirmation Alert */}
        <Alert className="border-green-500/30 bg-green-500/5">
          <Shield className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm text-green-500/90">
            <strong>Payment Received:</strong> Buyer has completed the payment. Please check your bank account and ship the item.
          </AlertDescription>
        </Alert>

        {/* Status Card */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                  <PackageCheck className="h-10 w-10 text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-2">Ready to Ship</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  The buyer has transferred the payment. Please verify your bank account and prepare the item for shipping.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                    <Check className="h-3 w-3 mr-1" />
                    Payment Confirmed
                  </Badge>
                  <Badge className="bg-accent/20 text-accent border-accent/50">
                    <Clock className="h-3 w-3 mr-1" />
                    Action Required
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Number Input */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-accent" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-border bg-secondary/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Enter the tracking number (optional) and upload proof of shipment to proceed.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">
                Tracking Number <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="trackingNumber"
                placeholder="e.g., TRK-1234567890"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Providing a tracking number helps the buyer track their package
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Shipping Proof */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-accent" />
              Upload Shipping Proof
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-border bg-secondary/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Upload a photo of the shipping receipt or proof of shipment (required to proceed).
              </AlertDescription>
            </Alert>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg transition-all ${
                dragActive
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/50 hover:bg-accent/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="shipping-proof-upload"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={!!shippingProof}
              />
              <div className="p-8 text-center">
                <div className="p-4 rounded-full bg-secondary/50 w-fit mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2">
                  Drag and drop shipping receipt here, or{" "}
                  <span className="text-accent">click to browse</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WEBP (Max 5MB)
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {shippingProof && (
              <div className="relative rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={URL.createObjectURL(shippingProof)}
                  alt="Shipping proof"
                  className="w-full h-auto max-h-96 object-contain bg-secondary"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 rounded-full bg-destructive/90 backdrop-blur text-white hover:bg-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <Badge className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur border-0">
                  <Check className="h-3 w-3 mr-1" />
                  Receipt Uploaded
                </Badge>
              </div>
            )}

          </CardContent>
        </Card>
        <Button
          className="w-full"
          size="lg"
          disabled={!shippingProof}
          onClick={handleSubmit}
        >
          <Check className="mr-2 h-5 w-5" />
          Confirm Shipped
        </Button>
      </div>
    );
  }

  // BUYER VIEW - Waiting State
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Waiting Alert */}
      <Alert className="border-accent/30 bg-accent/5">
        <Clock className="h-4 w-4 text-accent" />
        <AlertDescription className="text-sm text-accent/90">
          <strong>Payment Submitted:</strong> Your payment proof has been sent to the seller. Waiting for verification and shipment.
        </AlertDescription>
      </Alert>

      {/* Waiting State Card */}
      <Card className="border-border">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <PackageCheck className="h-16 w-16 text-accent" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-12 h-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-accent animate-spin" />
                </div>
              </div>
            </div>

            {/* Waiting Message */}
            <div className="space-y-3">
              <h2 className="text-2xl">Waiting for Seller</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                The seller is verifying your payment and preparing to ship the item. 
                You'll be notified once the package is shipped.
              </p>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                <Check className="h-3 w-3 mr-1" />
                Payment Proof Submitted
              </Badge>
              <Badge className="bg-accent/20 text-accent border-accent/50">
                <Clock className="h-3 w-3 mr-1" />
                Awaiting Seller Action
              </Badge>
            </div>

            {/* Information */}
            <Alert className="border-border bg-secondary/30 max-w-md">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                The seller has up to 48 hours to verify payment and ship the item. 
                You can chat with the seller if you have any questions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Preview */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Transaction Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm">Payment Proof Submitted</div>
                <div className="text-xs text-muted-foreground">Nov 28, 11:45 AM</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Seller Verifies & Ships</div>
                <div className="text-xs text-muted-foreground">Pending...</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Package in Transit</div>
                <div className="text-xs text-muted-foreground">Pending...</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                <PackageCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Delivery Confirmation</div>
                <div className="text-xs text-muted-foreground">Pending...</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
