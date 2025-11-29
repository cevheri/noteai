import { db } from '@/db';
import { noteTags, notes, tags } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
    // Query notes and tags to get their IDs
    const [note1] = await db.select().from(notes).where(and(
        eq(notes.title, "Q2 Sprint Planning Meeting"),
        eq(notes.userId, "demo-user-1")
    )).limit(1);
    const [note2] = await db.select().from(notes).where(and(
        eq(notes.title, "Client Presentation Outline"),
        eq(notes.userId, "demo-user-1")
    )).limit(1);
    const [note3] = await db.select().from(notes).where(and(
        eq(notes.title, "Weekend Trip Planning"),
        eq(notes.userId, "demo-user-1")
    )).limit(1);
    const [note4] = await db.select().from(notes).where(and(
        eq(notes.title, "App Feature Ideas - AI Integration"),
        eq(notes.userId, "demo-user-1")
    )).limit(1);
    const [note5] = await db.select().from(notes).where(and(
        eq(notes.title, "Archived Project: Mobile App v1"),
        eq(notes.userId, "demo-user-1")
    )).limit(1);

    const [note6] = await db.select().from(notes).where(and(
        eq(notes.title, "E-Commerce Platform Redesign"),
        eq(notes.userId, "demo-user-2")
    )).limit(1);
    const [note7] = await db.select().from(notes).where(and(
        eq(notes.title, "Marketing Campaign Ideas"),
        eq(notes.userId, "demo-user-2")
    )).limit(1);
    const [note8] = await db.select().from(notes).where(and(
        eq(notes.title, "TypeScript Advanced Patterns"),
        eq(notes.userId, "demo-user-2")
    )).limit(1);
    const [note9] = await db.select().from(notes).where(and(
        eq(notes.title, "Docker & Kubernetes Notes"),
        eq(notes.userId, "demo-user-2")
    )).limit(1);
    const [note10] = await db.select().from(notes).where(and(
        eq(notes.title, "Database Design Best Practices"),
        eq(notes.userId, "demo-user-2")
    )).limit(1);
    const [note11] = await db.select().from(notes).where(and(
        eq(notes.title, "Budget Proposal - Team Expansion"),
        eq(notes.userId, "demo-user-2")
    )).limit(1);

    const [note12] = await db.select().from(notes).where(and(
        eq(notes.title, "React Custom Hooks Library"),
        eq(notes.userId, "demo-user-3")
    )).limit(1);
    const [note13] = await db.select().from(notes).where(and(
        eq(notes.title, "Python API Client Template"),
        eq(notes.userId, "demo-user-3")
    )).limit(1);
    const [note14] = await db.select().from(notes).where(and(
        eq(notes.title, "Next.js API Route Patterns"),
        eq(notes.userId, "demo-user-3")
    )).limit(1);
    const [note15] = await db.select().from(notes).where(and(
        eq(notes.title, "API Documentation Guidelines"),
        eq(notes.userId, "demo-user-3")
    )).limit(1);

    // Query tags for demo-user-1
    const [tagImportant1] = await db.select().from(tags).where(and(
        eq(tags.name, "important"),
        eq(tags.userId, "demo-user-1")
    )).limit(1);
    const [tagTodo1] = await db.select().from(tags).where(and(
        eq(tags.name, "todo"),
        eq(tags.userId, "demo-user-1")
    )).limit(1);
    const [tagWork1] = await db.select().from(tags).where(and(
        eq(tags.name, "work"),
        eq(tags.userId, "demo-user-1")
    )).limit(1);
    const [tagCompleted1] = await db.select().from(tags).where(and(
        eq(tags.name, "completed"),
        eq(tags.userId, "demo-user-1")
    )).limit(1);

    // Query tags for demo-user-2
    const [tagUrgent2] = await db.select().from(tags).where(and(
        eq(tags.name, "urgent"),
        eq(tags.userId, "demo-user-2")
    )).limit(1);
    const [tagReview2] = await db.select().from(tags).where(and(
        eq(tags.name, "review"),
        eq(tags.userId, "demo-user-2")
    )).limit(1);
    const [tagDone2] = await db.select().from(tags).where(and(
        eq(tags.name, "done"),
        eq(tags.userId, "demo-user-2")
    )).limit(1);

    // Query tags for demo-user-3
    const [tagJavascript3] = await db.select().from(tags).where(and(
        eq(tags.name, "javascript"),
        eq(tags.userId, "demo-user-3")
    )).limit(1);
    const [tagReact3] = await db.select().from(tags).where(and(
        eq(tags.name, "react"),
        eq(tags.userId, "demo-user-3")
    )).limit(1);
    const [tagPython3] = await db.select().from(tags).where(and(
        eq(tags.name, "python"),
        eq(tags.userId, "demo-user-3")
    )).limit(1);
    const [tagApi3] = await db.select().from(tags).where(and(
        eq(tags.name, "api"),
        eq(tags.userId, "demo-user-3")
    )).limit(1);

    const noteTagsData = [];

    // demo-user-1 note-tag relationships
    if (note1 && tagImportant1 && tagTodo1 && tagWork1) {
        noteTagsData.push(
            { noteId: note1.id, tagId: tagImportant1.id },
            { noteId: note1.id, tagId: tagTodo1.id },
            { noteId: note1.id, tagId: tagWork1.id }
        );
    }

    if (note2 && tagWork1 && tagImportant1) {
        noteTagsData.push(
            { noteId: note2.id, tagId: tagWork1.id },
            { noteId: note2.id, tagId: tagImportant1.id }
        );
    }

    if (note3 && tagTodo1) {
        noteTagsData.push(
            { noteId: note3.id, tagId: tagTodo1.id }
        );
    }

    if (note4 && tagImportant1 && tagTodo1) {
        noteTagsData.push(
            { noteId: note4.id, tagId: tagImportant1.id },
            { noteId: note4.id, tagId: tagTodo1.id }
        );
    }

    if (note5 && tagCompleted1 && tagWork1) {
        noteTagsData.push(
            { noteId: note5.id, tagId: tagCompleted1.id },
            { noteId: note5.id, tagId: tagWork1.id }
        );
    }

    // demo-user-2 note-tag relationships
    if (note6 && tagUrgent2 && tagReview2) {
        noteTagsData.push(
            { noteId: note6.id, tagId: tagUrgent2.id },
            { noteId: note6.id, tagId: tagReview2.id }
        );
    }

    if (note7 && tagReview2) {
        noteTagsData.push(
            { noteId: note7.id, tagId: tagReview2.id }
        );
    }

    if (note8 && tagDone2) {
        noteTagsData.push(
            { noteId: note8.id, tagId: tagDone2.id }
        );
    }

    if (note9 && tagReview2) {
        noteTagsData.push(
            { noteId: note9.id, tagId: tagReview2.id }
        );
    }

    if (note10 && tagDone2) {
        noteTagsData.push(
            { noteId: note10.id, tagId: tagDone2.id }
        );
    }

    if (note11 && tagUrgent2 && tagReview2) {
        noteTagsData.push(
            { noteId: note11.id, tagId: tagUrgent2.id },
            { noteId: note11.id, tagId: tagReview2.id }
        );
    }

    // demo-user-3 note-tag relationships
    if (note12 && tagJavascript3 && tagReact3) {
        noteTagsData.push(
            { noteId: note12.id, tagId: tagJavascript3.id },
            { noteId: note12.id, tagId: tagReact3.id }
        );
    }

    if (note13 && tagPython3 && tagApi3) {
        noteTagsData.push(
            { noteId: note13.id, tagId: tagPython3.id },
            { noteId: note13.id, tagId: tagApi3.id }
        );
    }

    if (note14 && tagJavascript3 && tagReact3 && tagApi3) {
        noteTagsData.push(
            { noteId: note14.id, tagId: tagJavascript3.id },
            { noteId: note14.id, tagId: tagReact3.id },
            { noteId: note14.id, tagId: tagApi3.id }
        );
    }

    if (note15 && tagApi3) {
        noteTagsData.push(
            { noteId: note15.id, tagId: tagApi3.id }
        );
    }

    await db.insert(noteTags).values(noteTagsData);

    console.log('✅ Note tags seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});