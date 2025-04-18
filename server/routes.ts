import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeYoutubeNiches, getTrendingData } from "./openai";
import { 
  insertYoutubeNicheSchema, 
  insertNicheInsightSchema, 
  insertMonetizationInsightSchema, 
  insertAiRecommendationSchema,
  insertNicheMetricSchema,
  insertTrendingDataSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST update OpenAI API key
  app.post("/api/settings/openai-key", async (req: Request, res: Response) => {
    try {
      const { openaiApiKey } = req.body;
      
      if (!openaiApiKey) {
        return res.status(400).json({ message: "OpenAI API key is required" });
      }
      
      // In a real app, we would securely store this key
      // For this demo, we'll set it in env vars for the current session
      process.env.OPENAI_API_KEY = openaiApiKey;
      
      res.json({ message: "OpenAI API key updated successfully" });
    } catch (error) {
      console.error("Error updating OpenAI API key:", error);
      res.status(500).json({ message: "Failed to update OpenAI API key", error: (error as Error).message });
    }
  });
  // GET all niches
  app.get("/api/niches", async (_req: Request, res: Response) => {
    try {
      const niches = await storage.getAllNiches();
      res.json(niches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch niches", error: (error as Error).message });
    }
  });

  // GET single niche by ID
  app.get("/api/niches/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const niche = await storage.getNiche(id);
      if (!niche) {
        return res.status(404).json({ message: "Niche not found" });
      }
      
      res.json(niche);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch niche", error: (error as Error).message });
    }
  });

  // GET niche insights
  app.get("/api/insights/niche", async (_req: Request, res: Response) => {
    try {
      const insights = await storage.getNicheInsights();
      if (insights.length === 0) {
        return res.status(404).json({ message: "No niche insights found" });
      }
      
      // Return the most recent insights
      res.json(insights[insights.length - 1]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch niche insights", error: (error as Error).message });
    }
  });

  // GET monetization insights
  app.get("/api/insights/monetization", async (_req: Request, res: Response) => {
    try {
      const insights = await storage.getMonetizationInsights();
      if (insights.length === 0) {
        return res.status(404).json({ message: "No monetization insights found" });
      }
      
      // Return the most recent insights
      res.json(insights[insights.length - 1]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monetization insights", error: (error as Error).message });
    }
  });

  // GET AI recommendations
  app.get("/api/recommendations", async (_req: Request, res: Response) => {
    try {
      const recommendations = await storage.getAIRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI recommendations", error: (error as Error).message });
    }
  });

  // GET niche metrics
  app.get("/api/metrics", async (_req: Request, res: Response) => {
    try {
      const metrics = await storage.getNicheMetrics();
      if (!metrics) {
        return res.status(404).json({ message: "No metrics found" });
      }
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics", error: (error as Error).message });
    }
  });

  // GET trending data
  app.get("/api/trending", async (_req: Request, res: Response) => {
    try {
      const trendingData = await storage.getAllTrendingData();
      res.json(trendingData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending data", error: (error as Error).message });
    }
  });

  // POST trigger a new analysis with OpenAI
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      console.log("Starting AI video niche analysis...");
      // Call OpenAI to analyze YouTube niches focused on AI content
      const analysisResult = await analyzeYoutubeNiches();
      
      // Clear existing data (in a real application, you might archive it instead)
      // For simplicity, we're just adding new data in this implementation
      
      // Store niches
      const niches = await Promise.all(
        analysisResult.niches.map(async (niche) => {
          const validatedNiche = insertYoutubeNicheSchema.parse(niche);
          return await storage.createNiche(validatedNiche);
        })
      );
      
      // Store niche insights
      const validatedNicheInsights = insertNicheInsightSchema.parse({
        category: "competition",
        ...analysisResult.insights
      });
      const nicheInsights = await storage.createNicheInsights(validatedNicheInsights);
      
      // Store monetization insights
      const validatedMonetizationInsights = insertMonetizationInsightSchema.parse(analysisResult.monetization);
      const monetizationInsights = await storage.createMonetizationInsights(validatedMonetizationInsights);
      
      // Store AI recommendations
      const recommendations = await Promise.all(
        analysisResult.recommendations.map(async (recommendation) => {
          const validatedRecommendation = insertAiRecommendationSchema.parse(recommendation);
          return await storage.createAIRecommendation(validatedRecommendation);
        })
      );
      
      // Store niche metrics
      const validatedNicheMetrics = insertNicheMetricSchema.parse(analysisResult.metrics);
      const nicheMetrics = await storage.createNicheMetrics(validatedNicheMetrics);
      
      // Get updated trending data
      const trendingResult = await getTrendingData();
      
      // Store trending data
      const trendingData = await Promise.all(
        trendingResult.categories.map(async (category, index) => {
          const validatedTrending = insertTrendingDataSchema.parse({
            category,
            percentage: trendingResult.percentages[index]
          });
          return await storage.createTrendingData(validatedTrending);
        })
      );
      
      res.json({
        message: "Analysis complete",
        niches,
        nicheInsights,
        monetizationInsights,
        recommendations,
        nicheMetrics,
        trendingData
      });
    } catch (error) {
      console.error("Analysis error:", error);
      
      // Check if it's a quota exceeded error
      if (error instanceof Error && error.message.includes("quota")) {
        return res.status(429).json({ 
          message: "OpenAI API quota exceeded", 
          error: "Please check your API key and billing details before trying again." 
        });
      }
      
      res.status(500).json({ message: "Failed to analyze YouTube niches", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
