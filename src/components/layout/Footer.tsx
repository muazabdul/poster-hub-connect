
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const { appearanceSettings } = useSettings();

  const copyrightText = appearanceSettings?.copyrightText || 
    `© ${new Date().getFullYear()} PosterHub. All rights reserved.`;
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      default:
        return <Facebook className="h-5 w-5" />;
    }
  };

  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-purple">PosterHub</h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Empowering CSC owners with professional marketing materials and customized promotional content.
            </p>
            
            {/* Social Links */}
            {appearanceSettings?.socialLinks && appearanceSettings.socialLinks.length > 0 && (
              <div className="mt-4 flex space-x-4">
                {appearanceSettings.socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-brand-purple transition-colors"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <div className="sm:mt-0">
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {appearanceSettings?.navigationLinks?.filter(link => 
                link.name !== "Dashboard" && link.name !== "Profile"
              ).map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="text-sm text-gray-600 hover:text-brand-purple">
                    {link.name}
                  </Link>
                </li>
              )) || (
                <>
                  <li>
                    <Link to="/" className="text-sm text-gray-600 hover:text-brand-purple">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories" className="text-sm text-gray-600 hover:text-brand-purple">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-sm text-gray-600 hover:text-brand-purple">
                      Pricing
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="sm:mt-0">
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-brand-purple">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-brand-purple">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-brand-purple">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="sm:mt-0">
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-brand-purple">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-brand-purple">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            {copyrightText}
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-xs text-gray-500">
              Made for CSC Owners
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
