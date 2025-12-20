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
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import type { TransactionDetailResponse } from "../../../types/transaction";
import { formatTime } from "../../../utils/dateUtils";

type StepState = "completed" | "active-actor" | "active-observer" | "locked";

interface TransactionRoomProps {
  mode: StepState;
  transaction: TransactionDetailResponse;
  onPaymentProof: (file: File, shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  }) => void;
  isSeller: boolean;
  isLoading?: boolean;
}

export function TransactionRoom({ mode, transaction, onPaymentProof, isSeller, isLoading = false }: TransactionRoomProps) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: transaction.shippingInfo.fullName || "",
    address: transaction.shippingInfo.address || "",
    city: transaction.shippingInfo.city || "",
    phone: transaction.shippingInfo.phoneNumber || "",
  });

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentProof) {
      newErrors.paymentProof = "Payment receipt is required";
    }

    if (!isSeller) {
      // Full Name validation
      if (!shippingAddress.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (shippingAddress.fullName.trim().length > 255) {
        newErrors.fullName = "Full name is too long (max 255 characters)";
      }

      // Address validation
      if (!shippingAddress.address.trim()) {
        newErrors.address = "Address is required";
      }

      // City validation
      if (!shippingAddress.city.trim()) {
        newErrors.city = "City is required";
      }

      // Phone validation (Vietnamese format)
      if (!shippingAddress.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^(0|\+84)(\d{9,10})$/.test(shippingAddress.phone.trim())) {
        newErrors.phone = "Invalid Vietnamese phone number (e.g., 0901234567 or +84901234567)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && paymentProof) {
      onPaymentProof(paymentProof, shippingAddress);
    }
  };

  if (mode === "completed") {
    return (
      <div className="lg:col-span-2 space-y-6">
        {/* Completion Alert */}
        <Alert className="border-green-500/30 bg-green-500/5">
          <Shield className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm text-green-500/90">
            <strong>Payment Confirmed:</strong> Payment was verified and confirmed on{" "}
            {transaction.payment.confirmedAt && formatTime(transaction.payment.confirmedAt)}.
          </AlertDescription>
        </Alert>

        {/* Payment Details Summary */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                Payment Confirmed
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                <Check className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Amount Paid</div>
                <div className="text-3xl text-green-500 font-bold">${transaction.finalPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Payment Uploaded</div>
                <div className="text-sm">
                  {transaction.payment.uploadedAt && formatTime(transaction.payment.uploadedAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Confirmed At</div>
                <div className="text-sm">
                  {transaction.payment.confirmedAt && formatTime(transaction.payment.confirmedAt)}
                </div>
              </div>
            </div>

            {/* Payment Proof Image */}
            {transaction.payment.proofUrl && (
              <div className="space-y-2">
                <Label>Payment Receipt</Label>
                <div className="relative rounded-lg overflow-hidden border-2 border-green-500/30">
                  <img
                    src={transaction.payment.proofUrl}
                    alt="Payment receipt"
                    className="w-full h-auto max-h-96 object-contain bg-secondary"
                  />
                  <Badge className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address Summary */}
        {transaction.shippingInfo.fullName && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="space-y-1 text-sm">
                  <div><strong>{transaction.shippingInfo.fullName}</strong></div>
                  <div>{transaction.shippingInfo.address}</div>
                  <div>{transaction.shippingInfo.city}</div>
                  <div>{transaction.shippingInfo.phoneNumber}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ============================================================================
  // ACTIVE-OBSERVER STATE - Waiting for the other party
  // ============================================================================
  if (mode === "active-observer") {
    // SELLER waiting for BUYER to upload payment proof
    if (isSeller) {
      // Check if buyer already uploaded proof (seller just observes, no confirmation here)
      if (transaction.payment.proofUrl) {
        return (
          <div className="lg:col-span-2 space-y-6">
            {/* Review Alert */}
            <Alert className="border-accent/30 bg-accent/5">
              <Shield className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm text-accent/90">
                <strong>Payment Proof Received:</strong> The buyer has submitted payment proof and shipping address.
              </AlertDescription>
            </Alert>

            {/* Payment Proof Review */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Payment Proof Submitted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">Amount to Verify</div>
                    <div className="text-3xl text-accent font-bold">${transaction.finalPrice.toFixed(2)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">Uploaded At</div>
                    <div className="text-sm">
                      {transaction.payment.uploadedAt && formatTime(transaction.payment.uploadedAt)}
                    </div>
                  </div>
                </div>

                {/* Payment Proof Image */}
                <div className="space-y-2">
                  <Label>Payment Receipt</Label>
                  <div className="relative rounded-lg overflow-hidden border-2 border-accent">
                    <img
                      src={transaction.payment.proofUrl}
                      alt="Payment receipt"
                      className="w-full h-auto max-h-96 object-contain bg-secondary"
                    />
                  </div>
                </div>

                {/* Buyer's Shipping Address */}
                {transaction.shippingInfo.fullName && (
                  <div className="space-y-2">
                    <Label>Shipping Address Provided</Label>
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="space-y-1 text-sm">
                        <div><strong>{transaction.shippingInfo.fullName}</strong></div>
                        <div>{transaction.shippingInfo.address}</div>
                        <div>{transaction.shippingInfo.city}</div>
                        <div>{transaction.shippingInfo.phoneNumber}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      }

      // Buyer hasn't uploaded yet - pure waiting state
      return (
        <div className="lg:col-span-2 space-y-6">
          <Alert className="border-accent/30 bg-accent/5">
            <Clock className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-accent/90">
              <strong>Awaiting Payment:</strong> Waiting for the buyer to complete the payment transfer.
            </AlertDescription>
          </Alert>

          <Card className="border-border">
            <CardContent className="p-12">
              <div className="flex flex-col items-center text-center space-y-6">
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
                <div className="space-y-3">
                  <h2 className="text-2xl">Waiting for Buyer Payment</h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    The buyer is processing the payment transfer. You'll be notified once the payment proof is submitted.
                  </p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting Payment Proof
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  }

  if (mode === "active-actor") {
    return (
      <div className="lg:col-span-2 space-y-6">
        <Alert className="border-accent/30 bg-accent/5">
          <Shield className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm text-accent/90">
            <strong>Payment Required:</strong> Please complete the payment transfer and upload your payment receipt.
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
                <div className="text-xs text-muted-foreground mb-1">Total Amount to Transfer</div>
                <div className="text-3xl text-accent font-bold">${transaction.finalPrice.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                After completing the payment, upload a screenshot or photo of your payment receipt for verification.
              </AlertDescription>
            </Alert>

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
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</p>
              </div>
            </div>

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
                    onChange={(e) => {
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value });
                      setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={errors.fullName ? "border-destructive" : ""}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">
                    Address Line 1 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={shippingAddress.address}
                    onChange={(e) => {
                      setShippingAddress({ ...shippingAddress, address: e.target.value });
                      setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                    className={errors.address ? "border-destructive" : ""}
                    required
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive">{errors.address}</p>
                  )}
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
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, city: e.target.value });
                        setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      className={errors.city ? "border-destructive" : ""}
                      required
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0901234567 or +84901234567"
                      value={shippingAddress.phone}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, phone: e.target.value });
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      className={errors.phone ? "border-destructive" : ""}
                      required
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          className="w-full" 
          size="lg" 
          disabled={!paymentProof || isLoading} 
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {isLoading ? (
            "Submitting..."
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Confirm Payment Sent
            </>
          )}
        </Button>
      </div>
    );
  }

  return null;
}
