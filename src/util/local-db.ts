// Imports

import { DatabaseConfiguration } from "@/types/database";
import { databaseConstants } from "@/util/constants";

// Exports

export const localDatabaseConfiguration: DatabaseConfiguration = {
    name: 'ai_generated_newsletters',
    globalTriggerFunctions: [
        `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `,
        `
        CREATE OR REPLACE FUNCTION encrypt_password_before_insert()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.password IS NOT NULL THEN
                NEW.password = crypt(NEW.password, gen_salt('bf'));
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `,
    ],
    tables: [
        {
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: databaseConstants.primaryKey,
                },
                {
                    name: 'name',
                    type: databaseConstants.varchar(255),
                },
                {
                    name: 'email',
                    type: databaseConstants.varchar(255),
                },
                {
                    name: 'password',
                    type: databaseConstants.varchar(255),
                },
                {
                    name: 'created_at',
                    type: databaseConstants.defaultTimestamp,
                },
                {
                    name: 'updated_at',
                    type: databaseConstants.defaultTimestamp,
                },
            ],
            foreignKeys: '',
            uniqueConstraints: '',
            useUpdatedAtTrigger: true,
            usePasswordEncryptionTrigger: true,
        }, 
        {
            name: 'brand',
            columns: [
                {
                    name: 'id',
                    type: databaseConstants.primaryKey,
                },
                {
                    name: 'name',
                    type: databaseConstants.varchar(255),
                },
                {
                    name: 'primary_color',
                    type: databaseConstants.varchar(512),
                },
                {
                    name: 'secondary_color',
                    type: databaseConstants.varchar(512),
                },
                {
                    name: 'text_color',
                    type: databaseConstants.varchar(512),
                },
                {
                    name: 'text_font',
                    type: databaseConstants.varchar(512),
                },
                {
                    name: 'user_id',
                    type: databaseConstants.integer,
                },
                {
                    name: 'created_at',
                    type: databaseConstants.defaultTimestamp,
                },
                {
                    name: 'updated_at',
                    type: databaseConstants.defaultTimestamp,
                },
            ],
            foreignKeys: `
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            `,
            uniqueConstraints: '',
            useUpdatedAtTrigger: true,
            usePasswordEncryptionTrigger: false,
        },
        {
            name: 'newsletter',
            columns: [
                {
                    name: 'id',
                    type: databaseConstants.primaryKey,
                },
                {
                    name: 'name',
                    type: databaseConstants.varchar(512),
                },
                {
                    name: 'speaker',
                    type: databaseConstants.varchar(512),
                },
                {
                    name: 'content',
                    type: databaseConstants.json,
                },
                {
                    name: 'brand_id',
                    type: databaseConstants.integer,
                },
                {
                    name: 'user_id',
                    type: databaseConstants.integer,
                },
                {
                    name: 'created_at',
                    type: databaseConstants.defaultTimestamp,
                },
                {
                    name: 'updated_at',
                    type: databaseConstants.defaultTimestamp,
                },
            ],
            foreignKeys: `
                FOREIGN KEY (brand_id) REFERENCES brand(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            `,
            uniqueConstraints: '',
            useUpdatedAtTrigger: false,
            usePasswordEncryptionTrigger: false,
        }
    ],
}