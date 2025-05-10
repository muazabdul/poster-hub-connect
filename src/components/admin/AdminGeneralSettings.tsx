
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentGatewaySettings from "@/components/admin/PaymentGatewaySettings";
import { PaymentGatewaySettings as PaymentSettings } from "@/utils/settingsUtils";

interface AdminGeneralSettingsProps {
  loading: boolean;
  settings: PaymentSettings;
  onSave: (settings: PaymentSettings) => Promise<void>;
}

const AdminGeneralSettings = ({ loading, settings, onSave }: AdminGeneralSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage payment gateway and other general settings</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">Loading settings...</div>
        ) : (
          <PaymentGatewaySettings 
            settings={settings || {
              provider: "razorpay",
              apiKey: "",
              apiSecret: "",
              testMode: true
            }} 
            onSave={onSave} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminGeneralSettings;
