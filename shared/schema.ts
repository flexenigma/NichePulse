import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original user table, kept for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// YouTube niche related tables
export const youtubeNiches = pgTable("youtube_niches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  growthRate: real("growth_rate").notNull(),
  competition: text("competition").notNull(),
  revenuePotential: real("revenue_potential").notNull(),
  trend: text("trend").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertYoutubeNicheSchema = createInsertSchema(youtubeNiches).omit({
  id: true,
  createdAt: true,
});

export type InsertYoutubeNiche = z.infer<typeof insertYoutubeNicheSchema>;
export type YoutubeNiche = typeof youtubeNiches.$inferSelect;

export const nicheInsights = pgTable("niche_insights", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  leastCompetitive: text("least_competitive").notNull(),
  mostCompetitive: text("most_competitive").notNull(),
  bestEntryPoint: text("best_entry_point").notNull(),
  fastestGrowing: text("fastest_growing").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNicheInsightSchema = createInsertSchema(nicheInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertNicheInsight = z.infer<typeof insertNicheInsightSchema>;
export type NicheInsight = typeof nicheInsights.$inferSelect;

export const monetizationInsights = pgTable("monetization_insights", {
  id: serial("id").primaryKey(),
  highestCPM: text("highest_cpm").notNull(),
  lowestCPM: text("lowest_cpm").notNull(),
  bestSponsorship: text("best_sponsorship").notNull(),
  bestLongTerm: text("best_long_term").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMonetizationInsightSchema = createInsertSchema(monetizationInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertMonetizationInsight = z.infer<typeof insertMonetizationInsightSchema>;
export type MonetizationInsight = typeof monetizationInsights.$inferSelect;

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;

export const nicheMetrics = pgTable("niche_metrics", {
  id: serial("id").primaryKey(),
  topGrowingNiche: text("top_growing_niche").notNull(),
  topGrowingPercentage: real("top_growing_percentage").notNull(),
  mostProfitableNiche: text("most_profitable_niche").notNull(),
  mostProfitableCPM: real("most_profitable_cpm").notNull(),
  lowestCompetitionNiche: text("lowest_competition_niche").notNull(),
  lowestCompetitionPercentage: real("lowest_competition_percentage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNicheMetricSchema = createInsertSchema(nicheMetrics).omit({
  id: true,
  createdAt: true,
});

export type InsertNicheMetric = z.infer<typeof insertNicheMetricSchema>;
export type NicheMetric = typeof nicheMetrics.$inferSelect;

export const trendingData = pgTable("trending_data", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  percentage: real("percentage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrendingDataSchema = createInsertSchema(trendingData).omit({
  id: true,
  createdAt: true,
});

export type InsertTrendingData = z.infer<typeof insertTrendingDataSchema>;
export type TrendingData = typeof trendingData.$inferSelect;
