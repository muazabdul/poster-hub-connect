
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

interface Profile {
  id: string;
  name: string | null;
  csc_id: string | null;
  csc_name: string | null;
  address: string | null;
  phone: string | null;
  role: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      // First, check if the user has admin role directly from user metadata
      // This is a backup method if RLS causes issues with profile fetch
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role === 'admin') {
        console.log("Admin role found in user metadata");
        setIsAdmin(true);
        // Still try to fetch full profile, but we already know it's an admin
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      console.log("Fetched profile data:", data);
      setProfile(data);
      setIsAdmin(data?.role === 'admin' || user?.user_metadata?.role === 'admin');
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change:", event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Fetch the user profile in a separate call
        if (newSession?.user) {
          // Check for admin in user metadata first (more reliable)
          const isAdminFromMetadata = newSession.user.user_metadata?.role === 'admin';
          if (isAdminFromMetadata) {
            console.log("Setting admin role from metadata");
            setIsAdmin(true);
          }
          
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Current session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Check for admin in user metadata first
        const isAdminFromMetadata = currentSession.user.user_metadata?.role === 'admin';
        if (isAdminFromMetadata) {
          console.log("Setting admin role from metadata");
          setIsAdmin(true);
        }
        
        fetchUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during logout:", error);
        throw error;
      }
      
      // Clear local state immediately after successful logout
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success("Successfully logged out");
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if there's an error, clear the local state for safety
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.error("Error during logout, but you've been logged out of this browser");
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we are done loading AND the user is logged in but NOT an admin
    if (!isLoading && user && !isAdmin) {
      toast.error("You need admin privileges to access this page");
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};
