import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const categoryId = searchParams.get("categoryId");
    const tagId = searchParams.get("tagId");
    const search = searchParams.get("search");

    let notes;

    if (search) {
      notes = db.searchNotes(session.user.id, search);
    } else if (filter === "favorites") {
      notes = db.getFavoriteNotes(session.user.id);
    } else if (filter === "recent") {
      notes = db.getRecentNotes(session.user.id, 10);
    } else if (filter === "archived") {
      notes = db.getArchivedNotes(session.user.id);
    } else if (filter === "trash") {
      notes = db.getDeletedNotes(session.user.id);
    } else if (categoryId) {
      notes = db.getNotesByCategory(session.user.id, parseInt(categoryId));
    } else if (tagId) {
      notes = db.getNotesByTag(session.user.id, parseInt(tagId));
    } else {
      notes = db.getNotesByUser(session.user.id);
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, categoryId, tags } = await request.json();

    const note = db.createNote({
      title: title || "Untitled",
      content: content || "",
      userId: session.user.id,
      categoryId: categoryId || null,
      tags: tags || [],
      isFavorite: false,
      isArchived: false,
      isDeleted: false,
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
