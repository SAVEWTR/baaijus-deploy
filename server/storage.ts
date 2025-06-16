import {
  users,
  baaijuses,
  filterResults,
  type User,
  type InsertUser,
  type InsertBaaijus,
  type Baaijus,
  type InsertFilterResult,
  type FilterResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, avg, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Baajus operations
  createBaajus(baajus: InsertBaajus): Promise<Baajus>;
  getBaajusesByUserId(userId: number): Promise<Baajus[]>;
  getBaajusById(id: number): Promise<Baajus | undefined>;
  updateBaajus(id: number, updates: Partial<InsertBaajus>): Promise<Baajus>;
  deleteBaajus(id: number): Promise<void>;
  getPublicBaajuses(): Promise<Baajus[]>;
  updateBaajusUsage(id: number): Promise<void>;
  
  // Filter result operations
  createFilterResult(result: InsertFilterResult): Promise<FilterResult>;
  getFilterResultsByUserId(userId: number, limit?: number): Promise<FilterResult[]>;
  getUserStats(userId: number): Promise<{
    activeBaajuses: number;
    contentFiltered: number;
    averageAccuracy: number;
    totalRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
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

  async getBaajusesByUserId(userId: number): Promise<Baajus[]> {
    return await db
      .select()
      .from(baajuses)
      .where(eq(baajuses.userId, userId))
      .orderBy(desc(baajuses.createdAt));
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
      .set({
        ...updates,
        updatedAt: new Date(),
      })
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
      .orderBy(desc(baajuses.usageCount))
      .limit(50);
  }

  async updateBaajusUsage(id: number): Promise<void> {
    await db
      .update(baajuses)
      .set({
        usageCount: sql`${baajuses.usageCount} + 1`,
        updatedAt: new Date(),
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

  async getFilterResultsByUserId(userId: number, limit = 50): Promise<FilterResult[]> {
    return await db
      .select()
      .from(filterResults)
      .where(eq(filterResults.userId, userId))
      .orderBy(desc(filterResults.createdAt))
      .limit(limit);
  }

  async getUserStats(userId: number): Promise<{
    activeBaajuses: number;
    contentFiltered: number;
    averageAccuracy: number;
    totalRevenue: number;
  }> {
    const [baajusStats] = await db
      .select({
        count: count(baajuses.id),
      })
      .from(baajuses)
      .where(eq(baajuses.userId, userId));

    const [filterStats] = await db
      .select({
        count: count(filterResults.id),
        avgConfidence: avg(filterResults.confidence),
      })
      .from(filterResults)
      .where(eq(filterResults.userId, userId));

    return {
      activeBaajuses: baajusStats?.count || 0,
      contentFiltered: filterStats?.count || 0,
      averageAccuracy: Number(filterStats?.avgConfidence || 0),
      totalRevenue: 0, // Placeholder for future monetization features
    };
  }
}

export const storage = new DatabaseStorage();