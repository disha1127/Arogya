// Simplified translation utility (after removing i18next dependency)
// This is a stub implementation that returns the key itself
// or a predefined list of translations

// Define default translations for commonly used keys
const translations: Record<string, string> = {
  // Hospital Locator
  hospitalLocator: "Hospital Locator",
  loadingHospitals: "Loading hospitals...",
  tryAgain: "Try Again",
  hospitalDetails: "Hospital Details",
  selectedHospitalDesc: "View details of the selected hospital",
  selectHospitalPrompt: "Select a hospital from the map",
  location: "Location",
  contactInfo: "Contact Information",
  hospitalType: "Hospital Type",
  rating: "Rating",
  ratings: "ratings",
  visitWebsite: "Visit Website",
  selectHospitalFromMap: "Click on a hospital marker on the map to view details",
  
  // Auth related
  welcomeToArogya: "Welcome to AROGYA",
  authDescription: "Your personal health management platform",
  login: "Login",
  register: "Register", 
  username: "Username",
  password: "Password",
  confirmPassword: "Confirm Password",
  fullName: "Full Name",
  email: "Email",
  enterUsername: "Enter your username",
  enterPassword: "Enter your password",
  confirmYourPassword: "Confirm your password",
  enterFullName: "Enter your full name",
  enterEmail: "Enter your email",
  loggingIn: "Logging in...",
  registering: "Registering...",
  noAccount: "Don't have an account?",
  registerNow: "Register Now",
  alreadyHaveAccount: "Already have an account?",
  loginNow: "Login Now",
  
  // Home page features
  yourHealthJourney: "Your Health Journey Starts Here",
  arogyaFeatures: "A comprehensive platform to manage all aspects of your health in one place",
  symptomAnalysis: "Symptom Analysis",
  symptomCheckerDesc: "Analyze your symptoms and get potential health insights",
  healthTracking: "Health Metrics Tracking",
  healthTrackerDesc: "Monitor your vital signs and health metrics over time",
  documentStorage: "Medical Documents",
  documentStorageDesc: "Securely store and manage your medical records",
  
  // Navigation
  home: "Home",
  dashboard: "Dashboard",
  dietPlanner: "Diet Planner",
  healthTracker: "Health Tracker",
  medicationReminders: "Medication Reminders",
  healthDocuments: "Health Documents",
  symptomChecker: "Symptom Checker",
  govSchemes: "Government Schemes",
  logout: "Logout",
  
  // Common actions
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  view: "View",
  add: "Add",
  upload: "Upload",
  download: "Download",
  submit: "Submit",
  search: "Search",
  
  // Diet Planner
  createMealPlan: "Create Meal Plan",
  mealPreferences: "Meal Preferences",
  dietaryRestrictions: "Dietary Restrictions",
  
  // Health Tracker
  addHealthMetric: "Add Health Metric",
  viewHealthHistory: "View Health History",
  
  // Medication Reminders
  addMedication: "Add Medication",
  medicationName: "Medication Name",
  dosage: "Dosage",
  frequency: "Frequency",
  startDate: "Start Date",
  endDate: "End Date",
  reminderTime: "Reminder Time",
  
  // Document Manager
  uploadDocument: "Upload Document",
  documentTitle: "Document Title",
  documentType: "Document Type",
  dateOfDocument: "Date of Document",
  
  // Error messages
  usernameRequired: "Username is required",
  passwordRequired: "Password is required",
  passwordsDoNotMatch: "Passwords do not match",
  emailInvalid: "Please enter a valid email address",
  errorOccurred: "An error occurred"
};

export function useTranslation() {
  // Simple translation function that returns translations from our dictionary
  // or falls back to returning the key itself
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return { t };
}