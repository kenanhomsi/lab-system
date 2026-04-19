/** Same secret NextAuth uses to sign JWT cookies — must match everywhere `getToken` runs. */
export function getAuthSecret(): string {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "dev-secret-change-in-production"
  );
}
