import { useSearchParams, useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchValue = searchParams.get("search") || "";
  const { user, profile, signOut } = useUser();

  const userName = profile?.display_name || user?.email?.split("@")[0] || "Guest";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };


  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-woodland-surface-light border-b border-woodland-border-light px-4 md:px-8 py-4",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-woodland-text-main hover:bg-woodland-background-light"
          onClick={onMenuClick}
        >
          <MaterialIcon name="menu" size="lg" />
        </Button>

        {/* Search Input */}
        <div className="flex-1 md:flex-initial md:w-80 relative">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-woodland-text-muted"
            size="md"
          />
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white border-woodland-border-light focus:border-woodland-primary focus:ring-woodland-primary/20"
          />
        </div>

        {/* Spacer - hidden on mobile */}
        <div className="hidden md:block flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications (stub) */}
          <Button
            variant="ghost"
            size="icon"
            className="text-woodland-text-muted hover:bg-woodland-background-light hover:text-woodland-text-main"
          >
            <MaterialIcon name="notifications" size="lg" />
          </Button>

          {/* User Avatar */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 ml-2 cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || ""} alt={userName} />
                    <AvatarFallback className="bg-woodland-primary text-white text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-woodland-text-main">
                    {userName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <MaterialIcon name="logout" size="sm" className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
