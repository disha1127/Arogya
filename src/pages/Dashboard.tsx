import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Droplet, 
  FileText, 
  Heart, 
  HeartPulse, 
  LineChart, 
  Link, 
  Pill, 
  Scale, 
  Thermometer, 
  Utensils, 
  Users 
} from "lucide-react";
import { Link as WouterLink } from "wouter";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Sample health metrics data
const healthData = [
  { date: 'Apr 1', weight: 75, bp: 120, sugar: 100, pulse: 72 },
  { date: 'Apr 8', weight: 74.5, bp: 118, sugar: 95, pulse: 70 },
  { date: 'Apr 15', weight: 74, bp: 122, sugar: 105, pulse: 74 },
  { date: 'Apr 22', weight: 73.5, bp: 115, sugar: 90, pulse: 68 },
  { date: 'Apr 29', weight: 73, bp: 118, sugar: 98, pulse: 72 },
  { date: 'May 5', weight: 72.8, bp: 120, sugar: 92, pulse: 70 },
  { date: 'May 12', weight: 72.5, bp: 117, sugar: 88, pulse: 68 },
];

// Function to get status label
const getStatusLabel = (metric: string, value: number) => {
  switch (metric) {
    case 'bp':
      if (value < 90) return { label: 'Low', color: 'bg-blue-100 text-blue-800' };
      if (value < 120) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
      if (value < 130) return { label: 'Elevated', color: 'bg-yellow-100 text-yellow-800' };
      if (value < 140) return { label: 'High', color: 'bg-orange-100 text-orange-800' };
      return { label: 'Very High', color: 'bg-red-100 text-red-800' };
    case 'sugar':
      if (value < 70) return { label: 'Low', color: 'bg-blue-100 text-blue-800' };
      if (value < 100) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
      if (value < 126) return { label: 'Elevated', color: 'bg-yellow-100 text-yellow-800' };
      return { label: 'High', color: 'bg-red-100 text-red-800' };
    case 'pulse':
      if (value < 60) return { label: 'Low', color: 'bg-blue-100 text-blue-800' };
      if (value < 100) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
      return { label: 'High', color: 'bg-orange-100 text-orange-800' };
    default:
      return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  }
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeHealthMetric, setActiveHealthMetric] = useState<string>('weight');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Get most recent metrics
  const latestMetrics = healthData[healthData.length - 1];

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-md text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-primary-600">
            {activeHealthMetric === 'weight' && `Weight: ${payload[0].value} kg`}
            {activeHealthMetric === 'bp' && `Blood Pressure: ${payload[0].value} mmHg`}
            {activeHealthMetric === 'sugar' && `Blood Sugar: ${payload[0].value} mg/dL`}
            {activeHealthMetric === 'pulse' && `Pulse Rate: ${payload[0].value} bpm`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("dashboard")}</h1>
        <p className="text-slate-600">Welcome to your personalized health dashboard.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Main Dashboard Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Health Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary-500" />
                  Health Summary
                </CardTitle>
                <CardDescription>Your weekly health overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-primary-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-primary-700">Appointments</p>
                    <p className="text-2xl font-bold text-primary-800">2</p>
                    <p className="text-xs text-primary-600">Upcoming this week</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-green-700">Medications</p>
                    <p className="text-2xl font-bold text-green-800">4</p>
                    <p className="text-xs text-green-600">Active prescriptions</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-blue-700">Diet Plan</p>
                    <p className="text-2xl font-bold text-blue-800">6</p>
                    <p className="text-xs text-blue-600">Days completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Metrics Overview */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-primary-500" />
                    Health Tracker
                  </CardTitle>
                  <CardDescription>Monitor your key health metrics</CardDescription>
                </div>
                <WouterLink href="/healthTracker">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </WouterLink>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={activeHealthMetric === 'weight' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveHealthMetric('weight')}
                    className="gap-1"
                  >
                    <Scale className="h-4 w-4" />
                    Weight
                  </Button>
                  <Button 
                    variant={activeHealthMetric === 'bp' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveHealthMetric('bp')}
                    className="gap-1"
                  >
                    <Activity className="h-4 w-4" />
                    BP
                  </Button>
                  <Button 
                    variant={activeHealthMetric === 'sugar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveHealthMetric('sugar')}
                    className="gap-1"
                  >
                    <Droplet className="h-4 w-4" />
                    Sugar
                  </Button>
                  <Button 
                    variant={activeHealthMetric === 'pulse' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveHealthMetric('pulse')}
                    className="gap-1"
                  >
                    <HeartPulse className="h-4 w-4" />
                    Pulse
                  </Button>
                </div>
                
                {/* Chart Area */}
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={healthData}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis 
                        domain={['dataMin - 5', 'dataMax + 5']} 
                        tick={{ fontSize: 12 }}
                        width={30}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey={activeHealthMetric} 
                        stroke="#7C3AED" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Latest Readings */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Scale className="h-3 w-3 text-slate-500 mr-1" />
                      <p className="text-xs text-slate-500">Weight</p>
                    </div>
                    <p className="font-medium">{latestMetrics.weight} kg</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Activity className="h-3 w-3 text-slate-500 mr-1" />
                      <p className="text-xs text-slate-500">BP</p>
                    </div>
                    <p className="font-medium">{latestMetrics.bp}</p>
                    <Badge variant="outline" className={`text-[10px] ${getStatusLabel('bp', latestMetrics.bp).color}`}>
                      {getStatusLabel('bp', latestMetrics.bp).label}
                    </Badge>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Droplet className="h-3 w-3 text-slate-500 mr-1" />
                      <p className="text-xs text-slate-500">Sugar</p>
                    </div>
                    <p className="font-medium">{latestMetrics.sugar}</p>
                    <Badge variant="outline" className={`text-[10px] ${getStatusLabel('sugar', latestMetrics.sugar).color}`}>
                      {getStatusLabel('sugar', latestMetrics.sugar).label}
                    </Badge>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="h-3 w-3 text-slate-500 mr-1" />
                      <p className="text-xs text-slate-500">Pulse</p>
                    </div>
                    <p className="font-medium">{latestMetrics.pulse}</p>
                    <Badge variant="outline" className={`text-[10px] ${getStatusLabel('pulse', latestMetrics.pulse).color}`}>
                      {getStatusLabel('pulse', latestMetrics.pulse).label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary-500" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your health activities for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                  <div className="bg-primary-100 rounded-full p-2 mr-4">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Morning Medication</h4>
                      <span className="text-sm text-slate-500">8:00 AM</span>
                    </div>
                    <p className="text-sm text-slate-600">Thyroid medication (Levothyroxine)</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                  <div className="bg-green-100 rounded-full p-2 mr-4">
                    <Utensils className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Lunch Meal Plan</h4>
                      <span className="text-sm text-slate-500">1:00 PM</span>
                    </div>
                    <p className="text-sm text-slate-600">Brown rice, dal, mixed vegetables</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Doctor Appointment</h4>
                      <span className="text-sm text-slate-500">4:30 PM</span>
                    </div>
                    <p className="text-sm text-slate-600">Dr. Sharma - General check-up</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <WouterLink href="/medicationReminders">
                  <Button variant="outline" className="w-full justify-start">
                    <Pill className="mr-2 h-4 w-4" />
                    Medication Reminder
                  </Button>
                </WouterLink>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
                <WouterLink href="/healthTracker">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Health Tracker
                  </Button>
                </WouterLink>
                <WouterLink href="/dietPlanner">
                  <Button variant="outline" className="w-full justify-start">
                    <Utensils className="mr-2 h-4 w-4" />
                    Diet Plan
                  </Button>
                </WouterLink>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Articles */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Health Articles</CardTitle>
                <CardDescription>Recommended for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-2">
                  <h4 className="font-medium text-sm">Understanding Diabetes Management</h4>
                  <p className="text-xs text-slate-500 mt-1">How diet and exercise can help control blood sugar levels</p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="font-medium text-sm">Monsoon Health Tips</h4>
                  <p className="text-xs text-slate-500 mt-1">Stay healthy during the rainy season with these precautions</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Mental Wellness Practices</h4>
                  <p className="text-xs text-slate-500 mt-1">Simple daily habits for better mental health</p>
                </div>
                <WouterLink href="/healthArticles">
                  <Button variant="link" className="w-full justify-center text-primary-600 p-0 h-auto">
                    View all articles
                  </Button>
                </WouterLink>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}