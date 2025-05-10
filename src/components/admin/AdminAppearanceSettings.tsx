
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppearanceSettings from "@/components/admin/AppearanceSettings";
import { AppearanceSettings as AppearanceSettingsType } from "@/utils/settingsUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminAppearanceSettingsProps {
  loading: boolean;
  settings: AppearanceSettingsType;
  onSave: (settings: AppearanceSettingsType) => Promise<void>;
}

const AdminAppearanceSettings = ({ loading, settings, onSave }: AdminAppearanceSettingsProps) => {
  // Create default settings if none provided
  const defaultSettings: AppearanceSettingsType = {
    logo: null,
    navigationLinks: [
      { name: "Home", url: "/" },
      { name: "Dashboard", url: "/dashboard" }
    ],
    copyrightText: "© 2023 CSC Portal. All rights reserved.",
    socialLinks: []
  };
  
  const appearanceSettings = settings || defaultSettings;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Manage website appearance and pages</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <AppearanceSettings 
            settings={appearanceSettings} 
            onSave={onSave} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAppearanceSettings;
