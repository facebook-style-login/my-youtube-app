
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A simple in-memory index to start the key search from. This helps distribute load.
let nextKeyIndex = 0;

async function getGeminiApiKeys(): Promise<string[]> {
    const keys = await prisma.apiKey.findMany({
        where: { service: 'gemini' },
        orderBy: { createdAt: 'asc' },
    });
    if (keys.length === 0) {
        throw new Error("No Gemini API keys found in the database. Please add at least one key in Settings.");
    }
    return keys.map(k => k.key);
}

const getPrompt = (type: string, topic: string): string | null => {
    switch (type) {
        case 'titles': return `Generate 5 viral, clickbait-style YouTube video titles about "${topic}". Make them catchy, intriguing, and under 70 characters. Return a numbered list.`;
        case 'tags': return `Generate 15 relevant SEO tags for a YouTube video about "${topic}". Include broad and specific keywords. Return a comma-separated list.`;
        case 'prompt': return `Create a detailed, dramatic, and visually striking AI art prompt for a YouTube thumbnail about "${topic}". Describe scene, colors, lighting, and style (e.g., hyper-realistic, cinematic). Return a single paragraph.`;
        default: return null;
    }
};

export async function POST(request: Request) {
    let keys: string[];
    try {
        keys = await getGeminiApiKeys();
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const { type, topic } = await request.json();

    if (!type || !topic) {
        return NextResponse.json({ error: 'Invalid request body: type and topic are required.' }, { status: 400 });
    }

    const promptText = getPrompt(type, topic);
    if (!promptText) {
        return NextResponse.json({ error: 'Invalid generation type provided.' }, { status: 400 });
    }

    const startIndex = nextKeyIndex;

    for (let i = 0; i < keys.length; i++) {
        const keyIndex = (startIndex + i) % keys.length;
        const apiKey = keys[keyIndex];

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const generationConfig = { temperature: 1, topP: 0.95, topK: 0, maxOutputTokens: 2048 };
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ];

            const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: promptText }] }], generationConfig, safetySettings });

            if (!result.response || !result.response.text()) {
                throw new Error('AI model returned an empty or invalid response.');
            }
            
            // On success, update the index for the next request to start from the subsequent key
            nextKeyIndex = (keyIndex + 1) % keys.length;

            const text = result.response.text();
            const cleanedText = text.replace(/`/g, '').trim();
            const results = type === 'tags'
                ? cleanedText.split(',').map(t => t.trim()).filter(Boolean)
                : cleanedText.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);

            return NextResponse.json({ results }); // Success!

        } catch (error: any) {
            console.error(`API Key Error (key index ${keyIndex}):`, error.message);
            // This key failed, the loop will now try the next one.
        }
    }
    
    // If the loop completes without any key succeeding
    return NextResponse.json({ 
        error: "All available API keys failed.", 
        details: "This could be due to invalid keys, expired quotas, or a temporary network issue. Please check your keys in the Settings page and try again later."
    }, { status: 500 });
}
