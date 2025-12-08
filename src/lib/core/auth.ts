// Imports

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DatabaseClient } from "./database";
import { connectToDatabase, closeDatabaseConnection } from "./database";

// Exports 

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                let dbClient: DatabaseClient | null = null;

                try {
                    const connectionResult = await connectToDatabase(false);
                    if (!connectionResult.status || !connectionResult.data) {
                        console.error("Database connection failed:", connectionResult.message);
                        return null;
                    }

                    dbClient = connectionResult.data;

                    const userResult = await dbClient.query(
                        `SELECT id, name, email, password, team_id FROM users WHERE email = $1`,
                        [credentials.email]
                    );

                    if (userResult.rows.length === 0) {
                        return null;
                    }

                    const user = userResult.rows[0];

                    const passwordCheck = await dbClient.query(
                        `SELECT (password = crypt($1, password)) AS match FROM users WHERE id = $2`,
                        [credentials.password, user.id]
                    );

                    if (!passwordCheck.rows[0]?.match) {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                } finally {
                    if (dbClient) {
                        await closeDatabaseConnection(dbClient);
                    }
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
});