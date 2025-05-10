
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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
    // In a complete implementation, this would track the download
    // and perhaps increment a counter in the database
    
    // For now, just simulate a download
    toast.success(`Downloading ${poster.title}`);
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = poster.image_url;
    link.download = poster.title.replace(/\s+/g, '_').toLowerCase() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <CardFooter className="p-2 pt-0 border-t">
              <Button 
                variant="ghost"
                size="sm"
                className="w-full text-brand-purple hover:text-brand-deepPurple hover:bg-brand-light/50"
                onClick={(e) => handleDownload(poster, e)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPoster?.title}</DialogTitle>
          </DialogHeader>
          {selectedPoster && (
            <div className="space-y-4">
              <div className="aspect-[3/4] relative bg-muted rounded-md overflow-hidden">
                <img
                  src={selectedPoster.image_url}
                  alt={selectedPoster.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {selectedPoster.description && (
                <p className="text-sm">{selectedPoster.description}</p>
              )}
              
              {selectedPoster.serviceUrl && (
                <p className="text-sm">
                  Service URL: <a href={selectedPoster.serviceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedPoster.serviceUrl}</a>
                </p>
              )}
              
              <div className="flex justify-end">
                <Button 
                  className="gap-2 bg-brand-purple hover:bg-brand-darkPurple"
                  onClick={() => handleDownload(selectedPoster, {} as React.MouseEvent)}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostersGrid;
