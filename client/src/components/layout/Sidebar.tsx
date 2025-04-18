import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "Trend Analysis", href: "/trend-analysis", icon: "trending_up" },
  { name: "Niche Explorer", href: "/niche-explorer", icon: "category" },
  { name: "Competitor Analysis", href: "/competitor-analysis", icon: "compare_arrows" },
  { name: "Historical Data", href: "/historical-data", icon: "history" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={cn("hidden md:flex md:flex-shrink-0", className)}>
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="material-icons text-youtube-red mr-2">smart_display</span>
            <h1 className="text-xl font-bold text-youtube-black">NicheAI</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      location === item.href 
                        ? "text-youtube-black border-l-4 border-youtube-red bg-red-50" 
                        : "text-youtube-gray hover:bg-gray-50"
                    )}
                  >
                    <span 
                      className={cn(
                        "material-icons mr-3",
                        location === item.href ? "text-youtube-black" : "text-youtube-gray"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
