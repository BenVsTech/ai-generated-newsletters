// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { deleteNewsletter, getNewsletterById, updateNewsletter } from "@/lib/service/newsletter.service";

// Exports

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Newsletter ID is required', null);
        }

        const getNewsletterByIdResult = await getNewsletterById(Number(id));
        if(!getNewsletterByIdResult.status) {
            return handleApiResponse(false, getNewsletterByIdResult.message, null);
        }

        return handleApiResponse(true, getNewsletterByIdResult.message, getNewsletterByIdResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while getting newsletter by id', null);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        const body = await request.json();

        if(!id || !body) {
            return handleApiResponse(false, 'Newsletter ID and body are required', null);
        }

        const updateNewsletterResult = await updateNewsletter(body, Number(id));
        if(!updateNewsletterResult.status) {
            return handleApiResponse(false, updateNewsletterResult.message, null);
        }

        return handleApiResponse(true, updateNewsletterResult.message, updateNewsletterResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while updating newsletter', null);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Newsletter ID is required', null);
        }

        const deleteNewsletterResult = await deleteNewsletter(Number(id));
        if(!deleteNewsletterResult.status) {
            return handleApiResponse(false, deleteNewsletterResult.message, null);
        }

        return handleApiResponse(true, deleteNewsletterResult.message, deleteNewsletterResult.data);
        
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while deleting newsletter', null);
    }
}