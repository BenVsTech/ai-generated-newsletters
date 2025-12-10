// Imports

import { NewsletterComponent, ReturnContentData } from "@/types/component";
import { DatabaseClient, connectToDatabase } from "../core/database";
import { handleCloseDatabaseConnections } from "../core/helper";
import { DataReturnObject } from "@/types/helper";
import { dynamicSendData, getAllRowsFromTable, getRowById } from "../core/database/queries";

// Exports

export async function getAllNewsletters(): Promise<DataReturnObject<NewsletterComponent[]>> {

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

        const getAllNewslettersResult = await getAllRowsFromTable(dbClient, 'newsletter');
        if(!getAllNewslettersResult.status || !getAllNewslettersResult.data) {
            return {
                status: false,
                data: null,
                message: getAllNewslettersResult.message
            };
        }

        let returnData: NewsletterComponent[] = [];

        for(const newsletter of getAllNewslettersResult.data) {

            const brand = await getRowById(dbClient, 'brand', newsletter.brand_id);
            if(!brand.status || !brand.data) {
                return {
                    status: false,
                    data: null,
                    message: brand.message
                };
            }
            
            const user = await getRowById(dbClient, 'users', newsletter.user_id);
            if(!user.status || !user.data) {
                return {
                    status: false,
                    data: null,
                    message: user.message
                };
            }
            
            returnData.push({
                id: newsletter.id,
                name: newsletter.name,
                speaker: newsletter.speaker,
                brand: {
                    id: brand.data.id,
                    name: brand.data.name
                },
                user: {
                    id: user.data.id,
                    name: user.data.name
                },
                lastUpdated: newsletter.updated_at
            });

        }

        return {
            status: true,
            data: returnData as unknown as NewsletterComponent[],
            message: getAllNewslettersResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all newsletters'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createNewsletter(data: ReturnContentData, userId: number): Promise<DataReturnObject<boolean>> {

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

        const keys = Object.keys(data);
        keys.push('user_id');

        const values = Object.values(data);
        values.push(userId);

        const createNewsletterResult = await dynamicSendData(
            dbClient, 
            'newsletter', 
            keys, 
            values
        );
        if(!createNewsletterResult.status || !createNewsletterResult.data) {
            return {
                status: false,
                data: null,
                message: createNewsletterResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: createNewsletterResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating newsletter'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

