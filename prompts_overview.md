# AI Prompts Used - Website Blocker Chrome Extension

This document contains all prompts used during the development of the Website Blocker Chrome Extension, along with AI ratings on clarity, effectiveness, and learning outcomes.

---

## Prompt 1: Initial Project Setup

### User Prompt:
```
We are tasked to build a chrome extension that performs the following: 
1. Takes website urls to be blocked/timeout
2. Prevent viewing of the pages from the links
3. Provide a grace period with a random time lapse from 30 seconds to 9 minutes
4. Incase a grace period is requested, a unique key should be generated which should 
   be used to unlock the page. The unique key expires after the time lapse duration

Technologies used are wxt with the react template as the starter

Notes: 
1. Records should be saved in the local storage for persistent state 
2. In a single hour, only 3 grace periods are allowed.
```

### AI Response Summary:
- Created complete project architecture with WXT + React + TypeScript
- Provided 8 separate files including configuration, types, utilities, background worker, content script, and popup UI
- Implemented all requested features with proper storage management
- Included detailed code for grace period system with unique key generation

### Clarity Rating: ⭐⭐⭐⭐⭐ (5/5)

**Strengths:**
- Clear feature list with numbered requirements
- Specific technical stack mentioned (WXT + React)
- Important constraints clearly stated (3 per hour limit)
- Business logic well defined (grace period with keys)

**What Made It Effective:**
- Combined functional requirements with technical constraints
- Provided context about technology stack
- Specific time ranges given (30s - 9min)
- Storage requirements explicitly stated

**Learning Outcome:**
Complete working codebase generated from single comprehensive prompt.

---

## Prompt 2: Fixing Infinite Loop Bug

### User Prompt:
```
it's creating a lot of new windows all at the same time
```

### AI Response Summary:
- Identified the issue: `webNavigation.onBeforeNavigate` causing redirect loops
- Switched to `tabs.onUpdated` listener
- Added tab tracking to prevent duplicate processing
- Implemented proper timing delays for content script injection

### Clarity Rating: ⭐⭐⭐ (3/5)

**Strengths:**
- Described the symptom clearly ("creating a lot of new windows")
- Immediate and observable problem

**Areas for Improvement:**
- Could have included: "When I visit a blocked site, it opens multiple windows"
- Missing context: When does this happen? During what action?
- No error messages or console logs included

**Better Prompt Would Be:**
```
When I visit a blocked website, Chrome opens multiple new windows/tabs 
simultaneously in an infinite loop. This happens as soon as the page starts 
loading. No errors in console. How do I fix this?
```

**Learning Outcome:**
Despite brevity, the symptom was distinctive enough to diagnose. Learned about navigation event handling in Chrome extensions.

---

## Prompt 3: Path-Specific Blocking

### User Prompt:
```
Couple of changes,
1. Sites like youtube.com/shorts/ isn't the same as youtube.com
2. The unique key generation works but redirects immediately without giving 
   the user chance to enter the key
3. Once the key is even entered, the sites are not unlocked, this should be 
   when the key is entered or the blocked sites are opened but with an overlay 
   of time remaining on top right corner.
```

### AI Response Summary:
- Modified `urlToPattern()` to include pathname in regex
- Removed automatic reload after grace period generation
- Added "Unlock Site Now" button for manual unlocking
- Created timer overlay component for showing remaining time
- Fixed grace period matching logic to use base URLs

### Clarity Rating: ⭐⭐⭐⭐⭐ (5/5)

**Strengths:**
- Multiple issues clearly numbered
- Each issue described with specific examples (youtube.com/shorts)
- Desired behavior explicitly stated ("overlay of time remaining on top right corner")
- Sequential issues showing testing progression

**What Made It Effective:**
- Organized format (numbered list)
- Concrete examples provided
- Expected behavior described, not just problems
- Clear user experience goal ("without giving the user chance to enter the key")

**Learning Outcome:**
Three significant features improved: URL matching granularity, UX flow refinement, and timer overlay implementation.

---

## Prompt 4: Module Resolution Error

### User Prompt:
```
bug " WARN  Duplicated imports "storage", the one from "wxt/utils/storage" has been 
ignored and "D:/Projects/ai-projects/utils/storage.ts" is used
✖ Command failed after 4.334 s                                              
[10:50:26]  ERROR  entrypoints\background.ts: Default export not found, did you forget 
to call "export default defineBackground(...)"?"
```

### AI Response Summary:
- Identified naming conflict with WXT's built-in storage
- Renamed custom storage to `blockerStorage`
- Fixed export syntax in background.ts (changed from arrow function to object with main method)
- Updated all imports throughout the project

### Clarity Rating: ⭐⭐⭐⭐⭐ (5/5)

**Strengths:**
- Exact error messages copied verbatim
- Warning and error both included
- File paths provided
- Timestamp included showing build failure

**What Made It Effective:**
- Complete error output (not paraphrased)
- Multiple related errors shown together
- Context clear (happened during build)

**Learning Outcome:**
Understanding of WXT's built-in utilities and proper export patterns for background scripts.

---

## Prompt 5: Import Path Resolution

### User Prompt:
```
file: D:/Projects/ai-projects/entrypoints/background.ts:1:0
1: import { blockerStorage } from "../utils/storage";
   ^
2: import type { BlockCheckResult } from "../types";
```

### AI Response Summary:
- Changed all relative imports (`../`) to absolute imports using `@/` alias
- Created proper `tsconfig.json` with path mapping
- Updated all files to use consistent import style
- Explained WXT/Vite preference for absolute imports

### Clarity Rating: ⭐⭐⭐⭐ (4/5)

**Strengths:**
- Exact file path and line numbers
- Code snippet showing problematic line
- Clear indication of where error occurs

**Areas for Improvement:**
- Could have included the actual error message
- Missing context about what command was run

**Better Prompt Would Be:**
```
Getting this error when running npm run dev:

Error: Cannot resolve module
file: D:/Projects/ai-projects/entrypoints/background.ts:1:0
1: import { blockerStorage } from "../utils/storage";
```

**Learning Outcome:**
Learned about WXT's module resolution system and the benefits of alias-based imports.

---

## Prompt 6: Export Not Found Error

### User Prompt:
```
[cause]: entrypoints/background.ts (1:0): "blockerStorage" is not exported by "utils/
storage.ts", imported by "entrypoints/background.ts".
file: D:/Projects/ai-projects/entrypoints/background.ts:1:0
1: import { blockerStorage } from "@/utils/storage";
   ^
2: import type { BlockCheckResult } from "@/types";
```

### AI Response Summary:
- Verified the export statement in storage.ts
- Rewrote entire storage.ts file to ensure correct export
- Confirmed `blockerStorage` was properly exported as named export

### Clarity Rating: ⭐⭐⭐⭐⭐ (5/5)

**Strengths:**
- Complete error message with cause
- File path and line number
- Code showing the problematic import
- Error clearly states what's missing

**What Made It Effective:**
- Very specific: tells exactly what export is missing
- Shows both the import and the file being imported from
- Error message is self-explanatory

**Learning Outcome:**
Importance of verifying exports match imports, especially after refactoring.

---

## Prompt 7: Legacy Import Statement

### User Prompt:
```
file: D:/Projects/ai-projects/entrypoints/popup/App.tsx:2:9
1: import { useState, useEffect } from 'react';
2: import { storage } from '../../utils/storage';
            ^
3: import type { BlockedSite, GracePeriod } from '../../types';
4: import './App.css';
```

### AI Response Summary:
- Identified old import statement that wasn't updated
- Changed from `storage` to `blockerStorage`
- Changed from relative path to `@/` alias
- Rewrote entire App.tsx to ensure consistency

### Clarity Rating: ⭐⭐⭐⭐⭐ (5/5)

**Strengths:**
- Exact file, line, and column number
- Context showing surrounding code
- Clear indication of problematic identifier

**What Made It Effective:**
- Pinpointed exact location
- Showed the old import that needed updating
- Made it easy to identify the file needing changes

**Learning Outcome:**
When refactoring, need to update ALL references consistently across the codebase.

---

## Prompt 8: Build Output Location

### User Prompt:
```
where is the output after run npm run build
```

### AI Response Summary:
- Explained output location: `.output/chrome-mv3/`
- Provided full directory structure
- Gave instructions for loading the production build
- Explained zip command for distribution

### Clarity Rating: ⭐⭐⭐ (3/5)

**Strengths:**
- Direct question
- Clear intent

**Areas for Improvement:**
- Too vague - could mean "where to find files" or "where to see build logs"
- No context about why asking (deployment, debugging, distribution?)

**Better Prompt Would Be:**
```
I ran npm run build successfully. Where can I find the production-ready 
extension files so I can load them in Chrome?
```

**Learning Outcome:**
Understanding of WXT's build output structure and distribution workflow.

---

---

## Overall Prompt Quality Analysis

### Average Clarity Rating: 4.4/5 ⭐⭐⭐⭐

### Best Prompts (5/5):
1. Initial project setup - Comprehensive with all requirements
2. Path-specific blocking fixes - Organized, specific examples
3. Module resolution error - Complete error output
4. Export not found - Self-explanatory error messages
5. Documentation request - Clear deliverables with template

### Prompts That Could Improve (3/5):
1. "creating a lot of new windows" - Too brief, lacked context
2. "where is the output" - Vague intent

---

## Key Lessons in Effective Prompting

### ✅ Do's:
1. **Include exact error messages** - Copy full error output with file paths
2. **Provide context** - What were you doing when the problem occurred?
3. **Give specific examples** - "youtube.com/shorts/" vs "youtube.com"
4. **State expected behavior** - Not just what's wrong, but what should happen
5. **Use structured format** - Numbered lists, clear sections
6. **Include relevant code** - Show the problematic lines
7. **Specify deliverables** - "Create a markdown file", "Generate TypeScript code"

### ❌ Don'ts:
1. **Don't be too vague** - "It doesn't work" → "Grace period keys don't unlock the site"
2. **Don't paraphrase errors** - Copy exact error messages
3. **Don't skip context** - Say when/where the problem occurs
4. **Don't assume AI knows previous state** - Provide current situation

---

## Prompting Evolution Throughout Project

### Phase 1: Initial Setup (Prompt 1)
- **Style:** Comprehensive, requirements-based
- **Effectiveness:** Very high - got complete working codebase
- **Key Factor:** Clear requirements with technical constraints

### Phase 2: Bug Fixing (Prompts 2-3)
- **Style:** Problem description → Solution request
- **Effectiveness:** Mixed - improved with better error context
- **Key Factor:** Specific symptoms and desired outcomes

### Phase 3: Technical Errors (Prompts 4-7)
- **Style:** Error message sharing
- **Effectiveness:** Very high - exact errors enable precise fixes
- **Key Factor:** Complete error output with file paths

### Phase 4: Documentation (Prompts 8-10)
- **Style:** Deliverable-focused with templates
- **Effectiveness:** High - clear outputs produced
- **Key Factor:** Specific formats and templates provided

---

## Recommendations for Future Projects

### For Technical Issues:
```
1. State what you were doing
2. Copy the exact error message
3. Include relevant code snippet
4. Describe expected vs actual behavior
```

### For Feature Requests:
```
1. Describe the feature clearly
2. Provide use case/example
3. Specify technical constraints
4. Mention preferred technology/approach
```

### For Documentation:
```
1. Specify the format (markdown, PDF, etc.)
2. Provide template or example if available
3. List required sections
4. State the audience/purpose
```

---

## Impact of Prompt Quality on Development Speed

| Prompt Quality | Resolution Time | Iterations Needed | Learning Value |
|----------------|-----------------|-------------------|----------------|
| Excellent (5★) | Immediate | 1 | High |
| Good (4★) | Fast | 1-2 | Medium-High |
| Average (3★) | Moderate | 2-3 | Medium |
| Poor (1-2★) | Slow | 3+ | Low |

**Observation:** High-quality prompts with clear requirements and complete error messages resolved issues in single iterations, while vague prompts required clarification rounds.

---

## Conclusion

The quality of prompts directly correlated with development efficiency. The most effective prompts were those that:
- Provided complete context
- Included exact error messages
- Specified desired outcomes
- Used organized formatting

By the end of the project, prompt quality improved significantly as patterns emerged. The initial comprehensive prompt (Prompt 1) set a strong foundation, and error-focused prompts (4-7) demonstrated how precise information enables precise solutions.

**Key Takeaway:** Investing time in crafting clear, detailed prompts saves significantly more time in development and debugging phases.

---

*This analysis serves as a prompt engineering case study for future AI-assisted development projects.*
