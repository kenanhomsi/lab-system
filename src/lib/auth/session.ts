import { getServerSession as nextAuthGetServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export async function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}
