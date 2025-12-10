// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { createBrand, getAllBrands } from "@/lib/service/brand.service";

// Exports

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{

        const getAllBrandsResult = await getAllBrands();
        if(!getAllBrandsResult.status) {
            return handleApiResponse(false, getAllBrandsResult.message, null);
        }

        return handleApiResponse(true, getAllBrandsResult.message, getAllBrandsResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while getting all brands', null);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const body = await request.json();

        const createBrandResult = await createBrand(body);
        if(!createBrandResult.status) {
            return handleApiResponse(false, createBrandResult.message, null);
        }

        return handleApiResponse(true, createBrandResult.message, createBrandResult.data);
        
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while creating brand', null);
    }
}

