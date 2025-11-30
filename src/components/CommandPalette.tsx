"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Star,
  Clock,
  Archive,
  Trash2,
  Sparkles,
  Crown,
  LogOut,
  Folder,
  Tag,
  Moon,
  Sun,
  LayoutTemplate,
  Focus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Note, Category, Tag as TagType } from "@/types/notes";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  categories: Category[];
  tags: TagType[];
  onCreateNote: () => void;
  onSelectNote: (note: Note) => void;
  onSetFilter: (filter: string) => void;
  onOpenAI: () => void;
  onOpenTemplates: () => void;
  onOpenFocusMode: () => void;
  onLogout: () => void;
}

interface CommandItem {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  category: "action" | "note" | "navigation" | "category" | "tag";
  action: () => void;
  keywords?: string[];
}

export function CommandPalette({
  isOpen,
  onClose,
  notes,
  categories,
  tags,
  onCreateNote,
  onSelectNote,
  onSetFilter,
  onOpenAI,
  onOpenTemplates,
  onOpenFocusMode,
  onLogout,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build command list
  const commands = useMemo(() => {
    const items: CommandItem[] = [];

    // Actions
    items.push({
      id: "new-note",
      icon: Plus,
      title: "New Note",
      subtitle: "Create a new note",
      category: "action",
      action: () => { onCreateNote(); onClose(); },
      keywords: ["create", "add", "yeni", "oluştur"],
    });

    items.push({
      id: "templates",
      icon: LayoutTemplate,
      title: "Templates",
      subtitle: "Create from template",
      category: "action",
      action: () => { onOpenTemplates(); onClose(); },
      keywords: ["template", "şablon"],
    });

    items.push({
      id: "ai-assistant",
      icon: Sparkles,
      title: "AI Assistant",
      subtitle: "Get AI help with your writing",
      category: "action",
      action: () => { onOpenAI(); onClose(); },
      keywords: ["ai", "yapay zeka", "assistant", "help"],
    });

    items.push({
      id: "focus-mode",
      icon: Focus,
      title: "Focus Mode",
      subtitle: "Distraction-free writing",
      category: "action",
      action: () => { onOpenFocusMode(); onClose(); },
      keywords: ["zen", "focus", "odak", "minimal"],
    });

    // Navigation
    items.push({
      id: "nav-all",
      icon: FileText,
      title: "All Notes",
      category: "navigation",
      action: () => { onSetFilter("all"); onClose(); },
      keywords: ["tüm", "hepsi"],
    });

    items.push({
      id: "nav-favorites",
      icon: Star,
      title: "Favorites",
      category: "navigation",
      action: () => { onSetFilter("favorites"); onClose(); },
      keywords: ["favoriler", "starred"],
    });

    items.push({
      id: "nav-recent",
      icon: Clock,
      title: "Recent",
      category: "navigation",
      action: () => { onSetFilter("recent"); onClose(); },
      keywords: ["son", "recent"],
    });

    items.push({
      id: "nav-archived",
      icon: Archive,
      title: "Archived",
      category: "navigation",
      action: () => { onSetFilter("archived"); onClose(); },
      keywords: ["arşiv"],
    });

    items.push({
      id: "nav-trash",
      icon: Trash2,
      title: "Trash",
      category: "navigation",
      action: () => { onSetFilter("trash"); onClose(); },
      keywords: ["çöp", "deleted"],
    });

    items.push({
      id: "pricing",
      icon: Crown,
      title: "Upgrade Plan",
      subtitle: "View pricing plans",
      category: "navigation",
      action: () => { router.push("/pricing"); onClose(); },
      keywords: ["plan", "fiyat", "upgrade"],
    });

    items.push({
      id: "logout",
      icon: LogOut,
      title: "Log Out",
      category: "action",
      action: () => { onLogout(); onClose(); },
      keywords: ["çıkış", "sign out"],
    });

    // Categories
    categories.forEach((cat) => {
      items.push({
        id: `category-${cat.id}`,
        icon: Folder,
        title: cat.name,
        subtitle: "Category",
        category: "category",
        action: () => { onSetFilter(`category-${cat.id}`); onClose(); },
        keywords: [cat.name.toLowerCase()],
      });
    });

    // Tags
    tags.forEach((tag) => {
      items.push({
        id: `tag-${tag.id}`,
        icon: Tag,
        title: `#${tag.name}`,
        subtitle: "Tag",
        category: "tag",
        action: () => { onSetFilter(`tag-${tag.id}`); onClose(); },
        keywords: [tag.name.toLowerCase()],
      });
    });

    // Notes (show only first 10 to avoid overwhelming)
    notes.slice(0, 20).forEach((note) => {
      items.push({
        id: `note-${note.id}`,
        icon: FileText,
        title: note.title,
        subtitle: new Date(note.updatedAt).toLocaleDateString(),
        category: "note",
        action: () => { onSelectNote(note); onClose(); },
        keywords: [note.title.toLowerCase(), note.content.toLowerCase().slice(0, 100)],
      });
    });

    return items;
  }, [notes, categories, tags, onCreateNote, onSelectNote, onSetFilter, onOpenAI, onOpenTemplates, onOpenFocusMode, onLogout, onClose, router]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Show actions and navigation first when no query
      return commands.filter((c) => c.category === "action" || c.category === "navigation");
    }

    const lowerQuery = query.toLowerCase();
    return commands.filter((cmd) => {
      if (cmd.title.toLowerCase().includes(lowerQuery)) return true;
      if (cmd.subtitle?.toLowerCase().includes(lowerQuery)) return true;
      if (cmd.keywords?.some((k) => k.includes(lowerQuery))) return true;
      return false;
    });
  }, [commands, query]);

  // Reset selection when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  // Reset query when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filteredCommands, selectedIndex, onClose]
  );

  // Group commands by category for display
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const categoryLabels: Record<string, string> = {
    action: "Actions",
    navigation: "Navigation",
    note: "Notes",
    category: "Categories",
    tag: "Tags",
  };

  // Track cumulative index for keyboard navigation
  let cumulativeIndex = 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b px-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <ScrollArea className="max-h-[300px]">
          {filteredCommands.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category}>
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {categoryLabels[category] || category}
                  </p>
                  {items.map((cmd) => {
                    const itemIndex = cumulativeIndex++;
                    const isSelected = itemIndex === selectedIndex;
                    const Icon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 text-left min-w-0">
                          <span className="truncate block">{cmd.title}</span>
                          {cmd.subtitle && (
                            <span className="text-xs text-muted-foreground truncate block">
                              {cmd.subtitle}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="inline-flex h-5 items-center rounded border bg-background px-1.5 font-mono text-[10px]">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="inline-flex h-5 items-center rounded border bg-background px-1.5 font-mono text-[10px]">
              ↵
            </kbd>
            <span>Select</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
