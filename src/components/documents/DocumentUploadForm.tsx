import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, FileIcon, FileText, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

const documentSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  category: z.string({
    required_error: 'Please select a document category.',
  }).min(1, { message: 'Please select a category' }),
  documentDate: z.date({
    required_error: 'Document date is required.',
  }),
  notes: z.string().optional(),
  file: z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(
      (file) => Object.keys(ACCEPTED_FILE_TYPES).includes(file.type),
      'Only PDF, JPG/JPEG, and PNG files are accepted.'
    ),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;

const documentCategories = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'lab_report', label: 'Lab Report' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'other', label: 'Other' },
];

interface DocumentUploadFormProps {
  onSubmit: (data: DocumentFormValues) => void;
  onCancel: () => void;
}

export function DocumentUploadForm({ onSubmit, onCancel }: DocumentUploadFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      category: '',
      documentDate: new Date(),
      notes: '',
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        form.setValue('file', file, { shouldValidate: true });
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(null);
        }
      }
    },
  });

  const watchedFile = form.watch('file');
  
  // Remove file from form and preview
  const handleRemoveFile = () => {
    form.setValue('file', undefined, { shouldValidate: true });
    setPreviewUrl(null);
  };

  const handleFormSubmit = (data: DocumentFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Blood Test Report - March 2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Document Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Upload Document</FormLabel>
                <FormControl>
                  {!watchedFile ? (
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed rounded-md border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-center text-sm text-gray-500">
                        Drag & drop your file here, or click to select a file
                      </p>
                      <p className="text-center text-xs text-gray-400 mt-1">
                        PDF, JPG, or PNG. Max 5MB.
                      </p>
                    </div>
                  ) : (
                    <Card className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {previewUrl ? (
                              <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={previewUrl} 
                                  alt="Preview" 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate">{watchedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(watchedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleRemoveFile}
                            type="button"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about this document..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Upload Document
          </Button>
        </div>
      </form>
    </Form>
  );
}