import { cookies } from "next/headers";
import { db, User } from "./db";

const SESSION_COOKIE_NAME = "notesai_session";

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = db.findSession(sessionId);
  if (!session) {
    return null;
  }

  const user = db.findUserById(session.userId);
  if (!user) {
    return null;
  }

  return { user };
}

export async function createSessionCookie(userId: number): Promise<string> {
  const session = db.createSession(userId);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: session.expiresAt,
    path: "/",
  });

  return session.id;
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    db.deleteSession(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<User> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user;
}
