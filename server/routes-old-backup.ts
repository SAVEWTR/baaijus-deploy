import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { analyzeContent, generateBaajusDescription } from "./openai";
import { insertBaaijusSchema, insertFilterResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

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
        profileImageUrl: user.profileImageUrl
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Baajus routes
  app.get("/api/baaijuses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baaijuses = await storage.getBaaijusesByUserId(userId);
      res.json(baaijuses);
    } catch (error) {
      console.error("Error fetching baaijuses:", error);
      res.status(500).json({ message: "Failed to fetch baaijuses" });
    }
  });

  app.post("/api/baajuses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baaijusData = insertBaaijusSchema.parse({
        ...req.body,
        userId,
      });

      // Generate description if not provided
      if (!baajusData.description && baajusData.keywords) {
        const keywords = baajusData.keywords.split(',').map(k => k.trim()).filter(Boolean);
        baajusData.description = await generateBaajusDescription(baajusData.name, keywords);
      }

      const baajus = await storage.createBaajus(baajusData);
      res.json(baajus);
    } catch (error) {
      console.error("Error creating baajus:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create baajus" });
      }
    }
  });

  app.put("/api/baajuses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baajusId = parseInt(req.params.id);
      
      // Check if user owns this baajus
      const existingBaajus = await storage.getBaajusById(baajusId);
      if (!existingBaajus || existingBaajus.userId !== userId) {
        return res.status(404).json({ message: "Baajus not found" });
      }

      const updates = insertBaajusSchema.partial().parse(req.body);
      const updatedBaajus = await storage.updateBaajus(baajusId, updates);
      res.json(updatedBaajus);
    } catch (error) {
      console.error("Error updating baajus:", error);
      res.status(500).json({ message: "Failed to update baajus" });
    }
  });

  app.delete("/api/baajuses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const baajusId = parseInt(req.params.id);
      
      // Check if user owns this baajus
      const existingBaajus = await storage.getBaajusById(baajusId);
      if (!existingBaajus || existingBaajus.userId !== userId) {
        return res.status(404).json({ message: "Baajus not found" });
      }

      await storage.deleteBaajus(baajusId);
      res.json({ message: "Baajus deleted successfully" });
    } catch (error) {
      console.error("Error deleting baajus:", error);
      res.status(500).json({ message: "Failed to delete baajus" });
    }
  });

  // Content filtering route
  app.post("/api/filter", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { content, baajusId } = req.body;

      if (!content || !baajusId) {
        return res.status(400).json({ message: "Content and baajusId are required" });
      }

      // Get the baajus
      const baajus = await storage.getBaajusById(baajusId);
      if (!baajus || baajus.userId !== userId) {
        return res.status(404).json({ message: "Baajus not found" });
      }

      // Parse keywords
      const keywords = baajus.keywords 
        ? baajus.keywords.split(',').map(k => k.trim()).filter(Boolean)
        : [];

      // Analyze content with OpenAI
      const analysis = await analyzeContent(
        content,
        keywords,
        baajus.sensitivity as "permissive" | "balanced" | "strict"
      );

      // Save filter result
      const filterResult = await storage.createFilterResult({
        userId,
        baajusId,
        content,
        isBlocked: analysis.isBlocked,
        confidence: analysis.confidence,
        analysis: analysis.analysis,
        matchedKeywords: JSON.stringify(analysis.matchedKeywords),
      });

      // Update baajus usage
      await storage.updateBaajusUsage(baajusId);

      res.json({
        ...analysis,
        filterId: filterResult.id,
      });
    } catch (error) {
      console.error("Error filtering content:", error);
      res.status(500).json({ message: "Failed to filter content" });
    }
  });

  // Get public baajuses
  app.get("/api/baajuses/public", async (req, res) => {
    try {
      const publicBaajuses = await storage.getPublicBaajuses();
      res.json(publicBaajuses);
    } catch (error) {
      console.error("Error fetching public baajuses:", error);
      res.status(500).json({ message: "Failed to fetch public baajuses" });
    }
  });

  // User stats route
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Filter results history
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

  const httpServer = createServer(app);
  return httpServer;
}
