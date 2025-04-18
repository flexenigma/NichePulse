import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderProps {
  className?: string;
  toggleSidebar?: () => void;
  isMobile: boolean;
}

export function Header({ className, toggleSidebar, isMobile }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRefreshAnalysis = async () => {
    try {
      setIsRefreshing(true);
      toast({
        title: "Starting analysis...",
        description: "This may take a moment as we analyze YouTube trends.",
      });
      
      await apiRequest("POST", "/api/analyze", {});
      
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["/api/niches"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/insights/niche"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/insights/monetization"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/trending"] });
      
      toast({
        title: "Analysis complete!",
        description: "All insights have been updated with the latest data.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Unable to refresh analysis. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {isMobile && (
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="p-2 text-gray-500 rounded-md"
              onClick={toggleSidebar}
            >
              <span className="material-icons">menu</span>
            </button>
            <div className="ml-2 flex items-center">
              <span className="material-icons text-youtube-red mr-2">smart_display</span>
              <h1 className="text-lg font-bold text-youtube-black">NicheAI</h1>
            </div>
          </div>
        )}
        
        <div className="hidden md:block">
          <div className="relative">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
            <Input 
              type="text" 
              placeholder="Search for niches..." 
              className="block w-64 pl-10 pr-4 py-2"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            size="sm"
            onClick={handleRefreshAnalysis}
            disabled={isRefreshing}
            className="bg-youtube-red hover:bg-red-700 text-white"
          >
            <span className="material-icons text-sm mr-1">
              {isRefreshing ? "sync" : "refresh"}
            </span>
            {isRefreshing ? "Analyzing..." : "Refresh Analysis"}
          </Button>
          <button type="button" className="ml-3 p-1.5 rounded-full bg-gray-100 text-gray-500">
            <span className="material-icons">notifications</span>
          </button>
          <div className="ml-3 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="material-icons text-sm">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
