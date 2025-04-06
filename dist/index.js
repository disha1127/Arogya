var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { Router } from "express";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appointments: () => appointments,
  availability: () => availability,
  chatMessages: () => chatMessages,
  conditions: () => conditions,
  dietPlans: () => dietPlans,
  doctorProfiles: () => doctorProfiles,
  emergencyContacts: () => emergencyContacts,
  forumPosts: () => forumPosts,
  forumReplies: () => forumReplies,
  healthDocuments: () => healthDocuments,
  healthMetrics: () => healthMetrics,
  healthSchemes: () => healthSchemes,
  insertAppointmentSchema: () => insertAppointmentSchema,
  insertAvailabilitySchema: () => insertAvailabilitySchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertConditionSchema: () => insertConditionSchema,
  insertDietPlanSchema: () => insertDietPlanSchema,
  insertDoctorProfileSchema: () => insertDoctorProfileSchema,
  insertEmergencyContactSchema: () => insertEmergencyContactSchema,
  insertForumPostSchema: () => insertForumPostSchema,
  insertForumReplySchema: () => insertForumReplySchema,
  insertHealthDocumentSchema: () => insertHealthDocumentSchema,
  insertHealthMetricSchema: () => insertHealthMetricSchema,
  insertHealthSchemeSchema: () => insertHealthSchemeSchema,
  insertMedicationSchema: () => insertMedicationSchema,
  insertSymptomSchema: () => insertSymptomSchema,
  insertTranslationSchema: () => insertTranslationSchema,
  insertUserSchema: () => insertUserSchema,
  medications: () => medications,
  symptoms: () => symptoms,
  translations: () => translations,
  userRoles: () => userRoles,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, date, time, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var userRoles = {
  PATIENT: "PATIENT",
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN"
};
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").$type().notNull().default(userRoles.PATIENT),
  phone: text("phone"),
  address: text("address"),
  language: text("language").default("english"),
  createdAt: timestamp("created_at").defaultNow()
});
var doctorProfiles = pgTable("doctor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  specialization: text("specialization").notNull(),
  experience: integer("experience").notNull(),
  hospital: text("hospital"),
  qualification: text("qualification").notNull(),
  location: text("location").notNull().default("Delhi"),
  // Add location field with default
  isAvailable: boolean("is_available").default(false),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  consultationFee: integer("consultation_fee")
});
var emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  phone: text("phone").notNull()
});
var symptoms = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  urgencyLevel: integer("urgency_level").default(1)
  // 1-5 scale
});
var conditions = pgTable("conditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  symptoms: text("symptoms").array(),
  recommendations: text("recommendations").array()
});
var availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull().references(() => doctorProfiles.id),
  day: text("day").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull()
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => users.id),
  doctorId: integer("doctor_id").notNull().references(() => doctorProfiles.id),
  date: date("date").notNull(),
  time: time("time").notNull(),
  status: text("status").notNull().default("scheduled"),
  // scheduled, completed, cancelled
  type: text("type").notNull(),
  // video, in-person
  notes: text("notes")
});
var dietPlans = pgTable("diet_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  forConditions: text("for_conditions").array(),
  mealPlan: jsonb("meal_plan").notNull()
});
var medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  // daily, twice a day, etc.
  time: text("time").array().notNull(),
  // Array of times
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  notes: text("notes")
});
var forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  upvotes: integer("upvotes").default(0)
});
var forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  upvotes: integer("upvotes").default(0)
});
var healthSchemes = pgTable("health_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eligibility: text("eligibility").notNull(),
  benefits: text("benefits").notNull(),
  status: text("status").notNull().default("active"),
  // active, inactive
  coverageAmount: text("coverage_amount"),
  documents: text("documents").array()
});
var healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // weight, blood pressure, glucose, etc.
  value: text("value").notNull(),
  unit: text("unit").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isRead: boolean("is_read").default(false)
});
var translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  language: text("language").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull()
});
var healthDocuments = pgTable("health_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  category: text("category").notNull(),
  // Prescription, Lab Report, Imaging, Discharge Summary, Other
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  // MIME type
  fileSize: integer("file_size").notNull(),
  // in bytes
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  documentDate: date("document_date").notNull(),
  notes: text("notes")
});
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
var insertDoctorProfileSchema = createInsertSchema(doctorProfiles).omit({ id: true });
var insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true });
var insertSymptomSchema = createInsertSchema(symptoms).omit({ id: true });
var insertConditionSchema = createInsertSchema(conditions).omit({ id: true });
var insertAvailabilitySchema = createInsertSchema(availability).omit({ id: true });
var insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
var insertDietPlanSchema = createInsertSchema(dietPlans).omit({ id: true });
var insertMedicationSchema = createInsertSchema(medications).omit({ id: true });
var insertForumPostSchema = createInsertSchema(forumPosts).omit({ id: true, createdAt: true, upvotes: true });
var insertForumReplySchema = createInsertSchema(forumReplies).omit({ id: true, createdAt: true, upvotes: true });
var insertHealthSchemeSchema = createInsertSchema(healthSchemes).omit({ id: true });
var insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({ id: true, timestamp: true });
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, timestamp: true, isRead: true });
var insertTranslationSchema = createInsertSchema(translations).omit({ id: true });
var insertHealthDocumentSchema = createInsertSchema(healthDocuments).omit({
  id: true,
  uploadedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    try {
      const userRole = insertUser.role && (insertUser.role === userRoles.PATIENT || insertUser.role === userRoles.DOCTOR || insertUser.role === userRoles.ADMIN) ? insertUser.role : userRoles.PATIENT;
      const result = await db.insert(users).values({
        username: insertUser.username,
        password: insertUser.password,
        email: insertUser.email,
        fullName: insertUser.fullName,
        role: userRole,
        phone: insertUser.phone,
        address: insertUser.address,
        language: insertUser.language
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "arogya-healthcare-platform-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userResponse } = user;
        res.status(201).json(userResponse);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userResponse } = user;
        res.status(200).json(userResponse);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userResponse } = req.user;
    res.json(userResponse);
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  const apiRouter = Router();
  app2.use("/api", apiRouter);
  apiRouter.get("/users", async (req, res) => {
    res.json({ message: "Users endpoint" });
  });
  apiRouter.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: `Invalid user data: ${error}` });
    }
  });
  apiRouter.get("/symptoms", async (req, res) => {
    res.json([
      { id: 1, name: "Fever", urgencyLevel: 2 },
      { id: 2, name: "Headache", urgencyLevel: 1 },
      { id: 3, name: "Cough", urgencyLevel: 1 },
      { id: 4, name: "Breathing Difficulty", urgencyLevel: 4 }
    ]);
  });
  apiRouter.get("/health-schemes", async (req, res) => {
    res.json([
      {
        id: 1,
        name: "Ayushman Bharat",
        description: "Health insurance scheme providing coverage up to \u20B95 lakhs per family per year for secondary and tertiary care.",
        status: "active",
        coverageAmount: "\u20B95,00,000"
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
  apiRouter.get("/doctors", async (req, res) => {
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
        consultationFee: 1e3,
        availability: "Today, 4PM - 8PM"
      }
    ]);
  });
  apiRouter.get("/diet-plans", async (req, res) => {
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
  apiRouter.get("/medications", async (req, res) => {
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
  apiRouter.get("/hospitals", async (req, res) => {
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
  apiRouter.get("/health-articles", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import { createServer as createServer2 } from "vite";
import { fileURLToPath } from "url";
import path from "path";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
function log(message) {
  console.log(`${(/* @__PURE__ */ new Date()).toLocaleTimeString()} [express] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await createServer2({
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../client")
  });
  app2.use(vite.middlewares);
  return server;
}
function serveStatic(app2) {
  app2.use(express.static(path.resolve(__dirname, "../dist/public")));
  app2.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return;
    res.sendFile(path.resolve(__dirname, "../dist/public/index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
