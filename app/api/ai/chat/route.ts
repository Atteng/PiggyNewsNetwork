import { NextRequest, NextResponse } from 'next/server';
import { getPlatformIndex, searchIndex } from '@/lib/ai/indexing';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Retrieve platform-wide context
        const index = await getPlatformIndex();
        const relevantContent = searchIndex(message, index);

        const contextString = relevantContent.length > 0
            ? `Relevant Context from PiggyDAO Documents:\n${relevantContent.map((c: any) => `[TYPE: ${c.type}] TITLE: ${c.title}\nCONTENT: ${c.content}`).join('\n\n')}`
            : "No specific platform context found for this query in the local documents.";

        // 2. Prepare the prompt for Gemini
        const systemPrompt = `
            You are the PiggyDAO AI Assistant. Your goal is to help users navigate the Piggy News Network (PNN), understand proposals, and explore the Porktocracy.
            
            PLATFORM DATA:
            ${contextString}
            
            INSTRUCTIONS:
            1. Use the provided PLATFORM DATA to answer questions accurately.
            2. If the answer isn't in the data, use your general knowledge but clarify you're searching outside the official DAO records.
            3. Maintain a friendly, "oink-tastic" persona. Use slight pig puns occasionally, but stay professional about DAO governance.
            4. If a specific article or proposal is mentioned in the data, provide its title and type.
            
            USER QUESTION: ${message}
        `;

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_KEY_HERE' || apiKey === '') {
            return NextResponse.json({
                role: 'assistant',
                content: "I'm ready to talk, but I need a Gemini API Key! Please add `GOOGLE_GENERATIVE_AI_API_KEY` to your `.env` file to enable my brain."
            });
        }

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            role: 'assistant',
            content: text
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
