import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeMap: Record<string, BreadcrumbItem[]> = {
  "/seller/dashboard": [{ label: "Dashboard" }],
  "/seller/auction/create": [
    { label: "Dashboard", path: "/seller/dashboard" },
    { label: "Create Auction" },
  ],
};

export function Breadcrumb() {
  const location = useLocation();
  const items = routeMap[location.pathname];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-border bg-card/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
