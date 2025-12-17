import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Check,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Flag,
  Loader2,
  Info,
  PackageCheck,
} from "lucide-react";

interface TransactionRoomDeliveryProps {
  isSeller: boolean;
  onConfirmReceipt: () => void;
  onReportIssue: () => void;
}

export function TransactionRoomDelivery({
  isSeller,
  onConfirmReceipt,
  onReportIssue,
}: TransactionRoomDeliveryProps) {
  const handleConfirmReceipt = () => {
    onConfirmReceipt();
  };

  const handleReportIssue = () => {
    onReportIssue();
  };

  // SELLER VIEW - Waiting for buyer confirmation
  if (isSeller) {
    return (
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Confirmation Alert */}
        <Alert className="border-green-500/30 bg-green-500/5">
          <Shield className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm text-green-500/90">
            <strong>Package Delivered:</strong> The item has been delivered to the buyer. Waiting for buyer confirmation to release funds.
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
                <h2 className="text-2xl">Waiting for Buyer Confirmation</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  The package has been delivered successfully. The buyer is inspecting the item.
                  Funds will be released to your account once they confirm receipt.
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                  <Check className="h-3 w-3 mr-1" />
                  Package Delivered
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/50">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting Buyer Confirmation
                </Badge>
              </div>

              {/* Information */}
              <Alert className="border-border bg-secondary/30 max-w-md">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  The buyer has up to 72 hours to confirm receipt and inspect the item.
                  If no issues are reported, funds will be automatically released.
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
                  <div className="text-sm">Payment Received</div>
                  <div className="text-xs text-muted-foreground">Nov 28, 11:45 AM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">Package Shipped</div>
                  <div className="text-xs text-muted-foreground">Nov 28, 2:00 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">Package Delivered</div>
                  <div className="text-xs text-muted-foreground">Nov 30, 2:15 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Buyer Confirmation</div>
                  <div className="text-xs text-muted-foreground">Pending...</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Funds Released</div>
                  <div className="text-xs text-muted-foreground">Pending...</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // BUYER VIEW - Confirm delivery
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Map Visualization */}
      <Card className="border-border overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-secondary via-secondary/70 to-background">
          {/* Dark Map Background with Route Visualization */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 800 256">
              {/* Grid Pattern */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect width="800" height="256" fill="url(#grid)" />
            </svg>
          </div>

          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 256">
            <defs>
              <linearGradient
                id="routeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ff9900" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 150 128 Q 400 80 650 128"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
          </svg>

          {/* Seller Location (Start) */}
          <div className="absolute left-[150px] top-[128px] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <Flag className="h-6 w-6 text-green-500" />
              </div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="px-3 py-1 rounded bg-secondary border border-border text-xs">
                  San Francisco, CA
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Location (End - Arrived) */}
          <div className="absolute left-[650px] top-[128px] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center animate-pulse">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="px-3 py-1 rounded bg-accent/20 border border-accent text-xs text-accent">
                  <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  Arrived - New York, NY
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
              <Truck className="h-3 w-3 mr-1" />
              Delivered Nov 30, 2:15 PM
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action Required Card */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl mb-1">Package Delivered</CardTitle>
              <p className="text-sm text-muted-foreground">
                The carrier reported the item was delivered at{" "}
                <strong>2:15 PM</strong>. Please inspect the item carefully.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Warning Alert */}
          <Alert className="border-accent/50 bg-accent/10">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm">
              <strong className="text-accent">Important:</strong> Once you
              confirm receipt, the funds{" "}
              <strong className="text-accent">($1,400)</strong> held in Escrow
              will be released to the seller immediately.{" "}
              <strong className="text-accent">
                This action cannot be undone.
              </strong>
            </AlertDescription>
          </Alert>

          {/* Inspection Checklist */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h4 className="text-sm mb-3">Before confirming, please verify:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Package is sealed and in good condition</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Item matches the description and photos</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>No visible damage or missing components</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-14 text-lg"
              size="lg"
              onClick={handleConfirmReceipt}
            >
              <CheckCircle2 className="mr-2 h-6 w-6" />
              Confirm Receipt & Release Funds
            </Button>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleReportIssue}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Issue / Request Return
            </Button>
          </div>

          {/* Escrow Info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">
              Escrow Protection: $1,400 + $28 fee secured until confirmation
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
