import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key" });

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert YouTube trend analyzer with deep knowledge of content categories, monetization, and audience behavior. Your task is to analyze current YouTube trends and provide comprehensive insights."
        },
        {
          role: "user",
          content: `Analyze current YouTube niche trends and provide detailed information in a structured JSON format with the following:
          
          1. A list of the top 10 YouTube niches with their:
             - name
             - growthRate (percent, can be negative)
             - competition level (Low, Medium, High, Very High)
             - revenuePotential (CPM in USD)
             - trend (up or down)
          
          2. Competitive insights including:
             - leastCompetitive niche
             - mostCompetitive niche
             - bestEntryPoint for new creators
             - fastestGrowing niche
          
          3. Monetization insights including:
             - highestCPM niche with dollar amount
             - lowestCPM niche with dollar amount
             - bestSponsorship niche
             - bestLongTerm monetization niche
          
          4. Two specific AI-powered recommendations for unique niche combinations with titles and detailed descriptions
          
          5. Overall metrics highlighting:
             - topGrowingNiche name
             - topGrowingPercentage value
             - mostProfitableNiche name
             - mostProfitableCPM value in USD
             - lowestCompetitionNiche name
             - lowestCompetitionPercentage as growth potential
          
          Make the response realistic and useful for content creators. Use current trends based on your knowledge.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as NicheAnalysisResult;
  } catch (error) {
    console.error("Error analyzing YouTube niches:", error);
    throw new Error("Failed to analyze YouTube niches: " + (error as Error).message);
  }
}

export async function getTrendingData(): Promise<TrendingDataResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in YouTube analytics and trends."
        },
        {
          role: "user",
          content: `Generate trending data for 10 YouTube content categories in JSON format.
          
          Return the data in this format:
          {
            "categories": ["Category1", "Category2", ...],
            "percentages": [number1, number2, ...]
          }
          
          The categories should be short names like "Tech", "Gaming", etc.
          The percentages should be popularity scores between 40 and 95.
          Make sure the data reflects current trends based on your knowledge.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as TrendingDataResult;
  } catch (error) {
    console.error("Error getting trending data:", error);
    throw new Error("Failed to get trending data: " + (error as Error).message);
  }
}
