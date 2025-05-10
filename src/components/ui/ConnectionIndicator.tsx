
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { checkSupabaseConnection, type ConnectionStatus } from "@/lib/supabase-monitor";
import { Wifi, WifiOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ConnectionIndicator() {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  
  useEffect(() => {
    const checkConnection = async () => {
      setStatus('checking');
      const connectionStatus = await checkSupabaseConnection();
      setStatus(connectionStatus);
    };
    
    // Check connection immediately
    checkConnection();
    
    // Check connection every 15 seconds
    const interval = setInterval(checkConnection, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center">
            <Badge 
              variant={status === 'connected' ? 'outline' : 'destructive'}
              className="h-6 flex items-center gap-1 cursor-help transition-colors"
            >
              {status === 'connected' ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="text-xs">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="text-xs">
                    {status === 'checking' ? 'Checking...' : 'Connection issue'}
                  </span>
                </>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {status === 'connected' 
            ? 'Database connection is active' 
            : status === 'checking' 
              ? 'Checking database connection...' 
              : 'Database connection issue - Some features may not work'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
