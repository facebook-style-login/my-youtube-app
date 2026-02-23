
"use client";

import { useState, useEffect, useMemo, SVGProps } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// --- TYPE DEFINITIONS ---
type Trend = { id: string; category: string; topic: string; searches: string; region: string };
type GeneratedContent = { titles: string[]; tags: string[]; prompt: string };
type GenerationType = 'titles' | 'tags' | 'prompt';

// --- DATA FETCHING HOOK ---
const useGoogleTrends = (geo: string) => {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrends = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/trends?geo=${geo}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `An error occurred while fetching trends for ${geo}`);
                }
                const data: Trend[] = await res.json();
                setTrends(data);
            } catch (err: any) {
                setError(err.message);
                setTrends([]); // Clear trends on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrends();
    }, [geo]);

    return { trends, isLoading, error };
};

// --- ICON COMPONENTS ---
const IconWrapper = (props: SVGProps<SVGSVGElement> & { path: string; paths?: string[] }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {props.path && <path d={props.path} />}
        {props.paths && props.paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const TrendingUpIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="m22 7-8.5 8.5-4-4-6.5 6.5" paths={["M16 7h6v6"]} />;
const CopyIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" paths={["M9 2H5a2 2 0 0 0-2 2v2"]} />;
const CheckIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M20 6 9 17l-5-5" />;
const BotIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M12 8V4H8" paths={["m8 18-4 4-1-1", "m18 18 4 4 1-1", "M2 12h20", "M17 4v4"]} />;

// --- UI COMPONENTS ---
const RegionSelector = ({ selectedRegion, onRegionChange }: { selectedRegion: string; onRegionChange: (region: string) => void; }) => {
    const regions = useMemo(() => [ { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' }, { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' }, { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' }, { code: 'IN', name: 'India' } ], []);

    return (
        <select value={selectedRegion} onChange={e => onRegionChange(e.target.value)} className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
    );
};

const TrendCard = ({ trend, onGenerate }: { trend: Trend; onGenerate: (topic: string) => void; }) => (
    <div className="bg-secondary rounded-lg p-4 border border-border transition-all hover:bg-secondary/80 flex justify-between items-center">
        <div>
            <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">{trend.category} &middot; {trend.region}</span>
            <h3 className="text-lg font-bold text-white mt-2">{trend.topic}</h3>
            <p className="text-sm text-blue-400 font-semibold">{trend.searches} searches</p>
        </div>
        <button onClick={() => onGenerate(trend.topic)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors">
            <BotIcon className="h-5 w-5" />
            <span>Generate</span>
        </button>
    </div>
);

const GeneratedCard = ({ title, content, onCopy }: { title: string; content: string[] | string; onCopy: (text: string) => void; }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        const textToCopy = Array.isArray(content) ? content.join(title === 'Tags' ? ', ' : '\n') : content;
        onCopy(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-secondary rounded-lg p-5 border border-border">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button onClick={handleCopy} className="p-2 rounded-md hover:bg-background/70 transition-colors text-muted-foreground">
                    {copied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="text-muted-foreground space-y-2 text-sm">
                {Array.isArray(content) ? (
                    <ul className={title === 'Tags' ? 'flex flex-wrap gap-2' : 'list-disc list-inside'}>
                        {content.map((item, index) => (
                            <li key={index} className={title === 'Tags' ? 'bg-background/60 px-2 py-1 rounded-md' : ''}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>{content}</p>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialGeo = searchParams.get('geo') || 'US';

    const [selectedRegion, setSelectedRegion] = useState(initialGeo);
    const { trends, isLoading: trendsLoading, error: trendsError } = useGoogleTrends(selectedRegion);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const handleRegionChange = (regionCode: string) => {
        setSelectedRegion(regionCode);
        router.push(`/?geo=${regionCode}`); // Update URL
        setGeneratedContent(null); // Clear generated content when region changes
        setSelectedTopic(null);
    };
    
    const handleGenerate = async (topic: string) => {
        setSelectedTopic(topic);
        setIsGenerating(true);
        setGenerationError(null);
        setGeneratedContent(null);

        try {
            const generationPromises = ['titles', 'tags', 'prompt'].map(type =>
                fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, topic }),
                }).then(res => res.json())
            );

            const results = await Promise.all(generationPromises);
            const errors = results.filter(r => r.error);

            if (errors.length > 0) {
                 throw new Error(errors[0].error || 'An unknown error occurred during content generation.');
            }
            
            setGeneratedContent({
                titles: results[0].results,
                tags: results[1].results,
                prompt: results[2].results.join(' '),
            });

        } catch (err: any) {
            setGenerationError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy:', err));
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Column: Trends */}
            <div className="w-full md:w-1/2 lg:w-2/5 p-6 overflow-y-auto border-r border-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3"><TrendingUpIcon className="h-6 w-6 text-blue-400"/> Daily Trends</h2>
                    <RegionSelector selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
                </div>

                {trendsLoading && <p className="text-muted-foreground">Loading trends...</p>}
                {trendsError && <p className="text-red-400">Error: {trendsError}</p>}

                <div className="space-y-4">
                    {!trendsLoading && !trendsError && trends.map(trend => (
                        <TrendCard key={trend.id} trend={trend} onGenerate={handleGenerate} />
                    ))}
                </div>
            </div>

            {/* Right Column: AI Generation */}
            <div className="w-full md:w-1/2 lg:w-3/5 p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                     <div className="text-center mb-8 pt-4">
                        {selectedTopic ? (
                             <>
                                <p className="text-muted-foreground">AI Content for:</p>
                                <h2 className="text-3xl font-bold tracking-tight text-white">{selectedTopic}</h2>
                            </>
                        ) : (
                             <>
                                <BotIcon className="h-12 w-12 text-blue-500 mx-auto mb-4"/>
                                <h2 className="text-3xl font-bold tracking-tight text-white">Content Generation Hub</h2>
                                <p className="text-muted-foreground mt-2">Select a trend to generate YouTube titles, tags, and AI art prompts.</p>
                             </>
                        )}
                    </div>

                    {isGenerating && <p className="text-muted-foreground text-center">Generating creative content with AI...</p>}
                    {generationError && <p className="text-red-400 text-center">Generation Failed: {generationError}</p>}

                    {generatedContent && (
                        <div className="space-y-6">
                            <GeneratedCard title="Viral Titles" content={generatedContent.titles} onCopy={handleCopyToClipboard} />
                            <GeneratedCard title="SEO Tags" content={generatedContent.tags} onCopy={handleCopyToClipboard} />
                            <GeneratedCard title="AI Thumbnail Prompt" content={generatedContent.prompt} onCopy={handleCopyToClipboard} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
