import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { YoutubeNiche } from "@shared/schema";

type SortOption = "trending" | "growth" | "competition" | "revenue";

export function TopNichesTable() {
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  
  const { data: niches, isLoading } = useQuery<YoutubeNiche[]>({
    queryKey: ["/api/niches"],
  });

  const handleExport = () => {
    if (!niches) return;
    
    // Create CSV content
    const headers = ["Rank", "Niche", "Growth Rate", "Competition", "Revenue Potential", "Trend"];
    const rows = niches.map((niche, index) => [
      (index + 1).toString(),
      niche.name,
      `${niche.growthRate > 0 ? '+' : ''}${niche.growthRate}%`,
      niche.competition,
      `$${niche.revenuePotential.toFixed(2)} CPM`,
      niche.trend
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'youtube_niche_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedNiches = () => {
    if (!niches) return [];
    
    const nichesToSort = [...niches];
    
    switch (sortBy) {
      case "growth":
        return nichesToSort.sort((a, b) => b.growthRate - a.growthRate);
      case "competition":
        // Sort by competition level (Low < Medium < High < Very High)
        const competitionOrder = { "Low": 1, "Medium": 2, "High": 3, "Very High": 4 };
        return nichesToSort.sort((a, b) => {
          const aOrder = competitionOrder[a.competition as keyof typeof competitionOrder] || 5;
          const bOrder = competitionOrder[b.competition as keyof typeof competitionOrder] || 5;
          return aOrder - bOrder;
        });
      case "revenue":
        return nichesToSort.sort((a, b) => b.revenuePotential - a.revenuePotential);
      case "trending":
      default:
        // For "trending", we'll use a combination of growth rate and trend
        return nichesToSort.sort((a, b) => {
          if (a.trend === b.trend) {
            return b.growthRate - a.growthRate;
          }
          return a.trend === "up" ? -1 : 1;
        });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center">
            <Skeleton className="h-10 w-40 mr-4" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Card>
          <div className="p-2">
            <Skeleton className="h-60 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!niches || niches.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-youtube-black">Top YouTube Niches</h2>
          <div className="flex items-center">
            <Select defaultValue="trending">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Sort by: Trending</SelectItem>
                <SelectItem value="growth">Growth Rate</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="revenue">Revenue Potential</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="ml-4 text-youtube-blue border border-youtube-blue bg-transparent hover:bg-blue-50"
              disabled
            >
              <span className="material-icons text-sm mr-1">file_download</span>
              Export
            </Button>
          </div>
        </div>
        <Card>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No niche data available. Try refreshing the analysis.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-youtube-black">Top {niches.length} YouTube Niches</h2>
        <div className="flex items-center">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Sort by: Trending</SelectItem>
              <SelectItem value="growth">Growth Rate</SelectItem>
              <SelectItem value="competition">Competition</SelectItem>
              <SelectItem value="revenue">Revenue Potential</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="ml-4 text-youtube-blue border border-youtube-blue bg-transparent hover:bg-blue-50"
            onClick={handleExport}
          >
            <span className="material-icons text-sm mr-1">file_download</span>
            Export
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-youtube-gray uppercase tracking-wider">Rank</TableHead>
                <TableHead className="text-youtube-gray uppercase tracking-wider">Niche</TableHead>
                <TableHead className="text-youtube-gray uppercase tracking-wider">Growth Rate</TableHead>
                <TableHead className="text-youtube-gray uppercase tracking-wider">Competition</TableHead>
                <TableHead className="text-youtube-gray uppercase tracking-wider">Revenue Potential</TableHead>
                <TableHead className="text-youtube-gray uppercase tracking-wider">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNiches().map((niche, index) => (
                <TableRow key={niche.id} className="border-b border-gray-200">
                  <TableCell className="py-4 font-medium text-youtube-black">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4 font-medium text-youtube-black">
                    {niche.name}
                  </TableCell>
                  <TableCell className={`py-4 ${niche.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {niche.growthRate > 0 ? '+' : ''}{niche.growthRate}%
                  </TableCell>
                  <TableCell className="py-4 text-youtube-black">
                    {niche.competition}
                  </TableCell>
                  <TableCell className="py-4 text-youtube-black">
                    ${niche.revenuePotential.toFixed(2)} CPM
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`material-icons ${niche.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {niche.trend === 'up' ? 'trending_up' : 'trending_down'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
