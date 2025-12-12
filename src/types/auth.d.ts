// Imports

import "next-auth";
import "next-auth/jwt";

// Exports

declare module "next-auth" {
    interface User {
      id: string;
      name?: string | null;
      email?: string | null;
      teamId?: number;
    }
  
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        teamId?: number;
      };
    }
}
  
declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        teamId?: number;
    }
}