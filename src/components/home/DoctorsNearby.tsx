import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availability: string;
}

const DoctorsNearby = () => {
  const { t } = useTranslation();
  
  const { data: doctors, isLoading, error } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
  });

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">{t("doctorsNearby")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-[220px] animate-pulse">
              <CardContent className="p-5">
                <div className="flex items-start">
                  <div className="h-16 w-16 rounded-full bg-slate-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              </CardContent>
              <CardFooter className="px-5 py-3 bg-slate-50">
                <div className="h-8 bg-slate-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">{t("doctorsNearby")}</h2>
        </div>
        <Card className="p-6 text-center">
          <p className="text-red-500">{t("error")}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {t("tryAgain")}
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">{t("doctorsNearby")}</h2>
        <a href="#" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
          {t("viewAll")} →
        </a>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {doctors?.map((doctor, index) => (
          <motion.div key={doctor.id} variants={item} style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="h-full hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="flex items-start">
                  <div className="h-16 w-16 rounded-full bg-primary-100 mr-4 flex items-center justify-center text-primary-600 font-bold text-xl">
                    {doctor.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{doctor.fullName}</h3>
                    <p className="text-sm text-slate-600">
                      {t("specialistIn")} {doctor.specialization}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-slate-700">{doctor.rating}</span>
                      </div>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-sm text-slate-600">{doctor.experience}+ yrs exp.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Consultation Fee:</span>
                    <span className="font-medium text-slate-800">₹{doctor.consultationFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Available:</span>
                    <span className="font-medium text-green-600">{doctor.availability}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-5 py-3 bg-slate-50 flex justify-center items-center">
                <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Profile
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default DoctorsNearby;
