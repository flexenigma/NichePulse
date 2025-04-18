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

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-youtube-black">AI Video Niche Analysis</h1>
            <p className="text-youtube-gray">Real-time insights for AI-focused YouTube content creators</p>
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
