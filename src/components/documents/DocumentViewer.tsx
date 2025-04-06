import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { HealthDocument } from '@shared/schema';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: HealthDocument | null;
  documents: HealthDocument[];
  onDownload: (document: HealthDocument) => void;
}

export function DocumentViewer({ 
  isOpen, 
  onClose, 
  document, 
  documents,
  onDownload 
}: DocumentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    if (document) {
      const index = documents.findIndex(d => d.id === document.id);
      setCurrentIndex(index);
    }
  }, [document, documents]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < documents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentDocument = currentIndex !== -1 ? documents[currentIndex] : null;

  if (!currentDocument) {
    return null;
  }

  const isImage = currentDocument.fileType.startsWith('image/');
  const isPdf = currentDocument.fileType === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{currentDocument.title}</DialogTitle>
          <DialogDescription>
            {format(new Date(currentDocument.documentDate), 'PPP')}
            {currentDocument.notes && (
              <div className="mt-2 text-gray-700">{currentDocument.notes}</div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 flex-grow overflow-auto">
          {isImage ? (
            <img 
              src={currentDocument.fileUrl} 
              alt={currentDocument.title} 
              className="max-w-full h-auto mx-auto"
            />
          ) : isPdf ? (
            <iframe 
              src={`${currentDocument.fileUrl}#toolbar=0&navpanes=0`} 
              className="w-full h-[60vh]" 
              title={currentDocument.title}
            />
          ) : (
            <div className="text-center p-8 bg-gray-100 rounded-md">
              <p>Preview not available for this file type.</p>
              <Button
                variant="outline"
                onClick={() => onDownload(currentDocument)}
                className="mt-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download to View
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => onDownload(currentDocument)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex >= documents.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}