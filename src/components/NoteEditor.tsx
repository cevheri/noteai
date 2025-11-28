"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link,
  Image,
  Sparkles,
  Star,
  Folder,
  Tag,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import type { Note, Category, Tag as TagType } from "@/lib/db";

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  categories: Category[];
  tags: TagType[];
  onOpenAI: (selectedText?: string) => void;
}

export function NoteEditor({
  note,
  onUpdate,
  categories,
  tags,
  onOpenAI,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  // Debounced auto-save
  const debouncedUpdate = useCallback(
    (updatedTitle: string, updatedContent: string) => {
      const timer = setTimeout(() => {
        onUpdate({
          ...note,
          title: updatedTitle,
          content: updatedContent,
        });
      }, 500);
      return () => clearTimeout(timer);
    },
    [note, onUpdate]
  );

  useEffect(() => {
    const cleanup = debouncedUpdate(title, content);
    return cleanup;
  }, [title, content, debouncedUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("note-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleAIClick = () => {
    const textarea = document.getElementById("note-content") as HTMLTextAreaElement;
    if (textarea) {
      const selectedText = content.substring(
        textarea.selectionStart,
        textarea.selectionEnd
      );
      onOpenAI(selectedText);
    } else {
      onOpenAI();
    }
  };

  const toggleFavorite = () => {
    onUpdate({ ...note, isFavorite: !note.isFavorite });
  };

  const selectCategory = (categoryId: number | null) => {
    onUpdate({ ...note, categoryId });
    setIsCategoryOpen(false);
  };

  const toggleTag = (tagId: number) => {
    const newTags = note.tags.includes(tagId)
      ? note.tags.filter((t) => t !== tagId)
      : [...note.tags, tagId];
    onUpdate({ ...note, tags: newTags });
  };

  const currentCategory = categories.find((c) => c.id === note.categoryId);
  const noteTags = tags.filter((t) => note.tags.includes(t.id));

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/30 flex-wrap">
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton icon={Bold} onClick={() => insertMarkdown("**", "**")} title="Bold" />
          <ToolbarButton icon={Italic} onClick={() => insertMarkdown("*", "*")} title="Italic" />
          <ToolbarButton icon={Code} onClick={() => insertMarkdown("`", "`")} title="Inline Code" />
        </div>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton icon={Heading1} onClick={() => insertMarkdown("# ")} title="Heading 1" />
          <ToolbarButton icon={Heading2} onClick={() => insertMarkdown("## ")} title="Heading 2" />
          <ToolbarButton icon={Heading3} onClick={() => insertMarkdown("### ")} title="Heading 3" />
        </div>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton icon={List} onClick={() => insertMarkdown("- ")} title="Bullet List" />
          <ToolbarButton icon={ListOrdered} onClick={() => insertMarkdown("1. ")} title="Numbered List" />
          <ToolbarButton icon={Quote} onClick={() => insertMarkdown("> ")} title="Quote" />
        </div>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton icon={Link} onClick={() => insertMarkdown("[", "](url)")} title="Link" />
          <ToolbarButton icon={Image} onClick={() => insertMarkdown("![alt](", ")")} title="Image" />
        </div>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown("```\n", "\n```")}
          className="text-xs"
        >
          <Code className="w-3.5 h-3.5 mr-1" />
          Code Block
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant="default"
          size="sm"
          onClick={handleAIClick}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Assist
        </Button>
      </div>

      {/* Title & Meta */}
      <div className="px-6 pt-4 space-y-3">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="text-2xl font-bold border-0 px-0 h-auto focus-visible:ring-0 bg-transparent"
        />
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={note.isFavorite ? "text-amber-500" : "text-muted-foreground"}
          >
            <Star className={`w-4 h-4 mr-1 ${note.isFavorite ? "fill-current" : ""}`} />
            {note.isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
          
          <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Folder className="w-4 h-4 mr-1" />
                {currentCategory ? currentCategory.name : "No Category"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-48" align="start">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => selectCategory(null)}>
                      <span className="text-muted-foreground">No Category</span>
                      {note.categoryId === null && <Check className="ml-auto w-4 h-4" />}
                    </CommandItem>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => selectCategory(category.id)}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                        {note.categoryId === category.id && (
                          <Check className="ml-auto w-4 h-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Popover open={isTagOpen} onOpenChange={setIsTagOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Tag className="w-4 h-4 mr-1" />
                Add Tags
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-48" align="start">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {tags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => toggleTag(tag.id)}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        />
                        #{tag.name}
                        {note.tags.includes(tag.id) && (
                          <Check className="ml-auto w-4 h-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {noteTags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {noteTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-destructive/20"
                  style={{ borderColor: tag.color }}
                  onClick={() => toggleTag(tag.id)}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 px-6 py-4">
        <Textarea
          id="note-content"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your note... (Markdown supported)"
          className="w-full h-full resize-none border-0 focus-visible:ring-0 bg-transparent font-mono text-sm leading-relaxed"
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  onClick,
  title,
}: {
  icon: React.ElementType;
  onClick: () => void;
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={title}
      className="w-8 h-8"
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
