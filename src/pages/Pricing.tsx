import React from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { plansAPI } from "@/lib/api";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  features: string[] | null;
  active: boolean | null;
}

const Pricing = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await plansAPI.getPlans();
        
        if (response.status !== 'success') {
          throw new Error(response.message || "Failed to load plans");
        }

        // Parse features if needed
        const formattedPlans: Plan[] = (response.data || []).map(plan => ({
          ...plan,
          features: parseFeatures(plan.features)
        }));

        setPlans(formattedPlans);
      } catch (error: any) {
        console.error("Error fetching plans:", error);
        setError(error.message);
        toast.error("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);
  
  // Helper function to parse features from various formats
  const parseFeatures = (features: any): string[] => {
    if (!features) return [];
    
    if (Array.isArray(features)) {
      return features.map(item => String(item));
    }
    
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed.map(item => String(item)) : [];
      } catch {
        return [features];
      }
    }
    
    if (typeof features === 'object') {
      return Object.values(features).map(item => String(item));
    }
    
    return [String(features)];
  };
  
  const handleSubscribe = (planId: string) => {
    // In a real application, this would redirect to a checkout page
    toast.info("Subscription feature coming soon!");
    console.log(`Subscribing to plan: ${planId}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your CSC business needs.
            All plans include access to our core features.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-brand-purple border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pricing plans available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`flex flex-col ${
                  plan.name.toLowerCase().includes("premium") 
                    ? "border-brand-purple shadow-lg" 
                    : ""
                }`}
              >
                {plan.name.toLowerCase().includes("premium") && (
                  <div className="bg-brand-purple text-white py-1 px-3 text-xs font-medium tracking-wider text-center">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {(plan.features || []).map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckIcon className="h-4 w-4 mr-2 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      plan.name.toLowerCase().includes("premium") 
                        ? "bg-brand-purple hover:bg-brand-darkPurple" 
                        : ""
                    }`}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Subscribe Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How do I change my plan?</h3>
              <p className="text-muted-foreground">
                You can change your plan at any time from your account settings. The new plan will take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of the current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee for all plans. If you're not satisfied with our service, contact us within 7 days of your purchase for a full refund.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">How can I contact support?</h3>
              <p className="text-muted-foreground">
                Our support team is available 24/7. You can reach us through the contact page or by emailing support@cscportal.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
