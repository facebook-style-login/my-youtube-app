
import { NextResponse } from 'next/server';
import googleTrends from 'google-trends-api';

// Interface for the structure of a single trend from the API
interface GoogleTrend {
    title: { query: string };
    articles: { articleId?: string; source?: string }[];
}

// A helper function to generate a placeholder for search volume
const getRandomSearches = (): string => {
    const searches = Math.floor(Math.random() * (2500 - 100 + 1)) + 100;
    if (searches > 2000) return "2M+";
    if (searches > 1000) return `${(searches / 1000).toFixed(1)}M+`;
    return `${searches}K+`;
};

// The main GET handler for the trends API route
export async function GET(request: Request) {
    // Extract the 'geo' search parameter from the request URL
    const { searchParams } = new URL(request.url);
    const geo = searchParams.get('geo') || 'US'; // Default to US if not provided

    try {
        // Fetch daily trends from Google Trends API for the specified geography
        const trendsData: string = await googleTrends.dailyTrends({ geo });

        const trends = JSON.parse(trendsData);
        const trendingSearches: GoogleTrend[] = trends.default.trendingSearchesDays[0]?.trendingSearches || [];

        // Format the raw trend data into a more usable structure for the frontend
        const formattedTopics = trendingSearches.slice(0, 10).map((trend: GoogleTrend) => {
            const topicTitle = trend.title.query;
            // Heuristically determine a category
            const articleCategory = trend.articles[0]?.source?.toLowerCase().includes('tech') ? 'Technology' : 'Top Stories';

            return {
                id: trend.articles[0]?.articleId || Math.random().toString(),
                category: articleCategory,
                topic: topicTitle,
                searches: getRandomSearches(), // API doesn't provide real search volume
                region: geo.toUpperCase(),
            };
        });

        return NextResponse.json(formattedTopics);

    } catch (error) {
        console.error(`Failed to fetch Google Trends data for ${geo}:`, error);
        
        // Provide a more specific error message if trends for a region are not available
        if (error instanceof Error && error.message.includes('400')) { // Google Trends API often returns 400 for unsupported regions
             return NextResponse.json({ error: `Trends for the selected region (${geo.toUpperCase()}) are not available.` }, { status: 404 });
        }

        return NextResponse.json({ error: "An internal server error occurred while fetching trends." }, { status: 500 });
    }
}

// Ensure this route is always run dynamically to get the latest trends
export const dynamic = 'force-dynamic';
