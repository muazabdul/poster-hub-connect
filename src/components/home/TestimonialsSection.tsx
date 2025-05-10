
import { cn } from "@/lib/utils";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ content, author, role }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-4 text-brand-purple">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-2c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-2c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </div>
      <p className="text-gray-600 mb-6">{content}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      content: "This platform has transformed how I market my CSC services. The professionally designed posters with my centre details make my business stand out in the community.",
      author: "Rajesh Kumar",
      role: "CSC Owner, Bihar",
    },
    {
      content: "The variety of categories means I always find relevant material for seasonal promotions. Sharing directly to WhatsApp has increased my customer engagement significantly.",
      author: "Priya Sharma",
      role: "CSC Owner, Maharashtra",
    },
    {
      content: "Being able to download and share professional marketing materials has saved me so much time and money. My center is now recognized throughout the village.",
      author: "Mohan Singh",
      role: "CSC Owner, Uttar Pradesh",
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">What CSC Owners Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            Hear from CSC owners who have transformed their marketing approach with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
