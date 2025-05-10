
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authAPI } from "@/lib/api";

// Form schema for login
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Extended schema for signup
const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  csc_id: z.string().optional(),
  csc_name: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const schema = type === "login" ? loginSchema : signupSchema;
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      csc_id: "",
      csc_name: "",
    },
  });

  const onSubmit = async (values: LoginFormValues | SignupFormValues) => {
    setIsLoading(true);

    try {
      if (type === "login") {
        const loginValues = values as LoginFormValues;
        await authAPI.login(loginValues.email, loginValues.password);
        toast.success("Logged in successfully");
      } else {
        const signupValues = values as SignupFormValues;
        await authAPI.signup(signupValues);
        toast.success("Account created successfully");
      }

      // Redirect to dashboard after successful authentication
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === "signup" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                />
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
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "signup" && (
          <>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="csc_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSC ID (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your CSC ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="csc_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSC Name (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your CSC Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full bg-brand-purple hover:bg-brand-darkPurple"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {type === "login" ? "Logging in..." : "Creating account..."}
            </>
          ) : (
            <>{type === "login" ? "Log in" : "Create account"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
