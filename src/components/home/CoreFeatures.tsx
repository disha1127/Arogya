import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  PillIcon, 
  Salad, 
  FileText, 
  Activity, 
  ArrowRight,
  BarChart2
} from "lucide-react";
import { Link } from "wouter";

const CoreFeatures = () => {

  const features = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Symptom Checker",
      description: "Check your symptoms and get potential conditions with our AI-powered tool",
      bg: "bg-blue-100",
      textColor: "text-blue-600",
      linkTo: "/symptomChecker",
      buttonText: "Check Symptoms"
    },
    {
      icon: <PillIcon className="h-8 w-8" />,
      title: "Medication Reminders",
      description: "Track, manage, and get reminders for all your medications",
      bg: "bg-indigo-100",
      textColor: "text-indigo-600",
      linkTo: "/medicationReminders",
      buttonText: "Manage Medications"
    },
    {
      icon: <Salad className="h-8 w-8" />,
      title: "Diet Planner",
      description: "Create personalized diet plans based on your health conditions and preferences",
      bg: "bg-green-100",
      textColor: "text-green-600",
      linkTo: "/dietPlanner",
      buttonText: "Plan Your Diet"
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Health Tracker",
      description: "Monitor your vitals like blood pressure, sugar levels, and weight",
      bg: "bg-orange-100",
      textColor: "text-orange-600",
      linkTo: "/healthTracker",
      buttonText: "Track Health"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Medical Documents",
      description: "Securely upload, store, and manage your health records and documents",
      bg: "bg-purple-100",
      textColor: "text-purple-600",
      linkTo: "/medicalDocuments",
      buttonText: "Manage Documents"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Take Control of Your Health
        </h2>
        <p className="max-w-3xl mx-auto text-xl text-slate-600">
          Access all features of AROGYA from one place. Manage your health journey with our comprehensive tools.
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border border-slate-200 overflow-hidden">
              <CardHeader className="pb-2">
                <div className={`w-16 h-16 ${feature.bg} ${feature.textColor} rounded-2xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                <CardDescription className="text-slate-600 mt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Link href={feature.linkTo}>
                    <Button className="w-full gap-2 mt-2">
                      {feature.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CoreFeatures;