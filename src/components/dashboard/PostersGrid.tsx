
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Copy, Share2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Poster {
  id: string;
  title: string;
  image_url: string;
  category_id: string;
  description?: string;
  serviceUrl?: string;
}

interface PostersGridProps {
  posters: Poster[];
  loading?: boolean;
}

const PostersGrid = ({ posters, loading = false }: PostersGridProps) => {
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const handleViewPoster = (poster: Poster) => {
    setSelectedPoster(poster);
    setViewDialogOpen(true);
  };
  
  const handleDownload = (poster: Poster, e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast.success(`Downloading ${poster.title}`);
    
    const link = document.createElement('a');
    link.href = poster.image_url;
    link.download = poster.title.replace(/\s+/g, '_').toLowerCase() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyContent = () => {
    if (selectedPoster) {
      navigator.clipboard.writeText(selectedPoster.title + "\n" + (selectedPoster.description || ""));
      toast.success("Poster content copied to clipboard");
    }
  };

  const handleCopyUrl = () => {
    if (selectedPoster?.serviceUrl) {
      navigator.clipboard.writeText(selectedPoster.serviceUrl);
      toast.success("Service URL copied to clipboard");
    }
  };

  const handleSharePoster = () => {
    if (selectedPoster) {
      // This would be replaced with actual share functionality
      toast.success("Sharing poster");
    }
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[3/4] bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-3">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (posters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No posters found</h3>
        <p className="text-muted-foreground max-w-md">
          There are no posters matching your current selection. Try a different category or search term.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posters.map((poster) => (
          <Card 
            key={poster.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
            onClick={() => handleViewPoster(poster)}
          >
            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
              <img 
                src={poster.image_url} 
                alt={poster.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-3 flex-1">
              <h3 className="font-medium line-clamp-2">{poster.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
                />
              </div>
              
              {/* Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-darkPurple"
                  onClick={(e) => handleDownload(selectedPoster, e)}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={handleSharePoster}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
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
                      onClick={handleCopyUrl}
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
              {selectedPoster.category_id && (
                <div className="pt-4 border-t flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{selectedPoster.category_id}</Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostersGrid;
