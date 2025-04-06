import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SymptomCategory } from '@/data/symptomConditions';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

// Define Symptom interface
interface Symptom {
  id: number;
  name: string;
  urgencyLevel: number;
}

interface SymptomCategorySelectorProps {
  categories: SymptomCategory[];
  allSymptoms: Symptom[];
  selectedSymptoms: Symptom[];
  onSymptomToggle: (symptom: Symptom) => void;
}

export function SymptomCategorySelector({ 
  categories, 
  allSymptoms, 
  selectedSymptoms, 
  onSymptomToggle 
}: SymptomCategorySelectorProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter symptoms based on search query
  const filteredSymptoms = allSymptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get symptoms for a specific category
  const getCategorySymptoms = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return allSymptoms.filter(symptom => 
      category.symptoms.includes(symptom.id) && 
      symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Check if a symptom is selected
  const isSymptomSelected = (symptomId: number) => {
    return selectedSymptoms.some(s => s.id === symptomId);
  };

  // Calculate count of symptoms selected in each category
  const getCategorySelectedCount = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return 0;
    
    return selectedSymptoms.filter(symptom => 
      category.symptoms.includes(symptom.id)
    ).length;
  };

  return (
    <div className="space-y-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search symptoms..."
          className="pl-10"
          aria-label="Search symptoms"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start mb-4">
          <TabsTrigger value="all" className="flex items-center">
            All
            {selectedSymptoms.length > 0 && (
              <Badge variant="secondary" className="ml-2">{selectedSymptoms.length}</Badge>
            )}
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center"
              aria-label={`${category.name} symptoms`}
            >
              {category.name}
              {getCategorySelectedCount(category.id) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getCategorySelectedCount(category.id)}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredSymptoms.map(symptom => (
                <motion.div 
                  key={symptom.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start space-x-2"
                >
                  <Checkbox 
                    id={`symptom-${symptom.id}`} 
                    checked={isSymptomSelected(symptom.id)}
                    onCheckedChange={() => onSymptomToggle(symptom)}
                    aria-label={symptom.name}
                  />
                  <Label 
                    htmlFor={`symptom-${symptom.id}`}
                    className="text-sm cursor-pointer leading-tight flex items-center"
                  >
                    {symptom.name}
                    {symptom.urgencyLevel >= 4 && (
                      <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Urgent</Badge>
                    )}
                  </Label>
                </motion.div>
              ))}
              {filteredSymptoms.length === 0 && (
                <div className="col-span-2 py-8 text-center text-slate-500">
                  No symptoms match your search
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getCategorySymptoms(category.id).map(symptom => (
                  <motion.div 
                    key={symptom.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start space-x-2"
                  >
                    <Checkbox 
                      id={`${category.id}-symptom-${symptom.id}`} 
                      checked={isSymptomSelected(symptom.id)}
                      onCheckedChange={() => onSymptomToggle(symptom)}
                      aria-label={symptom.name}
                    />
                    <Label 
                      htmlFor={`${category.id}-symptom-${symptom.id}`}
                      className="text-sm cursor-pointer leading-tight flex items-center"
                    >
                      {symptom.name}
                      {symptom.urgencyLevel >= 4 && (
                        <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Urgent</Badge>
                      )}
                    </Label>
                  </motion.div>
                ))}
                {getCategorySymptoms(category.id).length === 0 && (
                  <div className="col-span-2 py-8 text-center text-slate-500">
                    No symptoms in this category match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}