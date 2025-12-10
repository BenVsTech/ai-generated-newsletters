// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { deleteBrand, getBrandById, updateBrand } from "@/lib/service/brand.service";

// Exports

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;

        if(!id) {
            return handleApiResponse(false, 'Brand ID is required', null);
        }

        const getBrandByIdResult = await getBrandById(Number(id));
        if(!getBrandByIdResult.status) {
            return handleApiResponse(false, getBrandByIdResult.message, null);
        }

        return handleApiResponse(true, getBrandByIdResult.message, getBrandByIdResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while getting brand by id', null);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;

        const body = await request.json();

        if(!id || !body) {
            return handleApiResponse(false, 'Brand ID and body are required', null);
        }

        const updateBrandResult = await updateBrand(Number(id), body);
        if(!updateBrandResult.status) {
            return handleApiResponse(false, updateBrandResult.message, null);
        }

        return handleApiResponse(true, updateBrandResult.message, updateBrandResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while updating brand', null);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;

        if(!id) {
            return handleApiResponse(false, 'Brand ID is required', null);
        }

        const deleteBrandResult = await deleteBrand(Number(id));
        if(!deleteBrandResult.status) {
            return handleApiResponse(false, deleteBrandResult.message, null);
        }

        return handleApiResponse(true, deleteBrandResult.message, deleteBrandResult.data);
        
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error while deleting brand', null);
    }
}

