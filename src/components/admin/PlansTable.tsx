
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import PlanForm from "./PlanForm";
import { Json } from "@/integrations/supabase/types";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  features: string[] | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function PlansTable() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("price");

      if (error) {
        console.error("Error fetching plans:", error);
        setError(`Failed to load plans: ${error.message}`);
        toast.error("Failed to load plans");
        throw error;
      }

      // Convert the data to ensure features is always string[]
      const formattedPlans: Plan[] = (data || []).map(plan => ({
        ...plan,
        features: parseFeatures(plan.features)
      }));

      setPlans(formattedPlans);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      setError(`Failed to load plans: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Helper function to handle all possible types of the features field
  const parseFeatures = (features: Json): string[] => {
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

  const handleAddPlan = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirm = (planId: string) => {
    setPlanToDelete(planId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    
    try {
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", planToDelete);

      if (error) throw error;
      
      toast.success("Plan deleted successfully");
      setPlans(plans.filter(plan => plan.id !== planToDelete));
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast.error(error.message || "Failed to delete plan");
    } finally {
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchPlans();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingPlan(null);
  };

  const handleRetry = () => {
    fetchPlans();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Subscription Plans</h3>
        <Button 
          onClick={handleAddPlan} 
          className="bg-brand-purple hover:bg-brand-darkPurple flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Plan
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No plans found. Create your first plan.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{plan.name}</div>
                      {plan.description && (
                        <div className="text-xs text-muted-foreground">{plan.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>₹{plan.price.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{plan.interval}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-xs">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.slice(0, 2).map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No features</span>
                      )}
                      {plan.features && plan.features.length > 2 && (
                        <li className="text-muted-foreground">{plan.features.length - 2} more...</li>
                      )}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteConfirm(plan.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan for your customers.
            </DialogDescription>
          </DialogHeader>
          <PlanForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Modify the details of this subscription plan.
            </DialogDescription>
          </DialogHeader>
          <PlanForm plan={editingPlan} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this plan. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
