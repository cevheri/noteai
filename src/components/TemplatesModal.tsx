"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  NOTE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_ICONS,
  type NoteTemplate,
} from "@/lib/templates";
import { FileText, Sparkles } from "lucide-react";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: NoteTemplate) => void;
}

type CategoryFilter = "all" | keyof typeof TEMPLATE_CATEGORIES;

export function TemplatesModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplatesModalProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate | null>(null);

  const filteredTemplates =
    activeCategory === "all"
      ? NOTE_TEMPLATES
      : NOTE_TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelectTemplate = (template: NoteTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setSelectedTemplate(null);
      setActiveCategory("all");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setActiveCategory("all");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-3xl h-[85vh] max-h-[700px] p-0 gap-0 flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Start with a Template
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a template to quickly create structured notes
          </p>
        </DialogHeader>

        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* Templates List */}
          <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r">
            {/* Category Filters */}
            <div className="flex gap-2 p-3 md:p-4 overflow-x-auto flex-shrink-0 border-b">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 h-8"
                onClick={() => setActiveCategory("all")}
              >
                All
              </Button>
              {Object.entries(TEMPLATE_CATEGORIES).map(([key, { label }]) => (
                <Button
                  key={key}
                  variant={activeCategory === key ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0 h-8"
                  onClick={() => setActiveCategory(key as CategoryFilter)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Templates Grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 md:p-4">
                {filteredTemplates.map((template) => {
                  const IconComponent = TEMPLATE_ICONS[template.icon] || FileText;
                  const isSelected = selectedTemplate?.id === template.id;
                  const categoryInfo = TEMPLATE_CATEGORIES[template.category];

                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`group p-3 md:p-4 rounded-lg border text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg flex-shrink-0"
                          style={{
                            backgroundColor: `${categoryInfo.color}15`,
                            color: categoryInfo.color,
                          }}
                        >
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base truncate">
                            {template.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {template.description}
                          </p>
                          <Badge
                            variant="secondary"
                            className="mt-2 text-[10px] md:text-xs"
                            style={{
                              backgroundColor: `${categoryInfo.color}15`,
                              color: categoryInfo.color,
                            }}
                          >
                            {categoryInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          <div className="w-full md:w-80 flex flex-col min-h-0 flex-shrink-0 max-h-[40%] md:max-h-none">
            {selectedTemplate ? (
              <>
                <div className="p-3 md:p-4 border-b flex-shrink-0">
                  <h3 className="font-medium">{selectedTemplate.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preview
                  </p>
                </div>
                <ScrollArea className="flex-1 p-3 md:p-4">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {selectedTemplate.content.slice(0, 500)}
                    {selectedTemplate.content.length > 500 && "..."}
                  </pre>
                </ScrollArea>
                <div className="p-3 md:p-4 border-t flex-shrink-0">
                  <Button className="w-full" onClick={handleUseTemplate}>
                    Use This Template
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 text-center">
                <div>
                  <FileText className="w-10 h-10 mx-auto text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Select a template to preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
