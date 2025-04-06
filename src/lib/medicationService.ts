import { Medication } from "@/components/medication/MedicationTracker";
import { format, parseISO, isWithinInterval, startOfToday, endOfToday } from "date-fns";

// Local storage keys
const MEDICATIONS_STORAGE_KEY = "arogya_medications";
const MEDICATION_REMINDERS_KEY = "arogya_medication_reminders";

// Check if browser notifications are supported
export const isNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    console.warn("Browser notifications are not supported");
    return false;
  }

  if (Notification?.permission === "granted") {
    return true;
  }

  if (Notification?.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Save medications to local storage
export const saveMedications = (medications: Medication[]): void => {
  localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(medications));
  
  // Update active reminders when medications change
  updateActiveReminders(medications);
};

// Get medications from local storage
export const getMedications = (): Medication[] => {
  const storedMedications = localStorage.getItem(MEDICATIONS_STORAGE_KEY);
  return storedMedications ? JSON.parse(storedMedications) : [];
};

// Update medication status
export const updateMedicationStatus = (
  id: string | number, 
  date: string, 
  time: string, 
  status: 'taken' | 'missed'
): Medication[] => {
  const medications = getMedications();
  const updatedMedications = medications.map(med => {
    if (med.id === id) {
      // Create or update status object
      const updatedStatus = med.status ? { ...med.status } : {};
      updatedStatus[`${date}_${time}`] = status;
      
      return { ...med, status: updatedStatus };
    }
    return med;
  });
  
  saveMedications(updatedMedications);
  return updatedMedications;
};

// Get today's medication reminders
export const getTodaysMedications = (): Medication[] => {
  const medications = getMedications();
  const today = new Date();
  
  return medications.filter(med => {
    const startDate = new Date(med.startDate);
    const endDate = med.endDate ? new Date(med.endDate) : new Date(2099, 11, 31);
    
    return isWithinInterval(today, { start: startDate, end: endDate });
  });
};

// Send a browser notification
export const sendNotification = (
  title: string, 
  body: string, 
  icon?: string
): void => {
  if (!isNotificationsSupported() || Notification?.permission !== "granted") {
    console.warn("Browser notifications are not supported or permission not granted");
    return;
  }
  
  // Create notification
  const notification = new Notification(title, {
    body,
    icon: icon || "/favicon.ico"
  });
  
  // Handle notification click
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

// Set up medication reminders
export const setupMedicationReminders = (medications: Medication[]): void => {
  if (!isNotificationsSupported() || Notification?.permission !== "granted") {
    console.warn("Browser notifications are not supported or permission not granted");
    return;
  }
  
  // Clear existing reminder intervals
  clearMedicationReminders();
  
  // Get active medications for today
  const todaysMedications = getTodaysMedications();
  const reminders: Record<string, number> = {};
  
  todaysMedications.forEach(medication => {
    medication.times.forEach(timeStr => {
      const [hourStr, minuteStr, period] = timeStr.split(/[:\s]/);
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      
      // Convert to 24-hour format
      if (period === "PM" && hour < 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }
      
      // Set reminder time
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hour, minute, 0, 0);
      
      // If time has already passed today, don't schedule
      if (reminderTime <= now) {
        return;
      }
      
      // Calculate milliseconds until reminder time
      const delay = reminderTime.getTime() - now.getTime();
      
      // Schedule reminder notification
      const reminderId = window.setTimeout(() => {
        sendNotification(
          "Medication Reminder",
          `Time to take ${medication.name} (${medication.dosage})`,
        );
      }, delay);
      
      reminders[`${medication.id}_${timeStr}`] = reminderId;
    });
  });
  
  // Save active reminders to local storage
  localStorage.setItem(MEDICATION_REMINDERS_KEY, JSON.stringify(reminders));
};

// Clear all medication reminders
export const clearMedicationReminders = (): void => {
  const storedReminders = localStorage.getItem(MEDICATION_REMINDERS_KEY);
  
  if (storedReminders) {
    const reminders = JSON.parse(storedReminders) as Record<string, number>;
    
    // Clear all timeout IDs
    Object.values(reminders).forEach(timeoutId => {
      window.clearTimeout(timeoutId);
    });
    
    // Clear from local storage
    localStorage.removeItem(MEDICATION_REMINDERS_KEY);
  }
};

// Update active reminders when medications change
export const updateActiveReminders = (medications: Medication[]): void => {
  if (isNotificationsSupported() && Notification?.permission === "granted") {
    setupMedicationReminders(medications);
  }
};

// Initialize medication reminders on page load
export const initializeMedicationReminders = async (): Promise<void> => {
  const permissionGranted = await requestNotificationPermission();
  
  if (permissionGranted) {
    const medications = getMedications();
    setupMedicationReminders(medications);
  }
};

// Check if a medication is active today
export const isMedicationActiveToday = (medication: Medication): boolean => {
  const today = new Date();
  const startDate = new Date(medication.startDate);
  const endDate = medication.endDate ? new Date(medication.endDate) : new Date(2099, 11, 31);
  
  return isWithinInterval(today, { start: startDate, end: endDate });
};