import { type ReactNode, useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  BookA,
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  LogOut,
  User,
  Sun,
  Moon,
  CircleUserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: "overview" | "categories" | "users" | "products";
  onNavigate: (page: "overview" | "categories" | "users" | "products") => void;
}

const navigationItems = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "users" as const,
    label: "User Management",
    icon: Users,
    badge: null,
  },
  {
    id: "categories" as const,
    label: "Categories",
    icon: FolderTree,
    badge: null,
  },
  {
    id: "products" as const,
    label: "Product Management",
    icon: Package,
    badge: null,
  },
];

export function AdminLayout({
  children,
  currentPage,
  onNavigate,
}: AdminLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentPageLabel =
    navigationItems.find((item) => item.id === currentPage)?.label ||
    "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`sticky top-0 h-screen border-r border-border bg-card/50 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[80px]" : "w-64"
        }`}
      >
        <div
          className={`p-4 border-border flex-shrink-0 flex items-center ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity text-accent overflow-hidden whitespace-nowrap"
          >
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 flex-shrink-0">
              <BookA className="h-5 w-5 text-accent" />
            </div>
            <span
              className={`tracking-tight text-lg transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
              }`}
            >
              Auctionary
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          <Separator className="mb-6" />
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                variant={isActive ? "default" : "ghost"}
                title={isCollapsed ? item.label : undefined}
                className={`group w-full flex items-center transition-all h-12 relative ${
                  isCollapsed ? "justify-center px-0" : "justify-between px-4"
                } ${
                  isActive
                    ? "bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20"
                    : "hover:bg-secondary/50 border border-transparent hover:border-accent/30 hover:text-accent"
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    !isCollapsed ? "flex-1" : ""
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 group-hover:text-accent ${
                      isActive ? "text-accent" : "text-muted-foreground"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm truncate">{item.label}</span>
                  )}
                </div>
              </Button>
            );
          })}

          <Separator className="my-4" />
        </nav>

        <div className="p-4 mt-auto">
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center h-10 hover:bg-secondary/50"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Collapse Sidebar</span>
              </div>
            )}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <header className="border-b border-border bg-card/30 backdrop-blur sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {currentPageLabel}
            </h2>

            <div className="flex items-center gap-4">
              {theme === "tactical" ? (
                <Button
                  variant="ghost"
                  className="lg:flex"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="lg:flex"
                  onClick={() => setTheme("tactical")}
                >
                  <Moon className="h-5 w-5" />
                </Button>
              )}

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="hidden md:block text-right">
                    <div className="text-sm">Welcome back,</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.fullName || user?.email}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer outline-none">
                        <CircleUserRound className="h-10 w-10 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-w-60">
                      <DropdownMenuLabel className="font-bold">
                        {user?.fullName || user?.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="group cursor-pointer"
                      >
                        <User className="h-5 w-5 text-muted-foreground group-focus:text-accent-foreground transition-colors" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="group cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <LogOut className="h-5 w-5 text-destructive group-focus:text-destructive" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
