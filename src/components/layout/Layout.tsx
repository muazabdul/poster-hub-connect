
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Layout = ({ 
  children, 
  hideFooter = false, 
  className,
  fullWidth = false
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      <main className={cn(
        "flex-1", 
        fullWidth ? "w-full" : "container py-4",
        className
      )}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
