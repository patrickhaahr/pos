import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isAdmin: boolean;
}

const sessionOptions = {
  password: "brewhaus-secret-key-change-in-production-32chars",
  cookieName: "brewhaus-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) {
    return null;
  }
  return session;
}
