
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

const CONNECTION_CHECK_TIMEOUT = 5000; // 5 seconds
let retryCount = 0;
const MAX_RETRIES = 3;
let lastConnectionStatus: ConnectionStatus = 'checking';
let connectionCheckTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isCheckingConnection = false;
let connectionMonitoringInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Check connection to Supabase and return status
 */
export const checkSupabaseConnection = async (): Promise<ConnectionStatus> => {
  if (isCheckingConnection) {
    return lastConnectionStatus;
  }

  try {
    isCheckingConnection = true;

    // Cancel any previous timeout
    if (connectionCheckTimeoutId) {
      clearTimeout(connectionCheckTimeoutId);
    }

    // Create a timeout promise
    const timeoutPromise = new Promise<ConnectionStatus>((_, reject) => {
      connectionCheckTimeoutId = setTimeout(() => {
        reject(new Error('Connection check timed out'));
      }, CONNECTION_CHECK_TIMEOUT);
    });

    // Create the check promise - just query any table with limit 1
    const checkPromise = supabase
      .from('categories')
      .select('id')
      .limit(1)
      .then(() => {
        // Connection successful
        if (lastConnectionStatus !== 'connected') {
          if (lastConnectionStatus === 'disconnected') {
            toast.success('Database connection restored');
          }
        }
        console.info('Connection check successful, resetting');
        retryCount = 0;
        return 'connected' as ConnectionStatus;
      })
      .catch((error) => {
        console.error('Connection check failed:', error);
        retryCount++;

        if (retryCount > MAX_RETRIES && lastConnectionStatus !== 'disconnected') {
          toast.error('Database connection issue detected');
        }

        return 'disconnected' as ConnectionStatus;
      });

    // Race between the timeout and the check
    // Using Promise.race correctly with proper error handling and type annotation
    try {
      const status = await Promise.race<ConnectionStatus>([checkPromise, timeoutPromise]);
      lastConnectionStatus = status;
      return status;
    } catch (error) {
      console.error('Connection check race failed:', error);
      lastConnectionStatus = 'disconnected';
      return 'disconnected';
    }
  } catch (error) {
    console.error('Error checking connection:', error);
    lastConnectionStatus = 'disconnected';
    return 'disconnected';
  } finally {
    isCheckingConnection = false;
    if (connectionCheckTimeoutId) {
      clearTimeout(connectionCheckTimeoutId);
      connectionCheckTimeoutId = null;
    }
  }
};

/**
 * Setup connection monitoring with periodic checks
 * @param checkIntervalMs Interval in milliseconds between connection checks
 * @returns Cleanup function to stop monitoring
 */
export const setupConnectionMonitoring = (checkIntervalMs = 30000): () => void => {
  // Clear any existing interval
  if (connectionMonitoringInterval) {
    clearInterval(connectionMonitoringInterval);
    connectionMonitoringInterval = null;
  }

  // Perform initial check
  void checkSupabaseConnection().catch(error => {
    console.error('Initial connection check failed:', error);
  });

  // Set up periodic checks
  connectionMonitoringInterval = setInterval(() => {
    void checkSupabaseConnection().catch(error => {
      console.error('Connection monitoring error:', error);
    });
  }, checkIntervalMs);

  // Return cleanup function
  return () => {
    if (connectionMonitoringInterval) {
      clearInterval(connectionMonitoringInterval);
      connectionMonitoringInterval = null;
    }
  };
};

/**
 * Reset connection status and retry count
 */
export const resetConnectionStatus = (): void => {
  lastConnectionStatus = 'checking';
  retryCount = 0;
};

/**
 * Get the current connection status without checking
 */
export const getConnectionStatus = (): ConnectionStatus => {
  return lastConnectionStatus;
};

/**
 * Check if currently connected
 */
export const isConnected = (): boolean => {
  return lastConnectionStatus === 'connected';
};
