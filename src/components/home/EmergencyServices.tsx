import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Hospital, Cross } from "lucide-react";

const EmergencyServices = () => {

  const emergencyServices = [
    {
      icon: <Phone className="text-2xl text-white" />,
      title: "Emergency Helpline",
      description: "Call 108 for immediate medical assistance"
    },
    {
      icon: <Hospital className="text-2xl text-white" />,
      title: "Nearest Hospitals",
      description: "Find emergency care facilities nearby"
    },
    {
      icon: <Cross className="text-2xl text-white" />,
      title: "First Aid Guidelines",
      description: "Quick reference for emergency situations"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="bg-red-600 rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 sm:p-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading">Medical Emergency</h2>
              <p className="mt-2 text-red-100">Contact emergency services immediately in case of medical emergencies</p>
            </div>
            <div className="mt-5 sm:mt-0">
              <Button
                size="lg"
                className="bg-white text-red-700 hover:bg-red-50 border-0"
              >
                Call Emergency
              </Button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyServices.map((service, index) => (
              <motion.div 
                key={index} 
                className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">{service.title}</h3>
                    <p className="text-red-100">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EmergencyServices;
