// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { updateUser } from "@/lib/service/user.service";

// Exports

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{
        
        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'User ID is required', null);
        }
        
        const body = await request.json();

        const updateUserResult = await updateUser(Number(id), body);
        if(!updateUserResult.status) {
            return handleApiResponse(false, updateUserResult.message, null);
        }
        
        return handleApiResponse(true, 'User updated successfully', updateUserResult.data);
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}