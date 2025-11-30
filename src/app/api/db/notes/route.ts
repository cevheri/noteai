import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, noteTags, tags, categories } from '@/db/schema';
import { eq, like, and, or, desc, inArray } from 'drizzle-orm';
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

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please log in',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const isFavorite = searchParams.get('isFavorite');
    const isArchived = searchParams.get('isArchived');
    const isDeleted = searchParams.get('isDeleted');

    // Build WHERE conditions - ALWAYS filter by current user
    const conditions = [eq(notes.userId, userId)];

    if (search) {
      conditions.push(
        or(
          like(notes.title, `%${search}%`),
          like(notes.content, `%${search}%`)
        )!
      );
    }

    if (categoryId) {
      conditions.push(eq(notes.categoryId, parseInt(categoryId)));
    }

    if (isFavorite !== null && isFavorite !== undefined) {
      conditions.push(eq(notes.isFavorite, isFavorite === 'true'));
    }

    if (isArchived !== null && isArchived !== undefined) {
      conditions.push(eq(notes.isArchived, isArchived === 'true'));
    }

    if (isDeleted !== null && isDeleted !== undefined) {
      conditions.push(eq(notes.isDeleted, isDeleted === 'true'));
    }

    // Get notes based on filters - always filtered by userId
    let notesList = await db.select()
      .from(notes)
      .where(and(...conditions))
      .orderBy(desc(notes.updatedAt))
      .limit(limit)
      .offset(offset);

    // Filter by tagId if provided
    if (tagId) {
      const noteIdsWithTag = await db.select({ noteId: noteTags.noteId })
        .from(noteTags)
        .where(eq(noteTags.tagId, parseInt(tagId)));

      const noteIdsSet = new Set(noteIdsWithTag.map(nt => nt.noteId));
      notesList = notesList.filter(note => noteIdsSet.has(note.id));
    }

    // Get all tags for the notes
    const noteIds = notesList.map(note => note.id);
    let noteTagsList: Array<{ noteId: number; tagId: number }> = [];
    let tagsList: Array<{ id: number; name: string; color: string }> = [];

    if (noteIds.length > 0) {
      noteTagsList = await db.select()
        .from(noteTags)
        .where(inArray(noteTags.noteId, noteIds));

      const tagIds = [...new Set(noteTagsList.map(nt => nt.tagId))];
      if (tagIds.length > 0) {
        tagsList = await db.select({
          id: tags.id,
          name: tags.name,
          color: tags.color
        })
          .from(tags)
          .where(inArray(tags.id, tagIds));
      }
    }

    // Map tags to notes
    const tagsMap = new Map(tagsList.map(tag => [tag.id, tag]));
    const notesWithTags = notesList.map(note => {
      const noteTags = noteTagsList
        .filter(nt => nt.noteId === note.id)
        .map(nt => tagsMap.get(nt.tagId))
        .filter(Boolean);

      return {
        ...note,
        tags: noteTags
      };
    });

    return NextResponse.json({ notes: notesWithTags }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please log in',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, categoryId, tags: tagIds, isFavorite } = body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!content || content.trim() === '') {
      return NextResponse.json({ 
        error: "Content is required",
        code: "MISSING_CONTENT" 
      }, { status: 400 });
    }

    // Validate categoryId if provided
    if (categoryId !== null && categoryId !== undefined) {
      const category = await db.select()
        .from(categories)
        .where(eq(categories.id, parseInt(categoryId)))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json({ 
          error: "Category not found",
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
    }

    // Validate tag IDs if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      const validTags = await db.select()
        .from(tags)
        .where(inArray(tags.id, tagIds.map((id: number) => parseInt(id.toString()))));

      if (validTags.length !== tagIds.length) {
        return NextResponse.json({ 
          error: "One or more tags not found",
          code: "INVALID_TAGS" 
        }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    // Insert note with userId from session (NOT from client)
    const newNote = await db.insert(notes)
      .values({
        title: title.trim(),
        content: content.trim(),
        userId: userId, // Use session userId - secure!
        categoryId: categoryId ? parseInt(categoryId) : null,
        isFavorite: isFavorite ?? false,
        isArchived: false,
        isDeleted: false,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Insert note tags if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      const noteTagsToInsert = tagIds.map((tagId: number) => ({
        noteId: newNote[0].id,
        tagId: parseInt(tagId.toString())
      }));

      await db.insert(noteTags)
        .values(noteTagsToInsert);
    }

    return NextResponse.json({ note: newNote[0] }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}