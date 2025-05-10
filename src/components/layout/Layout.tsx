
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
        "flex-1 py-4", 
        fullWidth ? "" : "container",
        className
      )}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
