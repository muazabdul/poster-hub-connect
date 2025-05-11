
import { settingsAPI, SettingsResponse } from "@/lib/api";

export interface NavigationLink {
  name: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface AppearanceSettings {
  logo: string | null;
  navigationLinks: NavigationLink[];
  copyrightText: string;
  socialLinks: SocialLink[];
}

export interface PaymentGatewaySettings {
  provider: string;
  apiKey: string;
  apiSecret: string;
  testMode: boolean;
}

export interface Settings {
  updated_at: string;
  id?: string;
  payment?: PaymentGatewaySettings;
  appearance?: AppearanceSettings;
}

// Get all settings
export async function getSettings(): Promise<Settings | null> {
  try {
    const response = await settingsAPI.getSettings();
    
    if (response.status === "success" && response.data) {
      return {
        id: response.data.id,
        payment: response.data.payment as PaymentGatewaySettings,
        appearance: response.data.appearance as AppearanceSettings,
        updated_at: response.data.updated_at || new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

// Get appearance settings
export async function getAppearanceSettings(): Promise<AppearanceSettings | null> {
  try {
    const settings = await getSettings();
    return settings?.appearance || null;
  } catch (error) {
    console.error("Failed to fetch appearance settings:", error);
    return null;
  }
}

// Get payment settings
export async function getPaymentSettings(): Promise<PaymentGatewaySettings | null> {
  try {
    const settings = await getSettings();
    return settings?.payment || null;
  } catch (error) {
    console.error("Failed to fetch payment settings:", error);
    return null;
  }
}

// Update settings
export async function updateSettings(settings: Settings): Promise<boolean> {
  try {
    const response = await settingsAPI.updateSettings(settings as unknown as Record<string, any>);
    
    if (response.status === "success") {
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('settings-updated'));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Failed to update settings:", error);
    return false;
  }
}

// Default settings if none exist
export function getDefaultSettings(): Settings {
  return {
    updated_at: new Date().toISOString(),
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
}
