import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, notes, bugReports, session } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const sessionData = await auth.api.getSession({ headers: await headers() });
    
    if (!sessionData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userRole = (sessionData.user as { role?: string }).role;
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get total users count
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(user);
    const totalUsers = totalUsersResult?.count || 0;

    // Get total notes count
    const [totalNotesResult] = await db
      .select({ count: count() })
      .from(notes);
    const totalNotes = totalNotesResult?.count || 0;

    // Get total bug reports count
    const [totalBugReportsResult] = await db
      .select({ count: count() })
      .from(bugReports);
    const totalBugReports = totalBugReportsResult?.count || 0;

    // Get open bug reports count
    const [openBugReportsResult] = await db
      .select({ count: count() })
      .from(bugReports)
      .where(eq(bugReports.status, "open"));
    const openBugReports = openBugReportsResult?.count || 0;

    // Get active sessions count (users online in last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [activeUsersResult] = await db
      .select({ count: sql<number>`count(distinct ${session.userId})` })
      .from(session)
      .where(sql`${session.expiresAt} > ${new Date()}`);
    const activeUsers = activeUsersResult?.count || 0;

    // Get recent users (last 5)
    const recentUsers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(5);

    // Get recent bug reports (last 5)
    const recentBugReports = await db
      .select({
        id: bugReports.id,
        title: bugReports.title,
        severity: bugReports.severity,
        status: bugReports.status,
        createdAt: bugReports.createdAt,
      })
      .from(bugReports)
      .orderBy(desc(bugReports.createdAt))
      .limit(5);

    return NextResponse.json({
      totalUsers,
      totalNotes,
      totalBugReports,
      openBugReports,
      activeUsers,
      recentUsers: recentUsers.map((u) => ({
        ...u,
        createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
      })),
      recentBugReports,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
