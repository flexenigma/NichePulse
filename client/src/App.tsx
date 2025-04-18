import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import TrendAnalysis from "@/pages/TrendAnalysis";
import NicheExplorer from "@/pages/NicheExplorer";
import CompetitorAnalysis from "@/pages/CompetitorAnalysis";
import HistoricalData from "@/pages/HistoricalData";
import Settings from "@/pages/Settings";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/trend-analysis" component={TrendAnalysis} />
      <Route path="/niche-explorer" component={NicheExplorer} />
      <Route path="/competitor-analysis" component={CompetitorAnalysis} />
      <Route path="/historical-data" component={HistoricalData} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Add YouTube-like variables to the root element
  useEffect(() => {
    document.documentElement.style.setProperty('--radius', '0.5rem');
    document.documentElement.style.setProperty('--background', '0 0% 98%');
    document.documentElement.style.setProperty('--foreground', '240 10% 3.9%');
    document.documentElement.style.setProperty('--card', '0 0% 100%');
    document.documentElement.style.setProperty('--card-foreground', '240 10% 3.9%');
    document.documentElement.style.setProperty('--popover', '0 0% 100%');
    document.documentElement.style.setProperty('--popover-foreground', '240 10% 3.9%');
    document.documentElement.style.setProperty('--primary', '0 100% 50%'); // YouTube Red
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    document.documentElement.style.setProperty('--secondary', '240 3.7% 15.9%'); // Dark Grey
    document.documentElement.style.setProperty('--secondary-foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--muted', '240 4.8% 95.9%');
    document.documentElement.style.setProperty('--muted-foreground', '240 3.8% 46.1%');
    document.documentElement.style.setProperty('--accent', '211.7 100% 43.7%'); // YouTube Blue
    document.documentElement.style.setProperty('--accent-foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--destructive', '0 84.2% 60.2%');
    document.documentElement.style.setProperty('--destructive-foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--border', '240 5.9% 90%');
    document.documentElement.style.setProperty('--input', '240 5.9% 90%');
    document.documentElement.style.setProperty('--ring', '0 100% 50%');
    document.documentElement.style.setProperty('--chart-1', '211.7 100% 43.7%'); // Blue
    document.documentElement.style.setProperty('--chart-2', '0 100% 50%'); // Red
    document.documentElement.style.setProperty('--chart-3', '120 100% 33%'); // Green
    document.documentElement.style.setProperty('--chart-4', '43 100% 50%'); // Orange
    document.documentElement.style.setProperty('--chart-5', '270 100% 60%'); // Purple
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
