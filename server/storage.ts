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
  
  // Baaijus operations
  createBaaijus(baaijus: InsertBaaijus): Promise<Baaijus>;
  getBaaijusesByUserId(userId: number): Promise<Baaijus[]>;
  getBaaijusById(id: number): Promise<Baaijus | undefined>;
  updateBaaijus(id: number, updates: Partial<InsertBaaijus>): Promise<Baaijus>;
  deleteBaaijus(id: number): Promise<void>;
  getPublicBaaijuses(): Promise<Baaijus[]>;
  updateBaaijusUsage(id: number): Promise<void>;
  
  // Filter result operations
  createFilterResult(result: InsertFilterResult): Promise<FilterResult>;
  getFilterResultsByUserId(userId: number, limit?: number): Promise<FilterResult[]>;
  getUserStats(userId: number): Promise<{
    activeBaaijuses: number;
    contentFiltered: number;
    averageAccuracy: number;
    totalRevenue: number;
  }>;
  
  // Admin operations
  getAdminRevenue(): Promise<{
    revenue: number;
    currency: string;
    monthlyGrowth: number;
  }>;
  getSignupStats(): Promise<{
    new: number;
    active: number;
    churned: number;
    paid: number;
    free: number;
  }>;
  getPopularBaaijuses(): Promise<Array<{
    name: string;
    uses: number;
    creator: string;
  }>>;
  getAllUsers(): Promise<User[]>;
  getExportData(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Baaijus operations
  async createBaaijus(baaijusData: InsertBaaijus): Promise<Baaijus> {
    const [baaijus] = await db
      .insert(baaijuses)
      .values(baaijusData)
      .returning();
    return baaijus;
  }

  async getBaaijusesByUserId(userId: number): Promise<Baaijus[]> {
    return await db.select().from(baaijuses).where(eq(baaijuses.userId, userId));
  }

  async getBaaijusById(id: number): Promise<Baaijus | undefined> {
    const [baaijus] = await db.select().from(baaijuses).where(eq(baaijuses.id, id));
    return baaijus || undefined;
  }

  async updateBaaijus(id: number, updates: Partial<InsertBaaijus>): Promise<Baaijus> {
    const [baaijus] = await db
      .update(baaijuses)
      .set(updates)
      .where(eq(baaijuses.id, id))
      .returning();
    return baaijus;
  }

  async deleteBaaijus(id: number): Promise<void> {
    await db.delete(baaijuses).where(eq(baaijuses.id, id));
  }

  async getPublicBaaijuses(): Promise<Baaijus[]> {
    return await db
      .select()
      .from(baaijuses)
      .where(eq(baaijuses.isPublic, true));
  }

  async updateBaaijusUsage(id: number): Promise<void> {
    await db
      .update(baaijuses)
      .set({ usageCount: sql`${baaijuses.usageCount} + 1` })
      .where(eq(baaijuses.id, id));
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
    activeBaaijuses: number;
    contentFiltered: number;
    averageAccuracy: number;
    totalRevenue: number;
  }> {
    // Get active baaijuses count
    const [activeBaaijusesResult] = await db
      .select({ count: count() })
      .from(baaijuses)
      .where(and(eq(baaijuses.userId, userId), eq(baaijuses.isActive, true)));

    // Get content filtered count
    const [contentFilteredResult] = await db
      .select({ count: count() })
      .from(filterResults)
      .where(eq(filterResults.userId, userId));

    // Get average accuracy (assuming we track this in baaijuses)
    const [averageAccuracyResult] = await db
      .select({ average: avg(baaijuses.accuracyRate) })
      .from(baaijuses)
      .where(eq(baaijuses.userId, userId));

    return {
      activeBaaijuses: activeBaaijusesResult?.count || 0,
      contentFiltered: contentFilteredResult?.count || 0,
      averageAccuracy: averageAccuracyResult?.average || 0,
      totalRevenue: 0, // Placeholder for revenue calculation
    };
  }

  // Admin operations
  async getAdminRevenue(): Promise<{
    revenue: number;
    currency: string;
    monthlyGrowth: number;
  }> {
    // Calculate platform revenue from usage and subscriptions
    const [usageCount] = await db
      .select({ total: count() })
      .from(filterResults);

    const [userCount] = await db
      .select({ total: count() })
      .from(users);

    // Simple revenue calculation: $0.01 per filter + $5 per active user
    const revenue = (usageCount?.total || 0) * 0.01 + (userCount?.total || 0) * 5;

    return {
      revenue: Math.round(revenue * 100) / 100,
      currency: "USD",
      monthlyGrowth: 12.5, // Sample growth rate
    };
  }

  async getSignupStats(): Promise<{
    new: number;
    active: number;
    churned: number;
    paid: number;
    free: number;
  }> {
    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    const [adminUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'master_admin'));

    const total = totalUsers?.count || 0;
    const admins = adminUsers?.count || 0;
    const regularUsers = total - admins;

    return {
      new: Math.floor(regularUsers * 0.1), // 10% new users
      active: regularUsers,
      churned: Math.floor(regularUsers * 0.05), // 5% churn
      paid: Math.floor(regularUsers * 0.2), // 20% paid
      free: Math.floor(regularUsers * 0.8), // 80% free
    };
  }

  async getPopularBaaijuses(): Promise<Array<{
    name: string;
    uses: number;
    creator: string;
  }>> {
    const popularBaaijuses = await db
      .select({
        name: baaijuses.name,
        uses: baaijuses.usageCount,
        creator: users.username,
      })
      .from(baaijuses)
      .leftJoin(users, eq(baaijuses.userId, users.id))
      .orderBy(desc(baaijuses.usageCount))
      .limit(10);

    return popularBaaijuses.map(b => ({
      name: b.name,
      uses: b.uses || 0,
      creator: b.creator || 'Unknown',
    }));
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        isAdmin: users.isAdmin,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async getExportData(): Promise<any> {
    const users = await this.getAllUsers();
    const allBaaijuses = await db.select().from(baaijuses);
    const allResults = await db.select().from(filterResults);

    return {
      users: users.length,
      baaijuses: allBaaijuses.length,
      filterResults: allResults.length,
      exportDate: new Date().toISOString(),
      data: {
        users,
        baaijuses: allBaaijuses,
        filterResults: allResults,
      }
    };
  }
}

export const storage = new DatabaseStorage();