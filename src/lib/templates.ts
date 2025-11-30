import { FileText, Calendar, CheckSquare, Code, BookOpen, Utensils, Briefcase, Lightbulb, MessageSquare, Target } from "lucide-react";

export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "productivity" | "personal" | "development" | "creative";
  content: string;
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    description: "Structured template for capturing meeting discussions",
    icon: "message-square",
    category: "productivity",
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 

---

## Agenda
1. 
2. 
3. 

## Discussion Points


## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Steps


## Notes

`,
  },
  {
    id: "daily-journal",
    title: "Daily Journal",
    description: "Reflect on your day with guided prompts",
    icon: "calendar",
    category: "personal",
    content: `# Daily Journal - ${new Date().toLocaleDateString()}

## 🌅 Morning Intentions
*What do I want to accomplish today?*


## 📝 Today's Highlights
*What happened today worth remembering?*


## 💡 Lessons Learned
*What did I learn today?*


## 🙏 Gratitude
*Three things I'm grateful for:*
1. 
2. 
3. 

## 🎯 Tomorrow's Focus

`,
  },
  {
    id: "project-plan",
    title: "Project Plan",
    description: "Outline your project goals, timeline and tasks",
    icon: "briefcase",
    category: "productivity",
    content: `# Project: [Project Name]

## Overview
*Brief description of the project*


## Goals
- 
- 
- 

## Timeline
| Phase | Duration | Status |
|-------|----------|--------|
| Planning | | ⏳ |
| Development | | ⏳ |
| Testing | | ⏳ |
| Launch | | ⏳ |

## Tasks
### Phase 1: Planning
- [ ] 
- [ ] 

### Phase 2: Development
- [ ] 
- [ ] 

### Phase 3: Testing
- [ ] 
- [ ] 

## Resources
- 

## Notes

`,
  },
  {
    id: "code-snippet",
    title: "Code Snippet",
    description: "Document code with explanation and examples",
    icon: "code",
    category: "development",
    content: `# Code Snippet: [Title]

## Description
*What does this code do?*


## Language
\`javascript\`

## Code
\`\`\`javascript
// Your code here

\`\`\`

## Usage Example
\`\`\`javascript
// How to use this code

\`\`\`

## Parameters
| Name | Type | Description |
|------|------|-------------|
| | | |

## Notes
- 

## Related Links
- 
`,
  },
  {
    id: "todo-list",
    title: "Todo List",
    description: "Simple task list with priorities",
    icon: "check-square",
    category: "productivity",
    content: `# Todo List - ${new Date().toLocaleDateString()}

## 🔴 High Priority
- [ ] 
- [ ] 

## 🟡 Medium Priority
- [ ] 
- [ ] 

## 🟢 Low Priority
- [ ] 
- [ ] 

## ✅ Completed
- [x] 

## Notes

`,
  },
  {
    id: "blog-post",
    title: "Blog Post Draft",
    description: "Structure your blog post with intro, body, conclusion",
    icon: "file-text",
    category: "creative",
    content: `# [Blog Post Title]

*Draft - ${new Date().toLocaleDateString()}*

## Hook
*Opening sentence to grab attention*


## Introduction
*Set the context and tell readers what they'll learn*


## Main Content

### Section 1: [Heading]


### Section 2: [Heading]


### Section 3: [Heading]


## Key Takeaways
- 
- 
- 

## Conclusion
*Summarize and call to action*


## Meta
- **Target audience:** 
- **Keywords:** 
- **Word count goal:** 
`,
  },
  {
    id: "book-notes",
    title: "Book Notes",
    description: "Capture key insights from what you're reading",
    icon: "book-open",
    category: "personal",
    content: `# 📚 Book Notes

**Title:** 
**Author:** 
**Date Started:** ${new Date().toLocaleDateString()}
**Date Finished:** 

## Rating
⭐⭐⭐⭐⭐ (X/5)

## Summary
*What is this book about in 2-3 sentences?*


## Key Ideas
1. 
2. 
3. 

## Favorite Quotes
> 

> 

## How This Applies to My Life


## Recommended For
*Who would benefit from reading this?*


## Related Books
- 
`,
  },
  {
    id: "recipe",
    title: "Recipe",
    description: "Document recipes with ingredients and steps",
    icon: "utensils",
    category: "personal",
    content: `# 🍳 [Recipe Name]

**Prep Time:** 
**Cook Time:** 
**Servings:** 
**Difficulty:** Easy / Medium / Hard

## Ingredients
- 
- 
- 
- 

## Equipment
- 
- 

## Instructions
1. 
2. 
3. 
4. 
5. 

## Tips & Variations
- 

## Notes

`,
  },
  {
    id: "brainstorm",
    title: "Brainstorm",
    description: "Free-form idea generation space",
    icon: "lightbulb",
    category: "creative",
    content: `# 💡 Brainstorm: [Topic]

*Date: ${new Date().toLocaleDateString()}*

## Problem / Question
*What am I trying to solve or explore?*


## Free Ideas
*Write anything that comes to mind, no filtering!*
- 
- 
- 
- 
- 

## Promising Ideas
*Which ideas seem worth exploring further?*
1. 
2. 
3. 

## Next Steps
- [ ] 
- [ ] 

## Inspiration / References
- 
`,
  },
  {
    id: "goal-tracker",
    title: "Goal Tracker",
    description: "Set and track progress toward your goals",
    icon: "target",
    category: "productivity",
    content: `# 🎯 Goal: [Your Goal]

**Start Date:** ${new Date().toLocaleDateString()}
**Target Date:** 
**Status:** 🟡 In Progress

## Why This Matters
*Your motivation for achieving this goal*


## Success Criteria
*How will you know when you've achieved it?*
- 
- 

## Milestones
| Milestone | Target Date | Status |
|-----------|-------------|--------|
| | | ⏳ |
| | | ⏳ |
| | | ⏳ |

## Weekly Progress

### Week 1
- 

## Obstacles & Solutions
| Obstacle | Solution |
|----------|----------|
| | |

## Resources Needed
- 

## Reflections

`,
  },
];

export const TEMPLATE_CATEGORIES = {
  productivity: { label: "Productivity", color: "#3B82F6" },
  personal: { label: "Personal", color: "#10B981" },
  development: { label: "Development", color: "#8B5CF6" },
  creative: { label: "Creative", color: "#F59E0B" },
} as const;

export const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "message-square": MessageSquare,
  "calendar": Calendar,
  "briefcase": Briefcase,
  "code": Code,
  "check-square": CheckSquare,
  "file-text": FileText,
  "book-open": BookOpen,
  "utensils": Utensils,
  "lightbulb": Lightbulb,
  "target": Target,
};
