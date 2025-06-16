import {
  users,
  baajuses,
  filterResults,
  type User,
  type UpsertUser,
  type InsertBaajus,
  type Baajus,
  type InsertFilterResult,
  type FilterResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, avg } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Baajus operations
  createBaajus(baajus: InsertBaajus): Promise<Baajus>;
  getBaajusesByUserId(userId: string): Promise<Baajus[]>;
  getBaajusById(id: number): Promise<Baajus | undefined>;
  updateBaajus(id: number, updates: Partial<InsertBaajus>): Promise<Baajus>;
  deleteBaajus(id: number): Promise<void>;
  getPublicBaajuses(): Promise<Baajus[]>;
  updateBaajusUsage(id: number): Promise<void>;
  
  // Filter result operations
  createFilterResult(result: InsertFilterResult): Promise<FilterResult>;
  getFilterResultsByUserId(userId: string, limit?: number): Promise<FilterResult[]>;
  getUserStats(userId: string): Promise<{
    activeBaajuses: number;
    contentFiltered: number;
    averageAccuracy: number;
    totalRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Baajus operations
  async createBaajus(baajusData: InsertBaajus): Promise<Baajus> {
    const [baajus] = await db
      .insert(baajuses)
      .values(baajusData)
      .returning();
    return baajus;
  }

  async getBaajusesByUserId(userId: string): Promise<Baajus[]> {
    return await db
      .select()
      .from(baajuses)
      .where(eq(baajuses.userId, userId))
      .orderBy(desc(baajuses.updatedAt));
  }

  async getBaajusById(id: number): Promise<Baajus | undefined> {
    const [baajus] = await db
      .select()
      .from(baajuses)
      .where(eq(baajuses.id, id));
    return baajus;
  }

  async updateBaajus(id: number, updates: Partial<InsertBaajus>): Promise<Baajus> {
    const [baajus] = await db
      .update(baajuses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(baajuses.id, id))
      .returning();
    return baajus;
  }

  async deleteBaajus(id: number): Promise<void> {
    await db.delete(baajuses).where(eq(baajuses.id, id));
  }

  async getPublicBaajuses(): Promise<Baajus[]> {
    return await db
      .select()
      .from(baajuses)
      .where(eq(baajuses.isPublic, true))
      .orderBy(desc(baajuses.usageCount));
  }

  async updateBaajusUsage(id: number): Promise<void> {
    await db
      .update(baajuses)
      .set({ 
        usageCount: sql`${baajuses.usageCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(baajuses.id, id));
  }

  // Filter result operations
  async createFilterResult(resultData: InsertFilterResult): Promise<FilterResult> {
    const [result] = await db
      .insert(filterResults)
      .values(resultData)
      .returning();
    return result;
  }

  async getFilterResultsByUserId(userId: string, limit = 50): Promise<FilterResult[]> {
    return await db
      .select()
      .from(filterResults)
      .where(eq(filterResults.userId, userId))
      .orderBy(desc(filterResults.createdAt))
      .limit(limit);
  }

  async getUserStats(userId: string): Promise<{
    activeBaajuses: number;
    contentFiltered: number;
    averageAccuracy: number;
    totalRevenue: number;
  }> {
    // Get active baajuses count
    const [activeBaajusesResult] = await db
      .select({ count: count() })
      .from(baajuses)
      .where(and(eq(baajuses.userId, userId), eq(baajuses.isActive, true)));

    // Get content filtered count
    const [contentFilteredResult] = await db
      .select({ count: count() })
      .from(filterResults)
      .where(eq(filterResults.userId, userId));

    // Get average accuracy
    const [accuracyResult] = await db
      .select({ avgAccuracy: avg(baajuses.accuracyRate) })
      .from(baajuses)
      .where(eq(baajuses.userId, userId));

    // Calculate estimated revenue (mock calculation)
    const revenue = Math.floor((contentFilteredResult.count || 0) * 0.001 * 100) / 100;

    return {
      activeBaajuses: activeBaajusesResult.count || 0,
      contentFiltered: contentFilteredResult.count || 0,
      averageAccuracy: Number(accuracyResult.avgAccuracy) || 0,
      totalRevenue: revenue,
    };
  }
}

export const storage = new DatabaseStorage();
