import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfidenceMeterProps {
  score: number; // 0-100 percentage
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceMeter({ score, size = 'md' }: ConfidenceMeterProps) {
  // Calculate the confidence level
  let confidenceLevel: 'low' | 'medium' | 'high';
  if (score < 40) {
    confidenceLevel = 'low';
  } else if (score < 70) {
    confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'high';
  }

  // Get the color based on confidence level
  const getColor = () => {
    switch (confidenceLevel) {
      case 'low':
        return '#f87171'; // Red-400
      case 'medium':
        return '#facc15'; // Yellow-400
      case 'high':
        return '#4ade80'; // Green-400
      default:
        return '#a3a3a3'; // Gray-400
    }
  };

  // Get text based on size
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  const barHeight = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2' : 'h-3';
  const sizeClass = size === 'sm' ? 'max-w-[100px]' : size === 'md' ? 'max-w-[150px]' : 'max-w-[200px]';

  return (
    <div className={`flex flex-col ${sizeClass} w-full`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`font-medium ${textSize} text-slate-700 flex items-center gap-1`}>
          Confidence
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Info className="h-3 w-3 text-slate-400" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  This indicates how closely your symptoms match the condition. 
                  Higher confidence means a stronger match based on the symptoms you selected.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={`${textSize} text-slate-500`}>{Math.round(score)}%</span>
      </div>
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${barHeight}`}>
        <motion.div 
          className="h-full rounded-full"
          style={{ backgroundColor: getColor() }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}