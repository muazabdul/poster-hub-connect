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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative("Price must be 0 or greater"), // Changed from positive to nonnegative
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
  const [formError, setFormError] = useState<string | null>(null);
  
  const isEditing = !!plan?.id;
  
  const defaultValues: Partial<PlanFormValues> = {
    id: plan?.id || "",
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
    setFormError(null);
    
    try {
      setIsSubmitting(true);
      console.log("Submitting plan form:", { isEditing, data });
      
      // Parse features from JSON string to actual array
      let featuresArray: string[] = [];
      try {
        featuresArray = JSON.parse(data.features || "[]");
      } catch (e) {
        toast.error("Invalid features format. Please use valid JSON array.");
        setFormError("Invalid features format. Please use valid JSON array format like [\"Feature 1\", \"Feature 2\"]");
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
          .eq("id", plan.id)
          .select();
          
        if (result.error) throw result.error;
        console.log("Plan updated successfully:", result.data);
        toast.success("Plan updated successfully");
      } else {
        // Create new plan
        result = await supabase
          .from("plans")
          .insert([planData])
          .select();
          
        if (result.error) throw result.error;
        console.log("Plan created successfully:", result.data);
        toast.success("Plan created successfully");
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error saving plan:", error);
      toast.error(error.message || "Failed to save plan");
      setFormError(error.message || "Failed to save plan. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const validateJsonFeatures = (value: string) => {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return "Invalid JSON format";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
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
          className="bg-brand-purple hover:bg-brand-darkPurple w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {plan ? "Updating Plan..." : "Creating Plan..."}
            </>
          ) : plan ? "Update Plan" : "Create Plan"}
        </Button>
      </form>
    </Form>
  );
}
