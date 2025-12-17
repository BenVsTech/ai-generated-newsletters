// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { createNewsletter, getAllNewsletters } from "@/lib/service/newsletter.service";

// Exports

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{

        const getAllNewslettersResult = await getAllNewsletters();
        if(!getAllNewslettersResult.status) {
            return handleApiResponse(false, getAllNewslettersResult.message, null);
        }

        return handleApiResponse(true, getAllNewslettersResult.message, getAllNewslettersResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while getting all newsletters', null);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const body = await request.json();

        const createNewsletterResult = await createNewsletter(body);
        if(!createNewsletterResult.status) {
            return handleApiResponse(false, createNewsletterResult.message, null);
        }

        return handleApiResponse(true, createNewsletterResult.message, createNewsletterResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while creating newsletter', null);
    }
}



