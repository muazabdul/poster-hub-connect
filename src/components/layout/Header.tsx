
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Poster Portal
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  to="/categories"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Categories
                </Link>
              </>
            )}
            <Link
              to="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Desktop buttons */}
          {!isMobile && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </>
          )}
          
          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    className="text-base font-medium py-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                  {user && (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-base font-medium py-2 text-muted-foreground transition-colors hover:text-primary"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/categories"
                        className="text-base font-medium py-2 text-muted-foreground transition-colors hover:text-primary"
                      >
                        Categories
                      </Link>
                    </>
                  )}
                  <Link
                    to="/pricing"
                    className="text-base font-medium py-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/contact"
                    className="text-base font-medium py-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                  
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <div className="flex flex-col gap-3">
                        {isAdmin && (
                          <Link to="/admin">
                            <Button variant="outline" className="w-full">
                              Admin
                            </Button>
                          </Link>
                        )}
                        <Link to="/profile">
                          <Button variant="outline" className="w-full">
                            Profile
                          </Button>
                        </Link>
                        <Button variant="outline" onClick={() => signOut()} className="w-full">
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup">
                          <Button className="w-full">Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
