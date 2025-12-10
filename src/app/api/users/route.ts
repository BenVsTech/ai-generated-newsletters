// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { createUser, getAllUsers } from "@/lib/service/user.service";

// Exports

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{

        const getAllUsersResult = await getAllUsers();
        if(!getAllUsersResult.status) {
            return handleApiResponse(false, getAllUsersResult.message, null);
        }

        return handleApiResponse(true, getAllUsersResult.message, getAllUsersResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while getting all users', null);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const body = await request.json();

        const createUserResult = await createUser(body);
        if(!createUserResult.status) {
            return handleApiResponse(false, createUserResult.message, null);
        }

        return handleApiResponse(true, createUserResult.message, createUserResult.data);
        
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while creating user', null);
    }
}


