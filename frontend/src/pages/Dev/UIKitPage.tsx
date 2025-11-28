import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  BookA,
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Settings,
  Search,
  Menu,
  Shield,
} from "lucide-react";

export default function UIKitPage() {
  const [progress] = useState(65);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                <BookA className="h-5 w-5 text-accent" />
                <h5 className="tracking-tight">Auctionary</h5>
              </div>
              <Badge variant="outline" className="border-accent text-accent">
                ALPHA v0.1
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border mb-4">
            <Lock className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              Secure • Anonymous • Tactical
            </span>
          </div>
          <h1 className="text-4xl tracking-tight">
            Black Market Design System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A high-fidelity UI kit featuring tactical accent colors on
            industrial dark surfaces. Built for secure, secretive, and modern
            web applications.
          </p>
        </div>

        {/* Design Tokens Display */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Color Palette
            </CardTitle>
            <CardDescription>
              Core design tokens and color system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Backgrounds</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-md bg-[#0b0c10] border border-border"></div>
                    <div>
                      <div className="text-sm">Deep Black</div>
                      <div className="text-xs text-muted-foreground">
                        #0b0c10
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-md bg-[#15161b] border border-border"></div>
                    <div>
                      <div className="text-sm">Dark Gunmetal</div>
                      <div className="text-xs text-muted-foreground">
                        #15161b
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Text Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-md bg-[#d1d5db] border border-border"></div>
                    <div>
                      <div className="text-sm">Light Gray</div>
                      <div className="text-xs text-muted-foreground">
                        #d1d5db
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-md bg-[#9ca3af] border border-border"></div>
                    <div>
                      <div className="text-sm">Cool Gray</div>
                      <div className="text-xs text-muted-foreground">
                        #9ca3af
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Accent</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-accent glow-accent">
                    <div className="w-12 h-12 rounded-md bg-[#ff9900] border border-accent"></div>
                    <div>
                      <div className="text-sm text-accent">Tactical Accent</div>
                      <div className="text-xs text-muted-foreground">
                        #ff9900
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-md bg-[#333333] border border-border"></div>
                    <div>
                      <div className="text-sm">Border Gray</div>
                      <div className="text-xs text-muted-foreground">
                        #333333
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Showcase */}
        <Tabs defaultValue="buttons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>
                  Primary actions with tactical accent highlights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">
                    Default Variants
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">With Icons</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <Lock className="mr-2 h-4 w-4" />
                      Secure Access
                    </Button>
                    <Button variant="secondary">
                      <BookA className="mr-2 h-4 w-4" />
                      Protected
                    </Button>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inputs Tab */}
          <TabsContent value="inputs" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Form Controls</CardTitle>
                <CardDescription>
                  Inputs with accent focus glow states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">Text Inputs</h4>
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="input1">Username</Label>
                      <Input id="input1" placeholder="Enter your codename..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="input2">Access Token</Label>
                      <Input
                        id="input2"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="input3">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="input3"
                          className="pl-10"
                          placeholder="Search auctions..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">
                    Select & Dropdowns
                  </h4>
                  <div className="max-w-md">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select auction category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="collectibles">
                          Collectibles
                        </SelectItem>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                        <SelectItem value="industrial">
                          Industrial Equipment
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">
                    Checkboxes & Switches
                  </h4>
                  <div className="space-y-4 max-w-md">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        Accept terms and conditions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="privacy" />
                      <Label htmlFor="privacy" className="text-sm">
                        Enable anonymous bidding
                      </Label>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Push Notifications</Label>
                      <Switch id="notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="darkmode">Stealth Mode</Label>
                      <Switch id="darkmode" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">Slider</h4>
                  <div className="max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bid Amount</span>
                      <span className="text-accent">
                        ${sliderValue[0] * 100}
                      </span>
                    </div>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Active Auction</CardTitle>
                  <CardDescription>Vintage Military Radio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Current Bid
                      </span>
                      <span className="text-accent">$1,250.00</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Ends in 2h 45m
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Place Bid</Button>
                </CardFooter>
              </Card>

              <Card className="border-accent glow-accent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Featured Item</CardTitle>
                      <CardDescription>Tactical Equipment Set</CardDescription>
                    </div>
                    <Badge className="bg-accent text-background">HOT</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Starting Bid
                      </span>
                      <span className="text-accent">$850.00</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-accent">32 watchers</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button className="flex-1">Bid Now</Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Closed Auction</CardTitle>
                  <CardDescription>Industrial Tools Bundle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Final Price
                      </span>
                      <span>$3,420.00</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Sold 3 days ago</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Badges & Status Indicators</CardTitle>
                <CardDescription>
                  Visual indicators for data categorization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">
                    Badge Variants
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="bg-accent text-background">Accent</Badge>
                    <Badge
                      className="border-accent text-accent"
                      variant="outline"
                    >
                      Accent Outline
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">
                    Status Badges
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                    <Badge className="bg-accent text-background">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                    <Badge variant="secondary">
                      <Lock className="mr-1 h-3 w-3" />
                      Secured
                    </Badge>
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Alert
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm text-muted-foreground">
                    Progress Indicators
                  </h4>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Auction Progress</span>
                        <span className="text-accent">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Verification</span>
                        <span className="text-green-500">100%</span>
                      </div>
                      <Progress value={100} className="[&>div]:bg-green-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Loading</span>
                        <span className="text-muted-foreground">30%</span>
                      </div>
                      <Progress value={30} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a standard alert message for general information.
                </AlertDescription>
              </Alert>

              <Alert className="border-accent bg-accent/10">
                <Zap className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent">
                  High Activity Detected
                </AlertTitle>
                <AlertDescription className="text-accent/90">
                  Multiple bids have been placed in the last 5 minutes. Act fast
                  to secure your item.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle className="text-success">Bid Successful</AlertTitle>
                <AlertDescription className="text-success">
                  Your bid of $1,500 has been placed successfully. You are
                  currently the highest bidder.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>
                  You must verify your identity before participating in this
                  auction.
                </AlertDescription>
              </Alert>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Notification Cards</CardTitle>
                <CardDescription>
                  System notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-md bg-accent/20">
                    <DollarSign className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">New bid on "Vintage Camera"</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      2 minutes ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-md bg-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">Payment confirmed</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      1 hour ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                  <div className="p-2 rounded-md bg-blue-500/20">
                    <Shield className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">Security scan completed</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      3 hours ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Shield className="h-5 w-5" />
              <span>Auctionary Design System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Black Market / Tactical Accent Theme • Built with React & Tailwind
              CSS
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>Font: Open Sans</span>
              <span>•</span>
              <span>Radius: 8px</span>
              <span>•</span>
              <span>Accent: #ff9900</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
