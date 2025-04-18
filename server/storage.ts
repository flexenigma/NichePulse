import { 
  users, type User, type InsertUser,
  youtubeNiches, type YoutubeNiche, type InsertYoutubeNiche,
  nicheInsights, type NicheInsight, type InsertNicheInsight,
  monetizationInsights, type MonetizationInsight, type InsertMonetizationInsight,
  aiRecommendations, type AiRecommendation, type InsertAiRecommendation,
  nicheMetrics, type NicheMetric, type InsertNicheMetric,
  trendingData, type TrendingData, type InsertTrendingData
} from "@shared/schema";

// Interface with all CRUD methods needed for the application
export interface IStorage {
  // User methods - kept from original
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // YouTube niches methods
  getAllNiches(): Promise<YoutubeNiche[]>;
  getNiche(id: number): Promise<YoutubeNiche | undefined>;
  createNiche(niche: InsertYoutubeNiche): Promise<YoutubeNiche>;
  updateNiche(id: number, niche: Partial<InsertYoutubeNiche>): Promise<YoutubeNiche | undefined>;
  deleteNiche(id: number): Promise<boolean>;
  
  // Niche insights methods
  getNicheInsights(): Promise<NicheInsight[]>;
  createNicheInsights(insights: InsertNicheInsight): Promise<NicheInsight>;
  
  // Monetization insights methods
  getMonetizationInsights(): Promise<MonetizationInsight[]>;
  createMonetizationInsights(insights: InsertMonetizationInsight): Promise<MonetizationInsight>;
  
  // AI recommendations methods
  getAIRecommendations(): Promise<AiRecommendation[]>;
  createAIRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  
  // Niche metrics methods
  getNicheMetrics(): Promise<NicheMetric | undefined>;
  createNicheMetrics(metrics: InsertNicheMetric): Promise<NicheMetric>;
  
  // Trending data methods
  getAllTrendingData(): Promise<TrendingData[]>;
  createTrendingData(data: InsertTrendingData): Promise<TrendingData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private niches: Map<number, YoutubeNiche>;
  private insights: Map<number, NicheInsight>;
  private monetization: Map<number, MonetizationInsight>;
  private recommendations: Map<number, AiRecommendation>;
  private metrics: Map<number, NicheMetric>;
  private trending: Map<number, TrendingData>;
  
  private userId: number;
  private nicheId: number;
  private insightId: number;
  private monetizationId: number;
  private recommendationId: number;
  private metricId: number;
  private trendingId: number;

  constructor() {
    this.users = new Map();
    this.niches = new Map();
    this.insights = new Map();
    this.monetization = new Map();
    this.recommendations = new Map();
    this.metrics = new Map();
    this.trending = new Map();
    
    this.userId = 1;
    this.nicheId = 1;
    this.insightId = 1;
    this.monetizationId = 1;
    this.recommendationId = 1;
    this.metricId = 1;
    this.trendingId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // YouTube niches methods
  async getAllNiches(): Promise<YoutubeNiche[]> {
    return Array.from(this.niches.values());
  }
  
  async getNiche(id: number): Promise<YoutubeNiche | undefined> {
    return this.niches.get(id);
  }
  
  async createNiche(insertNiche: InsertYoutubeNiche): Promise<YoutubeNiche> {
    const id = this.nicheId++;
    const createdAt = new Date();
    const niche: YoutubeNiche = { ...insertNiche, id, createdAt };
    this.niches.set(id, niche);
    return niche;
  }
  
  async updateNiche(id: number, updates: Partial<InsertYoutubeNiche>): Promise<YoutubeNiche | undefined> {
    const existingNiche = this.niches.get(id);
    if (!existingNiche) {
      return undefined;
    }
    
    const updatedNiche: YoutubeNiche = { ...existingNiche, ...updates };
    this.niches.set(id, updatedNiche);
    return updatedNiche;
  }
  
  async deleteNiche(id: number): Promise<boolean> {
    return this.niches.delete(id);
  }
  
  // Niche insights methods
  async getNicheInsights(): Promise<NicheInsight[]> {
    return Array.from(this.insights.values());
  }
  
  async createNicheInsights(insertInsights: InsertNicheInsight): Promise<NicheInsight> {
    const id = this.insightId++;
    const createdAt = new Date();
    const insight: NicheInsight = { ...insertInsights, id, createdAt };
    this.insights.set(id, insight);
    return insight;
  }
  
  // Monetization insights methods
  async getMonetizationInsights(): Promise<MonetizationInsight[]> {
    return Array.from(this.monetization.values());
  }
  
  async createMonetizationInsights(insertMonetization: InsertMonetizationInsight): Promise<MonetizationInsight> {
    const id = this.monetizationId++;
    const createdAt = new Date();
    const insight: MonetizationInsight = { ...insertMonetization, id, createdAt };
    this.monetization.set(id, insight);
    return insight;
  }
  
  // AI recommendations methods
  async getAIRecommendations(): Promise<AiRecommendation[]> {
    return Array.from(this.recommendations.values());
  }
  
  async createAIRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.recommendationId++;
    const createdAt = new Date();
    const recommendation: AiRecommendation = { ...insertRecommendation, id, createdAt };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }
  
  // Niche metrics methods
  async getNicheMetrics(): Promise<NicheMetric | undefined> {
    if (this.metrics.size === 0) {
      return undefined;
    }
    
    // Return the latest metrics (highest ID)
    const metricIds = Array.from(this.metrics.keys()).sort((a, b) => b - a);
    return this.metrics.get(metricIds[0]);
  }
  
  async createNicheMetrics(insertMetrics: InsertNicheMetric): Promise<NicheMetric> {
    const id = this.metricId++;
    const createdAt = new Date();
    const metrics: NicheMetric = { ...insertMetrics, id, createdAt };
    this.metrics.set(id, metrics);
    return metrics;
  }
  
  // Trending data methods
  async getAllTrendingData(): Promise<TrendingData[]> {
    return Array.from(this.trending.values());
  }
  
  async createTrendingData(insertTrending: InsertTrendingData): Promise<TrendingData> {
    const id = this.trendingId++;
    const createdAt = new Date();
    const trending: TrendingData = { ...insertTrending, id, createdAt };
    this.trending.set(id, trending);
    return trending;
  }
  
  // Initialize with sample data for development
  private initializeSampleData() {
    // This is just initial data structure, the actual data will be generated by AI
    
    // Sample niches
    const sampleNiches: InsertYoutubeNiche[] = [
      { name: "Gaming Commentary", growthRate: 24.8, competition: "High", revenuePotential: 14.2, trend: "up" },
      { name: "Finance Education", growthRate: 22.1, competition: "Medium", revenuePotential: 18.4, trend: "up" },
      { name: "Tech Reviews", growthRate: 19.7, competition: "High", revenuePotential: 16.3, trend: "up" },
      { name: "Fitness & Workout", growthRate: 17.5, competition: "Medium", revenuePotential: 12.8, trend: "up" },
      { name: "Science Experiments", growthRate: 16.4, competition: "Low", revenuePotential: 10.2, trend: "up" },
      { name: "Home DIY", growthRate: 15.2, competition: "Medium", revenuePotential: 11.5, trend: "up" },
      { name: "Cooking Tutorials", growthRate: 12.8, competition: "High", revenuePotential: 13.4, trend: "up" },
      { name: "Educational Animation", growthRate: 11.2, competition: "Low", revenuePotential: 9.8, trend: "up" },
      { name: "Product Unboxing", growthRate: -2.4, competition: "High", revenuePotential: 15.6, trend: "down" },
      { name: "Vlogging", growthRate: -3.8, competition: "Very High", revenuePotential: 10.9, trend: "down" }
    ];
    
    sampleNiches.forEach(niche => this.createNiche(niche));
    
    // Sample niche insights
    this.createNicheInsights({
      category: "competition",
      leastCompetitive: "Science Experiments",
      mostCompetitive: "Vlogging",
      bestEntryPoint: "Educational Animation",
      fastestGrowing: "Gaming Commentary"
    });
    
    // Sample monetization insights
    this.createMonetizationInsights({
      highestCPM: "Finance Education ($18.40)",
      lowestCPM: "Educational Animation ($9.80)",
      bestSponsorship: "Tech Reviews",
      bestLongTerm: "Finance Education"
    });
    
    // Sample AI recommendations
    this.createAIRecommendation({
      title: "Gaming Commentary + Educational Content",
      description: "Our AI analysis suggests combining gaming commentary with educational elements could create a unique niche with high growth potential and moderate competition. Educational gaming content has 32% higher retention than pure entertainment gaming."
    });
    
    this.createAIRecommendation({
      title: "Science Experiments with DIY Elements",
      description: "There's significant opportunity in creating science content that includes DIY components. Our analysis shows this combination has 74% less competition than mainstream science channels while maintaining strong monetization potential."
    });
    
    // Sample niche metrics
    this.createNicheMetrics({
      topGrowingNiche: "Gaming Commentary",
      topGrowingPercentage: 24.8,
      mostProfitableNiche: "Finance Education",
      mostProfitableCPM: 18.4,
      lowestCompetitionNiche: "Science Experiments",
      lowestCompetitionPercentage: 74.0
    });
    
    // Sample trending data
    const categories = ["Tech", "Gaming", "DIY", "Finance", "Fitness", "Food", "Travel", "Beauty", "Education", "Music"];
    const percentages = [65, 85, 45, 90, 75, 60, 80, 70, 95, 50];
    
    categories.forEach((category, index) => {
      this.createTrendingData({
        category,
        percentage: percentages[index]
      });
    });
  }
}

export const storage = new MemStorage();
