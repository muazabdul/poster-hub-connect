import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import PosterForm from "./PosterForm";

interface Poster {
  id: string;
  title: string;
  category_id: string;
  category_name?: string;
  image_url: string;
  description?: string;
  serviceUrl?: string;
  created_at: string;
  downloads?: number;
}

const PostersTable = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [categories, setCategories] = useState<Record<string, string>>({});

  const fetchPosters = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would JOIN with categories table
      // and get download counts
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPosters(data || []);
    } catch (error) {
      console.error("Error fetching posters:", error);
      toast.error("Failed to load posters");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');
        
      if (error) throw error;
      
      const categoryMap: Record<string, string> = {};
      data?.forEach(cat => {
        categoryMap[cat.id] = cat.name;
      });
      
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPosters();
  }, []);

  const handleEdit = (poster: Poster) => {
    setSelectedPoster(poster);
    setEditDialogOpen(true);
  };

  const handleView = (poster: Poster) => {
    setSelectedPoster(poster);
    setViewDialogOpen(true);
  };

  const handleDelete = (poster: Poster) => {
    setSelectedPoster(poster);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPoster) return;
    
    try {
      // In a real implementation, this would delete from storage too
      const { error } = await supabase
        .from('posters')
        .delete()
        .eq('id', selectedPoster.id);
        
      if (error) throw error;
      
      toast.success("Poster deleted successfully");
      fetchPosters();
    } catch (error) {
      console.error("Error deleting poster:", error);
      toast.error("Failed to delete poster");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div>      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poster
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
              {posters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No posters found. Add your first poster.
                  </td>
                </tr>
              ) : (
                posters.map((poster) => (
                  <tr key={poster.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          <div className="h-10 w-10 rounded-sm bg-gray-200"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {poster.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {categories[poster.category_id] || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(poster.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {poster.downloads || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(poster)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(poster)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(poster)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Poster</DialogTitle>
            <DialogDescription>
              Update the poster details.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            {selectedPoster && (
              <PosterForm 
                initialData={{
                  id: selectedPoster.id,
                  title: selectedPoster.title,
                  category: selectedPoster.category_id,
                  description: selectedPoster.description,
                  serviceUrl: selectedPoster.serviceUrl,
                }}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  fetchPosters();
                }} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Poster Details</DialogTitle>
          </DialogHeader>
          {selectedPoster && (
            <div className="space-y-4">
              <div className="aspect-[3/4] relative bg-muted rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-500">Poster Preview</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold">{selectedPoster.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Category: {categories[selectedPoster.category_id] || 'Unknown'}
                </p>
                {selectedPoster.description && (
                  <p className="text-sm">{selectedPoster.description}</p>
                )}
                {selectedPoster.serviceUrl && (
                  <p className="text-sm">
                    Service URL: <a href={selectedPoster.serviceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedPoster.serviceUrl}</a>
                  </p>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the poster "{selectedPoster?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostersTable;
