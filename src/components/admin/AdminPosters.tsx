
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PostersTable from "@/components/admin/PostersTable";
import PosterForm from "@/components/admin/PosterForm";

const AdminPosters = () => {
  const [addPosterOpen, setAddPosterOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={addPosterOpen} onOpenChange={setAddPosterOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-purple hover:bg-brand-darkPurple">
              <Plus className="mr-2 h-4 w-4" />
              Add New Poster
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Poster</DialogTitle>
              <DialogDescription>
                Upload a new poster to make available for CSC owners.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <PosterForm onSuccess={() => setAddPosterOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <PostersTable />
        </CardContent>
      </Card>
    </>
  );
};

export default AdminPosters;
