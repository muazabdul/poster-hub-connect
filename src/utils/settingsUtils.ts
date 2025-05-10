
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface PaymentGatewaySettings {
  provider: "razorpay" | "stripe" | "paypal";
  apiKey: string;
  apiSecret: string;
  testMode: boolean;
}

export interface AppearanceSettings {
  logo: string | null;
  navigationLinks: { name: string; url: string }[];
  copyrightText: string;
  socialLinks: { platform: string; url: string }[];
}

export interface Settings {
  id?: string;
  payment?: PaymentGatewaySettings;
  appearance?: AppearanceSettings;
  updated_at?: string;
}

const defaultSettings: Settings = {
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
};

// Type guard functions to ensure safe type conversion
function isPaymentGatewaySettings(value: unknown): value is PaymentGatewaySettings {
  if (!value || typeof value !== 'object') return false;
  
  const payment = value as Partial<PaymentGatewaySettings>;
  return (
    typeof payment.provider === 'string' &&
    typeof payment.apiKey === 'string' &&
    typeof payment.apiSecret === 'string' &&
    typeof payment.testMode === 'boolean'
  );
}

function isAppearanceSettings(value: unknown): value is AppearanceSettings {
  if (!value || typeof value !== 'object') return false;
  
  const appearance = value as Partial<AppearanceSettings>;
  return (
    (appearance.logo === null || typeof appearance.logo === 'string') &&
    Array.isArray(appearance.navigationLinks) &&
    typeof appearance.copyrightText === 'string' &&
    Array.isArray(appearance.socialLinks)
  );
}

export async function getSettings(): Promise<Settings> {
  try {
    console.log("Fetching settings...");
    
    // First, try using direct query instead of the RPC function
    const { data: queryData, error: queryError } = await supabase
      .from('settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
      
    if (queryError) {
      console.error("Error fetching settings with direct query:", queryError);
      return defaultSettings;
    }
      
    const settings = parseSettingsData(queryData);
    console.log("Settings fetched via direct query:", settings);
    return settings;
    
  } catch (error) {
    console.error("Error in getSettings:", error);
    return defaultSettings;
  }
}

// Helper function to parse settings data consistently
function parseSettingsData(data: any): Settings {
  const settings: Settings = {
    id: data.id,
    updated_at: data.updated_at
  };

  // Safely convert payment JSON to our type with fallback
  if (data.payment && isPaymentGatewaySettings(data.payment)) {
    settings.payment = data.payment as PaymentGatewaySettings;
  } else {
    settings.payment = defaultSettings.payment;
    console.warn("Invalid payment settings format, using defaults");
  }

  // Safely convert appearance JSON to our type with fallback
  if (data.appearance && isAppearanceSettings(data.appearance)) {
    settings.appearance = data.appearance as AppearanceSettings;
  } else {
    settings.appearance = defaultSettings.appearance;
    console.warn("Invalid appearance settings format, using defaults");
  }

  return settings;
}

export async function updateSettings(settings: Settings): Promise<boolean> {
  try {
    const updatedSettings = {
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    // Convert our strongly typed Settings to the database JSON format
    // Use type assertion to any to avoid TypeScript errors when converting to JSON
    const dbSettings = {
      id: updatedSettings.id,
      payment: updatedSettings.payment as unknown as Json,
      appearance: updatedSettings.appearance as unknown as Json,
      updated_at: updatedSettings.updated_at
    };
    
    // Using direct insert/update instead of RPC
    const { error } = await supabase
      .from('settings')
      .upsert(dbSettings, {
        onConflict: 'id'
      });

    if (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
      return false;
    }

    toast.success("Settings saved successfully");
    return true;
  } catch (error) {
    console.error("Error in updateSettings:", error);
    toast.error("Failed to save settings");
    return false;
  }
}
