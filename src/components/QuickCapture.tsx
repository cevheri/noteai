"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface QuickCaptureProps {
  onCreateNote: (title: string, content: string) => Promise<void>;
}

export function QuickCapture({ onCreateNote }: QuickCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setTitle("");
    setContent("");
  };

  const handleSubmit = async () => {
    if (!content.trim() && !title.trim()) {
      toast.error("Please add some content");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateNote(
        title.trim() || "Quick Note",
        content.trim() || title.trim()
      );
      toast.success("Note created!");
      handleClose();
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Floating Button - Hidden on mobile (bottom nav has + button) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`hidden md:flex fixed bottom-6 right-6 z-50 items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Quick capture"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick Capture Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] sm:w-96 bg-card border rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-medium text-sm">Quick Capture</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="h-9 text-sm"
                onKeyDown={handleKeyDown}
              />
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Capture your thought..."
                className="min-h-[100px] text-sm resize-none"
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">
                  ⌘↵
                </kbd>{" "}
                to save
              </p>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || (!content.trim() && !title.trim())}
                className="h-8"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
