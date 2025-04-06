import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard"; 
import SymptomChecker from "./pages/SymptomChecker";
import DietPlanner from "./pages/DietPlanner";
import MedicationReminders from "./pages/MedicationReminders";
import HospitalLocator from "./pages/HospitalLocator";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import HealthArticles from "./pages/HealthArticles";
import HealthTracker from "./pages/HealthTracker";
import MedicalDocuments from "./pages/MedicalDocuments";
import EmergencySOSPage from "./pages/EmergencySOSPage";
import AuthPage from "./pages/auth-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/symptomChecker" component={SymptomChecker} />
        <ProtectedRoute path="/dietPlanner" component={DietPlanner} />
        <ProtectedRoute path="/healthTracker" component={HealthTracker} />
        <ProtectedRoute path="/medicationReminders" component={MedicationReminders} />
        <ProtectedRoute path="/hospitalLocator" component={HospitalLocator} />
        <ProtectedRoute path="/governmentSchemes" component={GovernmentSchemes} />
        <ProtectedRoute path="/healthArticles" component={HealthArticles} />
        <ProtectedRoute path="/medicalDocuments" component={MedicalDocuments} />
        <Route path="/emergency-sos" component={EmergencySOSPage} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <motion.main
            className="flex-grow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Router />
          </motion.main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
