// Imports

import { DataReturnObject } from '@/types/helper';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Content } from '@/types/database';
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

async function withRetry<T>(fn: () => Promise<T>, retries: number = 5, baseDelay: number = 3000): Promise<T> {
  const maxRetries = parseInt(process.env.AI_RETRY_COUNT || '5', 10);
  const initialDelay = parseInt(process.env.AI_RETRY_DELAY_MS || '3000', 10);
  
  try {
    return await fn();
  } catch (err: any) {
    const errorMessage = err.message || err.toString() || '';
    
    // Don't retry on overloaded errors (503, Service Unavailable, overloaded)
    // These indicate the service needs time to recover, not immediate retries
    const isOverloadedError = 
      errorMessage.includes("503") || 
      errorMessage.includes("Service Unavailable") ||
      errorMessage.includes("overloaded");
    
    if (isOverloadedError) {
      throw err;
    }
    
    // Only retry on rate limit errors (429, rate limit, quota)
    const isRetryableError = 
      errorMessage.includes("429") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("quota");
    
    if (retries <= 0 || !isRetryableError) {
      throw err;
    }

    const attemptNumber = maxRetries - retries + 1;
    const exponentialDelay = initialDelay * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 1000;
    const delay = Math.min(exponentialDelay + jitter, 60000);
    
    console.log(`Rate limit encountered. Retry attempt ${attemptNumber}/${maxRetries} after ${Math.round(delay)}ms delay...`);
    
    await new Promise(res => setTimeout(res, delay));
    return withRetry(fn, retries - 1, initialDelay);
  }
}

function cleanHtmlOutput(html: string): string {
    html = html.replace(/```html?\s*/gi, '');
    html = html.replace(/```\s*/g, '');
    
    html = html.trim();
    
    const articleStart = html.toLowerCase().indexOf('<article');
    if (articleStart !== -1) {
        html = html.substring(articleStart);
    }
    
    const articleEnd = html.toLowerCase().lastIndexOf('</article>');
    if (articleEnd !== -1) {
        html = html.substring(0, articleEnd + '</article>'.length);
    }
    
    return html.trim();
}

function ensureNewsletterStyling(html: string, primaryColor?: string): string {
    const borderColor = primaryColor || '#333';
    const borderStyle = `border: 20px solid ${borderColor};`;
    
    if (!html.match(/<article[^>]*style=/i)) {
        html = html.replace(/<article/i, `<article style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; ${borderStyle}"`);
    } else {
        html = html.replace(/<article([^>]*style=")([^"]*)"/i, (match, p1, p2) => {
            if (!p2.includes('border:')) {
                return `<article${p1}${p2}; ${borderStyle}"`;
            }
            return `<article${p1}${p2.replace(/border:\s*[^;]+;?/gi, borderStyle)}"`;
        });
    }
    
    html = html.replace(/<header(?![^>]*style=)/gi, '<header style="margin-bottom: 40px; text-align: center;"');
    
    html = html.replace(/<h1(?![^>]*style=)/gi, '<h1 style="font-size: 2.5em; font-weight: bold; margin: 0 0 20px 0; padding: 0; color: #222; text-align: center;"');
    
    const headerPattern = /<header[^>]*>([\s\S]*?)<\/header>/i;
    html = html.replace(headerPattern, (match) => {
        return match.replace(/<p(?![^>]*style=)/gi, '<p style="font-size: 1.1em; margin: 0; padding: 0 20px; color: #555;"');
    });
    
    html = html.replace(/<footer(?![^>]*style=)/gi, '<footer style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; text-align: center;"');
    
    const footerPattern = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
    html = html.replace(footerPattern, (match) => {
        return match.replace(/<p(?![^>]*style=)/gi, '<p style="font-size: 1em; margin: 0; padding: 0; color: #555; font-style: italic;"');
    });
    
    html = html.replace(/<\/section>\s*<section/gi, '</section>\n            <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 30px 0;" />\n            <section');
    
    html = html.replace(/<section(?![^>]*style=)/gi, '<section style="margin: 40px 0; padding: 20px 0;"');
    
    html = html.replace(/<h2(?![^>]*style=)/gi, '<h2 style="font-size: 1.8em; font-weight: bold; margin: 0 0 15px 0; padding: 0; color: #222;"');
    
    html = html.replace(/<p(?![^>]*style=)/gi, '<p style="font-size: 1em; margin: 0 0 15px 0; padding: 0; color: #444; line-height: 1.7;"');
    
    return html;
}

export async function createAiPrompt(aiModel: GenerativeModel, newsletterTitle: string, speaker: string, content: Content[], primaryColor?: string): Promise<DataReturnObject<string | null>> {
    try {
        const prompt = `
        
            You are an expert HTML newsletter generator. Your task is to generate a complete, valid HTML newsletter with proper styling.

            CRITICAL REQUIREMENTS - FOLLOW EXACTLY:
            1. Output ONLY raw HTML code - no markdown, no explanations, no code blocks, no backticks
            2. Start immediately with <article> tag - no preamble, no introduction
            3. End with </article> tag - no additional text after
            4. Use ONLY semantic HTML5 elements: article, header, h1, h2, p, section, footer, hr
            5. NEVER include <script> tags or any JavaScript
            6. NEVER include external links, images, or assets
            7. MUST include inline styles for proper formatting, spacing, and layout
            8. Keep the layout clean, simple, and readable

            REQUIRED HTML STRUCTURE WITH STYLING:
            <article style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 20px solid ${primaryColor || '#333'};">
                <header style="margin-bottom: 40px; text-align: center;">
                    <h1 style="font-size: 2.5em; font-weight: bold; margin: 0 0 20px 0; padding: 0; color: #222;">${newsletterTitle}</h1>
                    <p style="font-size: 1.1em; margin: 0; padding: 0 20px; color: #555;">[Write an engaging introduction paragraph that introduces the entire newsletter and all its topics, written in the speaker's voice]</p>
                </header>

                ${content.map((item, idx) => `            
                <section style="margin: 40px 0; padding: 20px 0;">
                    <h2 style="font-size: 1.8em; font-weight: bold; margin: 0 0 15px 0; padding: 0; color: #222;">${item.title || `Section ${idx + 1}`}</h2>
                    <p style="font-size: 1em; margin: 0 0 15px 0; padding: 0; color: #444; line-height: 1.7;">[Rewrite the content below in the speaker's voice, making it engaging and natural]</p>
                    <p><a href="${item.link || ''}">${item.link || ''}</a></p>
                    <img src="${item.image || ''}" alt="${item.title || `Section ${idx + 1}`}" />
                </section>

                ${idx < content.length - 1 ? '<hr style="border: none; border-top: 2px solid #e0e0e0; margin: 30px 0;" />' : ''}`).join('\n')}
                
                <footer style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0; text-align: center;">
                    <p style="font-size: 1em; margin: 0; padding: 0; color: #555; font-style: italic;">[Write a personalized sign-off in the speaker's voice]</p>
                </footer>
            </article>

            STYLING REQUIREMENTS:
            - Article: max-width 800px, centered with auto margins, padding 40px vertical and 20px horizontal, border 20px solid ${primaryColor || '#333'} (primary brand color)
            - Header: centered text alignment, bottom margin 40px
            - H1 Title: font-size 2.5em, bold, centered, margin bottom 20px, color #222
            - Header paragraph: font-size 1.1em, horizontal padding 20px, color #555
            - Each section: margin 40px vertical, padding 20px vertical
            - H2 section titles: font-size 1.8em, bold, margin bottom 15px, color #222
            - Section paragraphs: font-size 1em, margin bottom 15px, line-height 1.7, color #444
            - Horizontal rules (hr) between sections: border-top 2px solid #e0e0e0, margin 30px vertical
            - Footer: margin-top 50px, padding-top 30px, border-top 2px solid #e0e0e0, centered, italic text
            - Overall: font-family Arial sans-serif, line-height 1.6, text color #333

            SPEAKER INFORMATION:
            ${speaker}

            CONTENT SECTIONS TO REWRITE:
            ${content.map((item, idx) => `
            Section ${idx + 1}:
            - Title: ${item.title || `Section ${idx + 1}`}
            - Content to rewrite: ${item.content || 'No content provided'}
            - Image: ${item.image || 'No image provided'}
            - Link: ${item.link || 'No link provided'}
            - Your task: Rewrite this content in the speaker's voice, making it engaging and natural. Do NOT copy it verbatim.`).join('\n')}

            CRITICAL CONTENT REWRITING REQUIREMENTS:
            - DO NOT copy any content verbatim - you must REWRITE everything in the speaker's voice
            - The introduction paragraph should introduce ALL topics/sections covered in this newsletter (${content.map((item, idx) => item.title || `Section ${idx + 1}`).join(', ')})
            - For each section above, rewrite the "Content to rewrite" text to match the speaker's voice, tone, and style
            - Transform the raw content into well-written, engaging paragraphs that flow naturally
            - Make it sound like the speaker personally wrote each section
            - Use the section titles provided, but rewrite all paragraph content completely
            - The introduction should preview what readers will learn about in each section

            REMEMBER:
            - Output ONLY the HTML code starting with <article> and ending with </article>
            - Do NOT wrap in markdown code blocks
            - Do NOT add any explanations or comments
            - Include ALL inline styles exactly as specified above
            - Add <hr> tags between each content section (but not after the last section)
            - REWRITE all content in the speaker's voice - do not copy it verbatim
            - The introduction should preview all sections/topics in the newsletter
            - Make the newsletter engaging, informative, and well-structured

            BEGIN YOUR OUTPUT NOW (start with <article>):
        `;
  
        const result = await withRetry(() => aiModel.generateContent(prompt));
        let html = result.response.text();

        html = cleanHtmlOutput(html);
        html = ensureNewsletterStyling(html, primaryColor);

        const htmlLower = html.toLowerCase().trim();
        if (!html || !htmlLower.startsWith('<article')) {
            return {
                status: false,
                data: null,
                message: `AI did not return valid HTML. Received: ${html.substring(0, 100)}...`,
            };
        }

        if (!htmlLower.includes('</article>')) {
            return {
                status: false,
                data: null,
                message: "HTML is missing closing </article> tag",
            };
        }

        if (htmlLower.includes('<script')) {
            return {
                status: false,
                data: null,
                message: "Unsafe HTML detected: script tags found",
            };
        }

        return {
            status: true,
            data: html,
            message: "HTML newsletter generated successfully",
        };

    } catch (error: unknown) {
        let errorMessage = "Unknown error while generating newsletter content";
        
        if (error instanceof Error) {
            const errMsg = error.message || error.toString();

            if (errMsg.includes("503") || errMsg.includes("overloaded") || errMsg.includes("Service Unavailable")) {
                errorMessage = "The AI service is currently overloaded. Please try again in a few moments. The system will automatically retry on your next attempt.";
            } else if (errMsg.includes("429") || errMsg.includes("rate limit") || errMsg.includes("quota")) {
                errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
            } else if (errMsg.includes("401") || errMsg.includes("403")) {
                errorMessage = "Authentication error. Please check your API configuration.";
            } else {
                errorMessage = errMsg;
            }
        }
        
        return {
            status: false,
            data: null,
            message: errorMessage,
        };
    }
}

