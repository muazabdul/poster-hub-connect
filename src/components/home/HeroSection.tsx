
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <section className="hero-gradient py-12 sm:py-16 md:py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 sm:space-y-6 animate-fadeIn text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Boost Your CSC Business with Professional Marketing
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-md mx-auto md:mx-0">
              Access premium posters and marketing materials tailored for CSC owners. Download and share instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-100" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/dashboard">Explore Materials</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-white/10 rounded-lg rotate-6"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-white/10 rounded-lg -rotate-6"></div>
              <div className="relative bg-white p-2 rounded-lg shadow-lg">
                <img 
                  src="/placeholder.svg"
                  alt="Poster Preview" 
                  className="w-full h-auto rounded"
                  width={400}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
