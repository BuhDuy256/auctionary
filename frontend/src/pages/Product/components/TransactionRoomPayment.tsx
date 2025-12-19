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
  AlertCircle,
  CreditCard,
  Shield,
  Info,
  Upload,
  X,
  Image as ImageIcon,
  Building2,
  Copy,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";

interface TransactionRoomProps {
  onPaymentProof: (file: File) => void;
  isSeller: boolean;
}

// Mock bank info - in real app this would come from API
const sellerBankInfo = {
  bankName: "Bank of America",
  accountNumber: "1234567890",
  accountHolder: "John Smith",
  routingNumber: "021000322",
  transactionCode: "TXN-89234",
};

export function TransactionRoom({ onPaymentProof, isSeller }: TransactionRoomProps) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Shipping address form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return;
    }

    setPaymentProof(file);
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
    setPaymentProof(null);
  };

  const handleSubmit = () => {
    if (paymentProof) {
      onPaymentProof(paymentProof);
    }
  };

  // SELLER VIEW - Waiting for buyer payment
  if (isSeller) {
    return (
      <div className="lg:col-span-2 space-y-6">
        {/* Waiting Alert */}
        <Alert className="border-accent/30 bg-accent/5">
          <Clock className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm text-accent/90">
            <strong>Awaiting Payment:</strong> Waiting for the buyer to complete the payment transfer.
          </AlertDescription>
        </Alert>

        {/* Waiting State Card */}
        <Card className="border-border">
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                  <CreditCard className="h-16 w-16 text-accent" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-accent animate-spin" />
                  </div>
                </div>
              </div>

              {/* Waiting Message */}
              <div className="space-y-3">
                <h2 className="text-2xl">Waiting for Buyer Payment</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  The buyer is processing the payment transfer. You'll be notified once the payment proof is submitted.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting Payment Proof
                </Badge>
              </div>

              {/* Information */}
              <Alert className="border-border bg-secondary/30 max-w-md">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  The buyer has up to 72 hours to complete the payment. 
                  You can chat with the buyer if needed.
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Buyer Completes Payment</div>
                  <div className="text-xs text-muted-foreground">Pending...</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Payment Verification</div>
                  <div className="text-xs text-muted-foreground">Pending...</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Ship Item</div>
                  <div className="text-xs text-muted-foreground">Pending...</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Transaction Complete</div>
                  <div className="text-xs text-muted-foreground">Pending...</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // BUYER VIEW - Payment form
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Payment Alert */}
      <Alert className="border-accent/30 bg-accent/5">
        <Shield className="h-4 w-4 text-accent" />
        <AlertDescription className="text-sm text-accent/90">
          <strong>Direct Bank Transfer:</strong> Please transfer the exact amount to the seller's bank account below. Upload your payment receipt after completing the transfer.
        </AlertDescription>
      </Alert>

      {/* Payment Details */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />
              Payment Information
            </CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
              <AlertCircle className="h-3 w-3 mr-1" />
              Awaiting Payment
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground mb-1">
                Total Amount to Transfer
              </div>
              <div className="text-3xl text-accent font-bold">$1,400.00</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/*}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent" />
            Seller's Bank Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-accent/30 bg-background">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs">
              Transfer the exact amount to this account. Use the transaction code as transfer description.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Bank Name</div>
                <div className="font-medium">{sellerBankInfo.bankName}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(sellerBankInfo.bankName, "bank")}
              >
                {copiedField === "bank" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Account Holder</div>
                <div className="font-medium">{sellerBankInfo.accountHolder}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(sellerBankInfo.accountHolder, "holder")}
              >
                {copiedField === "holder" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Account Number</div>
                <code className="font-mono text-lg tracking-wider text-accent">
                  {sellerBankInfo.accountNumber}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(sellerBankInfo.accountNumber, "account")}
              >
                {copiedField === "account" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Routing Number</div>
                <code className="font-mono text-lg tracking-wider">
                  {sellerBankInfo.routingNumber}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(sellerBankInfo.routingNumber, "routing")}
              >
                {copiedField === "routing" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border-2 border-accent/30">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  Transfer Description (Required)
                </div>
                <code className="font-mono text-lg tracking-wider text-accent font-bold">
                  {sellerBankInfo.transactionCode}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(sellerBankInfo.transactionCode, "code")}
              >
                {copiedField === "code" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Upload Payment Proof */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            Upload Payment Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-border bg-secondary/30">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              After completing the bank transfer, upload a screenshot or photo of your payment receipt for verification.
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
              id="payment-proof-upload"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={!!paymentProof}
            />
            <div className="p-8 text-center">
              <div className="p-4 rounded-full bg-secondary/50 w-fit mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-2">
                Drag and drop your receipt here, or{" "}
                <span className="text-accent">click to browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or WEBP (Max 5MB)
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {paymentProof && (
            <div className="relative rounded-lg overflow-hidden border-2 border-border">
              <img
                src={URL.createObjectURL(paymentProof)}
                alt="Payment receipt"
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

      {/* Shipping Address Form - Only for Buyers */}
      {!isSeller && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-border bg-secondary/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Please provide your delivery address. This will be shared with the seller for shipping.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      fullName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">
                  Address Line 1 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addressLine1"
                  placeholder="123 Main Street"
                  value={shippingAddress.addressLine1}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      addressLine1: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, etc."
                  value={shippingAddress.addressLine2}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      addressLine2: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">
                    ZIP Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Payment Button */}
      <Button
        className="w-full"
        size="lg"
        disabled={!paymentProof}
        onClick={handleSubmit}
      >
        <Check className="mr-2 h-5 w-5" />
        Confirm Payment Sent
      </Button>
    </div>
  );
}
