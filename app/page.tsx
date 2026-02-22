
"use client";

import React from 'react';

// Mock data for trending topics - in a real app, this would come from an API
const trendingTopics = [
  {
    category: "Technology",
    topic: "The Rise of AI Agents",
    searches: "1.2M+",
    region: "USA",
  },
  {
    category: "Gaming",
    topic: "Next-Gen VR Headsets Compared",
    searches: "850K+",
    region: "USA",
  },
  {
    category: "Finance",
    topic: "Is the Housing Market Going to Crash in 2025?",
    searches: "2.1M+",
    region: "USA",
  },
  {
    category: "Science",
    topic: "First Images from the Webb Telescope's Successor",
    searches: "600K+",
    region: "USA",
  },
  {
    category: "Lifestyle",
    topic: "The $100 vs $1,000 Outdoor Survival Kit Challenge",
    searches: "950K+",
    region: "USA",
  }
];

// --- Icon Components (to mimic shadcn/ui's use of lucide-react) ---
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);


// --- Main Page Component ---
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-800 bg-gray-950 p-4 sm:flex">
        <div className="flex items-center gap-2 mb-8">
            <TrendingUpIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Trendlytics</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-white transition-all hover:bg-gray-700">
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:bg-gray-800 hover:text-white">
            <TrendingUpIcon className="h-5 w-5" />
            <span>Saved Trends</span>
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:bg-gray-800 hover:text-white">
            <SettingsIcon className="h-5 w-5" />
            <span>API & Settings</span>
          </a>
        </nav>
        <div className="mt-auto">
             <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:bg-gray-800 hover:text-white">
                <LogOutIcon className="h-5 w-5" />
                <span>Log Out</span>
            </a>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex flex-1 flex-col p-6 md:p-8">
        <header className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Trending Topics Dashboard</h2>
          <p className="text-gray-400">High-CPM countries like the USA, UK, and Australia.</p>
        </header>

        <div className="grid gap-6">
          {trendingTopics.map((trend, index) => (
            <div key={index} className="rounded-xl border border-gray-800 bg-gray-900 shadow-lg transition-all hover:bg-gray-800/50">
              <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-sm font-semibold text-blue-400">{trend.category}</span>
                        <h3 className="mt-1 text-xl font-bold text-white">{trend.topic}</h3>
                        <p className="mt-1 text-sm text-gray-400">
                            <TrendingUpIcon className="inline-block h-4 w-4 mr-1" />
                            {trend.searches} monthly searches in {trend.region}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-700 text-white hover:bg-gray-600 h-9 px-4 py-2">
                    Generate Viral Titles
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-700 text-white hover:bg-gray-600 h-9 px-4 py-2">
                    Suggest SEO Tags
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-700 text-white hover:bg-gray-600 h-9 px-4 py-2">
                    Create AI Thumbnail Prompt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
