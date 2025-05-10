
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CategoriesTable from "@/components/admin/CategoriesTable";
import CategoryForm from "@/components/admin/CategoryForm";

const AdminCategories = () => {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-darkPurple">
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for posters.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <CategoryForm onSuccess={() => setAddCategoryOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <CategoriesTable />
        </CardContent>
      </Card>
    </>
  );
};

export default AdminCategories;
