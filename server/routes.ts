import type { Express } from "express";
import { createServer, type Server } from "http";
import * as path from "path";
import * as fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireRole } from "./auth";
import { analyzeContent, generateBaajusDescription } from "./openai";
import { insertBaaijusSchema, insertFilterResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Test endpoint for extension debugging
  app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Extension can reach the API' });
  });

  // Extension API routes with different prefix to bypass Vite
  app.get('/ext/baajuses', isAuthenticated, async (req: any, res) => {
    console.log("✓ REACHED /ext/baajuses route handler");
    try {
      const userId = req.user.id;
      console.log("✓ User ID:", userId);
      const baaijuses = await storage.getBaaijusesByUserId(userId);
      console.log("✓ Found", baaijuses.length, "baaijuses");
      res.json(baaijuses);
    } catch (error) {
      console.error("✗ Error fetching baaijuses:", error);
      res.status(500).json({ message: "Failed to fetch baaijuses" });
    }
  });
  
  app.post('/ext/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const bcrypt = await import("bcrypt");
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role || 'user'
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Baaijus routes
  app.get("/api/baaijuses", isAuthenticated, async (req: any, res) => {
    console.log("✓ REACHED /api/baaijuses route handler");
    try {
      const userId = req.user.id;
      console.log("✓ User ID:", userId);
      const baaijuses = await storage.getBaaijusesByUserId(userId);
      console.log("✓ Found", baaijuses.length, "baaijuses");
      res.json(baaijuses);
    } catch (error) {
      console.error("✗ Error fetching baaijuses:", error);
      res.status(500).json({ message: "Failed to fetch baaijuses" });
    }
  });

  app.post("/api/baaijuses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baaijusData = insertBaaijusSchema.parse({
        ...req.body,
        userId,
      });

      // Auto-generate description if not provided and keywords exist
      if (!baaijusData.description && baaijusData.keywords) {
        const keywordArray = baaijusData.keywords.split(',').map((k: string) => k.trim());
        baaijusData.description = await generateBaajusDescription(baaijusData.name, keywordArray);
      }

      const baaijus = await storage.createBaaijus(baaijusData);
      res.json(baaijus);
    } catch (error) {
      console.error("Error creating baaijus:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create baaijus" });
      }
    }
  });

  app.put("/api/baaijuses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baaijusId = parseInt(req.params.id);
      
      // Check if user owns this baaijus
      const existingBaaijus = await storage.getBaaijusById(baaijusId);
      if (!existingBaaijus || existingBaaijus.userId !== userId) {
        return res.status(404).json({ message: "Baaijus not found" });
      }

      const updates = insertBaaijusSchema.partial().parse(req.body);
      const updatedBaaijus = await storage.updateBaaijus(baaijusId, updates);
      res.json(updatedBaaijus);
    } catch (error) {
      console.error("Error updating baaijus:", error);
      res.status(500).json({ message: "Failed to update baaijus" });
    }
  });

  app.delete("/api/baaijuses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baaijusId = parseInt(req.params.id);
      
      // Check if user owns this baaijus
      const existingBaaijus = await storage.getBaaijusById(baaijusId);
      if (!existingBaaijus || existingBaaijus.userId !== userId) {
        return res.status(404).json({ message: "Baaijus not found" });
      }

      await storage.deleteBaaijus(baaijusId);
      res.json({ message: "Baaijus deleted successfully" });
    } catch (error) {
      console.error("Error deleting baaijus:", error);
      res.status(500).json({ message: "Failed to delete baaijus" });
    }
  });

  // Content filtering route
  app.post("/api/filter", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { content, baaijusId } = req.body;

      if (!content || !baaijusId) {
        return res.status(400).json({ message: "Content and baaijusId are required" });
      }

      // Get the baaijus
      const baaijus = await storage.getBaaijusById(baaijusId);
      if (!baaijus || baaijus.userId !== userId) {
        return res.status(404).json({ message: "Baaijus not found" });
      }

      // Parse keywords
      const keywords = baaijus.keywords ? baaijus.keywords.split(',').map((k: string) => k.trim()) : [];

      // Analyze content
      const analysis = await analyzeContent(content, keywords, baaijus.sensitivity as any);

      // Store filter result
      const filterResult = await storage.createFilterResult({
        userId,
        baaijusId,
        content,
        isBlocked: analysis.isBlocked,
        confidence: analysis.confidence,
        analysis: analysis.analysis,
        matchedKeywords: JSON.stringify(analysis.matchedKeywords),
      });

      // Update usage count
      await storage.updateBaaijusUsage(baaijusId);

      res.json({
        ...analysis,
        filterId: filterResult.id,
      });
    } catch (error) {
      console.error("Error filtering content:", error);
      res.status(500).json({ message: "Failed to filter content" });
    }
  });

  // Public baaijuses route
  app.get("/api/public/baaijuses", async (req, res) => {
    try {
      const publicBaaijuses = await storage.getPublicBaaijuses();
      res.json(publicBaaijuses);
    } catch (error) {
      console.error("Error fetching public baaijuses:", error);
      res.status(500).json({ message: "Failed to fetch public baaijuses" });
    }
  });

  // User stats route
  app.get("/api/user/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Filter results route
  app.get("/api/filter-results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const results = await storage.getFilterResultsByUserId(userId, limit);
      res.json(results);
    } catch (error) {
      console.error("Error fetching filter results:", error);
      res.status(500).json({ message: "Failed to fetch filter results" });
    }
  });

  // Admin routes
  app.get("/api/admin/revenue", isAuthenticated, requireRole(['master_admin']), async (req: any, res) => {
    try {
      const adminStats = await storage.getAdminRevenue();
      res.json(adminStats);
    } catch (error) {
      console.error("Error fetching admin revenue:", error);
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/admin/signups", isAuthenticated, requireRole(['master_admin']), async (req: any, res) => {
    try {
      const signupStats = await storage.getSignupStats();
      res.json(signupStats);
    } catch (error) {
      console.error("Error fetching signup stats:", error);
      res.status(500).json({ message: "Failed to fetch signup data" });
    }
  });

  app.get("/api/admin/popular-baaijuses", isAuthenticated, requireRole(['master_admin']), async (req: any, res) => {
    try {
      const popularBaaijuses = await storage.getPopularBaaijuses();
      res.json(popularBaaijuses);
    } catch (error) {
      console.error("Error fetching popular baaijuses:", error);
      res.status(500).json({ message: "Failed to fetch popular baaijuses" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, requireRole(['master_admin']), async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/export", isAuthenticated, requireRole(['master_admin']), async (req: any, res) => {
    try {
      // Generate export data
      const exportData = await storage.getExportData();
      res.json({ 
        url: `/exports/baaijus-report-${new Date().toISOString().split('T')[0]}.csv`,
        data: exportData
      });
    } catch (error) {
      console.error("Error generating export:", error);
      res.status(500).json({ message: "Failed to generate export" });
    }
  });

  // Serve extension ZIP download
  app.get('/baaijus-extension.zip', (req, res) => {
    const zipPath = path.join(process.cwd(), 'baaijus-extension.zip');
    res.download(zipPath, (err) => {
      if (err) {
        res.status(404).json({ message: 'Extension file not found' });
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}