import { useState } from 'react';
import { HealthCondition } from '@/data/symptomConditions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, HelpCircle, ChevronDown, ChevronUp, ThermometerIcon, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

// Define Symptom interface
interface Symptom {
  id: number;
  name: string;
  urgencyLevel: number;
}

interface ConditionResultProps {
  condition: HealthCondition;
  selectedSymptoms: Symptom[];
  index: number;
}

export function ConditionResult({ condition, selectedSymptoms, index }: ConditionResultProps) {
  const [expanded, setExpanded] = useState(false);

  // Map severity to visual elements
  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'mild':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <Check className="w-4 h-4 mr-1" />,
          label: 'Mild'
        };
      case 'moderate':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <AlertTriangle className="w-4 h-4 mr-1" />,
          label: 'Moderate'
        };
      case 'severe':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertTriangle className="w-4 h-4 mr-1" />,
          label: 'Severe'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <HelpCircle className="w-4 h-4 mr-1" />,
          label: 'Unknown'
        };
    }
  };

  const severityInfo = getSeverityInfo(condition.severity);
  
  // Get matching symptoms
  const matchingSymptoms = selectedSymptoms.filter(symptom => 
    condition.symptoms.includes(symptom.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`overflow-hidden ${expanded ? 'border-primary-200' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-primary-600" />
              <CardTitle className="text-lg">{condition.name}</CardTitle>
            </div>
            <Badge className={`${severityInfo.color} flex items-center`} aria-label={`Severity: ${severityInfo.label}`}>
              {severityInfo.icon}
              {severityInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-slate-600 mb-3">{condition.description}</p>
          
          <div className="mb-3">
            <div className="text-sm font-medium text-slate-700 mb-1 flex items-center">
              <ThermometerIcon className="w-4 h-4 mr-1 text-primary-600" />
              Matching Symptoms ({matchingSymptoms.length}/{condition.symptoms.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {matchingSymptoms.map(symptom => (
                <Badge key={symptom.id} variant="secondary" className="text-xs">
                  {symptom.name}
                </Badge>
              ))}
            </div>
          </div>

          {expanded && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Recommended Action:</h4>
                <p className="text-sm text-slate-600">{condition.recommendedAction}</p>
              </div>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 flex items-center justify-center text-primary-600"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={`condition-details-${condition.id}`}
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}