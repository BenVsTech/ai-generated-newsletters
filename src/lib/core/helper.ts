// Imports

import { NextResponse } from "next/server";
import { DatabaseClient } from "./database";
import { DataReturnObject } from "@/types/helper";
import { closeDatabaseConnection } from "./database";

// Exports

export async function handleCloseDatabaseConnections(temporaryDbClient: DatabaseClient | null, dbClient: DatabaseClient | null): Promise<DataReturnObject<boolean>> {
    try{
        if(temporaryDbClient) {
            await closeDatabaseConnection(temporaryDbClient);
        }
        if(dbClient) {
            await closeDatabaseConnection(dbClient);
        }
        return {
            status: true,
            data: true,
            message: 'Database connections closed successfully'
        };
    } catch(error: unknown) {
        console.error('Error closing database connections:', error instanceof Error ? error.message : 'Unknown error');
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while closing database connections'
        };
    }
}

export const createApiResponse = <T>(status: boolean, data: T | null, message: string): DataReturnObject<T> => {
    return {
        status: status,
        data: data,
        message: message
    }
}

export const handleApiResponse = (status: boolean, message: string, data?: any) => {
    if(status){
        console.log(message);
    } else {
        console.error(message);
    }

    return NextResponse.json({
        ...createApiResponse(status, data, message)
    })
}

export async function generatePassword(): Promise<DataReturnObject<string>> {
    try{

        const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return {
            status: true,
            data: password,
            message: 'Password generated successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while generating password'
        };
    }
}
