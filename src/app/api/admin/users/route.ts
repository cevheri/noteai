import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { desc, like, or } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED' 
      }, { status: 403 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

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

    // Build query
    let query = db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      image: user.image,
      emailVerified: user.emailVerified,
    }).from(user);

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where(
        or(
          like(user.name, searchTerm),
          like(user.email, searchTerm)
        )
      );
    }

    // Apply ordering and pagination
    const users = await query
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    // Convert timestamps to ISO strings
    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : new Date(u.createdAt).toISOString(),
      updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : new Date(u.updatedAt).toISOString(),
      image: u.image,
      emailVerified: u.emailVerified,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });

  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}