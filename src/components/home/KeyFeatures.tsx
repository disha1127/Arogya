import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserSearch, PillIcon, Salad, FileText } from "lucide-react";

const KeyFeatures = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <UserSearch className="h-6 w-6" />,
      title: t("featureOneTitle"),
      description: t("featureOneDesc"),
      bg: "bg-primary-100",
      textColor: "text-primary-600",
      stats: "50+ Specialties",
      linkTo: "#",
    },
    {
      icon: <PillIcon className="h-6 w-6" />,
      title: t("featureTwoTitle"),
      description: t("featureTwoDesc"),
      bg: "bg-secondary-100",
      textColor: "text-secondary-600",
      stats: "Smart Reminders",
      linkTo: "/medicationReminders",
    },
    {
      icon: <Salad className="h-6 w-6" />,
      title: t("featureThreeTitle"),
      description: t("featureThreeDesc"),
      bg: "bg-accent-100",
      textColor: "text-accent-600",
      stats: "Custom Plans",
      linkTo: "/dietPlanner",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: t("featureFourTitle"),
      description: t("featureFourDesc"),
      bg: "bg-green-100",
      textColor: "text-green-600",
      stats: "Secure Storage",
      linkTo: "#",
    },
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 font-heading">
          {t("featureTitle")}
        </h2>
        <p className="mt-4 text-xl text-slate-600">
          {t("healthcareTitle")}
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-slate-100">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.bg} ${feature.textColor} rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
              <CardFooter className="px-6 py-3 bg-slate-50 flex justify-between items-center">
                <span className="text-sm text-slate-500">{feature.stats}</span>
                <a href={feature.linkTo} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  {t("viewAll")} →
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default KeyFeatures;
