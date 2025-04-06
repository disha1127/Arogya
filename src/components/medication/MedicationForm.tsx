import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Define the form validation schema
const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  notes: z.string().optional(),
});

// Extend the schema type for our form state
type MedicationFormValues = z.infer<typeof medicationSchema> & {
  times: string[];
};

// Available frequency options
const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "twice_daily", label: "Twice Daily" },
  { value: "three_times_daily", label: "Three Times Daily" },
  { value: "every_other_day", label: "Every Other Day" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As Needed (PRN)" },
  { value: "custom", label: "Custom" },
];

interface MedicationFormProps {
  onSubmit: (data: MedicationFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<MedicationFormValues>;
  isEditing?: boolean;
}

export function MedicationForm({ onSubmit, onCancel, defaultValues, isEditing = false }: MedicationFormProps) {
  // State for the time picker
  const [selectedTimes, setSelectedTimes] = useState<string[]>(defaultValues?.times || []);
  const [timeInput, setTimeInput] = useState<string>("");

  // Initialize the form with default values
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      dosage: defaultValues?.dosage || "",
      frequency: defaultValues?.frequency || "",
      startDate: defaultValues?.startDate || new Date(),
      endDate: defaultValues?.endDate,
      notes: defaultValues?.notes || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof medicationSchema>) => {
    if (selectedTimes.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one reminder time",
        variant: "destructive",
      });
      return;
    }

    // Combine the form values with the selected times
    const medicationData: MedicationFormValues = {
      ...values,
      times: selectedTimes,
    };

    onSubmit(medicationData);
  };

  // Handle adding a time
  const handleAddTime = () => {
    if (!timeInput) return;
    
    // Validate time format (HH:MM AM/PM)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(timeInput)) {
      toast({
        title: "Invalid Time Format",
        description: "Please use the format: HH:MM AM/PM (e.g., 8:00 AM)",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (selectedTimes.includes(timeInput)) {
      toast({
        title: "Duplicate Time",
        description: "This time is already added",
        variant: "destructive",
      });
      return;
    }

    // Add the time and clear the input
    setSelectedTimes([...selectedTimes, timeInput]);
    setTimeInput("");
  };

  // Handle removing a time
  const handleRemoveTime = (time: string) => {
    setSelectedTimes(selectedTimes.filter((t) => t !== time));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Paracetamol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 500mg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Reminder Times</FormLabel>
            <div className="flex mt-1.5">
              <Input
                type="text"
                placeholder="e.g., 8:00 AM"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="button" onClick={handleAddTime} variant="secondary">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <FormDescription>
              Enter times in 12-hour format (e.g., 8:00 AM, 2:30 PM)
            </FormDescription>
          </div>

          {selectedTimes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTimes.map((time) => (
                <Badge key={time} variant="secondary" className="px-2 py-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {time}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveTime(time)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
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
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < (form.getValues("startDate") || new Date())}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Leave blank for ongoing medications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Take with food, avoid grapefruit, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Medication" : "Add Medication"}
          </Button>
        </div>
      </form>
    </Form>
  );
}