
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  interval: z.enum(["monthly", "yearly"], {
    required_error: "Please select a billing interval",
  }),
  features: z.string().optional(),
  active: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  plan?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    interval: string;
    features: string[] | null;
    active: boolean | null;
  } | null;
  onSuccess: () => void;
}

export default function PlanForm({ plan, onSuccess }: PlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<PlanFormValues> = {
    name: plan?.name || "",
    description: plan?.description || "",
    price: plan?.price || 0,
    interval: (plan?.interval as "monthly" | "yearly") || "monthly",
    features: plan?.features ? JSON.stringify(plan.features) : "[]",
    active: plan?.active !== null ? plan.active : true,
  };

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues,
  });

  async function onSubmit(data: PlanFormValues) {
    try {
      setIsSubmitting(true);
      
      // Parse features from JSON string to actual array
      let featuresArray: string[] = [];
      try {
        featuresArray = JSON.parse(data.features || "[]");
      } catch (e) {
        toast.error("Invalid features format. Please use valid JSON array.");
        setIsSubmitting(false);
        return;
      }
      
      const planData = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        interval: data.interval,
        features: featuresArray,
        active: data.active,
      };
      
      let result;
      
      if (plan?.id) {
        // Update existing plan
        result = await supabase
          .from("plans")
          .update({
            ...planData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", plan.id);
          
        if (result.error) throw result.error;
        toast.success("Plan updated successfully");
      } else {
        // Create new plan
        result = await supabase
          .from("plans")
          .insert([planData])
          .select();
          
        if (result.error) throw result.error;
        toast.success("Plan created successfully");
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error saving plan:", error);
      toast.error(error.message || "Failed to save plan");
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
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Basic Plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the plan benefits" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4 flex-wrap">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Billing Interval</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (JSON array)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='["Feature 1", "Feature 2", "Feature 3"]'
                  {...field} 
                  value={field.value || "[]"}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                Enter features as a JSON array of strings
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Active
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Make this plan available to customers
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="bg-brand-purple hover:bg-brand-darkPurple"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
        </Button>
      </form>
    </Form>
  );
}
