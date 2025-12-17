// Imports

import { DataReturnObject } from '@/types/helper';
import { Content, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load Environment Variables

dotenv.config();

// Exports

export async function createAiClient(): Promise<DataReturnObject<GenerativeModel>> {
    try{

        const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

        const geminiModel = client.getGenerativeModel({
            model: process.env.GOOGLE_MODEL || '',
        });

        return {
            status: true,
            data: geminiModel,
            message: 'AI client created successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating AI client'
        };
    }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries <= 0 || !err.message?.includes("503")) {
      throw err;
    }
    await new Promise(res => setTimeout(res, 1000 * (4 - retries)));
    return withRetry(fn, retries - 1);
  }
}

export async function createAiPrompt(aiModel: GenerativeModel, newsletterTitle: string, speaker: string, content: Content[]): Promise<DataReturnObject<string | null>> {
    try {
        const prompt = `
            You are generating an HTML newsletter.

            RULES:
            - Output HTML ONLY (no markdown, no explanation)
            - Do NOT wrap in code blocks
            - Use semantic HTML elements only
            - No <script> tags
            - No external assets
            - Inline styles only if necessary
            - Keep layout simple and readable

            STRUCTURE:
            - <article>
            - <header>
                - <h1>${newsletterTitle}</h1>
                - <p>Intro paragraph</p>
            - <section> for each content block
                - <h2>Section title</h2>
                - <p>Section content</p>
            - <footer>
                - <p>Sign-off written in speaker's voice</p>

            VOICE:
            Write in the voice of the speaker below.

            NEWSLETTER TITLE:
            ${newsletterTitle}

            CONTENT SECTIONS:
            ${JSON.stringify(content, null, 2)}

            SPEAKER:
            ${speaker}

            OUTPUT:
            Return a complete HTML fragment starting with <article>.
        `;
  
        const result = await withRetry(() => aiModel.generateContent(prompt));
        const html = result.response.text();

        if (!html || !html.trim().startsWith("<article")) {
            return {
                status: false,
                data: null,
                message: "AI did not return valid HTML",
            };
        }

        if (html.includes("<script")) {
            return {
                status: false,
                data: null,
                message: "Unsafe HTML detected",
            };
        }

        return {
            status: true,
            data: html,
            message: "HTML newsletter generated successfully",
        };

    } catch (error: unknown) {
        return {
            status: false,
            data: null,
            message:
            error instanceof Error
                ? error.message
                : "Unknown error while generating newsletter content",
        };
    }
}

