import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const PopularSearches = () => {
  const { t } = useTranslation();

  const popularSearchTerms = [
    "Fever",
    "COVID-19",
    "Diabetes",
    "Mental Health",
    "Cardiology",
    "Pediatrics",
    "Vaccination",
    "General Physician"
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-medium text-slate-700 mb-4">{t("popularSearches")}</h2>
      <motion.div 
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
      >
        {popularSearchTerms.map((term, index) => (
          <motion.div
            key={term}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Badge 
              className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 cursor-pointer text-sm font-medium"
              variant="outline"
            >
              {term}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularSearches;
