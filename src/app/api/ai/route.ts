// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { generateNewsletter } from "@/lib/service/ai.service";

// Exports

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const body = await request.json();
        const { newsletterId } = body;

        if(!newsletterId) {
            return handleApiResponse(false, 'Newsletter ID is required', null);
        }

        const generateNewsletterResult = await generateNewsletter(newsletterId);
        if(!generateNewsletterResult.status) {
            return handleApiResponse(false, generateNewsletterResult.message, null);
        }

        return handleApiResponse(true, generateNewsletterResult.message, generateNewsletterResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while generating newsletter', null);
    }
}