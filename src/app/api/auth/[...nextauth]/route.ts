import { clientAuthConfig } from "@/lib/auth-options";
import NextAuth from "next-auth";

const handler = NextAuth(clientAuthConfig);
export { handler as GET, handler as POST };
