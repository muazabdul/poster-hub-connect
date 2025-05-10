
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
      console.error("Supabase connection error:", error.message);
      return 'error';
    }
    
    return 'connected';
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return 'disconnected';
  }
}

// Setup connection monitoring with exponential backoff
export function setupConnectionMonitoring(initialInterval = 60000) {
  let intervalId: number | null = null;
  let currentInterval = initialInterval;
  let consecutiveErrors = 0;
  const maxInterval = 300000; // 5 minutes max
  
  // Clear any previous monitoring
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Initial check
  checkSupabaseConnection().then(status => {
    if (status !== 'connected') {
      console.log("Initial connection check failed, status:", status);
      toast.error("Having trouble connecting to server. Some features may not work properly.", {
        duration: 5000,
        id: "connection-error",
      });
      consecutiveErrors++;
    } else {
      console.log("Initial connection check successful");
      consecutiveErrors = 0;
    }
  });

  // Regular interval checks with exponential backoff
  const runConnectionCheck = async () => {
    const status = await checkSupabaseConnection();
    
    if (status === 'error' || status === 'disconnected') {
      console.log(`Connection check failed, status: ${status}, consecutive errors: ${consecutiveErrors + 1}`);
      toast.error("Having trouble connecting to server. Some features may not work properly.", {
        duration: 5000,
        id: "connection-error",
      });
      
      // Increase backoff with consecutive errors
      consecutiveErrors++;
      if (consecutiveErrors > 1) {
        // Exponential backoff with a maximum
        currentInterval = Math.min(initialInterval * Math.pow(1.5, consecutiveErrors - 1), maxInterval);
        console.log(`Adjusting check interval to ${currentInterval}ms`);
        
        // Reset the interval
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = window.setInterval(runConnectionCheck, currentInterval);
        }
      }
    } else if (status === 'connected') {
      // Reset on successful connection
      console.log("Connection check successful, resetting");
      consecutiveErrors = 0;
      
      // Reset interval to initial value if it was changed
      if (currentInterval !== initialInterval && intervalId) {
        currentInterval = initialInterval;
        clearInterval(intervalId);
        intervalId = window.setInterval(runConnectionCheck, currentInterval);
        console.log(`Resetting check interval to ${initialInterval}ms`);
      }
      
      // Clear any previous error toasts
      toast.dismiss("connection-error");
    }
  };

  intervalId = window.setInterval(runConnectionCheck, currentInterval);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}
