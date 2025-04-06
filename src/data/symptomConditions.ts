// Define interfaces for health conditions
export interface HealthCondition {
  id: number;
  name: string;
  description: string;
  symptoms: number[];
  severity: 'mild' | 'moderate' | 'severe';
  recommendedAction: string;
}

// Define symptom categories for organization in the UI
export interface SymptomCategory {
  id: string;
  name: string;
  symptoms: number[];
}

// Predefined conditions with associated symptoms
export const healthConditions: HealthCondition[] = [
  {
    id: 1,
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract, usually harmless and self-limiting.',
    symptoms: [1, 3, 2], // Fever, Cough, Headache
    severity: 'mild',
    recommendedAction: 'Rest, stay hydrated, take over-the-counter pain relievers if needed. See a doctor if symptoms persist more than 7 days.'
  },
  {
    id: 2,
    name: 'Influenza (Flu)',
    description: 'A viral infection that attacks your respiratory system. More severe than the common cold.',
    symptoms: [1, 3, 2, 6, 7], // Fever, Cough, Headache, Fatigue, Body aches
    severity: 'moderate',
    recommendedAction: 'Rest, stay hydrated, take fever reducers. Contact your doctor if symptoms are severe or if you are in a high-risk group.'
  },
  {
    id: 3,
    name: 'COVID-19',
    description: 'A respiratory disease caused by the SARS-CoV-2 virus with varying symptoms and severity.',
    symptoms: [1, 3, 4, 6, 7, 10], // Fever, Cough, Breathing Difficulty, Fatigue, Body aches, Loss of taste or smell
    severity: 'moderate',
    recommendedAction: 'Self-isolate, get tested, monitor symptoms. Seek immediate medical attention if you have trouble breathing or persistent chest pain.'
  },
  {
    id: 4,
    name: 'Pneumonia',
    description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid.',
    symptoms: [1, 3, 4, 6, 11], // Fever, Cough, Breathing Difficulty, Fatigue, Chest pain
    severity: 'severe',
    recommendedAction: 'Seek medical attention immediately. Pneumonia can be life-threatening and requires proper medical evaluation and treatment.'
  },
  {
    id: 5,
    name: 'Migraine',
    description: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.',
    symptoms: [2, 5, 8, 9], // Headache, Nausea, Light sensitivity, Dizziness
    severity: 'moderate',
    recommendedAction: 'Rest in a quiet, dark room. Take over-the-counter pain relievers. See a doctor if migraines are frequent or severe.'
  },
  {
    id: 6,
    name: 'Food Poisoning',
    description: 'Illness caused by consuming contaminated food or drink, often resulting in digestive issues.',
    symptoms: [5, 6, 12, 13], // Nausea, Fatigue, Vomiting, Diarrhea
    severity: 'moderate',
    recommendedAction: 'Stay hydrated, rest, avoid solid foods until symptoms improve. Seek medical attention if symptoms are severe or persist more than 2 days.'
  },
  {
    id: 7,
    name: 'Anxiety',
    description: 'A feeling of worry, nervousness, or unease about something with an uncertain outcome.',
    symptoms: [4, 6, 9, 14], // Breathing Difficulty, Fatigue, Dizziness, Rapid heartbeat
    severity: 'mild',
    recommendedAction: 'Practice deep breathing, meditation, or other relaxation techniques. Consider consulting a mental health professional if symptoms interfere with daily life.'
  },
  {
    id: 8,
    name: 'Asthma',
    description: 'A condition that affects the airways in the lungs, causing them to narrow and swell, producing extra mucus.',
    symptoms: [3, 4, 15], // Cough, Breathing Difficulty, Wheezing
    severity: 'moderate',
    recommendedAction: 'Use prescribed inhalers as directed. Seek emergency care if symptoms do not improve with medication.'
  }
];

// Categorized symptoms for UI organization
export const symptomCategories: SymptomCategory[] = [
  {
    id: 'general',
    name: 'General',
    symptoms: [1, 6, 7] // Fever, Fatigue, Body aches
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    symptoms: [3, 4, 11, 15] // Cough, Breathing Difficulty, Chest pain, Wheezing
  },
  {
    id: 'digestive',
    name: 'Digestive',
    symptoms: [5, 12, 13] // Nausea, Vomiting, Diarrhea
  },
  {
    id: 'neurological',
    name: 'Neurological',
    symptoms: [2, 8, 9, 10] // Headache, Light sensitivity, Dizziness, Loss of taste or smell
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    symptoms: [14] // Rapid heartbeat
  }
];

// Find matching conditions based on selected symptom IDs
export function findMatchingConditions(
  selectedSymptomIds: number[], 
  userAge?: number, 
  gender?: string
): HealthCondition[] {
  // Calculate a match score for each condition based on symptoms overlap
  const conditionsWithScores = healthConditions.map(condition => {
    // Calculate what percentage of the condition's symptoms are matched by the user's selection
    const matchedSymptoms = condition.symptoms.filter(id => selectedSymptomIds.includes(id));
    const matchPercentage = (matchedSymptoms.length / condition.symptoms.length) * 100;
    
    // Calculate what percentage of the user's selected symptoms match this condition
    const userSymptomMatchPercentage = (matchedSymptoms.length / selectedSymptomIds.length) * 100;
    
    // Combined score weighted toward condition coverage but also considering user symptom coverage
    const combinedScore = (matchPercentage * 0.7) + (userSymptomMatchPercentage * 0.3);
    
    return {
      condition,
      score: combinedScore,
      matchedSymptomCount: matchedSymptoms.length
    };
  });

  // Filter conditions that have at least 40% match or match at least 2 symptoms
  return conditionsWithScores
    .filter(item => item.score >= 40 || item.matchedSymptomCount >= 2)
    .sort((a, b) => b.score - a.score)
    .map(item => item.condition)
    .slice(0, 5); // Return top 5 matches maximum
}

// Additional symptoms - these would ideally come from the API, but we're adding them here for a complete experience
export const additionalSymptoms = [
  { id: 5, name: "Nausea", urgencyLevel: 2 },
  { id: 6, name: "Fatigue", urgencyLevel: 1 },
  { id: 7, name: "Body aches", urgencyLevel: 1 },
  { id: 8, name: "Light sensitivity", urgencyLevel: 2 },
  { id: 9, name: "Dizziness", urgencyLevel: 2 },
  { id: 10, name: "Loss of taste or smell", urgencyLevel: 3 },
  { id: 11, name: "Chest pain", urgencyLevel: 4 },
  { id: 12, name: "Vomiting", urgencyLevel: 3 },
  { id: 13, name: "Diarrhea", urgencyLevel: 2 },
  { id: 14, name: "Rapid heartbeat", urgencyLevel: 3 },
  { id: 15, name: "Wheezing", urgencyLevel: 3 },
  { id: 16, name: "Sore throat", urgencyLevel: 1 },
  { id: 17, name: "Runny nose", urgencyLevel: 1 },
  { id: 18, name: "Joint pain", urgencyLevel: 2 },
  { id: 19, name: "Muscle pain", urgencyLevel: 2 },
  { id: 20, name: "Rash", urgencyLevel: 2 },
  { id: 21, name: "Swelling", urgencyLevel: 2 },
  { id: 22, name: "Confusion", urgencyLevel: 4 },
  { id: 23, name: "Abdominal pain", urgencyLevel: 3 }
];