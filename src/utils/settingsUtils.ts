
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export async function getSettings(): Promise<Settings> {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
      return defaultSettings;
    }

    return data || defaultSettings;
  } catch (error) {
    console.error("Error in getSettings:", error);
    return defaultSettings;
  }
}

export async function updateSettings(settings: Settings): Promise<boolean> {
  try {
    const updatedSettings = {
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from("settings")
      .upsert(updatedSettings, {
        onConflict: "id"
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
