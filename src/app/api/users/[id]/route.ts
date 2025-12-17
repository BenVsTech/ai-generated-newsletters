// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { deleteUser, getUserById, updateUser } from "@/lib/service/user.service";

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{
        const { id } = await params;

        const getUserByIdResult = await getUserById(Number(id));
        if(!getUserByIdResult.status) {
            return handleApiResponse(false, getUserByIdResult.message, null);
        }

        return handleApiResponse(true, getUserByIdResult.message, getUserByIdResult.data);
    }
    catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{
        const { id } = await params;

        const deleteUserResult = await deleteUser(Number(id));
        if(!deleteUserResult.status) {
            return handleApiResponse(false, deleteUserResult.message, null);
        }

        return handleApiResponse(true, deleteUserResult.message, deleteUserResult.data);
    }
    catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

