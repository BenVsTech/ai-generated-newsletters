// Imports

import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { updateRowById } from "@/lib/core/database/queries";
import { DataReturnObject } from "@/types/helper";
import { User } from "@/types/database";

// Exports

export async function updateUser(id: number, user: User): Promise<DataReturnObject<boolean>> {

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

        const columns = Object.keys(user);
        const values = Object.values(user);

        const updateUserResult = await updateRowById(dbClient, 'users', columns, values, id);
        if(!updateUserResult.status) {
            return {
                status: false,
                data: null,
                message: updateUserResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: updateUserResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while updating user'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}