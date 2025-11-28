// Mock Database for AI-Powered Note Application

export interface User {
  id: number;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  userId: number;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  userId: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  userId: number;
  categoryId: number | null;
  tags: number[];
  isFavorite: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

// Sample Users
export const users: User[] = [
  {
    id: 1,
    email: "demo@notesai.com",
    password: "demo123",
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: 3,
    email: "mike@example.com",
    password: "password123",
    name: "Mike Williams",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];

// Sample Categories
export const categories: Category[] = [
  { id: 1, name: "Personal", color: "#6366f1", icon: "user", userId: 1, createdAt: new Date("2024-01-15") },
  { id: 2, name: "Work", color: "#f59e0b", icon: "briefcase", userId: 1, createdAt: new Date("2024-01-15") },
  { id: 3, name: "Ideas", color: "#10b981", icon: "lightbulb", userId: 1, createdAt: new Date("2024-01-16") },
  { id: 4, name: "Projects", color: "#ec4899", icon: "folder", userId: 1, createdAt: new Date("2024-01-17") },
  { id: 5, name: "Learning", color: "#8b5cf6", icon: "book", userId: 1, createdAt: new Date("2024-01-18") },
  { id: 6, name: "Code Snippets", color: "#06b6d4", icon: "code", userId: 1, createdAt: new Date("2024-01-19") },
  { id: 7, name: "Personal", color: "#6366f1", icon: "user", userId: 2, createdAt: new Date("2024-02-01") },
  { id: 8, name: "Research", color: "#22c55e", icon: "search", userId: 2, createdAt: new Date("2024-02-02") },
];

// Sample Tags
export const tags: Tag[] = [
  { id: 1, name: "important", color: "#ef4444", userId: 1 },
  { id: 2, name: "todo", color: "#f59e0b", userId: 1 },
  { id: 3, name: "reference", color: "#3b82f6", userId: 1 },
  { id: 4, name: "meeting", color: "#8b5cf6", userId: 1 },
  { id: 5, name: "idea", color: "#10b981", userId: 1 },
  { id: 6, name: "javascript", color: "#eab308", userId: 1 },
  { id: 7, name: "python", color: "#3b82f6", userId: 1 },
  { id: 8, name: "react", color: "#06b6d4", userId: 1 },
  { id: 9, name: "api", color: "#ec4899", userId: 1 },
  { id: 10, name: "database", color: "#84cc16", userId: 1 },
];

// Sample Notes
export const notes: Note[] = [
  {
    id: 1,
    title: "Welcome to NotesAI",
    content: `# Welcome to NotesAI! 🎉

This is your first note. NotesAI helps you capture thoughts, ideas, and code snippets with AI-powered assistance.

## Key Features

- **AI Writing Assistant**: Get help with writing, editing, and improving your notes
- **Code Formatting**: Beautiful syntax highlighting for code snippets
- **Categories & Tags**: Organize your notes efficiently
- **Favorites**: Quick access to your most important notes

## Getting Started

1. Create a new note using the + button
2. Use markdown for rich formatting
3. Try the AI assistant for writing help
4. Organize with categories and tags

Happy note-taking! ✨`,
    userId: 1,
    categoryId: 1,
    tags: [1, 3],
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T10:00:00"),
  },
  {
    id: 2,
    title: "React Hooks Cheat Sheet",
    content: `# React Hooks Cheat Sheet

## useState
\`\`\`javascript
const [state, setState] = useState(initialValue);

// Update with new value
setState(newValue);

// Update based on previous state
setState(prev => prev + 1);
\`\`\`

## useEffect
\`\`\`javascript
// Run on every render
useEffect(() => {
  console.log('Component rendered');
});

// Run only on mount
useEffect(() => {
  console.log('Component mounted');
}, []);

// Run when dependencies change
useEffect(() => {
  console.log('Value changed:', value);
}, [value]);

// Cleanup function
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
\`\`\`

## useCallback
\`\`\`javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## useMemo
\`\`\`javascript
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`

## useRef
\`\`\`javascript
const inputRef = useRef(null);

// Access the DOM element
inputRef.current.focus();
\`\`\``,
    userId: 1,
    categoryId: 6,
    tags: [3, 6, 8],
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-01-20T14:30:00"),
    updatedAt: new Date("2024-02-15T09:00:00"),
  },
  {
    id: 3,
    title: "Project Ideas 2024",
    content: `# Project Ideas for 2024

## Web Applications
- [ ] Personal finance tracker with AI insights
- [ ] Recipe sharing platform with meal planning
- [ ] Collaborative whiteboard tool
- [ ] Time tracking dashboard

## Mobile Apps
- [ ] Habit tracker with gamification
- [ ] Language learning flashcards
- [ ] Meditation timer with nature sounds

## AI/ML Projects
- [ ] Sentiment analysis for social media
- [ ] Image classification for plant species
- [ ] Chatbot for customer support

## Priority: High
The finance tracker could be really useful. Need to research:
- Chart libraries (Chart.js, Recharts)
- API for stock data
- Security best practices for financial data`,
    userId: 1,
    categoryId: 3,
    tags: [2, 5],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-01-25T16:00:00"),
    updatedAt: new Date("2024-02-20T11:30:00"),
  },
  {
    id: 4,
    title: "Meeting Notes - Q1 Planning",
    content: `# Q1 Planning Meeting

**Date:** January 28, 2024
**Attendees:** Team leads, Product, Engineering

## Agenda
1. Review Q4 results
2. Set Q1 objectives
3. Resource allocation
4. Timeline discussion

## Key Decisions
- Launch new feature by end of February
- Hire 2 more developers
- Focus on performance optimization

## Action Items
- [ ] @Alex: Prepare technical spec by Feb 1
- [ ] @Sarah: User research report
- [ ] @Mike: Infrastructure cost analysis

## Notes
The team agreed to prioritize mobile responsiveness. Budget approved for new tooling.

> "Focus on user experience above all" - CEO`,
    userId: 1,
    categoryId: 2,
    tags: [1, 4],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-01-28T09:00:00"),
    updatedAt: new Date("2024-01-28T11:30:00"),
  },
  {
    id: 5,
    title: "Python API Authentication",
    content: `# Python API Authentication with JWT

## Installation
\`\`\`bash
pip install PyJWT flask
\`\`\`

## Implementation

\`\`\`python
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify

SECRET_KEY = 'your-secret-key'

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer'
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated

# Usage
@app.route('/protected')
@token_required
def protected_route():
    return jsonify({'message': 'Access granted'})
\`\`\`

## Best Practices
- Use HTTPS in production
- Implement refresh tokens
- Store tokens securely on client
- Add rate limiting`,
    userId: 1,
    categoryId: 6,
    tags: [3, 7, 9],
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-02-05T13:00:00"),
    updatedAt: new Date("2024-02-05T13:00:00"),
  },
  {
    id: 6,
    title: "Database Design Principles",
    content: `# Database Design Principles

## Normalization Rules

### 1NF (First Normal Form)
- Each column contains atomic values
- No repeating groups

### 2NF (Second Normal Form)
- Meet 1NF requirements
- All non-key columns depend on the entire primary key

### 3NF (Third Normal Form)
- Meet 2NF requirements
- No transitive dependencies

## Common Patterns

### One-to-Many
\`\`\`sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    content TEXT
);
\`\`\`

### Many-to-Many
\`\`\`sql
CREATE TABLE posts_tags (
    post_id INT REFERENCES posts(id),
    tag_id INT REFERENCES tags(id),
    PRIMARY KEY (post_id, tag_id)
);
\`\`\`

## Indexing Tips
- Index columns used in WHERE clauses
- Index foreign keys
- Consider composite indexes for common queries
- Monitor query performance`,
    userId: 1,
    categoryId: 5,
    tags: [3, 10],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-02-10T10:00:00"),
    updatedAt: new Date("2024-02-10T10:00:00"),
  },
  {
    id: 7,
    title: "Weekly Goals",
    content: `# Weekly Goals

## This Week (Feb 19-23)

### Work
- [x] Complete API documentation
- [ ] Review pull requests
- [ ] Setup CI/CD pipeline

### Personal
- [ ] Go to the gym 3 times
- [ ] Read 2 chapters of current book
- [ ] Call parents

### Learning
- [ ] Complete React course module 5
- [ ] Practice TypeScript generics

## Reflection
Last week went well. Need to focus more on deep work sessions and reduce meetings.`,
    userId: 1,
    categoryId: 1,
    tags: [2],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-02-19T08:00:00"),
    updatedAt: new Date("2024-02-21T17:00:00"),
  },
  {
    id: 8,
    title: "CSS Grid Layouts",
    content: `# CSS Grid Layouts

## Basic Grid
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## Responsive Grid
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

## Named Grid Areas
\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Alignment
\`\`\`css
.container {
  /* Align all items */
  justify-items: center; /* horizontal */
  align-items: center;   /* vertical */
  
  /* Align grid itself */
  justify-content: center;
  align-content: center;
}
\`\`\``,
    userId: 1,
    categoryId: 6,
    tags: [3],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date("2024-02-22T14:00:00"),
    updatedAt: new Date("2024-02-22T14:00:00"),
  },
  {
    id: 9,
    title: "Old Meeting Notes",
    content: `# Old Meeting Notes

These notes are from previous meetings and have been archived for reference.`,
    userId: 1,
    categoryId: 2,
    tags: [4],
    isFavorite: false,
    isArchived: true,
    isDeleted: false,
    createdAt: new Date("2023-12-01T10:00:00"),
    updatedAt: new Date("2024-01-01T10:00:00"),
  },
  {
    id: 10,
    title: "Deleted Draft",
    content: `# Draft Note

This was a draft that has been deleted.`,
    userId: 1,
    categoryId: null,
    tags: [],
    isFavorite: false,
    isArchived: false,
    isDeleted: true,
    createdAt: new Date("2024-02-01T10:00:00"),
    updatedAt: new Date("2024-02-15T10:00:00"),
  },
];

// Sessions storage (in-memory for demo)
export const sessions: Session[] = [];

// Database helper functions
export const db = {
  // User functions
  findUserByEmail: (email: string): User | undefined => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id: number): User | undefined => {
    return users.find((u) => u.id === id);
  },

  createUser: (email: string, password: string, name: string): User => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      email,
      password,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },

  updateUser: (id: number, updates: Partial<User>): User | undefined => {
    const user = users.find((u) => u.id === id);
    if (user) {
      Object.assign(user, updates, { updatedAt: new Date() });
    }
    return user;
  },

  // Session functions
  createSession: (userId: number): Session => {
    const session: Session = {
      id: crypto.randomUUID(),
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    sessions.push(session);
    return session;
  },

  findSession: (sessionId: string): Session | undefined => {
    return sessions.find((s) => s.id === sessionId && s.expiresAt > new Date());
  },

  deleteSession: (sessionId: string): void => {
    const index = sessions.findIndex((s) => s.id === sessionId);
    if (index !== -1) {
      sessions.splice(index, 1);
    }
  },

  // Note functions
  getNotesByUser: (userId: number, options?: { includeArchived?: boolean; includeDeleted?: boolean }): Note[] => {
    return notes.filter((n) => {
      if (n.userId !== userId) return false;
      if (!options?.includeArchived && n.isArchived) return false;
      if (!options?.includeDeleted && n.isDeleted) return false;
      return true;
    });
  },

  getNoteById: (id: number): Note | undefined => {
    return notes.find((n) => n.id === id);
  },

  createNote: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
    const newNote: Note = {
      ...noteData,
      id: Math.max(...notes.map((n) => n.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    notes.push(newNote);
    return newNote;
  },

  updateNote: (id: number, updates: Partial<Note>): Note | undefined => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      Object.assign(note, updates, { updatedAt: new Date() });
    }
    return note;
  },

  deleteNote: (id: number, permanent: boolean = false): boolean => {
    if (permanent) {
      const index = notes.findIndex((n) => n.id === id);
      if (index !== -1) {
        notes.splice(index, 1);
        return true;
      }
      return false;
    } else {
      const note = notes.find((n) => n.id === id);
      if (note) {
        note.isDeleted = true;
        note.updatedAt = new Date();
        return true;
      }
      return false;
    }
  },

  getFavoriteNotes: (userId: number): Note[] => {
    return notes.filter((n) => n.userId === userId && n.isFavorite && !n.isArchived && !n.isDeleted);
  },

  getRecentNotes: (userId: number, limit: number = 5): Note[] => {
    return notes
      .filter((n) => n.userId === userId && !n.isArchived && !n.isDeleted)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  },

  getArchivedNotes: (userId: number): Note[] => {
    return notes.filter((n) => n.userId === userId && n.isArchived && !n.isDeleted);
  },

  getDeletedNotes: (userId: number): Note[] => {
    return notes.filter((n) => n.userId === userId && n.isDeleted);
  },

  getNotesByCategory: (userId: number, categoryId: number): Note[] => {
    return notes.filter((n) => n.userId === userId && n.categoryId === categoryId && !n.isArchived && !n.isDeleted);
  },

  getNotesByTag: (userId: number, tagId: number): Note[] => {
    return notes.filter((n) => n.userId === userId && n.tags.includes(tagId) && !n.isArchived && !n.isDeleted);
  },

  // Category functions
  getCategoriesByUser: (userId: number): Category[] => {
    return categories.filter((c) => c.userId === userId);
  },

  createCategory: (categoryData: Omit<Category, "id" | "createdAt">): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...categories.map((c) => c.id), 0) + 1,
      createdAt: new Date(),
    };
    categories.push(newCategory);
    return newCategory;
  },

  deleteCategory: (id: number): boolean => {
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories.splice(index, 1);
      // Remove category from notes
      notes.forEach((n) => {
        if (n.categoryId === id) {
          n.categoryId = null;
        }
      });
      return true;
    }
    return false;
  },

  // Tag functions
  getTagsByUser: (userId: number): Tag[] => {
    return tags.filter((t) => t.userId === userId);
  },

  createTag: (tagData: Omit<Tag, "id">): Tag => {
    const newTag: Tag = {
      ...tagData,
      id: Math.max(...tags.map((t) => t.id), 0) + 1,
    };
    tags.push(newTag);
    return newTag;
  },

  deleteTag: (id: number): boolean => {
    const index = tags.findIndex((t) => t.id === id);
    if (index !== -1) {
      tags.splice(index, 1);
      // Remove tag from notes
      notes.forEach((n) => {
        n.tags = n.tags.filter((t) => t !== id);
      });
      return true;
    }
    return false;
  },

  // Search function
  searchNotes: (userId: number, query: string): Note[] => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      (n) =>
        n.userId === userId &&
        !n.isArchived &&
        !n.isDeleted &&
        (n.title.toLowerCase().includes(lowerQuery) || n.content.toLowerCase().includes(lowerQuery))
    );
  },
};
