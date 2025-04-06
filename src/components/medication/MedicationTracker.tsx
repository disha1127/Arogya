import { useState } from "react";
import { format, isToday, parseISO, isWithinInterval, startOfToday, endOfToday, addDays, subDays } from "date-fns";
import { 
  Calendar,
  Check,
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Edit, 
  MoreHorizontal, 
  PillIcon, 
  Trash, 
  XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export interface Medication {
  id: string | number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string | Date;
  endDate?: string | Date;
  notes?: string;
  status?: Record<string, 'taken' | 'missed' | 'pending'>;
}

interface MedicationTrackerProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (id: string | number) => void;
  onStatusUpdate: (id: string | number, date: string, time: string, status: 'taken' | 'missed') => void;
}

export function MedicationTracker({ medications, onEdit, onDelete, onStatusUpdate }: MedicationTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDeleteAlert, setShowDeleteAlert] = useState<string | number | null>(null);

  // Calculate the date range for the tracker (7 days view)
  const startDate = subDays(selectedDate, 3);
  const endDate = addDays(selectedDate, 3);
  
  // Create an array of 7 dates for the tracker
  const dateRange = Array(7).fill(0).map((_, i) => addDays(startDate, i));

  // Get medications active for the selected date
  const getActiveMedications = (date: Date) => {
    return medications.filter(med => {
      const startDateObj = new Date(med.startDate);
      const endDateObj = med.endDate ? new Date(med.endDate) : new Date(2099, 11, 31); // Far future date if no end date
      
      return isWithinInterval(date, {
        start: startDateObj,
        end: endDateObj
      });
    });
  };

  // Get the status for a specific medication on a specific date and time
  const getMedicationStatus = (medication: Medication, date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const statusKey = `${dateStr}_${time}`;
    
    if (medication.status && medication.status[statusKey]) {
      return medication.status[statusKey];
    }
    
    // Return 'pending' for today and future dates, 'missed' for past dates
    return isWithinInterval(date, { start: startOfToday(), end: endOfToday() }) || date > new Date() 
      ? 'pending' 
      : 'missed';
  };

  // Handle status change
  const handleStatusChange = (medication: Medication, date: Date, time: string, status: 'taken' | 'missed') => {
    onStatusUpdate(medication.id, format(date, 'yyyy-MM-dd'), time, status);
  };

  // Navigate to previous/next week
  const navigatePrevious = () => setSelectedDate(prevDate => subDays(prevDate, 7));
  const navigateNext = () => setSelectedDate(prevDate => addDays(prevDate, 7));
  const navigateToday = () => setSelectedDate(new Date());

  // Format frequency for display
  const formatFrequency = (frequency: string) => {
    return frequency
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Title for the date column
  const getDateColumnTitle = (date: Date) => {
    const day = format(date, 'EEE');
    const dateNum = format(date, 'd');
    
    // Add "Today" label for current date
    const isCurrentDate = isToday(date);
    
    return (
      <div className="text-center">
        <div className="font-medium">{day}</div>
        <div className={`text-sm ${isCurrentDate ? 'bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
          {dateNum}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation Bar */}
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={navigatePrevious}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button variant="outline" size="sm" onClick={navigateToday}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={navigateNext}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Date Range Display */}
      <div className="grid grid-cols-7 gap-2">
        {dateRange.map((date, index) => (
          <div
            key={index}
            className={`p-2 rounded-md text-center cursor-pointer ${
              isToday(date) ? 'bg-primary-100 text-primary-800' : 'hover:bg-slate-100'
            } ${
              format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') 
                ? 'border-2 border-primary-500' 
                : ''
            }`}
            onClick={() => setSelectedDate(date)}
          >
            {getDateColumnTitle(date)}
          </div>
        ))}
      </div>

      {/* Selected Date Medications */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          Medications for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        <div className="space-y-4">
          {getActiveMedications(selectedDate).length > 0 ? (
            getActiveMedications(selectedDate).map(medication => (
              <Card key={medication.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                      <PillIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{medication.name}</CardTitle>
                      <CardDescription>{medication.dosage} - {formatFrequency(medication.frequency)}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(medication)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setShowDeleteAlert(medication.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-600">Started:</span>
                      <span className="ml-1 font-medium">
                        {typeof medication.startDate === 'string' 
                          ? format(parseISO(medication.startDate), 'MMM d, yyyy')
                          : format(medication.startDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                    {medication.endDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-slate-600">Ends:</span>
                        <span className="ml-1 font-medium">
                          {typeof medication.endDate === 'string' 
                            ? format(parseISO(medication.endDate), 'MMM d, yyyy')
                            : format(medication.endDate, 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">
                      {isToday(selectedDate) ? "Today's Schedule:" : `Schedule for ${format(selectedDate, 'MMMM d, yyyy')}:`}
                    </h4>
                    {medication.times.map((time, index) => {
                      const status = getMedicationStatus(medication, selectedDate, time);
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-slate-400 mr-2" />
                            <span>{time}</span>
                          </div>
                          <div className="flex gap-2">
                            {status === 'pending' && isWithinInterval(selectedDate, { start: startOfToday(), end: endOfToday() }) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() => handleStatusChange(medication, selectedDate, time, 'taken')}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Taken
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => handleStatusChange(medication, selectedDate, time, 'missed')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Missed
                                </Button>
                              </>
                            )}
                            {status === 'taken' && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Taken
                              </Badge>
                            )}
                            {status === 'missed' && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" /> Missed
                              </Badge>
                            )}
                            {status === 'pending' && !isWithinInterval(selectedDate, { start: startOfToday(), end: endOfToday() }) && (
                              <Badge className="bg-slate-100 text-slate-800 border-slate-200">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {medication.notes && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-medium text-sm mb-1">Notes:</h4>
                        <p className="text-sm text-slate-600">{medication.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 border rounded-md bg-slate-50">
              <p className="text-slate-500">No medications scheduled for this date</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert !== null} onOpenChange={() => setShowDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this medication?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the medication and all associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (showDeleteAlert) {
                  onDelete(showDeleteAlert);
                  setShowDeleteAlert(null);
                  toast({
                    title: "Medication Deleted",
                    description: "The medication has been successfully deleted.",
                  });
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}