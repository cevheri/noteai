"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Wand2,
  FileText,
  Code,
  CheckCircle,
  Loader2,
  Copy,
  Check,
  PenLine,
  ListChecks,
  MessageSquare,
  Lightbulb,
  Bug,
  Zap,
} from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  noteContent: string;
  onInsert: (text: string) => void;
}

type AIAction =
  | "improve"
  | "summarize"
  | "expand"
  | "simplify"
  | "fix_grammar"
  | "make_professional"
  | "add_examples"
  | "format_code"
  | "explain_code"
  | "fix_bugs"
  | "add_comments"
  | "generate_todo"
  | "brainstorm"
  | "custom";

interface AIActionConfig {
  id: AIAction;
  label: string;
  icon: React.ElementType;
  description: string;
  category: "writing" | "code" | "organize";
}

const AI_ACTIONS: AIActionConfig[] = [
  {
    id: "improve",
    label: "Improve Writing",
    icon: Wand2,
    description: "Enhance clarity and flow",
    category: "writing",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: FileText,
    description: "Create a concise summary",
    category: "writing",
  },
  {
    id: "expand",
    label: "Expand",
    icon: PenLine,
    description: "Add more detail and depth",
    category: "writing",
  },
  {
    id: "simplify",
    label: "Simplify",
    icon: Zap,
    description: "Make it easier to understand",
    category: "writing",
  },
  {
    id: "fix_grammar",
    label: "Fix Grammar",
    icon: CheckCircle,
    description: "Correct grammar and spelling",
    category: "writing",
  },
  {
    id: "make_professional",
    label: "Make Professional",
    icon: MessageSquare,
    description: "Formal business tone",
    category: "writing",
  },
  {
    id: "format_code",
    label: "Format Code",
    icon: Code,
    description: "Clean up code formatting",
    category: "code",
  },
  {
    id: "explain_code",
    label: "Explain Code",
    icon: Lightbulb,
    description: "Add explanatory comments",
    category: "code",
  },
  {
    id: "fix_bugs",
    label: "Fix Bugs",
    icon: Bug,
    description: "Identify and fix issues",
    category: "code",
  },
  {
    id: "add_comments",
    label: "Add Comments",
    icon: MessageSquare,
    description: "Document the code",
    category: "code",
  },
  {
    id: "generate_todo",
    label: "Generate Tasks",
    icon: ListChecks,
    description: "Extract action items",
    category: "organize",
  },
  {
    id: "brainstorm",
    label: "Brainstorm Ideas",
    icon: Lightbulb,
    description: "Generate related ideas",
    category: "organize",
  },
];

// Simulated AI responses (in production, this would call an actual AI API)
const generateAIResponse = async (
  action: AIAction,
  text: string,
  customPrompt?: string
): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Generate contextual mock responses based on action
  switch (action) {
    case "improve":
      return `## Improved Version\n\n${text}\n\n*This version has been enhanced with better clarity, improved sentence structure, and more engaging language. Key improvements include:*\n- Clearer topic sentences\n- Better transitions between ideas\n- More precise word choices`;

    case "summarize":
      const words = text.split(" ").slice(0, 20).join(" ");
      return `## Summary\n\n${words}...\n\n**Key Points:**\n- Main idea captured concisely\n- Essential details preserved\n- Actionable insights highlighted`;

    case "expand":
      return `## Expanded Content\n\n${text}\n\n### Additional Context\n\nThis topic can be further explored by considering:\n\n1. **Background Information**: Understanding the historical context helps provide deeper insight.\n\n2. **Related Concepts**: There are several related ideas worth exploring.\n\n3. **Practical Applications**: Here's how this applies in real-world scenarios.\n\n4. **Future Considerations**: What developments might we see going forward?`;

    case "simplify":
      return `## Simplified Version\n\n${text.split(" ").slice(0, 30).join(" ")}...\n\n*Written in plain language for easier understanding.*`;

    case "fix_grammar":
      return `## Grammar Corrected\n\n${text}\n\n✅ Grammar check complete:\n- Fixed punctuation errors\n- Corrected subject-verb agreement\n- Improved sentence structure`;

    case "make_professional":
      return `## Professional Version\n\nDear Team,\n\n${text}\n\nPlease let me know if you have any questions or require additional information.\n\nBest regards`;

    case "format_code":
      return `## Formatted Code\n\n\`\`\`javascript\n// Clean, well-formatted code\nfunction example() {\n  const data = {\n    key: "value",\n    items: [1, 2, 3],\n  };\n  \n  return data;\n}\n\`\`\`\n\n*Code has been formatted with consistent indentation and styling.*`;

    case "explain_code":
      return `## Code Explanation\n\n${text}\n\n### How it works:\n\n1. **Initialization**: The code starts by setting up necessary variables\n2. **Processing**: Data is transformed through the main logic\n3. **Output**: Results are returned or displayed\n\n### Key Concepts:\n- Uses modern JavaScript syntax\n- Follows best practices for readability\n- Handles edge cases appropriately`;

    case "fix_bugs":
      return `## Bug Analysis & Fixes\n\n### Issues Found:\n\n1. ⚠️ **Potential null reference** - Added null check\n2. ⚠️ **Missing error handling** - Added try-catch block\n3. ⚠️ **Memory leak possibility** - Added cleanup function\n\n### Corrected Code:\n\n\`\`\`javascript\ntry {\n  // Safe implementation with error handling\n  const result = await processData(input);\n  return result;\n} catch (error) {\n  console.error('Error:', error);\n  return null;\n}\n\`\`\``;

    case "add_comments":
      return `## Documented Code\n\n\`\`\`javascript\n/**\n * Main function description\n * @param {Object} params - Input parameters\n * @returns {Promise<Result>} - The processed result\n */\nasync function main(params) {\n  // Initialize configuration\n  const config = initConfig();\n  \n  // Process the input data\n  const processed = await process(params);\n  \n  // Return the final result\n  return processed;\n}\n\`\`\``;

    case "generate_todo":
      return `## Generated Tasks\n\n- [ ] Review the main points discussed\n- [ ] Follow up on action items\n- [ ] Schedule next meeting\n- [ ] Update documentation\n- [ ] Share findings with team\n- [ ] Set deadlines for deliverables`;

    case "brainstorm":
      return `## Brainstormed Ideas\n\n### Primary Concepts:\n1. **Expand on the core theme** - Develop the main idea further\n2. **Add visual elements** - Include diagrams or charts\n3. **Include case studies** - Real-world examples\n\n### Creative Angles:\n- Consider the opposite perspective\n- Apply to different industries\n- Explore future implications\n\n### Action Ideas:\n- Create a presentation\n- Write a detailed guide\n- Build a prototype`;

    case "custom":
      return `## AI Response\n\nBased on your prompt: "${customPrompt}"\n\n${text}\n\n*This response was generated based on your specific instructions.*`;

    default:
      return text;
  }
};

export function AIAssistantModal({
  isOpen,
  onClose,
  selectedText,
  noteContent,
  onInsert,
}: AIAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<"writing" | "code" | "organize">("writing");
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const textToProcess = selectedText || noteContent.slice(0, 500);

  const handleAction = async (action: AIAction) => {
    setIsLoading(true);
    setResult("");
    
    try {
      const response = await generateAIResponse(
        action,
        textToProcess,
        action === "custom" ? customPrompt : undefined
      );
      setResult(response);
    } catch (error) {
      console.error("AI Error:", error);
      setResult("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsert(result);
    setResult("");
    setCustomPrompt("");
  };

  const handleClose = () => {
    setResult("");
    setCustomPrompt("");
    onClose();
  };

  const filteredActions = AI_ACTIONS.filter((a) => a.category === activeTab);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            AI Writing Assistant
          </DialogTitle>
          <DialogDescription>
            {selectedText
              ? "Transform your selected text with AI"
              : "Get AI-powered help with your note"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 gap-4">
          {/* Context Preview */}
          {textToProcess && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {selectedText ? "Selected Text:" : "Note Preview:"}
              </p>
              <p className="text-sm line-clamp-3">{textToProcess}</p>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-2 border-b pb-2">
            {(["writing", "code", "organize"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === "writing" && <PenLine className="w-4 h-4 mr-1" />}
                {tab === "code" && <Code className="w-4 h-4 mr-1" />}
                {tab === "organize" && <ListChecks className="w-4 h-4 mr-1" />}
                {tab}
              </Button>
            ))}
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-start gap-1 hover:bg-accent"
                  onClick={() => handleAction(action.id)}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{action.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Instruction</label>
            <div className="flex gap-2">
              <Textarea
                placeholder="Enter your own instruction for the AI..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[60px]"
              />
              <Button
                onClick={() => handleAction("custom")}
                disabled={isLoading || !customPrompt.trim()}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Result */}
          {(result || isLoading) && (
            <div className="flex-1 min-h-0 flex flex-col border rounded-lg">
              <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                <span className="text-sm font-medium">AI Result</span>
                {result && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleInsert}
                    >
                      Insert to Note
                    </Button>
                  </div>
                )}
              </div>
              <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        AI is processing your request...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {result}
                    </pre>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
