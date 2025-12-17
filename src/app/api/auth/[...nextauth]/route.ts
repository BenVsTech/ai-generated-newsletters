// Imports

import { handlers } from "@/lib/core/auth";

// Exports

if (!handlers) {
    throw new Error("NextAuth handlers not initialized. Check NEXTAUTH_SECRET and database configuration.");
}

export const { GET, POST } = handlers;