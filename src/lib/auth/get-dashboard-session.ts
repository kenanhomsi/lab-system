import { cache } from "react";
import { getServerSession } from "next-auth";
import { serverAuthConfig } from "@/lib/auth-options";

/**
 * Cached dashboard session lookup — deduplicates reads within one RSC request.
 */
export const getDashboardSession = cache(() => getServerSession(serverAuthConfig));
