// Imports

import { DatabaseClient, connectToDatabase } from "../core/database";
import { handleCloseDatabaseConnections } from "../core/helper";
import { DataReturnObject } from "@/types/helper";
import { BrandComponent } from "@/types/component";
import { deleteRowById, dynamicSendData, getAllRowsFromTable, getRowById, updateRowById } from "../core/database/queries";

// Exports

export async function getAllBrands(): Promise<DataReturnObject<BrandComponent[]>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: null,
                message: dbConnection.message
            };
        }
        
        dbClient = dbConnection.data;

        const getAllBrandsResult = await getAllRowsFromTable(dbClient, 'brand');
        if(!getAllBrandsResult.status || !getAllBrandsResult.data) {
            return {
                status: false,
                data: null,
                message: getAllBrandsResult.message
            };
        }

        let returnData: BrandComponent[] = [];

        for(const brand of getAllBrandsResult.data) {

            const user = await getRowById(dbClient, 'users', brand.user_id);
            if(!user.status || !user.data) {
                return {
                    status: false,
                    data: null,
                    message: user.message
                };
            }
            
            returnData.push({
                id: brand.id,
                name: brand.name,
                user: {
                    id: user.data.id,
                    name: user.data.name
                },
                lastUpdated: brand.updated_at
            });
        }

        return {
            status: true,
            data: returnData as unknown as BrandComponent[],
            message: getAllBrandsResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all brands'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createBrand(brand: BrandComponent): Promise<DataReturnObject<boolean>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: null,
                message: dbConnection.message
            };
        }
        
        dbClient = dbConnection.data;

        const keys = Object.keys(brand);
        const values = Object.values(brand);

        const createBrandResult = await dynamicSendData(dbClient, 'brand', keys, values);
        if(!createBrandResult.status || !createBrandResult.data) {
            return {
                status: false,
                data: null,
                message: createBrandResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: createBrandResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating brand'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function updateBrand(id: number, brand: BrandComponent): Promise<DataReturnObject<boolean>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: null,
                message: dbConnection.message
            };
        }

        dbClient = dbConnection.data;

        const keys = Object.keys(brand);
        const values = Object.values(brand);

        const updateBrandResult = await updateRowById(dbClient, 'brand', keys, values, id);
        if(!updateBrandResult.status || !updateBrandResult.data) {
            return {
                status: false,
                data: null,
                message: updateBrandResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: updateBrandResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while updating brand'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function deleteBrand(id: number): Promise<DataReturnObject<boolean>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: null,
                message: dbConnection.message
            };
        }

        dbClient = dbConnection.data;

        const deleteBrandResult = await deleteRowById(dbClient, 'brand', id);
        if(!deleteBrandResult.status || !deleteBrandResult.data) {
            return {
                status: false,
                data: null,
                message: deleteBrandResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: deleteBrandResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while deleting brand'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function getBrandById(id: number): Promise<DataReturnObject<BrandComponent>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: null,
                message: dbConnection.message
            };
        }

        dbClient = dbConnection.data;

        const getBrandByIdResult = await getRowById(dbClient, 'brand', id);
        if(!getBrandByIdResult.status || !getBrandByIdResult.data) {
            return {
                status: false,
                data: null,
                message: getBrandByIdResult.message
            };
        }

        return {
            status: true,
            data: getBrandByIdResult.data as BrandComponent,
            message: getBrandByIdResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting brand by id'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}
