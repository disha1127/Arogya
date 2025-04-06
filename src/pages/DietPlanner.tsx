import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Apple, ArrowRight, Calendar, Clock, Download, RefreshCw, User, Utensils, AlertCircle, Check, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Interface for user preferences
interface UserPreferences {
  age: number;
  gender: string;
  height: number;
  weight: number;
  healthConditions: string[];
  allergies: string[];
  fitnessGoal: string;
  dietType: string;
  cuisineRegion: string;
  mealFrequency: number;
  activityLevel: string;
  foodPreferences: string;
  avoidFoods: string;
}

// Interface for a meal
interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  preparation: string;
  imageUrl?: string;
  tags: string[];
}

// Interface for a daily plan
interface DailyPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Interface for a complete diet plan
interface DietPlan {
  id: string;
  name: string;
  description: string;
  forUser: UserPreferences;
  days: DailyPlan[];
  tips: string[];
  warnings: string[];
}

// Original DietPlan interface from API
interface APIDietPlan {
  id: number;
  name: string;
  description: string;
  forConditions: string[];
}

// Validation schema for user preferences form
const userPreferencesSchema = z.object({
  age: z.coerce.number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  gender: z.string().min(1, "Please select your gender"),
  height: z.coerce.number()
    .min(50, "Height must be at least 50 cm")
    .max(250, "Height must be less than 250 cm"),
  weight: z.coerce.number()
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight must be less than 300 kg"),
  healthConditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  fitnessGoal: z.string().min(1, "Please select a fitness goal"),
  dietType: z.string().min(1, "Please select a diet type"),
  cuisineRegion: z.string().min(1, "Please select a cuisine region"),
  mealFrequency: z.coerce.number()
    .min(2, "You need at least 2 meals per day")
    .max(6, "Maximum 6 meals per day"),
  activityLevel: z.string().min(1, "Please select your activity level"),
  foodPreferences: z.string().optional(),
  avoidFoods: z.string().optional(),
});

// Define health conditions options
const healthConditionOptions = [
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension (High BP)" },
  { value: "pcos", label: "PCOS" },
  { value: "thyroid", label: "Thyroid Disorder" },
  { value: "heartDisease", label: "Heart Disease" },
  { value: "kidneyDisease", label: "Kidney Disease" },
  { value: "cholesterol", label: "High Cholesterol" },
  { value: "ibs", label: "Irritable Bowel Syndrome" },
  { value: "gout", label: "Gout" },
  { value: "arthritis", label: "Arthritis" },
];

// Define allergy options
const allergyOptions = [
  { value: "gluten", label: "Gluten" },
  { value: "lactose", label: "Lactose/Dairy" },
  { value: "nuts", label: "Nuts" },
  { value: "soy", label: "Soy" },
  { value: "eggs", label: "Eggs" },
  { value: "shellfish", label: "Shellfish" },
  { value: "fish", label: "Fish" },
  { value: "wheat", label: "Wheat" },
];

// Define fitness goal options
const fitnessGoalOptions = [
  { value: "weightLoss", label: "Weight Loss" },
  { value: "weightGain", label: "Weight Gain" },
  { value: "muscleBuild", label: "Muscle Building" },
  { value: "maintenance", label: "Maintain Weight" },
  { value: "immunity", label: "Boost Immunity" },
  { value: "energy", label: "Increase Energy" },
];

// Define diet type options
const dietTypeOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "nonVegetarian", label: "Non-Vegetarian" },
  { value: "eggetarian", label: "Eggetarian" },
  { value: "jain", label: "Jain" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
];

// Define cuisine region options
const cuisineRegionOptions = [
  { value: "north", label: "North Indian" },
  { value: "south", label: "South Indian" },
  { value: "east", label: "East Indian" },
  { value: "west", label: "West Indian" },
  { value: "northeast", label: "Northeast Indian" },
  { value: "fusion", label: "Pan-Indian Fusion" },
];

// Define activity level options
const activityLevelOptions = [
  { value: "sedentary", label: "Sedentary (Little to no exercise)" },
  { value: "light", label: "Lightly Active (Light exercise 1-3 days/week)" },
  { value: "moderate", label: "Moderately Active (Moderate exercise 3-5 days/week)" },
  { value: "active", label: "Very Active (Hard exercise 6-7 days/week)" },
  { value: "extreme", label: "Extremely Active (Very hard exercise & physical job)" },
];

// Sample diet plans (for demonstration)
const generateSampleDietPlan = (userPreferences: UserPreferences): DietPlan => {
  // This function would be replaced with an actual API call or algorithm
  // that generates a personalized diet plan based on user preferences
  
  // Adjust calorie targets based on user preferences
  let baseCalories = 0;
  
  // Calculate BMR using Harris-Benedict Equation
  if (userPreferences.gender === "male") {
    baseCalories = 88.362 + (13.397 * userPreferences.weight) + (4.799 * userPreferences.height) - (5.677 * userPreferences.age);
  } else {
    baseCalories = 447.593 + (9.247 * userPreferences.weight) + (3.098 * userPreferences.height) - (4.330 * userPreferences.age);
  }
  
  // Adjust for activity level
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9
  };
  
  const activityMultiplier = activityMultipliers[userPreferences.activityLevel] || 1.2;
  let targetCalories = Math.round(baseCalories * activityMultiplier);
  
  // Adjust for fitness goal
  if (userPreferences.fitnessGoal === 'weightLoss') {
    targetCalories -= 500; // Caloric deficit for weight loss
  } else if (userPreferences.fitnessGoal === 'weightGain') {
    targetCalories += 500; // Caloric surplus for weight gain
  } else if (userPreferences.fitnessGoal === 'muscleBuild') {
    targetCalories += 300; // Slight surplus for muscle building
  }
  
  // Generate meal plans based on diet type and region
  const mealData = getMealDataForUserPreferences(userPreferences, targetCalories);
  
  // Generate a 7-day meal plan
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyPlans: DailyPlan[] = days.map((day, index) => {
    // Rotate through meal patterns for variety
    const dayOffset = index % mealData.length;
    const dayMeals = mealData[dayOffset];
    
    // Calculate daily totals
    const totalCalories = dayMeals.breakfast.calories + dayMeals.lunch.calories + 
                          dayMeals.dinner.calories + dayMeals.snacks.reduce((sum, snack) => sum + snack.calories, 0);
    
    const totalProtein = dayMeals.breakfast.protein + dayMeals.lunch.protein + 
                         dayMeals.dinner.protein + dayMeals.snacks.reduce((sum, snack) => sum + snack.protein, 0);
    
    const totalCarbs = dayMeals.breakfast.carbs + dayMeals.lunch.carbs + 
                      dayMeals.dinner.carbs + dayMeals.snacks.reduce((sum, snack) => sum + snack.carbs, 0);
    
    const totalFat = dayMeals.breakfast.fat + dayMeals.lunch.fat + 
                    dayMeals.dinner.fat + dayMeals.snacks.reduce((sum, snack) => sum + snack.fat, 0);
    
    return {
      day,
      breakfast: dayMeals.breakfast,
      lunch: dayMeals.lunch,
      dinner: dayMeals.dinner,
      snacks: dayMeals.snacks,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    };
  });
  
  // Generate diet-specific tips
  const tips = generateTipsForUserPreferences(userPreferences);
  
  // Generate warnings based on health conditions and allergies
  const warnings = generateWarningsForUserPreferences(userPreferences);
  
  return {
    id: 'plan-' + Date.now(),
    name: `Personalized ${userPreferences.dietType.charAt(0).toUpperCase() + userPreferences.dietType.slice(1)} Diet Plan`,
    description: `A customized ${userPreferences.cuisineRegion} cuisine-based meal plan designed for your ${userPreferences.fitnessGoal} goal, taking into account your health conditions and preferences.`,
    forUser: userPreferences,
    days: dailyPlans,
    tips,
    warnings
  };
};

// Helper function to generate meal data based on user preferences
const getMealDataForUserPreferences = (preferences: UserPreferences, targetCalories: number): Array<{
  breakfast: Meal,
  lunch: Meal,
  dinner: Meal,
  snacks: Meal[]
}> => {
  // This would be replaced with an actual implementation that 
  // returns meals based on the user's preferences
  
  // Distribute calories across meals
  const breakfastPct = 0.25;  // 25% of daily calories
  const lunchPct = 0.35;      // 35% of daily calories
  const dinnerPct = 0.30;     // 30% of daily calories
  const snacksPct = 0.10;     // 10% of daily calories
  
  const breakfastCal = Math.round(targetCalories * breakfastPct);
  const lunchCal = Math.round(targetCalories * lunchPct);
  const dinnerCal = Math.round(targetCalories * dinnerPct);
  const snacksCal = Math.round(targetCalories * snacksPct);
  
  // Sample meal data based on region and diet type
  const regionBasedMeals: Record<string, any> = {
    north: {
      vegetarian: [
        {
          breakfast: {
            name: "Stuffed Paratha with Curd",
            description: "Whole wheat parathas stuffed with spiced potato filling, served with fresh yogurt",
            calories: breakfastCal,
            protein: Math.round(breakfastCal * 0.15 / 4), // 15% protein, 4 cal per gram
            carbs: Math.round(breakfastCal * 0.60 / 4),   // 60% carbs, 4 cal per gram
            fat: Math.round(breakfastCal * 0.25 / 9),     // 25% fat, 9 cal per gram
            ingredients: ["Whole wheat flour", "Potatoes", "Green chillies", "Spices", "Yogurt"],
            preparation: "Prepare stuffing, make dough, stuff and cook on tawa with minimal oil.",
            tags: ["Vegetarian", "High-fiber", "Protein-rich"]
          },
          lunch: {
            name: "Rajma Chawal with Salad",
            description: "Protein-rich kidney bean curry served with steamed brown rice and fresh vegetable salad",
            calories: lunchCal,
            protein: Math.round(lunchCal * 0.20 / 4),
            carbs: Math.round(lunchCal * 0.55 / 4),
            fat: Math.round(lunchCal * 0.25 / 9),
            ingredients: ["Kidney beans", "Brown rice", "Onions", "Tomatoes", "Cucumbers", "Spices"],
            preparation: "Pressure cook kidney beans, sauté with onion-tomato masala, serve with brown rice.",
            tags: ["Vegetarian", "Protein-rich", "Fiber-rich"]
          },
          dinner: {
            name: "Paneer Tikka with Roti",
            description: "Grilled paneer and vegetable skewers with whole wheat rotis and mint chutney",
            calories: dinnerCal,
            protein: Math.round(dinnerCal * 0.25 / 4),
            carbs: Math.round(dinnerCal * 0.45 / 4),
            fat: Math.round(dinnerCal * 0.30 / 9),
            ingredients: ["Paneer", "Bell peppers", "Onions", "Whole wheat flour", "Yogurt", "Spices", "Mint"],
            preparation: "Marinate paneer in yogurt and spices, grill with vegetables, serve with rotis.",
            tags: ["Vegetarian", "High-protein", "Low-carb"]
          },
          snacks: [
            {
              name: "Roasted Chana with Muri",
              description: "Protein-rich roasted chickpeas mixed with puffed rice and spices",
              calories: snacksCal,
              protein: Math.round(snacksCal * 0.25 / 4),
              carbs: Math.round(snacksCal * 0.60 / 4),
              fat: Math.round(snacksCal * 0.15 / 9),
              ingredients: ["Roasted chickpeas", "Puffed rice", "Onions", "Tomatoes", "Spices", "Lemon juice"],
              preparation: "Mix all ingredients together and season with lemon juice and spices.",
              tags: ["Vegetarian", "High-protein", "Low-fat"]
            }
          ]
        },
        {
          breakfast: {
            name: "Besan Chilla with Mint Chutney",
            description: "Savory gram flour pancakes served with refreshing mint chutney",
            calories: breakfastCal,
            protein: Math.round(breakfastCal * 0.18 / 4),
            carbs: Math.round(breakfastCal * 0.55 / 4),
            fat: Math.round(breakfastCal * 0.27 / 9),
            ingredients: ["Gram flour", "Onions", "Tomatoes", "Mint", "Coriander", "Spices"],
            preparation: "Mix gram flour with water, vegetables and spices. Cook as thin pancakes.",
            tags: ["Vegetarian", "Gluten-free", "High-protein"]
          },
          lunch: {
            name: "Chana Masala with Jeera Rice",
            description: "Spiced chickpea curry served with cumin-flavored brown rice",
            calories: lunchCal,
            protein: Math.round(lunchCal * 0.20 / 4),
            carbs: Math.round(lunchCal * 0.55 / 4),
            fat: Math.round(lunchCal * 0.25 / 9),
            ingredients: ["Chickpeas", "Brown rice", "Onions", "Tomatoes", "Spices", "Cumin seeds"],
            preparation: "Pressure cook chickpeas, sauté with onion-tomato masala, serve with rice.",
            tags: ["Vegetarian", "Fiber-rich", "Heart-healthy"]
          },
          dinner: {
            name: "Dal Tadka with Multi-grain Roti",
            description: "Yellow lentil curry with tempered spices served with multi-grain flatbreads",
            calories: dinnerCal,
            protein: Math.round(dinnerCal * 0.22 / 4),
            carbs: Math.round(dinnerCal * 0.50 / 4),
            fat: Math.round(dinnerCal * 0.28 / 9),
            ingredients: ["Yellow lentils", "Multi-grain flour", "Onions", "Tomatoes", "Garlic", "Cumin", "Asafoetida"],
            preparation: "Pressure cook lentils, prepare tempering with spices, serve with rotis.",
            tags: ["Vegetarian", "Protein-rich", "High-fiber"]
          },
          snacks: [
            {
              name: "Sprouts Bhel",
              description: "Mixed sprouted legumes with diced vegetables and tangy tamarind dressing",
              calories: snacksCal,
              protein: Math.round(snacksCal * 0.30 / 4),
              carbs: Math.round(snacksCal * 0.55 / 4),
              fat: Math.round(snacksCal * 0.15 / 9),
              ingredients: ["Mixed sprouts", "Onions", "Tomatoes", "Cucumbers", "Tamarind", "Coriander", "Spices"],
              preparation: "Mix sprouted beans with vegetables, season with tamarind chutney and spices.",
              tags: ["Vegetarian", "High-protein", "Raw-food"]
            }
          ]
        },
      ],
      nonVegetarian: [
        {
          breakfast: {
            name: "Egg Paratha with Curd",
            description: "Whole wheat parathas with egg stuffing, served with fresh yogurt",
            calories: breakfastCal,
            protein: Math.round(breakfastCal * 0.25 / 4),
            carbs: Math.round(breakfastCal * 0.50 / 4),
            fat: Math.round(breakfastCal * 0.25 / 9),
            ingredients: ["Eggs", "Whole wheat flour", "Onions", "Green chillies", "Spices", "Yogurt"],
            preparation: "Prepare egg mixture, stuff in dough, cook on tawa with minimal oil.",
            tags: ["Non-vegetarian", "High-protein", "Egg"]
          },
          lunch: {
            name: "Butter Chicken with Brown Rice",
            description: "Grilled chicken in a rich tomato-based sauce served with brown rice",
            calories: lunchCal,
            protein: Math.round(lunchCal * 0.30 / 4),
            carbs: Math.round(lunchCal * 0.45 / 4),
            fat: Math.round(lunchCal * 0.25 / 9),
            ingredients: ["Chicken breast", "Brown rice", "Tomatoes", "Butter", "Cream", "Spices"],
            preparation: "Grill chicken, prepare sauce with tomatoes and spices, simmer together, serve with rice.",
            tags: ["Non-vegetarian", "High-protein", "Gluten-free"]
          },
          dinner: {
            name: "Tandoori Chicken with Mint Chutney",
            description: "Spiced grilled chicken with mint chutney and vegetable salad",
            calories: dinnerCal,
            protein: Math.round(dinnerCal * 0.35 / 4),
            carbs: Math.round(dinnerCal * 0.25 / 4),
            fat: Math.round(dinnerCal * 0.40 / 9),
            ingredients: ["Chicken legs", "Yogurt", "Lemon juice", "Mint", "Coriander", "Spices"],
            preparation: "Marinate chicken in yogurt and spices, grill until cooked through.",
            tags: ["Non-vegetarian", "High-protein", "Low-carb"]
          },
          snacks: [
            {
              name: "Chicken Tikka",
              description: "Spiced grilled chicken pieces served with mint chutney",
              calories: snacksCal,
              protein: Math.round(snacksCal * 0.40 / 4),
              carbs: Math.round(snacksCal * 0.20 / 4),
              fat: Math.round(snacksCal * 0.40 / 9),
              ingredients: ["Chicken breast", "Yogurt", "Lemon juice", "Spices", "Mint"],
              preparation: "Marinate chicken pieces, grill until cooked through.",
              tags: ["Non-vegetarian", "High-protein", "Low-carb"]
            }
          ]
        }
      ]
    },
    south: {
      vegetarian: [
        {
          breakfast: {
            name: "Idli with Sambar and Chutney",
            description: "Steamed rice cakes served with lentil soup and coconut chutney",
            calories: breakfastCal,
            protein: Math.round(breakfastCal * 0.15 / 4),
            carbs: Math.round(breakfastCal * 0.70 / 4),
            fat: Math.round(breakfastCal * 0.15 / 9),
            ingredients: ["Rice", "Urad dal", "Mixed vegetables", "Toor dal", "Coconut", "Spices"],
            preparation: "Ferment batter, steam idlis, prepare sambar with vegetables and lentils.",
            tags: ["Vegetarian", "Fermented", "Low-fat"]
          },
          lunch: {
            name: "Vegetable Avial with Brown Rice",
            description: "Mixed vegetable curry in coconut-yogurt gravy served with brown rice",
            calories: lunchCal,
            protein: Math.round(lunchCal * 0.15 / 4),
            carbs: Math.round(lunchCal * 0.60 / 4),
            fat: Math.round(lunchCal * 0.25 / 9),
            ingredients: ["Mixed vegetables", "Brown rice", "Coconut", "Yogurt", "Curry leaves", "Spices"],
            preparation: "Cook vegetables with coconut-yogurt mixture, season with spices, serve with rice.",
            tags: ["Vegetarian", "Fiber-rich", "Gluten-free"]
          },
          dinner: {
            name: "Adai Dosa with Avocado Raita",
            description: "Multi-lentil and rice pancakes served with avocado-yogurt dip",
            calories: dinnerCal,
            protein: Math.round(dinnerCal * 0.20 / 4),
            carbs: Math.round(dinnerCal * 0.50 / 4),
            fat: Math.round(dinnerCal * 0.30 / 9),
            ingredients: ["Mixed lentils", "Rice", "Avocado", "Yogurt", "Spices", "Curry leaves"],
            preparation: "Grind soaked lentils and rice, ferment, cook as pancakes, serve with raita.",
            tags: ["Vegetarian", "Protein-rich", "Heart-healthy"]
          },
          snacks: [
            {
              name: "Sundal (Spiced Chickpeas)",
              description: "Protein-rich seasoned chickpeas with coconut, curry leaves and spices",
              calories: snacksCal,
              protein: Math.round(snacksCal * 0.25 / 4),
              carbs: Math.round(snacksCal * 0.60 / 4),
              fat: Math.round(snacksCal * 0.15 / 9),
              ingredients: ["Chickpeas", "Coconut", "Curry leaves", "Mustard seeds", "Green chillies"],
              preparation: "Pressure cook chickpeas, season with mustard seed tempering and coconut.",
              tags: ["Vegetarian", "High-protein", "Gluten-free"]
            }
          ]
        }
      ]
    }
  };
  
  // Select appropriate meals based on user preferences
  const regionMeals = regionBasedMeals[preferences.cuisineRegion] || regionBasedMeals.north;
  const dietMeals = regionMeals[preferences.dietType] || regionMeals.vegetarian;
  
  // If no specific meals available for the combination, use default
  return dietMeals.length > 0 ? dietMeals : regionBasedMeals.north.vegetarian;
};

// Helper function to generate tips based on user preferences
const generateTipsForUserPreferences = (preferences: UserPreferences): string[] => {
  const tips: string[] = [
    "Stay hydrated by drinking at least 8 glasses of water daily",
    "Include a variety of colorful fruits and vegetables in your diet",
    "Eat mindfully and slowly, savoring each bite",
    "Try to maintain regular meal timings"
  ];
  
  // Add tips based on fitness goal
  if (preferences.fitnessGoal === 'weightLoss') {
    tips.push(
      "Include high-fiber foods to increase satiety",
      "Practice portion control using smaller plates",
      "Include protein in every meal to maintain muscle mass",
      "Avoid eating 2-3 hours before bedtime"
    );
  } else if (preferences.fitnessGoal === 'weightGain') {
    tips.push(
      "Eat calorie-dense foods like nuts, dried fruits, and healthy oils",
      "Have larger meal portions and additional snacks",
      "Consume protein-rich foods to support muscle growth",
      "Include healthy fats from sources like avocados, nuts, and olive oil"
    );
  } else if (preferences.fitnessGoal === 'muscleBuild') {
    tips.push(
      "Consume protein within 30 minutes after strength training",
      "Ensure adequate carbohydrate intake for energy during workouts",
      "Include leucine-rich foods like dairy, eggs and legumes",
      "Stay consistent with both diet and exercise regimen"
    );
  }
  
  // Add tips based on health conditions
  if (preferences.healthConditions.includes('diabetes')) {
    tips.push(
      "Choose low glycemic index foods to manage blood sugar levels",
      "Space your meals evenly throughout the day",
      "Monitor your carbohydrate intake",
      "Include cinnamon in your diet, which may help improve insulin sensitivity"
    );
  }
  
  if (preferences.healthConditions.includes('hypertension')) {
    tips.push(
      "Limit salt intake to less than 5g per day",
      "Include potassium-rich foods like bananas and sweet potatoes",
      "Avoid processed and packaged foods high in sodium",
      "Consider the DASH diet approach (Dietary Approaches to Stop Hypertension)"
    );
  }
  
  if (preferences.healthConditions.includes('cholesterol')) {
    tips.push(
      "Include soluble fiber from oats, barley, and legumes",
      "Choose heart-healthy oils like olive oil and avocado oil",
      "Limit saturated and trans fats",
      "Consider including plant sterols and stanols in your diet"
    );
  }
  
  return tips;
};

// Helper function to generate warnings based on user preferences
const generateWarningsForUserPreferences = (preferences: UserPreferences): string[] => {
  const warnings: string[] = [
    "This meal plan is personalized based on the information you provided, but it is not a substitute for professional medical advice",
    "Always consult with a healthcare provider before making significant changes to your diet, especially if you have health conditions"
  ];
  
  // Add warnings based on health conditions
  if (preferences.healthConditions.includes('diabetes')) {
    warnings.push(
      "Monitor your blood glucose levels regularly when changing your diet",
      "Be aware of how different carbohydrates affect your blood sugar"
    );
  }
  
  if (preferences.healthConditions.includes('kidneyDisease')) {
    warnings.push(
      "This plan may not be suitable for advanced kidney disease - consult your nephrologist",
      "Monitor your protein intake carefully as excess protein can strain the kidneys"
    );
  }
  
  // Add warnings based on allergies
  if (preferences.allergies.length > 0) {
    warnings.push(
      "While we've tried to avoid your allergens, always check ingredients lists and food labels",
      "When eating out, inform restaurant staff about your allergies"
    );
  }
  
  return warnings;
};

const DietPlanner = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("browse");
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<{meal: Meal, type: string} | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Fetch diet plans from API
  const { data: apiDietPlans, isLoading, error } = useQuery<APIDietPlan[]>({
    queryKey: ['/api/diet-plans'],
  });
  
  // Initialize form with user preferences schema
  const form = useForm<z.infer<typeof userPreferencesSchema>>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      age: 30,
      gender: "male",
      height: 170,
      weight: 70,
      healthConditions: [],
      allergies: [],
      fitnessGoal: "maintenance",
      dietType: "vegetarian",
      cuisineRegion: "north",
      mealFrequency: 3,
      activityLevel: "moderate",
      foodPreferences: "",
      avoidFoods: "",
    },
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof userPreferencesSchema>) => {
    setLoading(true);
    
    // Simulate API call or processing delay
    setTimeout(() => {
      try {
        const generatedPlan = generateSampleDietPlan(values as UserPreferences);
        setDietPlan(generatedPlan);
        setCurrentTab("plan");
        setLoading(false);
        toast({
          title: "Diet Plan Generated",
          description: "Your personalized diet plan has been created successfully.",
          variant: "default",
        });
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to generate diet plan. Please try again.",
          variant: "destructive",
        });
      }
    }, 2000);
  };
  
  // Calculate BMI
  const calculateBMI = () => {
    const weight = form.getValues("weight");
    const height = form.getValues("height") / 100; // convert cm to m
    if (weight && height) {
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    return "?";
  };
  
  // Handle meal details view
  const handleViewMealDetails = (meal: Meal, type: string) => {
    setSelectedMeal({ meal, type });
  };
  
  // Handle meal plan regeneration
  const handleRegeneratePlan = () => {
    if (!dietPlan) return;
    
    setLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      try {
        const regeneratedPlan = generateSampleDietPlan(dietPlan.forUser);
        setDietPlan(regeneratedPlan);
        setLoading(false);
        toast({
          title: "Diet Plan Regenerated",
          description: "Your diet plan has been refreshed with new meal options.",
          variant: "default",
        });
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to regenerate diet plan. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };
  
  // Handle downloading diet plan
  const handleDownloadPlan = () => {
    if (!dietPlan) return;
    
    let content = `AROGYA PERSONALIZED DIET PLAN\n`;
    content += `===================================\n\n`;
    content += `PLAN SUMMARY\n`;
    content += `Name: ${dietPlan.name}\n`;
    content += `Description: ${dietPlan.description}\n\n`;
    
    content += `USER DETAILS\n`;
    content += `Age: ${dietPlan.forUser.age}\n`;
    content += `Gender: ${dietPlan.forUser.gender}\n`;
    content += `Height: ${dietPlan.forUser.height}cm\n`;
    content += `Weight: ${dietPlan.forUser.weight}kg\n`;
    content += `Fitness Goal: ${dietPlan.forUser.fitnessGoal}\n`;
    content += `Diet Type: ${dietPlan.forUser.dietType}\n\n`;
    
    content += `7-DAY MEAL PLAN\n`;
    dietPlan.days.forEach(day => {
      content += `\n--- ${day.day.toUpperCase()} ---\n`;
      content += `Total: ${day.totalCalories} calories, ${day.totalProtein}g protein, ${day.totalCarbs}g carbs, ${day.totalFat}g fat\n\n`;
      
      content += `Breakfast: ${day.breakfast.name}\n`;
      content += `${day.breakfast.description}\n`;
      content += `${day.breakfast.calories} calories | ${day.breakfast.protein}g protein | ${day.breakfast.carbs}g carbs | ${day.breakfast.fat}g fat\n\n`;
      
      content += `Lunch: ${day.lunch.name}\n`;
      content += `${day.lunch.description}\n`;
      content += `${day.lunch.calories} calories | ${day.lunch.protein}g protein | ${day.lunch.carbs}g carbs | ${day.lunch.fat}g fat\n\n`;
      
      content += `Dinner: ${day.dinner.name}\n`;
      content += `${day.dinner.description}\n`;
      content += `${day.dinner.calories} calories | ${day.dinner.protein}g protein | ${day.dinner.carbs}g carbs | ${day.dinner.fat}g fat\n\n`;
      
      content += `Snacks:\n`;
      day.snacks.forEach(snack => {
        content += `- ${snack.name}: ${snack.description}\n`;
        content += `  ${snack.calories} calories | ${snack.protein}g protein | ${snack.carbs}g carbs | ${snack.fat}g fat\n`;
      });
      content += `\n`;
    });
    
    content += `\nTIPS FOR SUCCESS\n`;
    dietPlan.tips.forEach(tip => {
      content += `- ${tip}\n`;
    });
    
    content += `\nIMPORTANT NOTES\n`;
    dietPlan.warnings.forEach(warning => {
      content += `- ${warning}\n`;
    });
    
    content += `\n===================================\n`;
    content += `Generated by AROGYA Health Platform | ${new Date().toLocaleDateString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AROGYA_Diet_Plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your diet plan has been downloaded as a text file.",
      variant: "default",
    });
  };
  
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
  
  // Loading state for API diet plans
  if (isLoading && currentTab === "browse") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Error state for API diet plans
  if (error && currentTab === "browse") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-red-500">{t("error")}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              {t("tryAgain")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("dietPlanner")}</h1>
        <p className="text-slate-600 mb-6">Create a personalized nutrition plan tailored to your health needs, preferences, and goals.</p>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" disabled={loading}>
              <Apple className="w-4 h-4 mr-2" />
              Browse Plans
            </TabsTrigger>
            <TabsTrigger value="customize" disabled={loading}>
              <User className="w-4 h-4 mr-2" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="plan" disabled={!dietPlan || loading}>
              <Utensils className="w-4 h-4 mr-2" />
              Your Plan
            </TabsTrigger>
          </TabsList>
          
          {/* Browse existing diet plans */}
          <TabsContent value="browse" className="pt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Apple className="mr-2 h-6 w-6 text-primary-500" />
                      Personalized Diet Plans
                    </CardTitle>
                    <CardDescription>
                      Select a diet plan that suits your health condition and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="mb-6">
                        <TabsTrigger value="all">All Plans</TabsTrigger>
                        <TabsTrigger value="diabetes">Diabetes</TabsTrigger>
                        <TabsTrigger value="heart">Heart Health</TabsTrigger>
                        <TabsTrigger value="weight">Weight Management</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {apiDietPlans?.map((plan) => (
                            <Card key={plan.id} className="h-full">
                              <CardHeader>
                                <CardTitle className="text-lg">{plan.name}</CardTitle>
                                <div className="flex flex-wrap gap-2">
                                  {plan.forConditions.map((condition, i) => (
                                    <span 
                                      key={i}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                    >
                                      {condition}
                                    </span>
                                  ))}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-slate-600">{plan.description}</p>
                              </CardContent>
                              <CardFooter>
                                <Button size="sm" className="w-full" onClick={() => setCurrentTab("customize")}>Customize This Plan</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="diabetes">
                        {apiDietPlans?.filter(plan => plan.forConditions.includes("Diabetes")).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {apiDietPlans?.filter(plan => plan.forConditions.includes("Diabetes")).map((plan) => (
                              <Card key={plan.id} className="h-full">
                                <CardHeader>
                                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                                  <div className="flex flex-wrap gap-2">
                                    {plan.forConditions.map((condition, i) => (
                                      <span 
                                        key={i}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                      >
                                        {condition}
                                      </span>
                                    ))}
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-slate-600">{plan.description}</p>
                                </CardContent>
                                <CardFooter>
                                  <Button size="sm" className="w-full" onClick={() => setCurrentTab("customize")}>Customize This Plan</Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-500">No plans found for this category.</p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="heart">
                        {apiDietPlans?.filter(plan => plan.forConditions.includes("Heart Disease") || plan.forConditions.includes("Hypertension")).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {apiDietPlans?.filter(plan => plan.forConditions.includes("Heart Disease") || plan.forConditions.includes("Hypertension")).map((plan) => (
                              <Card key={plan.id} className="h-full">
                                <CardHeader>
                                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                                  <div className="flex flex-wrap gap-2">
                                    {plan.forConditions.map((condition, i) => (
                                      <span 
                                        key={i}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                      >
                                        {condition}
                                      </span>
                                    ))}
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-slate-600">{plan.description}</p>
                                </CardContent>
                                <CardFooter>
                                  <Button size="sm" className="w-full" onClick={() => setCurrentTab("customize")}>Customize This Plan</Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-500">No plans found for this category.</p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="weight">
                        {apiDietPlans?.filter(plan => plan.forConditions.includes("Obesity") || plan.forConditions.includes("Metabolic Syndrome")).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {apiDietPlans?.filter(plan => plan.forConditions.includes("Obesity") || plan.forConditions.includes("Metabolic Syndrome")).map((plan) => (
                              <Card key={plan.id} className="h-full">
                                <CardHeader>
                                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                                  <div className="flex flex-wrap gap-2">
                                    {plan.forConditions.map((condition, i) => (
                                      <span 
                                        key={i}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                      >
                                        {condition}
                                      </span>
                                    ))}
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-slate-600">{plan.description}</p>
                                </CardContent>
                                <CardFooter>
                                  <Button size="sm" className="w-full" onClick={() => setCurrentTab("customize")}>Customize This Plan</Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-500">No plans found for this category.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Utensils className="mr-2 h-6 w-6 text-primary-500" />
                        Nutrition Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md bg-slate-50">
                          <h3 className="font-medium text-slate-900 mb-2">Balanced Diet Essentials</h3>
                          <p className="text-sm text-slate-700">Aim for a variety of foods from all food groups: fruits, vegetables, whole grains, lean proteins, and healthy fats.</p>
                        </div>
                        
                        <div className="p-4 border rounded-md bg-slate-50">
                          <h3 className="font-medium text-slate-900 mb-2">Hydration Importance</h3>
                          <p className="text-sm text-slate-700">Drink 8-10 glasses of water daily. Limit sugary beverages and alcohol.</p>
                        </div>
                        
                        <div className="p-4 border rounded-md bg-slate-50">
                          <h3 className="font-medium text-slate-900 mb-2">Portion Control</h3>
                          <p className="text-sm text-slate-700">Be mindful of portion sizes, even for healthy foods. Use smaller plates to help control portions.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Apple className="mr-2 h-6 w-6 text-primary-500" />
                        Food Groups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 mt-0.5">F</div>
                          <div>
                            <h4 className="font-medium text-slate-900">Fruits</h4>
                            <p className="text-xs text-slate-600">Apples, bananas, berries, citrus fruits</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 mt-0.5">V</div>
                          <div>
                            <h4 className="font-medium text-slate-900">Vegetables</h4>
                            <p className="text-xs text-slate-600">Leafy greens, carrots, broccoli, peppers</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2 mt-0.5">G</div>
                          <div>
                            <h4 className="font-medium text-slate-900">Grains</h4>
                            <p className="text-xs text-slate-600">Whole wheat, oats, brown rice, quinoa</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 mt-0.5">P</div>
                          <div>
                            <h4 className="font-medium text-slate-900">Proteins</h4>
                            <p className="text-xs text-slate-600">Lean meats, fish, beans, tofu, nuts</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 mt-0.5">D</div>
                          <div>
                            <h4 className="font-medium text-slate-900">Dairy</h4>
                            <p className="text-xs text-slate-600">Milk, yogurt, cheese, fortified alternatives</p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-start bg-amber-50 p-3 rounded-md text-amber-800 text-xs">
                        <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        <p>Consult a registered dietitian for personalized advice based on your specific health needs.</p>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* User Information Input Form */}
          <TabsContent value="customize" className="space-y-4 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      We'll use this information to calculate your nutritional needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min={1} max={120} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min={50} max={250} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min={20} max={300} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="bg-primary-50 p-4 rounded-md flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-primary-700">Your BMI</h3>
                        <p className="text-2xl font-bold text-primary-800">{calculateBMI()}</p>
                      </div>
                      <div className="text-sm text-primary-700">
                        <p>Underweight: &lt;18.5</p>
                        <p>Normal: 18.5-24.9</p>
                        <p>Overweight: 25-29.9</p>
                        <p>Obese: &gt;30</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Health Conditions & Allergies</CardTitle>
                    <CardDescription>
                      Select any conditions or allergies that apply to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="healthConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Conditions</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {healthConditionOptions.map((condition) => (
                              <div key={condition.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`condition-${condition.value}`}
                                  checked={field.value?.includes(condition.value)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked 
                                      ? [...field.value, condition.value]
                                      : field.value.filter(value => value !== condition.value);
                                    field.onChange(updatedValue);
                                  }}
                                />
                                <label
                                  htmlFor={`condition-${condition.value}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {condition.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies & Intolerances</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {allergyOptions.map((allergy) => (
                              <div key={allergy.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`allergy-${allergy.value}`}
                                  checked={field.value?.includes(allergy.value)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked 
                                      ? [...field.value, allergy.value]
                                      : field.value.filter(value => value !== allergy.value);
                                    field.onChange(updatedValue);
                                  }}
                                />
                                <label
                                  htmlFor={`allergy-${allergy.value}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {allergy.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Diet Preferences & Goals</CardTitle>
                    <CardDescription>
                      Tell us about your diet preferences and health goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fitnessGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Goal</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fitness goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fitnessGoalOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dietType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Diet Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select diet type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {dietTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cuisineRegion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Cuisine Region</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select cuisine region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cuisineRegionOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {activityLevelOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="mealFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Number of meals per day: {field.value}
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={2}
                              max={6}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              aria-label="Number of meals per day"
                            />
                          </FormControl>
                          <FormDescription>
                            Select how many meals you'd like each day (including snacks)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="foodPreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Favorite Foods (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List foods you particularly enjoy"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              We'll try to include these in your plan
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="avoidFoods"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foods to Avoid (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List foods you dislike or want to avoid"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Besides allergies, foods you prefer to avoid
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-1/2" 
                      onClick={() => setCurrentTab("browse")}
                      disabled={loading}
                    >
                      Back to Plans
                    </Button>
                    <Button type="submit" className="w-1/2" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-r-transparent"></div>
                          Generating Diet Plan...
                        </>
                      ) : (
                        <>
                          <Utensils className="mr-2 h-4 w-4" />
                          Generate Diet Plan
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </TabsContent>
          
          {/* Diet Plan Display */}
          <TabsContent value="plan" className="space-y-6 pt-4">
            {dietPlan && (
              <>
                {/* Plan Header */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <CardTitle>{dietPlan.name}</CardTitle>
                        <CardDescription>{dietPlan.description}</CardDescription>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRegeneratePlan}
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-r-transparent"></div>
                          ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                          )}
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadPlan}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setCurrentTab("customize")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Edit Info
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-slate-700 mb-2">Plan Overview</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Age</p>
                          <p className="font-medium">{dietPlan.forUser.age} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Gender</p>
                          <p className="font-medium capitalize">{dietPlan.forUser.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Goal</p>
                          <p className="font-medium">{fitnessGoalOptions.find(g => g.value === dietPlan.forUser.fitnessGoal)?.label}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Diet Type</p>
                          <p className="font-medium">{dietTypeOptions.find(d => d.value === dietPlan.forUser.dietType)?.label}</p>
                        </div>
                      </div>
                      {dietPlan.forUser.healthConditions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-500">Health Conditions</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dietPlan.forUser.healthConditions.map(condition => (
                              <Badge key={condition} variant="outline" className="text-xs">
                                {healthConditionOptions.find(c => c.value === condition)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {dietPlan.forUser.allergies.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-500">Allergies</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dietPlan.forUser.allergies.map(allergy => (
                              <Badge key={allergy} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                {allergyOptions.find(a => a.value === allergy)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Weekly Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your 7-Day Diet Plan</CardTitle>
                    <CardDescription>Navigate through days to see your personalized meals</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Day selector */}
                    <div className="overflow-x-auto scrollbar-hide border-b">
                      <div className="flex p-2">
                        {dietPlan.days.map((day, index) => (
                          <Button
                            key={index}
                            variant={activeDayIndex === index ? "default" : "ghost"}
                            className="rounded-full px-4 py-2 min-w-[100px]"
                            onClick={() => setActiveDayIndex(index)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {day.day}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Active day meals */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-4">
                          {/* Breakfast */}
                          <Card>
                            <CardHeader className="py-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base flex items-center">
                                  <div className="mr-2 bg-amber-100 p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                                      <path d="M8 2a2 2 0 0 0-2 2v2h12V4a2 2 0 0 0-2-2z"></path>
                                      <path d="M2 8v8a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V8z"></path>
                                      <path d="M12 8v8"></path>
                                      <path d="M4 8v8"></path>
                                      <path d="M8 8v8"></path>
                                      <path d="M16 8v8"></path>
                                      <path d="M18 12h.01"></path>
                                    </svg>
                                  </div>
                                  Breakfast
                                </CardTitle>
                                <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                                  {dietPlan.days[activeDayIndex].breakfast.calories} cal
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-0">
                              <h3 className="font-medium">{dietPlan.days[activeDayIndex].breakfast.name}</h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {dietPlan.days[activeDayIndex].breakfast.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {dietPlan.days[activeDayIndex].breakfast.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                                  <div>
                                    <span className="font-semibold text-slate-700">Protein:</span> {dietPlan.days[activeDayIndex].breakfast.protein}g
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Carbs:</span> {dietPlan.days[activeDayIndex].breakfast.carbs}g
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Fat:</span> {dietPlan.days[activeDayIndex].breakfast.fat}g
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewMealDetails(dietPlan.days[activeDayIndex].breakfast, "Breakfast")}
                                >
                                  Details
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Lunch */}
                          <Card>
                            <CardHeader className="py-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base flex items-center">
                                  <div className="mr-2 bg-orange-100 p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                                      <path d="M12 2v1"></path>
                                      <path d="M12 7v1"></path>
                                      <path d="M12 12v1"></path>
                                      <path d="M12 17v1"></path>
                                      <path d="m5 3-1.9 1.9"></path>
                                      <path d="m5 13-1.9 1.9"></path>
                                      <path d="M21.9 13.9 20 12"></path>
                                      <path d="m15 5 5-5"></path>
                                      <path d="M5 2h6v4H5z"></path>
                                      <path d="M2 7h20v5H2z"></path>
                                      <path d="M2 17h20v5H2z"></path>
                                    </svg>
                                  </div>
                                  Lunch
                                </CardTitle>
                                <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                                  {dietPlan.days[activeDayIndex].lunch.calories} cal
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-0">
                              <h3 className="font-medium">{dietPlan.days[activeDayIndex].lunch.name}</h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {dietPlan.days[activeDayIndex].lunch.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {dietPlan.days[activeDayIndex].lunch.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                                  <div>
                                    <span className="font-semibold text-slate-700">Protein:</span> {dietPlan.days[activeDayIndex].lunch.protein}g
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Carbs:</span> {dietPlan.days[activeDayIndex].lunch.carbs}g
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Fat:</span> {dietPlan.days[activeDayIndex].lunch.fat}g
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewMealDetails(dietPlan.days[activeDayIndex].lunch, "Lunch")}
                                >
                                  Details
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Dinner */}
                          <Card>
                            <CardHeader className="py-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base flex items-center">
                                  <div className="mr-2 bg-indigo-100 p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                                      <path d="M2 19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1H2z"></path>
                                      <path d="M2 11v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"></path>
                                      <path d="M14 14v1"></path>
                                      <path d="M14 5V4"></path>
                                      <path d="M14 7v9"></path>
                                    </svg>
                                  </div>
                                  Dinner
                                </CardTitle>
                                <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                                  {dietPlan.days[activeDayIndex].dinner.calories} cal
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-0">
                              <h3 className="font-medium">{dietPlan.days[activeDayIndex].dinner.name}</h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {dietPlan.days[activeDayIndex].dinner.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {dietPlan.days[activeDayIndex].dinner.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                                  <div>
                                    <span className="font-semibold text-slate-700">Protein:</span> {dietPlan.days[activeDayIndex].dinner.protein}g
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Carbs:</span> {dietPlan.days[activeDayIndex].dinner.carbs}g
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Fat:</span> {dietPlan.days[activeDayIndex].dinner.fat}g
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewMealDetails(dietPlan.days[activeDayIndex].dinner, "Dinner")}
                                >
                                  Details
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Snacks */}
                          {dietPlan.days[activeDayIndex].snacks.length > 0 && (
                            <Card>
                              <CardHeader className="py-3">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base flex items-center">
                                    <div className="mr-2 bg-green-100 p-1 rounded-full">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                        <circle cx="16" cy="19" r="2"></circle>
                                        <circle cx="6" cy="17" r="2"></circle>
                                        <path d="M14.5 16.5 16 12l2-5h-8.9C8 7 7.1 7.4 6.2 8L3 10.8c-.7.7-.8 2.1.2 2.9l7.2 5c1.3.9 3.2.3 3.8-1.2z"></path>
                                        <path d="m8.6 8.5 7.8 3"></path>
                                      </svg>
                                    </div>
                                    Snacks
                                  </CardTitle>
                                  <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                                    {dietPlan.days[activeDayIndex].snacks.reduce((sum, snack) => sum + snack.calories, 0)} cal
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="py-0">
                                {dietPlan.days[activeDayIndex].snacks.map((snack, index) => (
                                  <div 
                                    key={index} 
                                    className={`${index > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-medium">{snack.name}</h3>
                                        <p className="text-sm text-slate-600 mt-1">
                                          {snack.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {snack.tags.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="text-xs text-right">
                                        <div><span className="font-semibold">P:</span> {snack.protein}g</div>
                                        <div><span className="font-semibold">C:</span> {snack.carbs}g</div>
                                        <div><span className="font-semibold">F:</span> {snack.fat}g</div>
                                      </div>
                                    </div>
                                    {index < dietPlan.days[activeDayIndex].snacks.length - 1 && (
                                      <div className="mt-2"></div>
                                    )}
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        
                        {/* Daily Summary */}
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">Daily Nutritional Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="py-0">
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Calories</span>
                                    <span className="text-slate-600">{dietPlan.days[activeDayIndex].totalCalories} kcal</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Protein</span>
                                    <span className="text-slate-600">{dietPlan.days[activeDayIndex].totalProtein}g ({Math.round((dietPlan.days[activeDayIndex].totalProtein * 4 / dietPlan.days[activeDayIndex].totalCalories) * 100)}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (dietPlan.days[activeDayIndex].totalProtein * 4 / dietPlan.days[activeDayIndex].totalCalories) * 100)}%` }}></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Carbohydrates</span>
                                    <span className="text-slate-600">{dietPlan.days[activeDayIndex].totalCarbs}g ({Math.round((dietPlan.days[activeDayIndex].totalCarbs * 4 / dietPlan.days[activeDayIndex].totalCalories) * 100)}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (dietPlan.days[activeDayIndex].totalCarbs * 4 / dietPlan.days[activeDayIndex].totalCalories) * 100)}%` }}></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Fats</span>
                                    <span className="text-slate-600">{dietPlan.days[activeDayIndex].totalFat}g ({Math.round((dietPlan.days[activeDayIndex].totalFat * 9 / dietPlan.days[activeDayIndex].totalCalories) * 100)}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (dietPlan.days[activeDayIndex].totalFat * 9 / dietPlan.days[activeDayIndex].totalCalories) * 100)}%` }}></div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                                <div>Protein: 4 calories/gram</div>
                                <div>Carbs: 4 calories/gram</div>
                                <div>Fat: 9 calories/gram</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Meal Distribution */}
                          <Card>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">Meal Timing</CardTitle>
                            </CardHeader>
                            <CardContent className="py-0">
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className="font-medium">Breakfast</p>
                                      <p className="text-sm text-slate-500">7:00 - 8:30 AM</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                    <Clock className="h-4 w-4 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className="font-medium">Lunch</p>
                                      <p className="text-sm text-slate-500">12:30 - 1:30 PM</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <Clock className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className="font-medium">Snack</p>
                                      <p className="text-sm text-slate-500">4:00 - 5:00 PM</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <p className="font-medium">Dinner</p>
                                      <p className="text-sm text-slate-500">7:30 - 8:30 PM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                                <p className="flex items-center">
                                  <Info className="h-3 w-3 mr-1 text-slate-400" />
                                  Meal timing is suggested and can be adjusted to your schedule.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Tips and Warning */}
                          <Card>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">Tips & Advisories</CardTitle>
                            </CardHeader>
                            <CardContent className="py-0 space-y-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center text-green-700">
                                  <Check className="h-4 w-4 mr-1" />
                                  Tips for Success
                                </h4>
                                <ul className="space-y-1 text-sm text-slate-600 pl-6 list-disc">
                                  {dietPlan.tips.slice(0, 4).map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              {dietPlan.warnings.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium flex items-center text-amber-700">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Important Notes
                                  </h4>
                                  <ul className="space-y-1 text-sm text-slate-600 pl-6 list-disc">
                                    {dietPlan.warnings.slice(0, 2).map((warning, index) => (
                                      <li key={index}>{warning}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMeal(null)}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{selectedMeal.meal.name}</CardTitle>
              <CardDescription>{selectedMeal.type} | {selectedMeal.meal.calories} calories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-slate-600">{selectedMeal.meal.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Nutritional Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-600">Protein</p>
                    <p className="text-xl font-bold text-blue-700">{selectedMeal.meal.protein}g</p>
                    <p className="text-xs text-slate-500">{Math.round((selectedMeal.meal.protein * 4 / selectedMeal.meal.calories) * 100)}% of calories</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-600">Carbs</p>
                    <p className="text-xl font-bold text-orange-700">{selectedMeal.meal.carbs}g</p>
                    <p className="text-xs text-slate-500">{Math.round((selectedMeal.meal.carbs * 4 / selectedMeal.meal.calories) * 100)}% of calories</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-600">Fat</p>
                    <p className="text-xl font-bold text-yellow-700">{selectedMeal.meal.fat}g</p>
                    <p className="text-xs text-slate-500">{Math.round((selectedMeal.meal.fat * 9 / selectedMeal.meal.calories) * 100)}% of calories</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedMeal.meal.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Preparation</h3>
                  <p className="text-slate-600">{selectedMeal.meal.preparation}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMeal.meal.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelectedMeal(null)}>Close</Button>
              <Button>Save to Favorites</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DietPlanner;
