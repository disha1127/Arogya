import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertUserSchema,
  insertDoctorProfileSchema,
  insertSymptomSchema,
  insertConditionSchema,
  insertAppointmentSchema,
  insertDietPlanSchema,
  insertMedicationSchema,
  insertHealthSchemeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
    
  // API routes
  const apiRouter = Router();
  app.use('/api', apiRouter);

  // Users API
  apiRouter.get('/users', async (req, res) => {
    // This would be implemented in a real application
    res.json({ message: "Users endpoint" });
  });
  
  apiRouter.post('/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: `Invalid user data: ${error}` });
    }
  });

  // Symptoms API
  apiRouter.get('/symptoms', async (req, res) => {
    // In a real app, this would fetch symptoms from storage
    res.json([
      { id: 1, name: "Fever", urgencyLevel: 2 },
      { id: 2, name: "Headache", urgencyLevel: 1 },
      { id: 3, name: "Cough", urgencyLevel: 1 },
      { id: 4, name: "Breathing Difficulty", urgencyLevel: 4 }
    ]);
  });

  // Health Schemes API
  apiRouter.get('/health-schemes', async (req, res) => {
    // In a real app, this would fetch health schemes from storage
    res.json([
      { 
        id: 1, 
        name: "Ayushman Bharat", 
        description: "Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and tertiary care.", 
        status: "active",
        coverageAmount: "₹5,00,000"
      },
      { 
        id: 2, 
        name: "National Mental Health Program", 
        description: "Program focusing on mental health services, prevention, and rehabilitation across the country.", 
        status: "active" 
      },
      { 
        id: 3, 
        name: "Pradhan Mantri Surakshit Matritva Abhiyan", 
        description: "Provides free health check-ups to pregnant women on the 9th of every month across the country.", 
        status: "active" 
      }
    ]);
  });

  // Doctor Profiles API
  apiRouter.get('/doctors', async (req, res) => {
    // In a real app, this would fetch doctors from storage
    res.json([
      { 
        id: 1,
        fullName: "Dr. Amit Sharma",
        specialization: "Cardiology",
        experience: 10,
        rating: 4.8,
        location: "Delhi",
        consultationFee: 800,
        availability: "Today, 2PM - 6PM"
      },
      { 
        id: 2,
        fullName: "Dr. Priya Patel",
        specialization: "Pediatrics",
        experience: 8,
        rating: 4.9,
        location: "Mumbai",
        consultationFee: 700,
        availability: "Tomorrow, 10AM - 2PM"
      },
      { 
        id: 3,
        fullName: "Dr. Rajesh Kumar",
        specialization: "Orthopedics",
        experience: 15,
        rating: 4.7,
        location: "Delhi",
        consultationFee: 1000,
        availability: "Today, 4PM - 8PM"
      }
    ]);
  });

  // Diet Plans API
  apiRouter.get('/diet-plans', async (req, res) => {
    // In a real app, this would fetch diet plans from storage
    res.json([
      { 
        id: 1, 
        name: "Diabetes Management Diet", 
        description: "Balanced diet to help manage blood sugar levels",
        forConditions: ["Diabetes", "Obesity"]
      },
      { 
        id: 2, 
        name: "Heart Healthy Diet", 
        description: "Low sodium, low fat diet for cardiovascular health",
        forConditions: ["Hypertension", "Heart Disease"]
      },
      { 
        id: 3, 
        name: "Weight Loss Diet", 
        description: "Calorie controlled diet for healthy weight loss",
        forConditions: ["Obesity", "Metabolic Syndrome"]
      }
    ]);
  });

  // Medications API
  apiRouter.get('/medications', async (req, res) => {
    // In a real app, this would fetch the user's medications from storage
    res.json([
      { 
        id: 1, 
        name: "Metformin", 
        dosage: "500mg",
        frequency: "twice daily",
        time: ["9:00 AM", "9:00 PM"],
        startDate: "2023-01-15"
      },
      { 
        id: 2, 
        name: "Atorvastatin", 
        dosage: "10mg",
        frequency: "once daily",
        time: ["9:00 PM"],
        startDate: "2023-02-10"
      },
      { 
        id: 3, 
        name: "Aspirin", 
        dosage: "81mg",
        frequency: "once daily",
        time: ["9:00 AM"],
        startDate: "2023-01-20"
      }
    ]);
  });

  // Hospitals API
  apiRouter.get('/hospitals', async (req, res) => {
    // In a real app, this would fetch hospitals from storage based on location
    res.json([
      { 
        id: 1, 
        name: "All India Institute of Medical Sciences", 
        location: "New Delhi",
        type: "Government",
        emergencyServices: true,
        contactNumber: "+91-11-26588500"
      },
      { 
        id: 2, 
        name: "Apollo Hospitals", 
        location: "Delhi",
        type: "Private",
        emergencyServices: true,
        contactNumber: "+91-11-26825858"
      },
      { 
        id: 3, 
        name: "Fortis Hospital", 
        location: "Gurgaon",
        type: "Private",
        emergencyServices: true,
        contactNumber: "+91-124-4522222"
      }
    ]);
  });

  // Health Articles API
  apiRouter.get('/health-articles', async (req, res) => {
    // In a real app, this would fetch health articles from storage
    res.json([
      { 
        id: 1, 
        title: "Understanding Diabetes: Symptoms, Causes, and Management", 
        summary: "Learn about the different types of diabetes and how to manage them effectively.",
        category: "Chronic Conditions",
        publishDate: "2023-05-15"
      },
      { 
        id: 2, 
        title: "The Importance of Mental Health Awareness", 
        summary: "How to recognize mental health issues and seek appropriate help.",
        category: "Mental Health",
        publishDate: "2023-06-10"
      },
      { 
        id: 3, 
        title: "COVID-19: Latest Updates and Prevention Measures", 
        summary: "Stay informed about the current COVID-19 situation and how to protect yourself.",
        category: "Infectious Diseases",
        publishDate: "2023-07-05"
      }
    ]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
