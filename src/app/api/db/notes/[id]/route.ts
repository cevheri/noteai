import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, noteTags, tags } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Helper function to get current user from session
async function getCurrentUserId(): Promise<number | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      return parseInt(session.user.id);
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const noteId = parseInt(id);

    // Get note and verify ownership
    const note = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (note.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const noteTags_records = await db
      .select({
        tagId: noteTags.tagId,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(noteTags.noteId, noteId));

    const noteTags_array = noteTags_records.map((nt) => ({
      id: nt.tagId,
      name: nt.tagName,
      color: nt.tagColor,
    }));

    return NextResponse.json({
      note: {
        ...note[0],
        tags: noteTags_array,
      },
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const noteId = parseInt(id);
    const requestBody = await request.json();

    // Verify ownership before update
    const existingNote = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const {
      title,
      content,
      categoryId,
      isFavorite,
      isArchived,
      isDeleted,
      tags: tagIds,
    } = requestBody;

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isArchived !== undefined) updates.isArchived = isArchived;
    if (isDeleted !== undefined) updates.isDeleted = isDeleted;

    const updatedNote = await db
      .update(notes)
      .set(updates)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning();

    if (tagIds !== undefined && Array.isArray(tagIds)) {
      await db.delete(noteTags).where(eq(noteTags.noteId, noteId));

      if (tagIds.length > 0) {
        const noteTagsInserts = tagIds.map((tagId) => ({
          noteId: noteId,
          tagId: tagId,
        }));
        await db.insert(noteTags).values(noteTagsInserts);
      }
    }

    const noteTags_records = await db
      .select({
        tagId: noteTags.tagId,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(noteTags.noteId, noteId));

    const noteTags_array = noteTags_records.map((nt) => ({
      id: nt.tagId,
      name: nt.tagName,
      color: nt.tagColor,
    }));

    return NextResponse.json({
      note: {
        ...updatedNote[0],
        tags: noteTags_array,
      },
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const noteId = parseInt(id);
    const requestBody = await request.json();

    // Verify ownership before update
    const existingNote = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const {
      title,
      content,
      categoryId,
      isFavorite,
      isArchived,
      isDeleted,
      tags: tagIds,
    } = requestBody;

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isArchived !== undefined) updates.isArchived = isArchived;
    if (isDeleted !== undefined) updates.isDeleted = isDeleted;

    const updatedNote = await db
      .update(notes)
      .set(updates)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning();

    if (tagIds !== undefined && Array.isArray(tagIds)) {
      await db.delete(noteTags).where(eq(noteTags.noteId, noteId));

      if (tagIds.length > 0) {
        const noteTagsInserts = tagIds.map((tagId: number) => ({
          noteId: noteId,
          tagId: tagId,
        }));
        await db.insert(noteTags).values(noteTagsInserts);
      }
    }

    const noteTags_records = await db
      .select({
        tagId: noteTags.tagId,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(noteTags.noteId, noteId));

    const noteTags_array = noteTags_records.map((nt) => ({
      id: nt.tagId,
      name: nt.tagName,
      color: nt.tagColor,
    }));

    return NextResponse.json({
      note: {
        ...updatedNote[0],
        tags: noteTags_array,
      },
    });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const noteId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    // Verify ownership before delete
    const existingNote = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (permanent) {
      await db.delete(noteTags).where(eq(noteTags.noteId, noteId));
      await db.delete(notes).where(and(eq(notes.id, noteId), eq(notes.userId, userId))).returning();

      return NextResponse.json({
        success: true,
        message: 'Note deleted',
      });
    } else {
      await db
        .update(notes)
        .set({
          isDeleted: true,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .returning();

      return NextResponse.json({
        success: true,
        message: 'Note deleted',
      });
    }
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}