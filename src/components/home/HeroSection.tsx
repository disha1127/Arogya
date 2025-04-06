import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Stethoscope, BarChart2, FileText, PillIcon, Salad } from "lucide-react";
import { Link } from "wouter";

const HeroSection = () => {

  return (
    <section className="relative bg-gradient-to-br from-primary-500 to-primary-800 overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute right-0 bottom-0 text-white/10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" preserveAspectRatio="none">
          <path fill="currentColor" d="M1280 0H0v720h1280V0z M769.5 129.5c139.54 0 252.5 111.78 252.5 249.22C1022 516.28 909.04 629 769.5 629c-139.6 0-252.5-112.72-252.5-250.28 0-137.44 112.9-249.22 252.5-249.22z M222 512c123.71 0 224 68.09 224 152 0 83.94-100.29 152-224 152-123.75 0-224-68.06-224-152 0-83.91 100.25-152 224-152z"/>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col max-w-lg"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading tracking-tight">
              AROGYA Health Platform
            </h1>
            <p className="mt-4 text-xl text-primary-100">
              Your comprehensive healthcare companion for symptom checking, medication management, diet planning, and more.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Link href="/symptomChecker">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full bg-white text-primary-700 hover:bg-primary-50 shadow-md"
                  aria-label="Check Symptoms"
                >
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Check Symptoms
                </Button>
              </Link>
              <Link href="/medicationReminders">
                <Button 
                  size="lg"
                  className="w-full bg-primary-700 text-white hover:bg-primary-600 shadow-md"
                  aria-label="Manage Medications"
                >
                  <PillIcon className="mr-2 h-5 w-5" />
                  Medications
                </Button>
              </Link>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Link href="/dietPlanner">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full bg-primary-600/40 text-white border-white/30 hover:bg-primary-700/60 shadow-md"
                  aria-label="Plan Diet"
                >
                  <Salad className="mr-2 h-5 w-5" />
                  Diet Planner
                </Button>
              </Link>
              <Link href="/healthTracker">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full bg-primary-600/40 text-white border-white/30 hover:bg-primary-700/60 shadow-md"
                  aria-label="Track Health"
                >
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Health Tracker
                </Button>
              </Link>
            </div>
            
            <div className="mt-4">
              <Link href="/medicalDocuments">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full bg-primary-600/20 text-white border-white/20 hover:bg-primary-700/40 shadow-md"
                  aria-label="Manage Documents"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Medical Documents
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-6 md:mt-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-square w-full max-w-md">
              {/* Base layers for 3D effect */}
              <div className="absolute inset-0 h-full w-full bg-primary-300 rounded-xl shadow-2xl rotate-3" style={{ zIndex: 0 }}></div>
              <div className="absolute inset-0 h-full w-full bg-primary-200 rounded-xl shadow-2xl -rotate-3" style={{ zIndex: 1 }}></div>
              
              {/* Main image container */}
              <div className="absolute inset-0 h-full w-full bg-white rounded-xl shadow-2xl overflow-hidden" style={{ zIndex: 2 }}>
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                  </defs>
                  
                  {/* Background */}
                  <rect width="400" height="400" fill="#f8fafc" />
                  
                  {/* Medical symbols and elements */}
                  <circle cx="200" cy="200" r="150" fill="url(#heroGrad)" fillOpacity="0.1" />
                  
                  {/* Doctor silhouette */}
                  <path d="M150,100 Q200,50 250,100 L250,250 Q200,300 150,250 Z" fill="#4F46E5" fillOpacity="0.2" />
                  <circle cx="200" cy="90" r="40" fill="#4F46E5" fillOpacity="0.3" />
                  
                  {/* Medical cross symbol */}
                  <rect x="180" y="160" width="40" height="120" rx="5" fill="#4F46E5" />
                  <rect x="140" y="200" width="120" height="40" rx="5" fill="#4F46E5" />
                  
                  {/* Heartbeat line */}
                  <polyline points="20,320 60,320 80,280 100,360 120,300 140,320 380,320" 
                    fill="none" stroke="#0EA5E9" strokeWidth="4" />
                </svg>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg" style={{ zIndex: 3 }}>
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
