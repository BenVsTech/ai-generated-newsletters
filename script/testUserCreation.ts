// Imports

import { createTestUser } from "@/lib/service/database.service";

// Run Script

(async () => {
    const result = await createTestUser();
    console.log(result.message);
    process.exit(0);
})();