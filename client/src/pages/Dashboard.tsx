import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OverviewMetrics } from "@/components/dashboard/OverviewMetrics";
import { TrendAnalysisChart } from "@/components/dashboard/TrendAnalysisChart";
import { TopNichesTable } from "@/components/dashboard/TopNichesTable";
import { NicheInsightsCards } from "@/components/dashboard/NicheInsightsCards";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isMobile } = useMobile();
  const { toast } = useToast();

  // Check if API needs initialization on first load
  useEffect(() => {
    const checkData = async () => {
      try {
        const metricsRes = await fetch("/api/metrics");
        if (metricsRes.status === 404) {
          toast({
            title: "Initializing analysis",
            description: "We're analyzing YouTube trends. This will take a moment...",
          });
          
          await apiRequest("POST", "/api/analyze", {});
          
          toast({
            title: "Analysis complete!",
            description: "Your YouTube niche insights are ready to explore.",
          });
        }
      } catch (error) {
        console.error("Error checking data:", error);
      }
    };
    
    checkData();
  }, [toast]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const refreshAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      
      toast({
        title: "Refreshing AI video niche analysis",
        description: "We're analyzing the latest YouTube AI content trends. This will take a moment...",
      });
      
      await apiRequest("POST", "/api/analyze", {});
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/niches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights/niche"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights/monetization"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending"] });
      
      toast({
        title: "Analysis complete!",
        description: "Your AI video niche insights have been updated with the latest data.",
      });
      
    } catch (error) {
      console.error("Error refreshing analysis:", error);
      
      // Check if it's an API quota error
      let errorMessage = "There was an error updating the AI video niche analysis.";
      
      if (error instanceof Error && 
          (error.message.includes("quota") || error.message.includes("429"))) {
        errorMessage = "OpenAI API quota exceeded. Please go to Settings to update your API key.";
        // After a short delay, navigate to the settings page
        setTimeout(() => {
          window.location.href = '/settings';
        }, 3000);
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        
        <main className="flex-1 overflow-y-auto bg-youtube-light-gray p-4">
          {/* Page Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-youtube-black">AI Video Niche Analysis</h1>
              <p className="text-youtube-gray">Real-time insights for AI-focused YouTube content creators</p>
            </div>
            <Button 
              onClick={refreshAnalysis}
              disabled={isAnalyzing}
              className="bg-youtube-red hover:bg-red-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <span className="material-icons animate-spin mr-2">refresh</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-icons mr-2">refresh</span>
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
          
          {/* Main Content */}
          <OverviewMetrics />
          <TrendAnalysisChart />
          <TopNichesTable />
          <NicheInsightsCards />
          <AIRecommendations />
        </main>
      </div>
    </div>
  );
}
