
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Copy, Link as LinkIcon, Share2, Eye } from "lucide-react";
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
            <DialogTitle>{selectedPoster?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedPoster && (
            <div className="space-y-6">
              {/* Poster Display Area */}
              <div className="border-2 rounded-md overflow-hidden">
                <img
                  src={selectedPoster.image_url}
                  alt={selectedPoster.title}
                  className="w-full object-contain"
                />
              </div>
              
              {/* Download and Share Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-brand-purple hover:bg-brand-darkPurple"
                  onClick={() => handleDownload(selectedPoster, {} as React.MouseEvent)}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Poster
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1" 
                  onClick={handleSharePoster}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share Poster
                </Button>
              </div>
              
              {/* Service URL Display with Copy Button */}
              {selectedPoster.serviceUrl && (
                <div className="flex items-center gap-2 border rounded-md p-2">
                  <div className="flex-1 truncate text-sm text-muted-foreground">
                    <span className="font-medium text-foreground mr-2">Service URL:</span>
                    {selectedPoster.serviceUrl}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyUrl}
                  >
                    <Copy className="h-4 w-4" /> Copy URL
                  </Button>
                </div>
              )}
              
              {/* Content Copy Button */}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleCopyContent}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Content
              </Button>
              
              {/* Marketing Message Area */}
              {selectedPoster.description && (
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Marketing Message</h4>
                  <p className="text-sm text-muted-foreground">{selectedPoster.description}</p>
                </div>
              )}
              
              {/* Additional Metadata */}
              {selectedPoster.category_id && (
                <div className="flex items-center justify-between text-sm">
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
