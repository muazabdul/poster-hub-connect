
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

  const handleDownload = (poster: Poster) => {
    toast.success(`Downloading ${poster.title}`);
    // Actual implementation would handle download logic
  };

  const handleCopyServiceUrl = () => {
    if (selectedPoster?.serviceUrl) {
      navigator.clipboard.writeText(selectedPoster.serviceUrl);
      toast.success("Service URL copied to clipboard");
    }
  };

  const handleCopyContent = () => {
    if (selectedPoster) {
      navigator.clipboard.writeText(selectedPoster.title + "\n" + (selectedPoster.description || ""));
      toast.success("Poster content copied to clipboard");
    }
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
                          <img 
                            src={poster.image_url} 
                            alt={poster.title}
                            className="h-10 w-10 rounded-sm object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
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
                        {categories[poster.category_id] || 'Uncategorized'}
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
            <DialogTitle className="text-xl font-bold">{selectedPoster?.title}</DialogTitle>
          </DialogHeader>
          {selectedPoster && (
            <div className="space-y-6">
              {/* Poster Display Area */}
              <div className="border-2 rounded-md overflow-hidden bg-white">
                <img
                  src={selectedPoster.image_url}
                  alt={selectedPoster.title}
                  className="w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              {/* Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-darkPurple"
                  onClick={() => handleDownload(selectedPoster)}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={() => handleEdit(selectedPoster)}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
              
              {/* Service URL Display with Copy Button */}
              {selectedPoster.serviceUrl && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service URL:</label>
                  <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                    <div className="flex-1 truncate text-sm text-muted-foreground">
                      {selectedPoster.serviceUrl}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyServiceUrl}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Marketing Message Area */}
              {selectedPoster.description && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Marketing Message:</label>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p className="text-sm text-gray-600">{selectedPoster.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex ml-auto" 
                    onClick={handleCopyContent}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy Content
                  </Button>
                </div>
              )}
              
              {/* Metadata */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{categories[selectedPoster.category_id] || 'Uncategorized'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Added On:</span>
                  <span>{formatDate(selectedPoster.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span>{selectedPoster.downloads || 0}</span>
                </div>
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
