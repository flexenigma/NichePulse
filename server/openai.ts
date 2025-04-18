import OpenAI from "openai";

// Helper function to get OpenAI client with the latest API key
function getOpenAIClient() {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Initialize a default client just in case
const openaiClient = getOpenAIClient();

export interface NicheAnalysisResult {
  niches: {
    name: string;
    growthRate: number;
    competition: string;
    revenuePotential: number;
    trend: string;
  }[];
  insights: {
    leastCompetitive: string;
    mostCompetitive: string;
    bestEntryPoint: string;
    fastestGrowing: string;
  };
  monetization: {
    highestCPM: string;
    lowestCPM: string;
    bestSponsorship: string;
    bestLongTerm: string;
  };
  recommendations: {
    title: string;
    description: string;
  }[];
  metrics: {
    topGrowingNiche: string;
    topGrowingPercentage: number;
    mostProfitableNiche: string;
    mostProfitableCPM: number;
    lowestCompetitionNiche: string;
    lowestCompetitionPercentage: number;
  };
}

export interface TrendingDataResult {
  categories: string[];
  percentages: number[];
}

export async function analyzeYoutubeNiches(): Promise<NicheAnalysisResult> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert YouTube trend analyzer with deep knowledge of AI-related content categories, monetization, and audience behavior. Your task is to analyze current AI-related YouTube trends and provide comprehensive insights backed by real YouTube trend data."
        },
        {
          role: "user",
          content: `Analyze current YouTube AI-focused niche trends and provide detailed information in a structured JSON format with the following:
          
          1. A list of the top 10 AI-related YouTube niches with their:
             - name (focus on niches like Video Editing with AI, Prompt Engineering, Text-to-Image AI, AI Music Production, AI Coding Assistants, etc.)
             - growthRate (percent, can be negative)
             - competition level (Low, Medium, High, Very High)
             - revenuePotential (CPM in USD)
             - trend (up or down)
          
          2. Competitive insights including:
             - leastCompetitive AI niche
             - mostCompetitive AI niche
             - bestEntryPoint for new creators in the AI space
             - fastestGrowing AI video content niche
          
          3. Monetization insights including:
             - highestCPM AI niche with dollar amount
             - lowestCPM AI niche with dollar amount
             - bestSponsorship opportunities for AI content
             - bestLongTerm monetization strategy for AI video creators
          
          4. Two specific AI-powered recommendations for unique AI niche combinations with titles and detailed descriptions
          
          5. Overall metrics highlighting:
             - topGrowingNiche name within AI video content
             - topGrowingPercentage value
             - mostProfitableNiche name for AI content
             - mostProfitableCPM value in USD
             - lowestCompetitionNiche name in AI space
             - lowestCompetitionPercentage as growth potential
          
          Make the response realistic and useful for AI content creators. Use current trends based on real YouTube analytics and data.
          Focus only on AI-related niches like AI tools, AI techniques, AI applications in art, music, coding, video editing, etc.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    return result as NicheAnalysisResult;
  } catch (error) {
    console.error("Error analyzing YouTube niches:", error);
    // Check if the error is related to exceeding quota
    if (error instanceof Error && 
        (error.message.includes("quota") || error.message.includes("429") || error.message.includes("insufficient_quota"))) {
      throw new Error("API quota exceeded: Please check your OpenAI API key or billing details.");
    }
    throw new Error("Failed to analyze YouTube niches: " + (error as Error).message);
  }
}

export async function getTrendingData(): Promise<TrendingDataResult> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in YouTube analytics and trends focusing specifically on AI-related content. Your analysis is based on real YouTube trend data and actual channel performance metrics."
        },
        {
          role: "user",
          content: `Generate trending data for the top 10 AI-focused YouTube content niches based on real YouTube analytics and trend data. Focus specifically on AI video creation tools, techniques, and applications.
          
          Return the data in this format:
          {
            "categories": ["Category1", "Category2", ...],
            "percentages": [number1, number2, ...]
          }
          
          The categories should be specific AI niches like "AI Video Editing", "Prompt Engineering", "Text-to-Image AI", "AI Music Production", etc.
          The percentages should be popularity/growth scores between 40 and 95 reflecting their current performance on YouTube.
          
          Make sure the data reflects current real-world AI YouTube trends as of 2024, using your knowledge of actual YouTube performance metrics for these niches.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    return result as TrendingDataResult;
  } catch (error) {
    console.error("Error getting trending data:", error);
    // Check if the error is related to exceeding quota
    if (error instanceof Error && 
        (error.message.includes("quota") || error.message.includes("429") || error.message.includes("insufficient_quota"))) {
      throw new Error("API quota exceeded: Please check your OpenAI API key or billing details.");
    }
    throw new Error("Failed to get trending data: " + (error as Error).message);
  }
}
