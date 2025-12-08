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

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: string;
    created_by_user_id: number;
    assigned_to_user_id: number;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    team_id: number;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    text: string;
    ticket_id: number;
    author_id: number;
    created_at: string;
    updated_at: string;
}

export interface Team {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}
