import { v4 as uuidv4 } from 'uuid';
import { HealthDocument } from '@shared/schema';
import { DocumentFormValues } from '@/components/documents/DocumentUploadForm';

const DOCUMENTS_STORAGE_KEY = 'arogya_medical_documents';

// Get documents from local storage
export const getSavedDocuments = (): HealthDocument[] => {
  if (typeof window === 'undefined') return [];
  
  const storedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return storedDocuments ? JSON.parse(storedDocuments) : [];
};

// Save documents to local storage
export const saveDocuments = (documents: HealthDocument[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

// Save document to local storage
export const saveDocument = async (formData: DocumentFormValues, userId: number = 1): Promise<HealthDocument> => {
  // In a real app, you would upload the file to a server/cloud storage
  // For now, we'll create a data URL for the file
  const fileUrl = await readFileAsDataURL(formData.file);
  
  const newDocument: HealthDocument = {
    id: uuidv4(),
    userId,
    title: formData.title,
    category: formData.category,
    fileUrl,
    fileName: formData.file.name,
    fileType: formData.file.type,
    fileSize: formData.file.size,
    uploadedAt: new Date().toISOString(),
    documentDate: formData.documentDate.toISOString(),
    notes: formData.notes || null
  };
  
  const documents = getSavedDocuments();
  documents.push(newDocument);
  saveDocuments(documents);
  
  return newDocument;
};

// Update document
export const updateDocument = (
  id: string,
  updates: Partial<Omit<HealthDocument, 'id' | 'userId' | 'fileUrl' | 'fileName' | 'fileType' | 'fileSize' | 'uploadedAt'>>
): HealthDocument | null => {
  const documents = getSavedDocuments();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index === -1) return null;
  
  documents[index] = {
    ...documents[index],
    ...updates
  };
  
  saveDocuments(documents);
  return documents[index];
};

// Delete document
export const deleteDocument = (id: string): boolean => {
  const documents = getSavedDocuments();
  const filteredDocuments = documents.filter(doc => doc.id !== id);
  
  if (filteredDocuments.length === documents.length) {
    return false; // Document not found
  }
  
  saveDocuments(filteredDocuments);
  return true;
};

// Get a document by ID
export const getDocumentById = (id: string): HealthDocument | null => {
  const documents = getSavedDocuments();
  const document = documents.find(doc => doc.id === id);
  return document || null;
};

// Get all documents for a user
export const getUserDocuments = (userId: number = 1): HealthDocument[] => {
  const documents = getSavedDocuments();
  return documents.filter(doc => doc.userId === userId);
};

// Convert file to data URL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

// Download a document
export const downloadDocument = (document: HealthDocument): void => {
  const link = document.fileUrl;
  const filename = document.fileName;
  
  const a = window.document.createElement('a');
  a.href = link;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};