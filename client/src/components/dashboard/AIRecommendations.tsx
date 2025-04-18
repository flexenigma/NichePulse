import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiRecommendation } from "@shared/schema";

export function AIRecommendations() {
  const { data: recommendations, isLoading } = useQuery<AiRecommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <Skeleton className="h-6 w-6 mr-2 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-md bg-blue-50 p-4 mb-4">
              <div className="flex">
                <Skeleton className="h-6 w-6 rounded-full bg-blue-200" />
                <div className="ml-3 w-full">
                  <Skeleton className="h-5 w-56 bg-blue-200" />
                  <Skeleton className="h-16 w-full mt-2 bg-blue-100" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <span className="material-icons text-youtube-blue mr-2">psychology</span>
            <h2 className="text-lg font-bold text-youtube-black">AI-Powered Recommendations</h2>
          </div>
          
          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-center text-muted-foreground">No recommendations available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <span className="material-icons text-youtube-blue mr-2">psychology</span>
          <h2 className="text-lg font-bold text-youtube-black">AI-Powered Recommendations</h2>
        </div>
        
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="rounded-md bg-blue-50 p-4 mb-4 last:mb-0">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-youtube-blue">lightbulb</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-youtube-blue">{recommendation.title}</h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>{recommendation.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
