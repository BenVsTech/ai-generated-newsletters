// Imports

import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DatabaseClient } from "./database";
import { connectToDatabase, closeDatabaseConnection } from "./database";

// Configuration object
const authOptions = {
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
                        `SELECT id, name, email, password FROM users WHERE email = $1`,
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
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
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
};

// Initialize and export
const nextAuth = NextAuth(authOptions as AuthOptions);

// Check what we got
console.log("NextAuth result type:", typeof nextAuth);
console.log("NextAuth result:", nextAuth);

// Export - handle both function and object cases
export const handlers = typeof nextAuth === 'function' 
    ? { GET: nextAuth, POST: nextAuth }
    : nextAuth.handlers;

export const signIn = typeof nextAuth === 'function' ? undefined : nextAuth.signIn;
export const signOut = typeof nextAuth === 'function' ? undefined : nextAuth.signOut;
export const auth = typeof nextAuth === 'function' ? undefined : nextAuth.auth;