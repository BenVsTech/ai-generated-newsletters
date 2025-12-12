// Imports

import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";
import { DataReturnObject } from "@/types/helper";

// Load Environment Variables

dotenv.config();

const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT || "5432");
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DATABASE;

if(!host || !port || !user || !password || !database) {
    throw new Error("Missing environment variables");
}

// Exports Types

export type DatabaseClient = PoolClient;

// Exports Functions

export async function connectToDatabase(temporary: boolean): Promise<DataReturnObject<DatabaseClient>> {
    try{

        const pool = new Pool({
            user: user,
            host: host,
            database: temporary ? 'postgres' : database,
            password: password,
            port: port,
            max: 50,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 2000,
            maxUses: 1000,
            application_name: "internal-ticket-system",
        });

        const client = await pool.connect();

        return {
            status: true,
            data: client,
            message: "Connected to database"
        }

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : "Unknown error"
        }
    }
}

export async function closeDatabaseConnection(client: DatabaseClient): Promise<DataReturnObject<void>> {
    try{

        client.release();
        
        return {
            status: true,
            data: null,
            message: "Closed database connection"
        }
    }
    catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : "Unknown error"
        }
    }
}

