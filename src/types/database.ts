// Exporting Types

export interface DatabaseColumn {
    name: string;
    type: string;
}

export interface DatabaseTable {
    name: string;
    columns: DatabaseColumn[];
    foreignKeys: string;
    uniqueConstraints: string;
    useUpdatedAtTrigger: boolean;
    usePasswordEncryptionTrigger: boolean;
}

export interface DatabaseConfiguration {
    name: string;
    globalTriggerFunctions: string[];
    tables: DatabaseTable[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface Brand {
    id: number;
    name: string;
    primary_color: string;
    secondary_color: string;
    text_color: string;
    text_font: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}
