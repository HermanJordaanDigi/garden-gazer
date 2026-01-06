import { Link, useLocation, useSearchParams } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: string;
  to: string;
  isActive: (pathname: string, searchParams: URLSearchParams) => boolean;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "My Plants",
    icon: "potted_plant",
    to: "/",
    isActive: (pathname, searchParams) =>
      pathname === "/" && searchParams.get("view") !== "wishlist",
  },
  {
    label: "Wishlist",
    icon: "favorite",
    to: "/?view=wishlist",
    isActive: (_, searchParams) => searchParams.get("view") === "wishlist",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <aside
      className={cn(
        "w-72 bg-woodland-surface-light border-r border-woodland-border-light flex flex-col",
        className
      )}
    >
      {/* Logo / Brand Section */}
      <div className="p-6 border-b border-woodland-border-light">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-woodland-primary flex items-center justify-center">
            <MaterialIcon name="eco" className="text-white" size="md" />
          </div>
          <span className="font-bold text-xl text-woodland-text-main">
            Villa Jordaan
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.isActive(location.pathname, searchParams);

            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive &&
                      "bg-woodland-primary/15 text-woodland-text-main font-medium",
                    !isActive &&
                      "text-woodland-text-muted hover:bg-woodland-background-light"
                  )}
                >
                  <MaterialIcon
                    name={item.icon}
                    filled={isActive}
                    className={cn(
                      isActive
                        ? "text-woodland-primary"
                        : "text-woodland-text-muted"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          {/* Add Plant Button */}
          <li>
            <Link
              to="/add-plant"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-woodland-text-muted hover:bg-woodland-background-light transition-colors"
            >
              <MaterialIcon name="add" className="text-woodland-text-muted" />
              <span>Add Plant</span>
            </Link>
          </li>
          {/* Settings */}
          <li>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                location.pathname === "/settings"
                  ? "bg-woodland-primary/15 text-woodland-text-main font-medium"
                  : "text-woodland-text-muted hover:bg-woodland-background-light"
              )}
            >
              <MaterialIcon
                name="settings"
                filled={location.pathname === "/settings"}
                className={cn(
                  location.pathname === "/settings"
                    ? "text-woodland-primary"
                    : "text-woodland-text-muted"
                )}
              />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
