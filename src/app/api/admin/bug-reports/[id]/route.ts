import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bugReports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin role check
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED'
      }, { status: 403 });
    }

    // Validate ID parameter
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const bugReportId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status field
    if (!status) {
      return NextResponse.json({ 
        error: 'Status is required',
        code: 'MISSING_STATUS'
      }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    // Check if bug report exists
    const existingReport = await db.select()
      .from(bugReports)
      .where(eq(bugReports.id, bugReportId))
      .limit(1);

    if (existingReport.length === 0) {
      return NextResponse.json({ 
        error: 'Bug report not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Update bug report
    const updated = await db.update(bugReports)
      .set({
        status,
        updatedAt: new Date().toISOString()
      })
      .where(eq(bugReports.id, bugReportId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update bug report',
        code: 'UPDATE_FAILED'
      }, { status: 500 });
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin role check
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED'
      }, { status: 403 });
    }

    // Validate ID parameter
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const bugReportId = parseInt(id);

    // Check if bug report exists
    const existingReport = await db.select()
      .from(bugReports)
      .where(eq(bugReports.id, bugReportId))
      .limit(1);

    if (existingReport.length === 0) {
      return NextResponse.json({ 
        error: 'Bug report not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Delete bug report
    const deleted = await db.delete(bugReports)
      .where(eq(bugReports.id, bugReportId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete bug report',
        code: 'DELETE_FAILED'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bug report deleted',
      id: bugReportId
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}