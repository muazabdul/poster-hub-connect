
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn, LogOut } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface NavItem {
  title: string;
  href: string;
  restricted?: boolean;
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user, isLoading, signOut } = useAuth();

  const navItems: NavItem[] = [
    { title: "Home", href: "/" },
    { title: "Dashboard", href: "/dashboard", restricted: true },
    { title: "Categories", href: "/categories", restricted: true },
    { title: "Pricing", href: "/pricing" },
    { title: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    signOut();
  };

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const filteredNavItems = navItems.filter(item => 
    !item.restricted || (item.restricted && user)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-brand-purple">PosterHub</div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-purple",
                  location.pathname === item.href
                    ? "text-brand-purple"
                    : "text-foreground/60"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-100 animate-pulse rounded"></div>
          ) : user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
              </Button>
              <Button size="sm" className="bg-brand-purple hover:bg-brand-darkPurple" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t animate-fadeIn">
          <nav className="container flex flex-col py-4 gap-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors px-2 py-1 rounded-md",
                  location.pathname === item.href
                    ? "bg-brand-light text-brand-purple"
                    : "text-foreground/60 hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
