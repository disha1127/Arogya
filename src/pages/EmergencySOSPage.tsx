import EmergencySOS from '@/components/EmergencySOS';
import { useTranslation } from '@/lib/i18n';
import { Phone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function EmergencySOSPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4 md:p-6 relative pb-24">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-500 via-primary to-red-600 p-4 md:p-6 rounded-xl mb-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <AlertTriangle className="mr-2 h-8 w-8" />
            Emergency SOS
          </h1>
          <p className="text-white/90 max-w-2xl">
            In case of emergency, use this feature to quickly share your current location with emergency services.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 order-2 md:order-1"
        >
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              Emergency Information
            </h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-700 mb-1">Emergency Contacts</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Ambulance:</span> 
                    <a href="tel:108" className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1">108</a>
                  </li>
                  <li className="flex justify-between">
                    <span>Police:</span> 
                    <a href="tel:100" className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1">100</a>
                  </li>
                  <li className="flex justify-between">
                    <span>Fire:</span> 
                    <a href="tel:101" className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1">101</a>
                  </li>
                  <li className="flex justify-between">
                    <span>National Emergency:</span> 
                    <a href="tel:112" className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1">112</a>
                  </li>
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-700 mb-1">Quick Tips</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Stay calm and provide clear information</li>
                  <li>• Share your exact location from the SOS alert</li>
                  <li>• Describe your emergency situation briefly</li>
                  <li>• Follow instructions from emergency operators</li>
                  <li>• Stay on the line until help arrives</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                  size="lg"
                  onClick={() => window.location.href = 'tel:112'}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call National Emergency (112)
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 order-1 md:order-2"
        >
          <EmergencySOS />
          
          <div className="mt-6 bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h3 className="font-medium text-amber-700 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Important Note
            </h3>
            <p className="text-sm text-amber-800">
              This feature requires location access permission. Your location will only be displayed on your device
              and not sent to any server automatically. You will need to manually share these details with emergency services.
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Emergency Button */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1 
        }}
      >
        <a 
          href="tel:112" 
          className="flex items-center justify-center h-16 w-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
          aria-label="Call Emergency Services"
        >
          <Phone className="h-7 w-7" />
          <span className="animate-ping absolute h-14 w-14 rounded-full bg-red-400 opacity-40"></span>
        </a>
      </motion.div>
    </div>
  );
}