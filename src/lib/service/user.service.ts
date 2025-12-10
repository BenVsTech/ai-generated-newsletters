// Imports

import { generatePassword, handleCloseDatabaseConnections } from "@/lib/core/helper";
import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { deleteRowById, dynamicSendData, getAllRowsFromTable, getRowById, updateRowById } from "@/lib/core/database/queries";
import { DataReturnObject } from "@/types/helper";
import { User } from "@/types/database";
import { UserComponent } from "@/types/component";
import { sendEmailToUser } from "./email.service";

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

export async function getAllUsers(): Promise<DataReturnObject<User[]>> {

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

        const getAllUsersResult = await getAllRowsFromTable(dbClient, 'users');
        if(!getAllUsersResult.status || !getAllUsersResult.data) {
            return {
                status: false,
                data: null,
                message: getAllUsersResult.message
            };
        }

        let returnData: UserComponent[] = [];

        for(const user of getAllUsersResult.data) {
            returnData.push({
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.created_at
            });
        }

        return { status: true, data: returnData as unknown as User[], message: getAllUsersResult.message };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all users'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createUser(user: User): Promise<DataReturnObject<boolean>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: false,
                message: dbConnection.message
            };
        }

        dbClient = dbConnection.data;

        const password = await generatePassword();
        if(!password.status || !password.data) {
            return {
                status: false,
                data: false,
                message: password.message
            };
        }

        const createUserResult = await dynamicSendData(dbClient, 'users', ['name', 'email', 'password'], [user.name, user.email, password.data]);
        if(!createUserResult.status || !createUserResult.data) {
            return {
                status: false,
                data: false,
                message: createUserResult.message
            };
        }

        const sendEmailResult = await sendEmailToUser(
            user.email, 
            'Welcome to the system', 
            `Welcome to the system ${user.name}. Your password is ${password.data}`
        );
        if(!sendEmailResult.status || !sendEmailResult.data) {
            return {
                status: false,
                data: false,
                message: sendEmailResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: 'User created successfully'
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating user'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function deleteUser(id: number): Promise<DataReturnObject<boolean>> {

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

        const deleteUserResult = await deleteRowById(dbClient, 'users', id);
        if(!deleteUserResult.status || !deleteUserResult.data) {
            return {
                status: false,
                data: null,
                message: deleteUserResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: deleteUserResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while deleting user'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function getUserById(id: number): Promise<DataReturnObject<User>> {

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

        const getUserByIdResult = await getRowById(dbClient, 'users', id);
        if(!getUserByIdResult.status || !getUserByIdResult.data) {
            return {
                status: false,
                data: null,
                message: getUserByIdResult.message
            };
        }

        return {
            status: true,
            data: getUserByIdResult.data as User,
            message: getUserByIdResult.message
        };

        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting user by id'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}
