import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Brain, Heart } from "lucide-react";
import { Link } from "wouter";

interface HealthScheme {
  id: number;
  name: string;
  description: string;
  status: string;
  coverageAmount?: string;
}

const GovernmentSchemes = () => {
  const { data: schemes, isLoading, error } = useQuery<HealthScheme[]>({
    queryKey: ['/api/health-schemes'],
  });

  const getSchemeIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Building2 className="h-5 w-5" />;
      case 1:
        return <Brain className="h-5 w-5" />;
      case 2:
        return <Heart className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getSchemeColor = (index: number) => {
    switch (index % 3) {
      case 0:
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          button: "bg-blue-50 hover:bg-blue-100 text-blue-600"
        };
      case 1:
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-600",
          button: "bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
        };
      case 2:
        return {
          bg: "bg-violet-100",
          text: "text-violet-600",
          button: "bg-violet-50 hover:bg-violet-100 text-violet-600"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          button: "bg-gray-50 hover:bg-gray-100 text-gray-600"
        };
    }
  };

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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Government Health Schemes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="w-full animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Government Health Schemes</h2>
        </div>
        <Card className="p-6 text-center">
          <p className="text-red-500">Error loading schemes</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </section>
    );
  }

  // Limit to 4 schemes on the homepage
  const displayedSchemes = schemes?.slice(0, 4) || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Government Health Schemes</h2>
        <Link href="/governmentSchemes" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {displayedSchemes.map((scheme, index) => {
          const colorScheme = getSchemeColor(index);
          
          return (
            <motion.div key={scheme.id} variants={item}>
              <Card className="h-full hover:shadow-md transition-shadow duration-300 border-0">
                <CardContent className="p-5">
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 ${colorScheme.bg} ${colorScheme.text} rounded-full flex items-center justify-center mr-2`}>
                      {getSchemeIcon(index)}
                    </div>
                    <h3 className="font-bold text-slate-900">{scheme.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{scheme.description}</p>
                  <Link href={`/governmentSchemes/${scheme.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`w-full font-medium ${colorScheme.button}`}
                    >
                      Take Me There
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default GovernmentSchemes;
