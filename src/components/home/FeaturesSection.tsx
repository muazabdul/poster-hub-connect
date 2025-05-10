
import { cn } from "@/lib/utils";
import { Download, Share, FolderIcon, User } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="h-12 w-12 bg-brand-light rounded-lg flex items-center justify-center mb-4 text-brand-purple">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Download size={24} />,
      title: "Ready-to-Use Posters",
      description: "Download professional marketing materials with just one click, customized with your CSC details.",
    },
    {
      icon: <Share size={24} />,
      title: "Easy Sharing",
      description: "Share posters directly to WhatsApp and other social media platforms to reach your community.",
    },
    {
      icon: <FolderIcon size={24} />,
      title: "Organized by Categories",
      description: "Find exactly what you need with our well-organized categories and easy search functionality.",
    },
    {
      icon: <User size={24} />,
      title: "Personalized Branding",
      description: "Every download includes your CSC centre details in the footer for instant brand recognition.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need For CSC Marketing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools and materials CSC owners need to promote services effectively in their local communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideUp">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
