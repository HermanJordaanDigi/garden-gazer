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
    to: "/?view=collection",
    isActive: (_, searchParams) => searchParams.get("view") === "collection",
  },
  {
    label: "Wishlist",
    icon: "favorite",
    to: "/",
    isActive: (pathname, searchParams) =>
      pathname === "/" && !searchParams.get("view"),
  },
  {
    label: "Settings",
    icon: "settings",
    to: "#",
    isActive: () => false,
    disabled: true,
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
            Garden Gazer
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.isActive(location.pathname, searchParams);
            const isDisabled = item.disabled;

            return (
              <li key={item.label}>
                <Link
                  to={isDisabled ? "#" : item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive &&
                      "bg-woodland-primary/15 text-woodland-text-main font-medium",
                    !isActive &&
                      !isDisabled &&
                      "text-woodland-text-muted hover:bg-woodland-background-light",
                    isDisabled &&
                      "text-woodland-text-muted/50 cursor-not-allowed opacity-60"
                  )}
                  onClick={(e) => isDisabled && e.preventDefault()}
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
        </ul>
      </nav>

      {/* Add Plant Button */}
      <div className="p-4 border-t border-woodland-border-light">
        <Link
          to="/add-plant"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-woodland-primary text-white font-medium hover:bg-woodland-primary/90 transition-colors"
        >
          <MaterialIcon name="add" size="md" />
          <span>Add Plant</span>
        </Link>
      </div>
    </aside>
  );
}
