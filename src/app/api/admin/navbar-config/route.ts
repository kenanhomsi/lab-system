import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";
import { revalidatePath } from "next/cache";
import {
  readNavbarConfig,
  resetNavbarConfig,
  writeNavbarConfig,
} from "@/lib/navbar-config/store";
import {
  navbarConfigSchema,
  normalizeNavbarConfig,
  validateNavbarConfig,
} from "@/lib/navbar-config/types";

export const dynamic = "force-dynamic";

const isAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: getAuthSecret() });
  const roles = Array.isArray(token?.roles) ? (token.roles as string[]) : [];
  return roles.some((role) => role.toLowerCase().includes("admin"));
};

const forbidden = () => NextResponse.json({ message: "Forbidden" }, { status: 403 });

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return forbidden();
  return NextResponse.json(await readNavbarConfig());
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) return forbidden();
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = navbarConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid navbar config" }, { status: 400 });
  }
  const config = normalizeNavbarConfig(parsed.data);
  const error = validateNavbarConfig(config);
  if (error) return NextResponse.json({ message: error }, { status: 400 });
  await writeNavbarConfig(config);
  revalidatePath("/", "layout");
  return NextResponse.json(config);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return forbidden();
  await resetNavbarConfig();
  revalidatePath("/", "layout");
  return NextResponse.json(await readNavbarConfig());
}
