
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Status types
export type ConnectionStatus = 'connected' | 'disconnected' | 'checking' | 'error';

// Function to check Supabase connection status
export async function checkSupabaseConnection(): Promise<ConnectionStatus> {
  try {
    // A simple query to check if we can connect to Supabase
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error("Supabase connection error:", error);
      return 'error';
    }
    
    return 'connected';
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return 'disconnected';
  }
}

// Setup connection monitoring
export function setupConnectionMonitoring(interval = 60000) {
  // Initial check
  checkSupabaseConnection().then(status => {
    if (status !== 'connected') {
      toast.error("Having trouble connecting to server. Some features may not work properly.", {
        duration: 5000,
        id: "connection-error",
      });
    }
  });

  // Regular interval checks
  const intervalId = setInterval(async () => {
    const status = await checkSupabaseConnection();
    
    if (status === 'error' || status === 'disconnected') {
      toast.error("Having trouble connecting to server. Some features may not work properly.", {
        duration: 5000,
        id: "connection-error",
      });
    } else if (status === 'connected') {
      // Clear any previous error toasts
      toast.dismiss("connection-error");
    }
  }, interval);

  return () => clearInterval(intervalId);
}
