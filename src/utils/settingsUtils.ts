
import { toast } from "sonner";
import { settingsAPI } from "@/lib/api";

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
    
    const response = await settingsAPI.getSettings();
    
    if (response.status === 'success' && response.data) {
      const settings = parseSettingsData(response.data);
      console.log("Settings fetched:", settings);
      return settings;
    }
      
    return defaultSettings;
    
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
    
    const response = await settingsAPI.updateSettings(updatedSettings);
    
    if (response.status === 'success') {
      toast.success("Settings saved successfully");
      return true;
    } else {
      throw new Error(response.message || "Failed to save settings");
    }
  } catch (error) {
    console.error("Error in updateSettings:", error);
    toast.error("Failed to save settings");
    return false;
  }
}
