import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { NicheMetric } from "@shared/schema";

export function OverviewMetrics() {
  const { data: metrics, isLoading } = useQuery<NicheMetric>({
    queryKey: ["/api/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-8 w-48 mt-2" />
              <div className="flex items-center mt-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24 ml-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-center py-4 text-muted-foreground">No metrics available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Top Growing Niche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-youtube-gray font-medium text-sm">Top Growing Niche</h3>
            <span className="material-icons text-youtube-red">trending_up</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-youtube-black">{metrics.topGrowingNiche}</p>
            <div className="flex items-center mt-1">
              <span className="text-green-500 font-medium">+{metrics.topGrowingPercentage}%</span>
              <span className="text-youtube-gray text-sm ml-2">vs last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Most Profitable Niche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-youtube-gray font-medium text-sm">Most Profitable Niche</h3>
            <span className="material-icons text-green-500">attach_money</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-youtube-black">{metrics.mostProfitableNiche}</p>
            <div className="flex items-center mt-1">
              <span className="text-green-500 font-medium">${metrics.mostProfitableCPM.toFixed(2)} CPM</span>
              <span className="text-youtube-gray text-sm ml-2">avg. monetization</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Lowest Competition */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-youtube-gray font-medium text-sm">Lowest Competition</h3>
            <span className="material-icons text-youtube-blue">emoji_events</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-youtube-black">{metrics.lowestCompetitionNiche}</p>
            <div className="flex items-center mt-1">
              <span className="text-youtube-blue font-medium">{metrics.lowestCompetitionPercentage}% Growth Potential</span>
              <span className="text-youtube-gray text-sm ml-2">opportunity score</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
