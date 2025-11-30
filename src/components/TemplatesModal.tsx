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
import { FileText, Sparkles, X } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 md:p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Start with a Template
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a template to quickly create structured notes
          </p>
        </DialogHeader>

        {/* Category Filters */}
        <div className="flex gap-2 p-3 md:p-4 overflow-x-auto border-b bg-muted/30">
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
        <ScrollArea className="flex-1 max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {filteredTemplates.map((template) => {
              const IconComponent = TEMPLATE_ICONS[template.icon] || FileText;
              const isSelected = selectedTemplate?.id === template.id;
              const categoryInfo = TEMPLATE_CATEGORIES[template.category];

              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`group p-4 rounded-xl border text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${categoryInfo.color}15`,
                        color: categoryInfo.color,
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {template.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[10px]"
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

        {/* Selected Template Preview & Action */}
        {selectedTemplate && (
          <div className="border-t bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedTemplate.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedTemplate.description}
                </p>
              </div>
              <Button onClick={handleUseTemplate} className="flex-shrink-0">
                Use Template
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}