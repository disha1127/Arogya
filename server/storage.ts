import { users, userRoles, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Use default role if none provided or if invalid
      const userRole = (insertUser.role && 
        (insertUser.role === userRoles.PATIENT || 
         insertUser.role === userRoles.DOCTOR || 
         insertUser.role === userRoles.ADMIN)) 
        ? insertUser.role 
        : userRoles.PATIENT;
      
      const result = await db
        .insert(users)
        .values({
          username: insertUser.username,
          password: insertUser.password,
          email: insertUser.email,
          fullName: insertUser.fullName,
          role: userRole,
          phone: insertUser.phone,
          address: insertUser.address,
          language: insertUser.language
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
