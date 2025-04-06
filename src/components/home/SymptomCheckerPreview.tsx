import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

const SymptomCheckerPreview = () => {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Fever", "Headache", "Cough"]);
  const [searchTerm, setSearchTerm] = useState("");

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:flex">
          <div className="p-8 md:p-12 md:w-1/2">
            <h2 className="text-3xl font-bold text-white font-heading">Quick Symptom Checker</h2>
            <p className="mt-4 text-secondary-100">Not feeling well? Use our symptom checker to help identify potential causes and get recommendations.</p>
            <div className="mt-8 max-w-md">
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/70 border border-secondary-400 focus:ring-white"
                    placeholder="Search symptoms..."
                  />
                  <Search className="absolute right-3 top-3 h-5 w-5 text-white/70" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSymptoms.map((symptom) => (
                    <Badge 
                      key={symptom}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 px-3 py-1.5"
                    >
                      {symptom}
                      <button 
                        type="button" 
                        onClick={() => removeSymptom(symptom)}
                        className="ml-1.5 text-white/70 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Link href="/symptomChecker">
                  <Button 
                    className="mt-6 bg-white text-secondary-700 hover:bg-secondary-50 border-0"
                    size="lg"
                  >
                    Check My Symptoms
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-transparent z-10"></div>
            <div className="h-full w-full bg-secondary-300"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SymptomCheckerPreview;
