
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentGatewaySettings as PaymentSettings } from "@/utils/settingsUtils";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface PaymentGatewaySettingsProps {
  settings: PaymentSettings;
  onSave: (settings: PaymentSettings) => Promise<void>;
}

const PaymentGatewaySettings = ({ settings, onSave }: PaymentGatewaySettingsProps) => {
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (checked: boolean) => {
    setPaymentSettings((prev) => ({
      ...prev,
      testMode: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(paymentSettings);
      toast.success("Payment settings saved successfully");
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast.error("Failed to save payment settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-2">Payment Gateway Integration</h3>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md border">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Gateway
              </label>
              <select 
                name="provider" 
                value={paymentSettings.provider}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="razorpay">Razorpay</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <Input 
                type="text" 
                name="apiKey"
                value={paymentSettings.apiKey} 
                onChange={handleChange}
                placeholder="Enter API Key" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Secret
              </label>
              <Input 
                type="password" 
                name="apiSecret"
                value={paymentSettings.apiSecret}
                onChange={handleChange}
                placeholder="Enter API Secret" 
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="test-mode" 
              checked={paymentSettings.testMode}
              onCheckedChange={handleToggleChange}
            />
            <label 
              htmlFor="test-mode" 
              className="text-sm font-medium text-gray-700"
            >
              Enable Test Mode
            </label>
          </div>
          <Button 
            className="bg-brand-purple hover:bg-brand-darkPurple w-auto"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Payment Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentGatewaySettings;
