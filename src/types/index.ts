// src/types/index.ts
import { Client, Mission } from "@prisma/client";

// Example of a combined type if needed frequently outside stores
export type MissionWithClientDetails = Mission & {
  client: Pick<Client, "id" | "name">; // Only include needed client fields
};

// Add other global types here if required
