
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppearanceSettings as AppearanceSettingsType } from "@/utils/settingsUtils";
import { Trash2, Plus } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { uploadImage } from "@/utils/imageUpload";
import { toast } from "sonner";

interface AppearanceSettingsProps {
  settings: AppearanceSettingsType;
  onSave: (settings: AppearanceSettingsType) => Promise<void>;
}

const AppearanceSettings = ({ settings, onSave }: AppearanceSettingsProps) => {
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettingsType>(settings);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyrightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      copyrightText: e.target.value,
    }));
  };

  const handleNavLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...appearanceSettings.navigationLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setAppearanceSettings((prev) => ({
      ...prev,
      navigationLinks: updatedLinks,
    }));
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...appearanceSettings.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setAppearanceSettings((prev) => ({
      ...prev,
      socialLinks: updatedLinks,
    }));
  };

  const addNavLink = () => {
    setAppearanceSettings((prev) => ({
      ...prev,
      navigationLinks: [...prev.navigationLinks, { name: "", url: "" }],
    }));
  };

  const addSocialLink = () => {
    setAppearanceSettings((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "Facebook", url: "" }],
    }));
  };

  const removeNavLink = (index: number) => {
    const updatedLinks = [...appearanceSettings.navigationLinks];
    updatedLinks.splice(index, 1);
    setAppearanceSettings((prev) => ({
      ...prev,
      navigationLinks: updatedLinks,
    }));
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...appearanceSettings.socialLinks];
    updatedLinks.splice(index, 1);
    setAppearanceSettings((prev) => ({
      ...prev,
      socialLinks: updatedLinks,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setLogoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let logoUrl = appearanceSettings.logo;
      
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'site-assets', 'logos');
      }
      
      const updatedSettings = {
        ...appearanceSettings,
        logo: logoUrl
      };
      
      await onSave(updatedSettings);
      toast.success("Appearance settings saved successfully");
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast.error("Failed to save appearance settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Header & Footer</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md border">
              <h4 className="font-medium mb-3">Header Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <ImageUploader 
                    imagePreview={appearanceSettings.logo}
                    onImageChange={handleImageChange}
                    onImageRemove={() => {
                      setLogoFile(null);
                      setAppearanceSettings(prev => ({...prev, logo: null}));
                    }}
                    label="Logo"
                    aspectRatio="video"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Navigation Links
                  </label>
                  <div className="space-y-2">
                    {appearanceSettings.navigationLinks.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <Input 
                          value={link.name} 
                          onChange={(e) => handleNavLinkChange(index, 'name', e.target.value)}
                          className="flex-grow mr-2" 
                          placeholder="Link name"
                        />
                        <Input 
                          value={link.url} 
                          onChange={(e) => handleNavLinkChange(index, 'url', e.target.value)}
                          className="flex-grow mr-2" 
                          placeholder="URL"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => removeNavLink(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={addNavLink}
                      type="button"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border">
              <h4 className="font-medium mb-3">Footer Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Copyright Text
                  </label>
                  <Input 
                    value={appearanceSettings.copyrightText} 
                    onChange={handleCopyrightChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Media Links
                  </label>
                  <div className="space-y-2">
                    {appearanceSettings.socialLinks.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <select 
                          className="w-24 rounded-md border border-gray-300 p-1 mr-2"
                          value={link.platform}
                          onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                        >
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Instagram">Instagram</option>
                          <option value="LinkedIn">LinkedIn</option>
                        </select>
                        <Input 
                          value={link.url} 
                          onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                          className="flex-grow mr-2" 
                          placeholder="URL"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => removeSocialLink(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={addSocialLink}
                      type="button"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Social Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button 
            className="mt-4 bg-brand-purple hover:bg-brand-darkPurple"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Appearance Settings"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AppearanceSettings;
