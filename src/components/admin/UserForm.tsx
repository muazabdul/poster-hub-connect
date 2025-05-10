
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// In a real application, we would use Supabase's admin functions or edge functions
// to handle user creation and updates securely.
// This is a simplified implementation for the prototype.

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  csc_id: z.string().optional(),
  csc_name: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  address: z.string().optional(),
  phone: z.string().optional()
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: {
    id: string;
    name: string | null;
    email: string;
    csc_id?: string | null;
    csc_name?: string | null;
    role?: string | null;
    address?: string | null;
    phone?: string | null;
  } | null;
  onSuccess: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!user?.id;
  
  const defaultValues: Partial<UserFormValues> = {
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    csc_id: user?.csc_id || "",
    csc_name: user?.csc_name || "",
    role: user?.role || "user",
    address: user?.address || "",
    phone: user?.phone || ""
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  async function onSubmit(data: UserFormValues) {
    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        // Update existing user
        const updateData = {
          name: data.name,
          csc_id: data.csc_id || null,
          csc_name: data.csc_name || null,
          role: data.role,
          address: data.address || null,
          phone: data.phone || null,
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", user!.id);
          
        if (error) throw error;
        
        toast.success("User updated successfully");
      } else {
        // In a real app, we would use a secure admin function to create users with specific roles
        // This is a simplified version for the prototype
        toast.success("User creation would require a secure admin function in production");
        toast.info("For this prototype, we'll simulate user creation");
        
        // Simulate user creation
        setTimeout(() => {
          toast.success("User created successfully");
          onSuccess();
        }, 1000);
        
        return;
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast.error(error.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Smith" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="e.g. john@example.com" 
                  {...field}
                  disabled={isEditing} // Can't change email for existing users
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isEditing && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Set a secure password" 
                    {...field}
                    required={!isEditing} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="csc_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CSC ID</FormLabel>
                <FormControl>
                  <Input placeholder="CSC Identifier" {...field} value={field.value || ""} />
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
                <FormLabel>CSC Name</FormLabel>
                <FormControl>
                  <Input placeholder="CSC Name" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 12345 67890" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Role</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">User (CSC Owner)</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input placeholder="Full address" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="bg-brand-purple hover:bg-brand-darkPurple"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
