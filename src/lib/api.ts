
import { toast } from "sonner";

// API base URL - will use direct database connection instead
const API_BASE_URL = "";

export interface AuthResponse {
  status: string;
  session?: {
    token: string;
    user: {
      id: string;
      email: string;
      user_metadata: {
        role: string;
      }
    }
  };
  profile?: {
    id: string;
    name: string | null;
    csc_id: string | null;
    csc_name: string | null;
    address: string | null;
    phone: string | null;
    role: string | null;
  };
  message?: string;
  error?: string;
}

export interface Poster {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  downloads?: number;
}

export interface PostersResponse {
  status: string;
  data: Poster[];
  message?: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon?: string | null;
  created_at: string;
  updated_at: string;
  poster_count?: number;
}

export interface CategoriesResponse {
  status: string;
  data: Category[];
  message?: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsResponse {
  status: string;
  data: Record<string, any>;
  message?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  features: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlansResponse {
  status: string;
  data: Plan[];
  message?: string;
}

// Mock data for direct use without API
const mockData = {
  // We'll populate this with mock data for direct usage
};

// Helper for making API requests (now returns mock data directly)
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // For now, return mock data based on the endpoint
    // This will be replaced with direct database access in a future update
    console.log(`Mock data requested for endpoint: ${endpoint}`);
    
    // In a real implementation, this would use database connection directly
    // Return empty successful response for now
    return {
      status: "success",
      data: []
    } as unknown as T;
    
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`API error (${endpoint}):`, err);
    throw err;
  }
}

// Authentication APIs
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // This would use direct database query in final implementation
      console.log(`Login attempt with email: ${email}`);
      
      // Mock successful login with admin privileges
      const mockResponse: AuthResponse = {
        status: "success",
        session: {
          token: "mock-token-12345",
          user: {
            id: "user-123",
            email: email,
            user_metadata: {
              role: "admin" // Changed from "user" to "admin"
            }
          }
        },
        profile: {
          id: "profile-123",
          name: "Mock User",
          csc_id: "CSC001",
          csc_name: "Demo CSC",
          address: null,
          phone: null,
          role: "admin" // Changed from "user" to "admin"
        }
      };
      
      // Store token in localStorage (for compatibility with existing code)
      localStorage.setItem("auth_token", mockResponse.session.token);
      
      return mockResponse;
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Login failed");
      throw err;
    }
  },
  
  signup: async (userData: { email: string; password: string; name: string; csc_id?: string; csc_name?: string; }): Promise<AuthResponse> => {
    try {
      // This would use direct database query in final implementation
      console.log(`Signup attempt with email: ${userData.email}`);
      
      // Mock successful signup with admin privileges
      const mockResponse: AuthResponse = {
        status: "success",
        session: {
          token: "mock-token-signup-12345",
          user: {
            id: "new-user-123",
            email: userData.email,
            user_metadata: {
              role: "admin" // Changed from "user" to "admin"
            }
          }
        },
        profile: {
          id: "new-profile-123",
          name: userData.name,
          csc_id: userData.csc_id || null,
          csc_name: userData.csc_name || null,
          address: null,
          phone: null,
          role: "admin" // Changed from "user" to "admin"
        }
      };
      
      // Store token in localStorage (for compatibility with existing code)
      localStorage.setItem("auth_token", mockResponse.session.token);
      
      return mockResponse;
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Signup failed");
      throw err;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      console.log("Logout attempt");
      
      // Clear token from localStorage
      localStorage.removeItem("auth_token");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Logout error:", err);
      // Still remove the token even if the API call fails
      localStorage.removeItem("auth_token");
      throw err;
    }
  },
  
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // This would verify the token against the database in the final implementation
      console.log("Getting current user with token");
      
      // Mock response for authenticated user with admin privileges
      return {
        status: "success",
        session: {
          token: token,
          user: {
            id: "user-123",
            email: "user@example.com",
            user_metadata: {
              role: "admin" // Changed from "user" to "admin"
            }
          }
        },
        profile: {
          id: "profile-123",
          name: "Mock User",
          csc_id: "CSC001",
          csc_name: "Demo CSC",
          address: null,
          phone: null,
          role: "admin" // Changed from "user" to "admin"
        }
      };
    } catch (error: unknown) {
      const err = error as Error;
      // If token is invalid, clear it
      localStorage.removeItem("auth_token");
      throw err;
    }
  }
};

// Posters API
export const postersAPI = {
  getPosters: async (params: { category?: string, search?: string } = {}): Promise<PostersResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.category) {
      queryParams.append("category", params.category);
    }
    
    if (params.search) {
      queryParams.append("search", params.search);
    }
    
    console.log(`Getting posters with params: ${JSON.stringify(params)}`);
    
    // Mock posters data
    return {
      status: "success",
      data: [
        {
          id: "poster-1",
          title: "Sample Poster 1",
          description: "This is a sample poster",
          image_url: "/placeholder.svg",
          category_id: "category-1",
          user_id: "user-1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_name: "Marketing"
        }
      ],
      count: 1
    };
  }
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<CategoriesResponse> => {
    console.log("Getting categories");
    
    // Mock categories data
    return {
      status: "success",
      data: [
        {
          id: "category-1",
          name: "Marketing",
          description: "Marketing materials",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          poster_count: 5
        },
        {
          id: "category-2",
          name: "Educational",
          description: "Educational materials",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          poster_count: 3
        }
      ]
    };
  }
};

// Settings API
export const settingsAPI = {
  getSettings: async (): Promise<SettingsResponse> => {
    console.log("Getting settings");
    
    // Mock settings data
    return {
      status: "success",
      data: {
        payment: {
          provider: "razorpay",
          apiKey: "",
          apiSecret: "",
          testMode: true
        },
        appearance: {
          logo: null,
          navigationLinks: [
            { name: "Home", url: "/" },
            { name: "Dashboard", url: "/dashboard" }
          ],
          copyrightText: "© 2023 CSC Portal. All rights reserved.",
          socialLinks: []
        }
      }
    };
  },
  
  updateSettings: async (settingsData: Record<string, any>): Promise<SettingsResponse> => {
    console.log("Updating settings:", settingsData);
    
    // In a real implementation, this would update the database
    return {
      status: "success",
      data: settingsData,
      message: "Settings updated successfully"
    };
  }
};

// Plans API
export const plansAPI = {
  getPlans: async (): Promise<PlansResponse> => {
    console.log("Getting plans");
    
    // Mock plans data
    return {
      status: "success",
      data: [
        {
          id: "plan-1",
          name: "Basic",
          description: "Basic plan for individuals",
          price: 9.99,
          interval: "month",
          features: JSON.stringify(["5 posters per month", "Basic support"]),
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "plan-2",
          name: "Premium",
          description: "Premium plan for businesses",
          price: 29.99,
          interval: "month",
          features: JSON.stringify(["Unlimited posters", "Priority support", "Analytics"]),
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };
  }
};

// Upload API
export interface UploadResult {
  status: string;
  publicUrl: string;
  filename: string;
  bucket: string;
  folder: string;
}

export const uploadAPI = {
  uploadImage: async (file: File, bucket = "uploads", folder = "images"): Promise<UploadResult> => {
    try {
      console.log(`Mock uploading file: ${file.name} to ${bucket}/${folder}`);
      
      // Mock successful upload
      return {
        status: "success",
        publicUrl: URL.createObjectURL(file), // Create a temporary URL for preview
        filename: file.name,
        bucket: bucket,
        folder: folder
      };
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Image upload failed");
      throw err;
    }
  }
};
