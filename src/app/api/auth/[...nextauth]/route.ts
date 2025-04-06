// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"; // Referring to your lib/auth.ts where handlers are exported
export const { GET, POST } = handlers;
