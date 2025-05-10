
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppearanceSettings from "@/components/admin/AppearanceSettings";
import { AppearanceSettings as AppearanceSettingsType } from "@/utils/settingsUtils";

interface AdminAppearanceSettingsProps {
  loading: boolean;
  settings: AppearanceSettingsType;
  onSave: (settings: AppearanceSettingsType) => Promise<void>;
}

const AdminAppearanceSettings = ({ loading, settings, onSave }: AdminAppearanceSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Manage website appearance and pages</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">Loading settings...</div>
        ) : (
          <AppearanceSettings 
            settings={settings || {
              logo: null,
              navigationLinks: [],
              copyrightText: "",
              socialLinks: []
            }} 
            onSave={onSave} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAppearanceSettings;
