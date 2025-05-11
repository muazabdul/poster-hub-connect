
import { toast } from "sonner";

// Update this to point to where your PHP server is running
const API_BASE_URL = "http://localhost:8000/api";

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
  posters: Poster[];
  message?: string;
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
  categories: Category[];
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
  settings: Record<string, string>;
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
  plans: Plan[];
  message?: string;
}

// Helper for making API requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");
    
    // Set default headers
    const headers = {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    };
    
    // Add auth token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Parse the JSON response
    const data = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }
    
    return data as T;
  } catch (error: any) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const data = await apiRequest<AuthResponse>("/auth/login.php", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      // Store token in localStorage
      if (data.session?.token) {
        localStorage.setItem("auth_token", data.session.token);
      }
      
      return data;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  },
  
  signup: async (userData: { email: string; password: string; name: string; csc_id?: string; csc_name?: string; }): Promise<AuthResponse> => {
    try {
      const data = await apiRequest<AuthResponse>("/auth/register.php", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      
      // Store token in localStorage
      if (data.session?.token) {
        localStorage.setItem("auth_token", data.session.token);
      }
      
      return data;
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await apiRequest<{ message: string }>("/auth/logout.php", {
        method: "POST",
      });
      
      // Clear token from localStorage
      localStorage.removeItem("auth_token");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still remove the token even if the API call fails
      localStorage.removeItem("auth_token");
      throw error;
    }
  },
  
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      return await apiRequest<AuthResponse>("/auth/user.php");
    } catch (error: any) {
      // If token is invalid, clear it
      localStorage.removeItem("auth_token");
      throw error;
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
    
    const queryString = queryParams.toString();
    const endpoint = `/posters/list.php${queryString ? `?${queryString}` : ""}`;
    
    return apiRequest<PostersResponse>(endpoint);
  }
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<CategoriesResponse> => {
    return apiRequest<CategoriesResponse>("/categories/list.php");
  }
};

// Settings API
export const settingsAPI = {
  getSettings: async (): Promise<SettingsResponse> => {
    return apiRequest<SettingsResponse>("/settings/get.php");
  },
  
  updateSettings: async (settingsData: Record<string, string>): Promise<SettingsResponse> => {
    return apiRequest<SettingsResponse>("/settings/update.php", {
      method: "POST",
      body: JSON.stringify(settingsData),
    });
  }
};

// Plans API
export const plansAPI = {
  getPlans: async (): Promise<PlansResponse> => {
    return apiRequest<PlansResponse>("/plans/list.php");
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
      const formData = new FormData();
      formData.append("image", file);
      formData.append("bucket", bucket);
      formData.append("folder", folder);
      
      const response = await fetch(`${API_BASE_URL}/upload/image.php`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
      
      return await response.json();
    } catch (error: any) {
      toast.error(error.message || "Image upload failed");
      throw error;
    }
  }
};
