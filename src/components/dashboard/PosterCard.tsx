
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Image, Copy } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PosterCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  serviceUrl?: string;
  isNew?: boolean;
}

const PosterCard = ({ 
  id, 
  title, 
  category, 
  imageUrl, 
  description,
  serviceUrl,
  isNew = false 
}: PosterCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDownload = () => {
    setIsLoading(true);
    
    // This is a placeholder for the actual download logic
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Poster downloaded successfully with your CSC details in the footer.");
    }, 1500);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(title + "\n" + (description || ""));
    toast.success("Marketing message copied to clipboard");
  };

  const handleCopyUrl = () => {
    if (serviceUrl) {
      navigator.clipboard.writeText(serviceUrl);
      toast.success("Service URL copied to clipboard");
    }
  };

  return (
    <>
      <Card className="poster-card overflow-hidden flex flex-col h-full">
        <div 
          className="poster-image-container cursor-pointer" 
          onClick={() => setDialogOpen(true)}
        >
          {isNew && (
            <Badge className="absolute top-2 right-2 bg-brand-purple hover:bg-brand-darkPurple">
              New
            </Badge>
          )}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <Image className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 
            className="font-medium text-lg mb-1 cursor-pointer hover:text-brand-purple"
            onClick={() => setDialogOpen(true)}
          >
            {title}
          </h3>
          <Badge variant="outline" className="category-badge">
            {category}
          </Badge>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
          <Button 
            onClick={handleDownload} 
            className="bg-brand-purple hover:bg-brand-darkPurple flex-1 mr-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
          
          <Button variant="outline" size="icon" onClick={handleCopyContent}>
            <Copy className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Poster Display Area */}
            <div className="border-2 rounded-md overflow-hidden bg-white">
              <img
                src={imageUrl}
                alt={title}
                className="w-full object-contain"
              />
            </div>
            
            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-darkPurple"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={handleCopyContent}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Content
              </Button>
            </div>
            
            {/* Service URL Display with Copy Button */}
            {serviceUrl && (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Service URL:</label>
                <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                  <div className="flex-1 truncate text-sm text-muted-foreground">
                    {serviceUrl}
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
            {description && (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Marketing Message:</label>
                <div className="border rounded-md p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">{description}</p>
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
            <div className="pt-4 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{category}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PosterCard;
