import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required' 
      }, { status: 403 });
    }

    const { id } = await params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ 
        error: 'Valid user ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { role } = body;

    const validRoles = ['user', 'admin', 'super_admin'];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be one of: user, admin, super_admin',
        code: 'INVALID_ROLE' 
      }, { status: 400 });
    }

    const existingUser = await db.select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    const updated = await db.update(user)
      .set({
        role,
        updatedAt: new Date()
      })
      .where(eq(user.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update user' 
      }, { status: 500 });
    }

    const updatedUser = updated[0];
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      image: updatedUser.image,
      emailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required' 
      }, { status: 403 });
    }

    const { id } = await params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ 
        error: 'Valid user ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const existingUser = await db.select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    const targetUser = existingUser[0];
    if (session.user.id === id && userRole === 'super_admin') {
      return NextResponse.json({ 
        error: 'Super admin cannot delete themselves',
        code: 'SELF_DELETE_NOT_ALLOWED' 
      }, { status: 403 });
    }

    const deleted = await db.delete(user)
      .where(eq(user.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete user' 
      }, { status: 500 });
    }

    const deletedUser = deleted[0];
    return NextResponse.json({
      message: 'User deleted successfully',
      user: {
        id: deletedUser.id,
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role,
        createdAt: deletedUser.createdAt.toISOString(),
        updatedAt: deletedUser.updatedAt.toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}