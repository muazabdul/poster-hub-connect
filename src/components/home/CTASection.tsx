
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 hero-gradient text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Transform Your CSC Marketing?</h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
          Join thousands of CSC owners who are using professional marketing materials to grow their business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-100" asChild>
            <Link to="/signup">Sign Up Now</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
