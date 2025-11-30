"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Type, AlignLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Note } from "@/types/notes";

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (note: Note) => void;
}

export function FocusMode({ isOpen, onClose, note, onSave }: FocusModeProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize with note data
  useEffect(() => {
    if (note && isOpen) {
      setTitle(note.title);
      setContent(note.content);
      setHasChanges(false);
      setLastSaved(null);
    }
  }, [note, isOpen]);

  // Calculate word and character count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && isOpen) {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, title, content, note]);

  const handleSave = useCallback(() => {
    if (note) {
      onSave({
        ...note,
        title,
        content,
      });
      setLastSaved(new Date());
      setHasChanges(false);
    }
  }, [note, title, content, onSave]);

  const handleClose = () => {
    if (hasChanges) {
      // Auto-save on close
      handleSave();
    }
    onClose();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isOpen || !hasChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 30000);

    return () => clearTimeout(timer);
  }, [isOpen, hasChanges, handleSave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Minimal Header */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-4 opacity-30 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>{wordCount} words</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" />
              <span>{charCount} chars</span>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-xs h-8"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Writing Area */}
        <main className="flex-1 flex flex-col items-center overflow-auto px-4 pb-8">
          <div className="w-full max-w-2xl space-y-6 py-8 sm:py-16">
            {/* Title */}
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Note title..."
              className="text-2xl sm:text-3xl font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-muted-foreground/40"
            />

            {/* Content */}
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing..."
              className="min-h-[60vh] text-base sm:text-lg leading-relaxed border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 resize-none placeholder:text-muted-foreground/40"
            />
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="px-4 sm:px-8 py-3 text-center opacity-30 hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Esc</kbd> to exit
            {" • "}
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘S</kbd> to save
          </p>
        </footer>
      </div>
    </div>
  );
}
