import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MapPin, Clock, Share2, Copy, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export default function EmergencySOS() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  const handleSOSClick = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        });
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get location timed out';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  };

  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Load map when location data is available
  useEffect(() => {
    if (locationData && !mapLoaded) {
      // Use iframe to load Google Maps with the location pin
      setMapLoaded(true);
    }
  }, [locationData, mapLoaded]);
  
  // Function to copy location to clipboard
  const copyLocationToClipboard = () => {
    if (!locationData) return;
    
    const locationText = `Emergency Location - Latitude: ${formatCoordinate(locationData.latitude)}, Longitude: ${formatCoordinate(locationData.longitude)}, Time: ${formatTime(locationData.timestamp)}`;
    
    navigator.clipboard.writeText(locationText).then(() => {
      toast({
        title: "Location copied",
        description: "The location has been copied to your clipboard",
      });
    }).catch((error) => {
      console.error('Failed to copy: ', error);
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    });
  };
  
  // Function to share via SMS
  const shareViaSMS = () => {
    if (!locationData) return;
    
    const locationText = `EMERGENCY: My location is - Latitude: ${formatCoordinate(locationData.latitude)}, Longitude: ${formatCoordinate(locationData.longitude)}. Please send help.`;
    
    window.open(`sms:?body=${encodeURIComponent(locationText)}`, '_blank');
  };
  
  // Function to share via WhatsApp
  const shareViaWhatsApp = () => {
    if (!locationData) return;
    
    const locationText = `EMERGENCY: My location is - Latitude: ${formatCoordinate(locationData.latitude)}, Longitude: ${formatCoordinate(locationData.longitude)}. Please send help.`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(locationText)}`, '_blank');
  };
  
  // Function to open Google Maps with the location
  const openInGoogleMaps = () => {
    if (!locationData) return;
    
    window.open(`https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}`, '_blank');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-b from-white to-purple-50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-100 rounded-t-lg border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-gradient bg-gradient-to-r from-red-600 to-primary bg-clip-text text-transparent">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Emergency SOS
          </CardTitle>
          <CardDescription>
            Get your current location in case of emergency
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {!locationData ? (
            <div className="text-center">
              <p className="mb-6 text-muted-foreground">
                Click the SOS button to share your current location with emergency services
              </p>
              <Button 
                onClick={handleSOSClick}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-primary hover:from-red-600 hover:to-primary/90 transition-all shadow-md"
                size="lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Getting Location...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    SEND SOS ALERT
                  </span>
                )}
              </Button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg mb-4">
                <h3 className="text-green-800 font-medium text-lg mb-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  SOS Alert Activated
                </h3>
                <p className="text-green-700 text-sm">
                  Your location has been captured. Share these details with emergency services.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Your Location</h4>
                    <p className="font-mono font-medium">
                      Lat: <span className="text-primary">{formatCoordinate(locationData.latitude)}</span>
                    </p>
                    <p className="font-mono font-medium">
                      Long: <span className="text-primary">{formatCoordinate(locationData.longitude)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Time Captured</h4>
                    <p className="font-medium">{formatTime(locationData.timestamp)}</p>
                  </div>
                </div>
                
                {/* Map view */}
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm h-40 bg-gray-50">
                  <iframe 
                    title="Location Map" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={`https://www.google.com/maps/embed/v1/place?key=&q=${locationData.latitude},${locationData.longitude}&zoom=15`}
                    allowFullScreen
                    className="w-full h-full"
                    onClick={openInGoogleMaps}
                    style={{ cursor: 'pointer' }}
                  ></iframe>
                </div>
                
                {/* Share buttons */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" />
                    Share your location
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={shareViaSMS} 
                      variant="outline" 
                      className="border-primary/20 hover:bg-primary/5 flex gap-1.5"
                      size="sm"
                    >
                      <Phone className="h-4 w-4 text-primary" />
                      Via SMS
                    </Button>
                    
                    <Button 
                      onClick={shareViaWhatsApp} 
                      variant="outline" 
                      className="border-green-300 hover:bg-green-50 text-green-700 flex gap-1.5"
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    
                    <Button 
                      onClick={copyLocationToClipboard} 
                      variant="outline" 
                      className="border-primary/20 hover:bg-primary/5 flex gap-1.5"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 text-primary" />
                      Copy Text
                    </Button>
                    
                    <Button 
                      onClick={openInGoogleMaps} 
                      variant="outline" 
                      className="border-blue-300 hover:bg-blue-50 text-blue-700 flex gap-1.5"
                      size="sm"
                    >
                      <MapPin className="h-4 w-4" />
                      Open Maps
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={() => {
                      setLocationData(null);
                      setMapLoaded(false);
                    }}
                    variant="outline"
                    className="w-full border-primary/20 hover:bg-primary/5"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}