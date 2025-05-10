
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
  type: "login" | "signup";
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  cscId: z.string().min(3, { message: "CSC ID must be at least 3 characters" }),
  cscName: z.string().min(3, { message: "CSC Name must be at least 3 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const schema = type === "login" ? loginSchema : signupSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "signup" && {
        name: "",
        cscId: "",
        cscName: "",
        address: "",
        phone: "",
      }),
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual authentication logic
      console.log("Form values:", values);
      
      setTimeout(() => {
        setIsLoading(false);
        
        if (type === "login") {
          toast.success("Successfully logged in!");
        } else {
          toast.success("Account created successfully!");
        }
        
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred. Please try again.");
      console.error("Auth error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {type === "signup" && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cscId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSC ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Your CSC ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cscName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSC Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your CSC Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your CSC Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-darkPurple" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {type === "login" ? "Logging in..." : "Creating account..."}
            </>
          ) : type === "login" ? "Log In" : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
