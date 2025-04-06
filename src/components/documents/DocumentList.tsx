import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  MoreVertical,
  FileText, 
  FileImage, 
  FileDown, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  FileIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HealthDocument } from '@shared/schema';

interface DocumentListProps {
  documents: HealthDocument[];
  onEdit: (document: HealthDocument) => void;
  onDelete: (documentId: string) => void;
  onView: (document: HealthDocument) => void;
  onDownload: (document: HealthDocument) => void;
}

export function DocumentList({ 
  documents, 
  onEdit, 
  onDelete, 
  onView,
  onDownload 
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Filter documents based on search term and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc.notes && doc.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Group documents by year and month for better organization
  const groupedDocuments: Record<string, HealthDocument[]> = {};
  
  filteredDocuments.forEach(doc => {
    const date = new Date(doc.documentDate);
    const key = format(date, 'MMMM yyyy');
    
    if (!groupedDocuments[key]) {
      groupedDocuments[key] = [];
    }
    
    groupedDocuments[key].push(doc);
  });

  // Get all unique categories from documents
  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileDown className="h-8 w-8 text-red-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  // Function to format file size
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Function to get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prescription':
        return 'bg-green-100 text-green-800';
      case 'lab_report':
        return 'bg-blue-100 text-blue-800';
      case 'imaging':
        return 'bg-purple-100 text-purple-800';
      case 'discharge_summary':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get display name for category
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'prescription':
        return 'Prescription';
      case 'lab_report':
        return 'Lab Report';
      case 'imaging':
        return 'Imaging';
      case 'discharge_summary':
        return 'Discharge Summary';
      default:
        return 'Other';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search documents by title or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {getCategoryDisplayName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <FileIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? "Try changing your search criteria"
              : "Upload your first medical document to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDocuments).map(([dateGroup, docs]) => (
            <div key={dateGroup} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">{dateGroup}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((document) => (
                  <Card key={document.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className={`mb-2 ${getCategoryColor(document.category)}`}>
                            {getCategoryDisplayName(document.category)}
                          </Badge>
                          <CardTitle className="text-base truncate">{document.title}</CardTitle>
                          <CardDescription>
                            {format(new Date(document.documentDate), 'PPP')}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(document)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDownload(document)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(document)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete(document.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      {document.notes && (
                        <p className="text-gray-600 text-sm line-clamp-2">{document.notes}</p>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between">
                      <div className="flex items-center">
                        {getFileIcon(document.fileType)}
                        <div className="ml-2">
                          <p className="text-xs text-gray-500 truncate max-w-[120px]">
                            {document.fileName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(document.fileSize)}
                          </p>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8"
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{document.title}</DialogTitle>
                            <DialogDescription>
                              {format(new Date(document.documentDate), 'PPP')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 flex justify-center">
                            {document.fileType.startsWith('image/') ? (
                              <img 
                                src={document.fileUrl} 
                                alt={document.title} 
                                className="max-h-[60vh] object-contain"
                              />
                            ) : (
                              <iframe 
                                src={document.fileUrl} 
                                className="w-full h-[60vh]" 
                                title={document.title}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}