import {
  ShieldCheck,
  Lock,
  Truck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

export default function BidderProtectionPage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-accent/5 py-20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-accent/10 mb-6">
            <ShieldCheck className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Bid with Total Confidence
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your purchases are backed by our comprehensive Buyer Protection
            Program. From bidding to delivery, we've got you covered.
          </p>
          <Button size="lg" onClick={() => navigate("/products")}>
            Start Exploring
          </Button>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your payment is held in our secure Escrow system until you
                confirm that the item has been received as described.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Authenticity Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We verify sellers and listings. If an item isn't authentic, you
                get your money back, including shipping.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Truck className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Tracked Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every shipment is tracked. If your item doesn't arrive, our team
                steps in to ensure a full refund.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <RefreshCw className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle>Easy Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Item not as described? You have 3 days after delivery to inspect
                and request a return or refund.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How You're Protected
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

            <div className="text-center relative">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/10">
                <span className="text-4xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Pay Securely</h3>
              <p className="text-muted-foreground">
                You pay Auctionary, not the seller directly. We hold the funds
                safely.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/10">
                <span className="text-4xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Seller Ships</h3>
              <p className="text-muted-foreground">
                The seller is notified to ship. Funds are released only after
                delivery is confirmed.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/10">
                <span className="text-4xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Inspect & Keep</h3>
              <p className="text-muted-foreground">
                You receive the item and check it. If it's good, the seller gets
                paid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What happens if my item never arrives?
            </AccordionTrigger>
            <AccordionContent>
              If the tracking shows no movement or the item is lost, report it
              to our support team. We will investigate and issue a full refund
              if the item is not delivered.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              The item is damaged or not as described. What do I do?
            </AccordionTrigger>
            <AccordionContent>
              Do NOT confirm receipt in the system. Instead, open a dispute
              within 3 days of delivery. Submit photos and details. Our team
              will review the case and facilitate a return or refund.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Is my credit card information safe?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. We use industry-standard encryption and do not store
              your full card details. Payments are processed by secure
              third-party payment gateways.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I cancel a bid?</AccordionTrigger>
            <AccordionContent>
              Generally, bids are binding. However, you can retract a bid in
              specific severe circumstances (e.g., obvious typo in bid amount)
              by contacting support immediately.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </MainLayout>
  );
}
