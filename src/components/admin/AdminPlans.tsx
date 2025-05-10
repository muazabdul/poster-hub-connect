
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PlansTable from "@/components/admin/PlansTable";
import PlanForm from "@/components/admin/PlanForm";

const AdminPlans = () => {
  const [addPlanOpen, setAddPlanOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={addPlanOpen} onOpenChange={setAddPlanOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-darkPurple">
              <Plus className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Plan</DialogTitle>
              <DialogDescription>
                Create a new subscription plan for CSC owners.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <PlanForm onSuccess={() => setAddPlanOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <PlansTable />
        </CardContent>
      </Card>
    </>
  );
};

export default AdminPlans;
