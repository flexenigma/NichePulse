import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrendingData } from "@shared/schema";

type TimeRange = "Weekly" | "Monthly" | "Quarterly";

export function TrendAnalysisChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Weekly");
  
  const { data: trendingData, isLoading } = useQuery<TrendingData[]>({
    queryKey: ["/api/trending"],
  });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-64" />
            <div className="flex">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16 ml-4" />
              <Skeleton className="h-5 w-16 ml-4" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!trendingData || trendingData.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-youtube-black">Trending Niches (Last 30 Days)</h2>
            <div className="flex">
              <Button variant="ghost" size="sm" className="text-youtube-blue">Weekly</Button>
              <Button variant="ghost" size="sm" className="text-youtube-gray">Monthly</Button>
              <Button variant="ghost" size="sm" className="text-youtube-gray">Quarterly</Button>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No trending data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-youtube-black">
            Trending Niches (Last {timeRange === "Weekly" ? "7" : timeRange === "Monthly" ? "30" : "90"} Days)
          </h2>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className={timeRange === "Weekly" ? "text-youtube-blue" : "text-youtube-gray"}
              onClick={() => setTimeRange("Weekly")}
            >
              Weekly
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={timeRange === "Monthly" ? "text-youtube-blue" : "text-youtube-gray"}
              onClick={() => setTimeRange("Monthly")}
            >
              Monthly
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={timeRange === "Quarterly" ? "text-youtube-blue" : "text-youtube-gray"}
              onClick={() => setTimeRange("Quarterly")}
            >
              Quarterly
            </Button>
          </div>
        </div>
        
        <div className="chart-container relative h-64">
          {trendingData.map((item, index) => (
            <div 
              key={item.id}
              className="chart-bar absolute bottom-0 w-[8%] bg-youtube-blue rounded-t-md transition-all duration-500 ease-out"
              style={{
                left: `${index * 10 + 2}%`,
                height: `${item.percentage}%`,
                // Add a slight animation delay based on index
                transitionDelay: `${index * 50}ms`
              }}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-10 text-center text-xs text-youtube-gray mt-2">
          {trendingData.map((item) => (
            <div key={item.id}>{item.category}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
