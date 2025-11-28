"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Star,
  Clock,
  Archive,
  Trash2,
  Folder,
  Tag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Heart,
  MoreVertical,
  User,
  Briefcase,
  Lightbulb,
  Code,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteEditor } from "@/components/NoteEditor";
import { AIAssistantModal } from "@/components/AIAssistantModal";
import type { Note, Category, Tag as TagType } from "@/lib/db";

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  user: User,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
  folder: Folder,
  book: Book,
  code: Code,
  search: Search,
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiSelectedText, setAISelectedText] = useState("");
  
  // Track if initial load happened
  const initialLoadDone = useRef(false);

  // Check authentication and get user data
  useEffect(() => {
    const token = localStorage.getItem("bearer_token");
    const storedUser = localStorage.getItem("user");
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // If parsing fails, fetch from API
      }
    }

    // Verify token is still valid
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem("bearer_token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify token:", error);
      }
    };
    verifyToken();
  }, [router]);

  // Fetch notes - stable function that reads current state directly
  const fetchNotes = useCallback(async (filter: string, search: string) => {
    setIsLoading(true);
    try {
      let url = "/api/notes";
      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      } else if (filter === "favorites") {
        params.set("filter", "favorites");
      } else if (filter === "recent") {
        params.set("filter", "recent");
      } else if (filter === "archived") {
        params.set("filter", "archived");
      } else if (filter === "trash") {
        params.set("filter", "trash");
      } else if (filter.startsWith("category-")) {
        params.set("categoryId", filter.replace("category-", ""));
      } else if (filter.startsWith("tag-")) {
        params.set("tagId", filter.replace("tag-", ""));
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load - fetch categories, tags, and notes once
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const fetchInitialData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/categories", { headers: getAuthHeaders() }),
          fetch("/api/tags", { headers: getAuthHeaders() }),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories);
        }

        if (tagsRes.ok) {
          const data = await tagsRes.json();
          setTags(data.tags);
        }
      } catch (error) {
        console.error("Failed to fetch categories/tags:", error);
      }
    };
    
    fetchInitialData();
    fetchNotes(activeFilter, searchQuery);
  }, [activeFilter, searchQuery, fetchNotes]);

  // Fetch notes when filter changes (skip initial)
  const prevFilterRef = useRef(activeFilter);
  useEffect(() => {
    if (prevFilterRef.current !== activeFilter) {
      prevFilterRef.current = activeFilter;
      if (!searchQuery) {
        fetchNotes(activeFilter, "");
      }
    }
  }, [activeFilter, searchQuery, fetchNotes]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery) return;
    
    const timer = setTimeout(() => {
      fetchNotes(activeFilter, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter, fetchNotes]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { 
        method: "POST",
        headers: getAuthHeaders(),
      });
      localStorage.removeItem("bearer_token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          categoryId: activeFilter.startsWith("category-")
            ? parseInt(activeFilter.replace("category-", ""))
            : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add new note to the beginning of the list (optimistic update)
        setNotes(prev => [data.note, ...prev]);
        setSelectedNote(data.note);
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: updatedNote.title,
          content: updatedNote.content,
          isFavorite: updatedNote.isFavorite,
          categoryId: updatedNote.categoryId,
          tags: updatedNote.tags,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the note in place (optimistic update)
        setNotes(prev => prev.map(n => n.id === data.note.id ? data.note : n));
        setSelectedNote(data.note);
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (noteId: number, permanent: boolean = false) => {
    try {
      await fetch(`/api/notes/${noteId}?permanent=${permanent}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      // Remove from local state (optimistic update)
      setNotes(prev => prev.filter(n => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleToggleFavorite = async (note: Note) => {
    await handleNoteUpdate({ ...note, isFavorite: !note.isFavorite });
  };

  const handleArchiveNote = async (note: Note) => {
    await handleNoteUpdate({ ...note, isArchived: !note.isArchived });
  };

  const openAIAssistant = (text: string = "") => {
    setAISelectedText(text);
    setIsAIModalOpen(true);
  };

  const handleAIInsert = (text: string) => {
    if (selectedNote) {
      const updatedContent = selectedNote.content + "\n\n" + text;
      handleNoteUpdate({ ...selectedNote, content: updatedContent });
    }
    setIsAIModalOpen(false);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const getFilterTitle = () => {
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (activeFilter === "all") return "All Notes";
    if (activeFilter === "favorites") return "Favorites";
    if (activeFilter === "recent") return "Recent";
    if (activeFilter === "archived") return "Archived";
    if (activeFilter === "trash") return "Trash";
    if (activeFilter.startsWith("category-")) {
      const cat = categories.find(
        (c) => c.id === parseInt(activeFilter.replace("category-", ""))
      );
      return cat?.name || "Category";
    }
    if (activeFilter.startsWith("tag-")) {
      const tag = tags.find(
        (t) => t.id === parseInt(activeFilter.replace("tag-", ""))
      );
      return `#${tag?.name || "Tag"}`;
    }
    return "Notes";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold">NotesAI</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* New Note Button */}
          <div className="p-3">
            <Button className="w-full justify-start" onClick={handleCreateNote}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {/* Quick Access */}
              <div className="py-2">
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Access
                </p>
                <NavItem
                  icon={FileText}
                  label="All Notes"
                  active={activeFilter === "all"}
                  onClick={() => setActiveFilter("all")}
                />
                <NavItem
                  icon={Star}
                  label="Favorites"
                  active={activeFilter === "favorites"}
                  onClick={() => setActiveFilter("favorites")}
                />
                <NavItem
                  icon={Clock}
                  label="Recent"
                  active={activeFilter === "recent"}
                  onClick={() => setActiveFilter("recent")}
                />
                <NavItem
                  icon={Archive}
                  label="Archived"
                  active={activeFilter === "archived"}
                  onClick={() => setActiveFilter("archived")}
                />
                <NavItem
                  icon={Trash2}
                  label="Trash"
                  active={activeFilter === "trash"}
                  onClick={() => setActiveFilter("trash")}
                />
              </div>

              {/* Categories */}
              <div className="py-2">
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Categories
                </p>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category.icon] || Folder;
                  return (
                    <NavItem
                      key={category.id}
                      icon={IconComponent}
                      label={category.name}
                      active={activeFilter === `category-${category.id}`}
                      onClick={() => setActiveFilter(`category-${category.id}`)}
                      color={category.color}
                    />
                  );
                })}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="py-2">
                  <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Tags
                  </p>
                  {tags.slice(0, 8).map((tag) => (
                    <NavItem
                      key={tag.id}
                      icon={Tag}
                      label={`#${tag.name}`}
                      active={activeFilter === `tag-${tag.id}`}
                      onClick={() => setActiveFilter(`tag-${tag.id}`)}
                      color={tag.color}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* User Profile */}
          <div className="p-3 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-2"
                >
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openAIAssistant()}
            className="hidden sm:flex"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Notes List */}
          <div className="w-80 border-r bg-muted/30 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold">{getFilterTitle()}</h2>
              <p className="text-sm text-muted-foreground">
                {notes.length} note{notes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No notes found</p>
                  <p className="text-sm mt-1">
                    Create a new note to get started
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onClick={() => setSelectedNote(note)}
                      onToggleFavorite={() => handleToggleFavorite(note)}
                      onArchive={() => handleArchiveNote(note)}
                      onDelete={() => handleDeleteNote(note.id)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onUpdate={handleNoteUpdate}
                categories={categories}
                tags={tags}
                onOpenAI={openAIAssistant}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select a note</p>
                  <p className="text-sm mt-1">
                    Choose a note from the list or create a new one
                  </p>
                  <Button className="mt-4" onClick={handleCreateNote}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        selectedText={aiSelectedText}
        noteContent={selectedNote?.content || ""}
        onInsert={handleAIInsert}
      />
    </div>
  );
}

// Navigation Item Component
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  color,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0"
        style={color ? { color } : undefined}
      />
      <span className="truncate">{label}</span>
    </button>
  );
}

// Note Card Component
function NoteCard({
  note,
  isSelected,
  onClick,
  onToggleFavorite,
  onArchive,
  onDelete,
  formatDate,
}: {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
  onArchive: () => void;
  onDelete: () => void;
  formatDate: (date: Date | string) => string;
}) {
  // Get preview text (strip markdown)
  const getPreview = (content: string) => {
    return content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*|__/g, "")
      .replace(/\*|_/g, "")
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 100);
  };

  return (
    <div
      onClick={onClick}
      className={`group p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
        isSelected
          ? "bg-accent"
          : "hover:bg-accent/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm truncate flex-1">{note.title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1 hover:bg-background rounded"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                note.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              }`}
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 hover:bg-background rounded">
                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                <Archive className="w-4 h-4 mr-2" />
                {note.isArchived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {getPreview(note.content) || "No content"}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        {formatDate(note.updatedAt)}
      </p>
    </div>
  );
}