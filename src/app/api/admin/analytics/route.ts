import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, notes, bugReports, session } from '@/db/schema';
import { count, desc, eq, gte, sql, gt } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const sessionData = await auth.api.getSession({ headers: await headers() });
    if (!sessionData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Authorization check - admin or super_admin only
    const userRole = (sessionData.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required' 
      }, { status: 403 });
    }

    // Calculate 7 days ago timestamp
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAgoTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // 1. Total users
    const totalUsersResult = await db
      .select({ count: count() })
      .from(user);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // 2. Total notes
    const totalNotesResult = await db
      .select({ count: count() })
      .from(notes);
    const totalNotes = totalNotesResult[0]?.count || 0;

    // 3. Total bug reports
    const totalBugReportsResult = await db
      .select({ count: count() })
      .from(bugReports);
    const totalBugReports = totalBugReportsResult[0]?.count || 0;

    // 4. Open bug reports
    const openBugReportsResult = await db
      .select({ count: count() })
      .from(bugReports)
      .where(eq(bugReports.status, 'open'));
    const openBugReports = openBugReportsResult[0]?.count || 0;

    // 5. Active users (users with active sessions)
    const activeUsersResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${session.userId})` })
      .from(session)
      .where(gt(session.expiresAt, new Date(currentTimestamp * 1000)));
    const activeUsers = activeUsersResult[0]?.count || 0;

    // 6. New users this week
    const newUsersThisWeekResult = await db
      .select({ count: count() })
      .from(user)
      .where(gte(user.createdAt, new Date(sevenDaysAgoTimestamp * 1000)));
    const newUsersThisWeek = newUsersThisWeekResult[0]?.count || 0;

    // 7. New notes this week (ISO string comparison)
    const newNotesThisWeekResult = await db
      .select({ count: count() })
      .from(notes)
      .where(gte(notes.createdAt, sevenDaysAgoISO));
    const newNotesThisWeek = newNotesThisWeekResult[0]?.count || 0;

    // 8. Recent users (last 10)
    const recentUsers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(10);

    // Convert timestamps to ISO strings for consistency
    const formattedRecentUsers = recentUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString()
    }));

    // 9. Recent bug reports (last 10)
    const recentBugReports = await db
      .select({
        id: bugReports.id,
        title: bugReports.title,
        severity: bugReports.severity,
        status: bugReports.status,
        createdAt: bugReports.createdAt
      })
      .from(bugReports)
      .orderBy(desc(bugReports.createdAt))
      .limit(10);

    // 10. Bug reports by status
    const bugReportsByStatusResult = await db
      .select({
        status: bugReports.status,
        count: count()
      })
      .from(bugReports)
      .groupBy(bugReports.status);

    const bugReportsByStatus = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    bugReportsByStatusResult.forEach(result => {
      const status = result.status as keyof typeof bugReportsByStatus;
      if (status in bugReportsByStatus) {
        bugReportsByStatus[status] = result.count || 0;
      }
    });

    // 11. Bug reports by severity
    const bugReportsBySeverityResult = await db
      .select({
        severity: bugReports.severity,
        count: count()
      })
      .from(bugReports)
      .groupBy(bugReports.severity);

    const bugReportsBySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    bugReportsBySeverityResult.forEach(result => {
      const severity = result.severity as keyof typeof bugReportsBySeverity;
      if (severity in bugReportsBySeverity) {
        bugReportsBySeverity[severity] = result.count || 0;
      }
    });

    // Return comprehensive analytics
    return NextResponse.json({
      totalUsers,
      totalNotes,
      totalBugReports,
      openBugReports,
      activeUsers,
      newUsersThisWeek,
      newNotesThisWeek,
      recentUsers: formattedRecentUsers,
      recentBugReports,
      bugReportsByStatus,
      bugReportsBySeverity
    }, { status: 200 });

  } catch (error) {
    console.error('GET analytics error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}