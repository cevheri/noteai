"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
  Eye,
  Edit3,
  Columns,
  Loader2,
  CheckCircle2,
  Copy,
  CheckCheck,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import type { Note, Category, Tag as TagType } from "@/types/notes";

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
  const [localTags, setLocalTags] = useState<number[]>(note.tags || []);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastNoteIdRef = useRef<number>(note.id);

  // Only reset local state when note ID changes (switching to different note)
  useEffect(() => {
    if (lastNoteIdRef.current !== note.id) {
      lastNoteIdRef.current = note.id;
      setTitle(note.title);
      setContent(note.content);
      setLocalTags(note.tags || []);
      setViewMode("edit");
      setSaveStatus("idle");
      // Clear any pending saves
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    }
  }, [note.id, note.title, note.content, note.tags]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // Auto-save function
  const triggerAutoSave = useCallback(
    (updatedTitle: string, updatedContent: string) => {
      // Clear existing timeouts
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
      
      // Show saving status
      setSaveStatus("saving");
      
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({
          ...note,
          title: updatedTitle,
          content: updatedContent,
        });
        
        // Show saved status
        setSaveStatus("saved");
        
        // Reset to idle after 2 seconds
        statusTimeoutRef.current = setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      }, 800);
    },
    [note, onUpdate]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    triggerAutoSave(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    triggerAutoSave(title, newContent);
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
    triggerAutoSave(title, newContent);
    
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
    const currentTags = localTags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId];
    
    // Update local state immediately for visual feedback
    setLocalTags(newTags);
    
    // Then update parent
    onUpdate({ ...note, tags: newTags });
  };

  const currentCategory = categories.find((c) => c.id === note.categoryId);
  const noteTags = tags.filter((t) => (localTags || []).includes(t.id));

  // Preview component to avoid duplication
  const PreviewContent = () => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = async (code: string) => {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mt-6 mb-4 pb-2 border-b">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="my-3 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="my-3 pl-6 list-disc space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-3 pl-6 list-decimal space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              
              // Inline code
              if (!match) {
                return (
                  <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono text-primary">
                    {children}
                  </code>
                );
              }
              
              // Code block with syntax highlighting
              const language = match[1];
              
              return (
                <div className="relative group my-4">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 rounded-t-lg border-b border-zinc-700">
                    <span className="text-xs font-medium text-zinc-400 uppercase">
                      {language}
                    </span>
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {copiedCode === codeString ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: "0.5rem",
                      borderBottomRightRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            },
            pre: ({ children }) => <>{children}</>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-4 py-2">{children}</td>
            ),
            hr: () => <hr className="my-6 border-border" />,
          }}
        >
          {content || "*No content yet. Switch to Edit mode to start writing.*"}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/30 flex-wrap">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg mr-2">
          <Button
            variant={viewMode === "edit" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("edit")}
            className="h-7 px-3 text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant={viewMode === "split" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("split")}
            className="h-7 px-3 text-xs"
            title="Side by side view"
          >
            <Columns className="w-3.5 h-3.5 mr-1.5" />
            Split
          </Button>
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="h-7 px-3 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        </div>
        
        {/* Auto-save Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Saved</span>
            </>
          )}
          {saveStatus === "idle" && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 opacity-50" />
              <span className="opacity-70">Auto-save</span>
            </>
          )}
        </div>
        
        <div className="w-px h-6 bg-border mx-1" />

        {(viewMode === "edit" || viewMode === "split") && (
          <>
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
            
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
            
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <ToolbarButton icon={List} onClick={() => insertMarkdown("- ")} title="Bullet List" />
              <ToolbarButton icon={ListOrdered} onClick={() => insertMarkdown("1. ")} title="Numbered List" />
              <ToolbarButton icon={Quote} onClick={() => insertMarkdown("> ")} title="Quote" />
            </div>
            
            <div className="w-px h-6 bg-border mx-1 hidden md:block" />
            
            <div className="hidden md:flex items-center gap-1 mr-2">
              <ToolbarButton icon={Link} onClick={() => insertMarkdown("[", "](url)")} title="Link" />
              <ToolbarButton icon={Image} onClick={() => insertMarkdown("![alt](", ")")} title="Image" />
            </div>
            
            <div className="w-px h-6 bg-border mx-1 hidden lg:block" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertMarkdown("```\n", "\n```")}
              className="text-xs hidden lg:flex"
            >
              <Code className="w-3.5 h-3.5 mr-1" />
              Code Block
            </Button>
          </>
        )}
        
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
          readOnly={viewMode === "preview"}
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Tag className="w-4 h-4 mr-1" />
                Add Tags
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              <DropdownMenuLabel className="text-xs">Select Tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-1.5">No tags available</p>
              ) : (
                tags.map((tag) => {
                  const isSelected = (localTags || []).includes(tag.id);
                  return (
                    <DropdownMenuCheckboxItem
                      key={tag.id}
                      checked={isSelected}
                      onCheckedChange={() => {
                        const currentTags = localTags || [];
                        const newTags = currentTags.includes(tag.id)
                          ? currentTags.filter((t) => t !== tag.id)
                          : [...currentTags, tag.id];
                        
                        setLocalTags(newTags);
                        onUpdate({ ...note, tags: newTags });
                      }}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>#{tag.name}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
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

      {/* Content Editor / Preview / Split */}
      <div className="flex-1 px-6 py-4 overflow-hidden">
        {viewMode === "edit" && (
          <Textarea
            id="note-content"
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your note... (Markdown supported)"
            className="w-full h-full resize-none border-0 focus-visible:ring-0 bg-transparent font-mono text-sm leading-relaxed"
          />
        )}
        
        {viewMode === "preview" && (
          <div className="h-full overflow-auto">
            <PreviewContent />
          </div>
        )}
        
        {viewMode === "split" && (
          <div className="flex h-full gap-4">
            {/* Editor Panel */}
            <div className="flex-1 flex flex-col min-w-0 border rounded-lg overflow-hidden">
              <div className="px-3 py-1.5 bg-muted/50 border-b text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Edit3 className="w-3 h-3" />
                Editor
              </div>
              <Textarea
                id="note-content"
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing your note... (Markdown supported)"
                className="flex-1 w-full resize-none border-0 focus-visible:ring-0 bg-transparent font-mono text-sm leading-relaxed rounded-none"
              />
            </div>
            
            {/* Preview Panel */}
            <div className="flex-1 flex flex-col min-w-0 border rounded-lg overflow-hidden">
              <div className="px-3 py-1.5 bg-muted/50 border-b text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Preview
              </div>
              <div className="flex-1 overflow-auto p-4">
                <PreviewContent />
              </div>
            </div>
          </div>
        )}
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