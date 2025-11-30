import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bugReports } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role-based authorization check
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED'
      }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ 
        error: 'Invalid limit parameter',
        code: 'INVALID_LIMIT'
      }, { status: 400 });
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: 'Invalid offset parameter',
        code: 'INVALID_OFFSET'
      }, { status: 400 });
    }

    // Filtering parameters
    const statusFilter = searchParams.get('status');
    const severityFilter = searchParams.get('severity');

    // Validate status filter
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (statusFilter && !validStatuses.includes(statusFilter)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    // Validate severity filter
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (severityFilter && !validSeverities.includes(severityFilter)) {
      return NextResponse.json({ 
        error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`,
        code: 'INVALID_SEVERITY'
      }, { status: 400 });
    }

    // Build query with filters
    let query = db.select().from(bugReports);

    // Apply filters if provided
    const conditions = [];
    if (statusFilter) {
      conditions.push(eq(bugReports.status, statusFilter));
    }
    if (severityFilter) {
      conditions.push(eq(bugReports.severity, severityFilter));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply ordering and pagination
    const results = await query
      .orderBy(desc(bugReports.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ 
      bugReports: results 
    }, { status: 200 });

  } catch (error) {
    console.error('GET bug reports error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message,
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}