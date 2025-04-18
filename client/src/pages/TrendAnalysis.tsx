import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useMobile } from "@/hooks/use-mobile";

export default function TrendAnalysis() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile } = useMobile();

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-youtube-black">Trend Analysis</h1>
            <p className="text-youtube-gray">Detailed analysis of YouTube content trends over time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium text-youtube-black mb-4">Coming Soon</h2>
            <p className="text-youtube-gray">
              This feature is currently in development. Check back soon for detailed trend analysis!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
