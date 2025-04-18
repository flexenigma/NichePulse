import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NicheInsight, MonetizationInsight } from "@shared/schema";

export function NicheInsightsCards() {
  const { data: nicheInsights, isLoading: isLoadingNiche } = useQuery<NicheInsight>({
    queryKey: ["/api/insights/niche"],
  });
  
  const { data: monetizationInsights, isLoading: isLoadingMonetization } = useQuery<MonetizationInsight>({
    queryKey: ["/api/insights/monetization"],
  });

  const isLoading = isLoadingNiche || isLoadingMonetization;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <div className="px-4 py-5 sm:px-6 bg-youtube-dark">
              <Skeleton className="h-6 w-40 bg-gray-700" />
              <Skeleton className="h-4 w-60 mt-1 bg-gray-700" />
            </div>
            <CardContent className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="sm:col-span-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Skeleton className="h-9 w-36" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!nicheInsights || !monetizationInsights) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No insight data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Niche Competitive Analysis */}
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-5 sm:px-6 bg-youtube-dark">
          <CardTitle className="text-lg font-medium text-white">Niche Competitive Analysis</CardTitle>
          <CardDescription className="mt-1 max-w-2xl text-sm text-gray-300">
            AI-generated insights about competition levels
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Least Competitive</dt>
              <dd className="mt-1 text-sm text-youtube-black">{nicheInsights.leastCompetitive}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Most Competitive</dt>
              <dd className="mt-1 text-sm text-youtube-black">{nicheInsights.mostCompetitive}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Best Entry Point</dt>
              <dd className="mt-1 text-sm text-youtube-black">{nicheInsights.bestEntryPoint}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Fastest Growing</dt>
              <dd className="mt-1 text-sm text-youtube-black">{nicheInsights.fastestGrowing}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Button variant="outline" className="text-youtube-blue bg-blue-50 hover:bg-blue-100 border-0">
              View Detailed Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Monetization Potential */}
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-5 sm:px-6 bg-youtube-red">
          <CardTitle className="text-lg font-medium text-white">Monetization Potential</CardTitle>
          <CardDescription className="mt-1 max-w-2xl text-sm text-gray-100">
            Revenue opportunities by niche category
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Highest CPM</dt>
              <dd className="mt-1 text-sm text-youtube-black">{monetizationInsights.highestCPM}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Lowest CPM</dt>
              <dd className="mt-1 text-sm text-youtube-black">{monetizationInsights.lowestCPM}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Best Sponsorship</dt>
              <dd className="mt-1 text-sm text-youtube-black">{monetizationInsights.bestSponsorship}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-youtube-gray">Best Long-term</dt>
              <dd className="mt-1 text-sm text-youtube-black">{monetizationInsights.bestLongTerm}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Button variant="outline" className="text-youtube-blue bg-blue-50 hover:bg-blue-100 border-0">
              View Revenue Projections
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
