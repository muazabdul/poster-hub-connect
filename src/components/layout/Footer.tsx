
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-purple">PosterHub</h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Empowering CSC owners with professional marketing materials and customized promotional content.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-brand-purple">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-brand-purple">
                  Dashboard
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
            </ul>
          </div>
          
          <div>
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
          
          <div>
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
            &copy; {new Date().getFullYear()} PosterHub. All rights reserved.
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
