
import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isMobile = useIsMobile();

  // Check online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (!online) {
        toast.error("You appear to be offline. Changes may not be saved.");
      } else {
        toast.success("Back online. Your changes can now be saved.");
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      {!isOnline && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm text-center">
          You are currently offline. Changes may not be saved until you reconnect.
        </div>
      )}
      <main className={cn(
        "flex-1", 
        fullWidth ? "w-full" : "container py-4",
        isMobile ? "px-4" : "",
        className
      )}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
