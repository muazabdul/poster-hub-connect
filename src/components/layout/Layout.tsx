
import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  // Check connection to Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple health check
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
          console.error("Error connecting to Supabase:", error);
          toast.error("Having trouble connecting to the server. Some features may not work properly.");
        }
      } catch (err) {
        console.error("Connection error:", err);
      }
    };

    // Check online status
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (!online) {
        toast.error("You appear to be offline. Changes may not be saved.");
      } else {
        toast.success("Back online. Your changes can now be saved.");
        checkConnection();
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Initial check
    checkConnection();

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
        className
      )}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
