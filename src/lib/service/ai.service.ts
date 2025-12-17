// Imports

import { createAiClient, createAiPrompt } from "@/lib/core/ai";
import { DataReturnObject } from "@/types/helper";
import { handleCloseDatabaseConnections } from "../core/helper";
import { connectToDatabase, DatabaseClient } from "../core/database";
import { getRowById } from "../core/database/queries";
import { Newsletter } from "@/types/database";

// Exports

export async function generateNewsletter(newsletterId: number): Promise<DataReturnObject<string>> {

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

        const newsletterObject = await getRowById(dbClient, 'newsletter', newsletterId);
        if(!newsletterObject.status || !newsletterObject.data) {
            return {
                status: false,
                data: null,
                message: newsletterObject.message
            };
        }

        const { name, speaker, content, brand_id } = newsletterObject.data as Newsletter;
        
        const aiClient = await createAiClient();
        if(!aiClient.status || !aiClient.data) {
            return {
                status: false,
                data: null,
                message: aiClient.message
            };
        }
        
        const createAiPromptResult = await createAiPrompt(aiClient.data, name, speaker, content as any);
        if(!createAiPromptResult.status || !createAiPromptResult.data) {
            return {
                status: false,
                data: null,
                message: createAiPromptResult.message
            };
        }

        console.log('Create Ai Prompt Result:', createAiPromptResult.data);

        return {
            status: true,
            data: 'Newsletter generated successfully',
            message: 'Newsletter generated successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while generating newsletter'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}