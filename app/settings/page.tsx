
"use client";

import React, { useState, useEffect, SVGProps } from 'react';

// --- TYPE DEFINITIONS ---
interface ApiKey {
    id: string;
    key: string;
    service: string;
}

// --- ICON COMPONENTS ---
const IconWrapper = (props: SVGProps<SVGSVGElement> & { path: string; paths?: string[] }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {props.path && <path d={props.path} />}
        {props.paths && props.paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
);

const TrashIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />;
const PlusIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M5 12h14m-7-7v14" />;
const KeyIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777z" paths={["m15.5 7.5-3 3L6 16l-2-2 6-6 3-3 5.5 5.5z"]} />;

// --- API Key Management Component ---
const ApiKeyManager = ({ service, title, description, maxKeys }: { service: string; title: string; description: string; maxKeys: number; }) => {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [newKey, setNewKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const fetchKeys = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/keys');
            if (!res.ok) throw new Error('Failed to fetch keys');
            const allKeys: ApiKey[] = await res.json();
            setKeys(allKeys.filter(k => k.service === service));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, [service]);

    const handleAddKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!newKey.trim() || keys.length >= maxKeys) return;
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: newKey, service }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to add key');
            }
            setNewKey('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            fetchKeys();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteKey = async (id: string) => {
        setError(null);
        try {
            const res = await fetch('/api/keys', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error('Failed to delete key');
            fetchKeys();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const maskKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

    return (
        <div className="bg-secondary rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6">{description}</p>

            {isLoading ? <div className="h-10 w-full bg-background/50 animate-pulse rounded-md"></div> : (
                <div className="space-y-3 mb-6">
                    {keys.map(apiKey => (
                        <div key={apiKey.id} className="flex items-center justify-between bg-background/60 p-3 rounded-md border border-border">
                            <span className="font-mono text-sm text-gray-300 flex items-center gap-3"><KeyIcon className="h-5 w-5 text-gray-400"/> {maskKey(apiKey.key)}</span>
                            <button onClick={() => handleDeleteKey(apiKey.id)} className="text-muted-foreground hover:text-red-400 p-1 rounded-full transition-colors"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    ))}
                </div>
            )}
            
            {keys.length < maxKeys && (
                <form onSubmit={handleAddKey} className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="password" 
                        value={newKey} 
                        onChange={(e) => setNewKey(e.target.value)} 
                        placeholder={`Enter new ${title}...`} 
                        className="flex-grow bg-background border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50" disabled={!newKey.trim()}>
                        <PlusIcon className="h-5 w-5"/>Add Key
                    </button>
                </form>
            )}
            {showSuccess && <p className="text-green-400 mt-4">Key added successfully!</p>}
            {error && <p className="text-red-400 mt-4">Error: {error}</p>}
        </div>
    );
};

// --- SETTINGS PAGE COMPONENT ---
export default function SettingsPage() {
    return (
        <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">API Key Management</h2>
            <div className="space-y-8 max-w-4xl mx-auto">
                <ApiKeyManager 
                    service="gemini"
                    title="Gemini API Keys"
                    description="Add up to 5 Google Gemini API keys. The app automatically rotates keys to manage quotas and avoid interruptions."
                    maxKeys={5}
                />
                <ApiKeyManager 
                    service="youtube"
                    title="YouTube API Key"
                    description="Add your YouTube Data API v3 key. This will be used for in-depth channel and video analytics in a future update."
                    maxKeys={1}
                />
            </div>
        </div>
    );
}
