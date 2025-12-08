// Exporting Types

export interface DataReturnObject<T> {
    status: boolean;
    data: T | null;
    message: string;
}

