
import { useState, useEffect } from "react";
import { checkSupabaseConnection, type ConnectionStatus as ConnectionStatusType } from "@/lib/supabase-monitor";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wifi, WifiOff } from "lucide-react";

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatusType>('checking');
  
  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await checkSupabaseConnection();
      setStatus(connectionStatus);
    };
    
    checkConnection();
    
    // Check connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={status === 'connected' ? 'outline' : 'destructive'}
            className="flex items-center gap-1 cursor-help"
          >
            {status === 'connected' ? (
              <>
                <Wifi className="h-3.5 w-3.5" />
                <span className="text-xs">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {status === 'checking' ? 'Checking connection...' : 'Connection issue'}
                </span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {status === 'connected' 
            ? 'Connected to database' 
            : status === 'checking' 
              ? 'Checking database connection...' 
              : 'Database connection issue - Some features may not work'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
