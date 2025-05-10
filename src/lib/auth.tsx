
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI, AuthResponse } from '@/lib/api';

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

interface User {
  id: string;
  email: string;
  user_metadata: {
    role: string;
  };
}

interface Session {
  token: string;
  user: User;
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

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem("auth_token")) {
        setIsLoading(false);
        return;
      }
      
      const authResponse = await authAPI.getCurrentUser();
      
      if (authResponse.session && authResponse.profile) {
        setSession(authResponse.session);
        setUser(authResponse.session.user);
        setProfile(authResponse.profile);
        
        // Set admin status
        const isAdminRole = authResponse.profile.role === 'admin' || 
                          authResponse.session.user.user_metadata.role === 'admin';
        setIsAdmin(isAdminRole);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // Clear any stored session data
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const signOut = async () => {
    try {
      await authAPI.logout();
      
      // Clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success("Successfully logged out");
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still clear the session data even if API call fails
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
