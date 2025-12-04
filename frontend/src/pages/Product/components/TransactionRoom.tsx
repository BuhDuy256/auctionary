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
import { Separator } from "../../../components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import {
  Check,
  Clock,
  AlertCircle,
  Send,
  Package,
  CreditCard,
  MapPin,
  Truck,
  Shield,
  Info,
  Copy,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

interface TransactionRoomProps {
  onSubmitAddress: () => void;
  onOpenFeedback: () => void;
}

const transactionSteps = [
  {
    id: 1,
    label: "Payment",
    icon: CreditCard,
    status: "completed" as const,
    description: "Waiting for payment confirmation",
  },
  {
    id: 2,
    label: "Shipping",
    icon: Package,
    status: "pending" as const,
    description: "Seller will ship your item",
  },
  {
    id: 3,
    label: "Delivery",
    icon: Truck,
    status: "upcoming" as const,
    description: "Item in transit to you",
  },
  {
    id: 4,
    label: "Complete",
    icon: CheckCircle2,
    status: "upcoming" as const,
    description: "Transaction complete",
  },
];

const chatMessages = [
  {
    id: 1,
    sender: "seller",
    name: "John Smith",
    message:
      "Congratulations on winning the auction! I'll ship it out as soon as payment clears.",
    timestamp: "10:23 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
  },
  {
    id: 2,
    sender: "buyer",
    name: "You",
    message: "Thanks! How long does shipping usually take?",
    timestamp: "10:25 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Buyer",
  },
  {
    id: 3,
    sender: "seller",
    name: "John Smith",
    message:
      "Usually 2-3 business days. I'll pack it very carefully with the original case.",
    timestamp: "10:27 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller",
  },
  {
    id: 4,
    sender: "system",
    message:
      "Escrow payment of $1,400 has been secured. Funds will be released to seller upon delivery confirmation.",
    timestamp: "10:30 AM",
  },
];

export function TransactionRoom({
  onSubmitAddress,
  onOpenFeedback,
}: TransactionRoomProps) {
  const [message, setMessage] = useState("");
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [copied, setCopied] = useState(false);

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText("TXN-89234");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage("");
    }
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Address submitted:", addressForm);
    onSubmitAddress();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">Transaction Room</h1>
            <Badge className="bg-accent/20 text-accent border-accent/50">
              <Clock className="h-3 w-3 mr-1" />
              In Progress
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Complete your purchase and communicate with the seller
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Transaction ID:</span>
            <code className="px-2 py-1 rounded bg-secondary border border-border font-mono text-xs">
              TXN-89234
            </code>
            <Button variant="ghost" size="sm" onClick={handleCopyTransactionId}>
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Summary */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1755136979154-c491ac08dc37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYW1lcmElMjBkZXRhaWx8ZW58MXx8fHwxNzY0MTc1NTE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vintage Leica M6"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg mb-1">
                Vintage Leica M6 Camera with 50mm Lens
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Auction Ended: Nov 25, 2025</span>
                <span>•</span>
                <span>Category: Cameras</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Winning Bid
              </div>
              <div className="text-2xl text-accent">$1,400</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Stepper */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Transaction Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="relative">
            {/* Progress Line */}
            <div
              className="absolute top-5 left-0 right-0 h-0.5 bg-border"
              style={{ width: "calc(100% - 40px)", marginLeft: "20px" }}
            >
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: "0%" }}
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-4">
              {transactionSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.status === "pending";
                const isCompleted = step.status === "completed";
                // const isUpcoming = step.status === "upcoming";

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 relative z-10 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-2 border-green-500"
                          : isActive
                          ? "bg-accent border-2 border-accent animate-pulse"
                          : "bg-secondary border-2 border-border"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isCompleted || isActive
                            ? "text-background"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <div
                      className={`text-sm mb-1 ${
                        isActive
                          ? "text-accent"
                          : isCompleted
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </div>

                    {/* Description */}
                    <div className="text-xs text-muted-foreground max-w-[120px]">
                      {step.status === "completed"
                        ? "Completed"
                        : step.description}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <Badge className="mt-2 bg-accent/20 text-accent border-accent/50 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Form + Chat */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Delivery Address Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Alert */}
          <Alert className="border-accent/30 bg-accent/5">
            <Shield className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-accent/90">
              <strong>Escrow Protection Active:</strong> Your payment of $1,400
              is secured in escrow. Funds will only be released to the seller
              after you confirm delivery.
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
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Amount
                  </div>
                  <div className="text-xl text-accent">$1,400.00</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Escrow Fee
                  </div>
                  <div className="text-xl">$28.00</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Payment Method
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-xs text-white">
                      VISA
                    </div>
                    <span className="text-sm">•••• 4242</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Status
                  </div>
                  <div className="text-sm">Processing...</div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <DollarSign className="mr-2 h-5 w-5" />
                Complete Payment
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Address Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAddress} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
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
                    value={addressForm.addressLine1}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        addressLine1: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, etc."
                    value={addressForm.addressLine2}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
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
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
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
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
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
                      value={addressForm.zipCode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
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
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <Alert className="border-border bg-secondary/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This address will be shared with the seller for shipping
                    purposes only.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg">
                  <Check className="mr-2 h-5 w-5" />
                  Confirm Delivery Address
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Chat Box */}
        <div className="lg:col-span-1">
          <Card className="border-border sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Transaction Chat</CardTitle>
              <p className="text-xs text-muted-foreground">
                Communicate securely with the seller
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              {/* Chat Messages */}
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === "buyer" ? "flex-row-reverse" : ""
                      } ${msg.sender === "system" ? "justify-center" : ""}`}
                    >
                      {msg.sender !== "system" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>
                            {msg.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`flex-1 max-w-[80%] ${
                          msg.sender === "system" ? "max-w-full" : ""
                        }`}
                      >
                        {msg.sender !== "system" && (
                          <div
                            className={`text-xs text-muted-foreground mb-1 ${
                              msg.sender === "buyer" ? "text-right" : ""
                            }`}
                          >
                            {msg.name} • {msg.timestamp}
                          </div>
                        )}

                        <div
                          className={`rounded-lg p-3 text-sm ${
                            msg.sender === "buyer"
                              ? "bg-accent/20 border border-accent/30 text-foreground"
                              : msg.sender === "seller"
                              ? "bg-secondary border border-border"
                              : "bg-blue-500/10 border border-blue-500/30 text-center text-xs text-blue-400"
                          }`}
                        >
                          {msg.message}
                          {msg.sender === "system" && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {msg.timestamp}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  All messages are monitored for security
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
