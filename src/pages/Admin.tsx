
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Settings, LayoutDashboard, Image, FolderIcon, User, CreditCard, Settings as SettingsIcon } from "lucide-react";
import { getSettings, updateSettings, Settings as SettingsType, PaymentGatewaySettings as PaymentSettings, AppearanceSettings as AppearanceSettingsType } from "@/utils/settingsUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Import components
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminPosters from "@/components/admin/AdminPosters";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminPlans from "@/components/admin/AdminPlans";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminGeneralSettings from "@/components/admin/AdminGeneralSettings";
import AdminAppearanceSettings from "@/components/admin/AdminAppearanceSettings";
import ConnectionStatus from "@/components/admin/ConnectionStatus";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [settings, setSettings] = useState<SettingsType>({
    updated_at: new Date().toISOString(), // Adding the required property
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const fetchedSettings = await getSettings();
        console.log("Fetched settings in Admin:", fetchedSettings);
        if (fetchedSettings) {
          setSettings(fetchedSettings);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdatePaymentSettings = async (paymentSettings: PaymentSettings) => {
    try {
      const updatedSettings = {
        ...settings,
        payment: paymentSettings
      };
      
      const success = await updateSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        // Force refresh settings context after update
        window.dispatchEvent(new CustomEvent('settings-updated'));
      }
    } catch (error) {
      console.error("Error updating payment settings:", error);
      toast.error("Failed to save payment settings");
    }
  };

  const handleUpdateAppearanceSettings = async (appearanceSettings: AppearanceSettingsType) => {
    try {
      console.log("Updating appearance settings:", appearanceSettings);
      const updatedSettings = {
        ...settings,
        appearance: appearanceSettings
      };
      
      const success = await updateSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        // Force refresh settings context after update
        window.dispatchEvent(new CustomEvent('settings-updated'));
      }
    } catch (error) {
      console.error("Error updating appearance settings:", error);
      toast.error("Failed to save appearance settings");
    }
  };

  // Ensure appearance settings is never undefined
  const currentAppearanceSettings = settings.appearance || {
    logo: null,
    navigationLinks: [
      { name: "Home", url: "/" },
      { name: "Dashboard", url: "/dashboard" }
    ],
    copyrightText: "© 2023 CSC Portal. All rights reserved.",
    socialLinks: []
  };

  return (
    <Layout className="p-0" fullWidth>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-border/40">
            <SidebarHeader>
              <div className="px-2 py-4">
                <h2 className="text-lg font-bold flex items-center">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-brand-purple" />
                  Admin Panel
                </h2>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "dashboard"} 
                        onClick={() => setActiveTab("dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "posters"} 
                        onClick={() => setActiveTab("posters")}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        <span>Posters</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "categories"} 
                        onClick={() => setActiveTab("categories")}
                      >
                        <FolderIcon className="mr-2 h-4 w-4" />
                        <span>Categories</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "plans"} 
                        onClick={() => setActiveTab("plans")}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Plans</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "users"} 
                        onClick={() => setActiveTab("users")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Users</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "general"} 
                        onClick={() => setActiveTab("general")}
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>General</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "appearance"} 
                        onClick={() => setActiveTab("appearance")}
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Appearance</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="px-4 py-4 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Admin Panel v1.0</span>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                <p className="text-muted-foreground">Manage your {activeTab} efficiently</p>
              </div>
              <ConnectionStatus />
            </div>
            
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "posters" && <AdminPosters />}
            {activeTab === "categories" && <AdminCategories />}
            {activeTab === "plans" && <AdminPlans />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "general" && (
              <AdminGeneralSettings 
                loading={loading} 
                settings={settings.payment as PaymentSettings} 
                onSave={handleUpdatePaymentSettings} 
              />
            )}
            {activeTab === "appearance" && (
              <AdminAppearanceSettings 
                loading={loading} 
                settings={currentAppearanceSettings} 
                onSave={handleUpdateAppearanceSettings} 
              />
            )}
          </div>
        </div>
      </SidebarProvider>
    </Layout>
  );
};

export default Admin;
