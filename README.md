# AlgoSphere - Interactive DSA Handbook

 **Overview**

AlgoSphere combines a modern textbook, algorithm visualizer, coding playground, problem-solving platform, and personal notebook into one seamless experience. Understand concepts visually, practice them immediately, and track your learning journey—all while keeping your data local and private

**Live Demo:** https://algo-sphere-jet.vercel.app/



---

##  Key Features

###  Content Library


- Competitive programming onboarding
- Foundations & NP-hardness
- Arrays & bit manipulation
- Searching & sorting algorithms
- Recursion & backtracking
- Linked lists, stacks & queues
- Hashing & hash tables
- Trees, BSTs & traversals
- Heaps & priority queues
- Graph algorithms (pathfinding, MST)
- Greedy algorithms
- Divide & conquer
- Dynamic programming (1D, 2D, bitmask/TSP)
- String matching & pattern algorithms
- Number theory & game theory

###  Interactive Visualizers (~18)
Built on a unified frame engine:

- **Array operations** - Insert, delete, search
- **Searching algorithms** - Linear, Binary
- **Sorting algorithms** - Quick, Merge, Bubble, Insertion, Selection
- **Recursion/Backtracking** - N-Queens, Maze solving
- **Linked Lists** - Singly, Doubly, Circular
- **Stack & Queue** - Push, pop, enqueue, dequeue
- **Hash Tables** - Chaining, Linear probing
- **Trees & BSTs** - Insert, delete, search, rotations
- **Heap Operations** - Insert, extract, heapify
- **Tree Traversals** - Preorder, Inorder, Postorder, Level-order
- **Pathfinding** - Dijkstra, A*, BFS, DFS
- **Sieve of Eratosthenes** - Prime number generation
- **Game Theory** - Nim, Grundy numbers
- **String Matching** - Naïve vs KMP
- **Greedy Algorithms** - Activity selection, Kadane, Fractional knapsack
- **Bit Manipulation** - Operations visualized
- **DP Tables** - Step-by-step table filling
- **Weighted Graph Lab** - Bellman-Ford, Floyd-Warshall, Kruskal, Prim, Union-Find

###  Practice System
- **Laddered problem sets:** Easy → Medium → Hard per topic
- **In-browser grading:** Hidden tests run via Pyodide (CPython → WASM)
- **Progressive hints:** Nudge → Step → Near-answer
- **Complete solutions:** Python + C++ reference solutions

###  Python Playground
- Full CPython environment in the browser
- No setup required
- Test algorithms instantly


---

##  Quick Start

### Prerequisites
```bash
Node.js (v16+ recommended)
npm or yarn
```

### Installation
```bash
# Clone the repository
git clone https://github.com/RoBiul-Hasan-Jisan/AlgoSphere.git
cd AlgoSphere

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check + build production assets |
| `npm run preview` | Serve production build locally |

---

##  Application Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with quick access |
| `/learn` | Chapter Library | Browse all 23 chapters |
| `/learn/:chapterId/:lessonId` | Lesson Reader | Interactive lesson with visualizers |
| `/visualizers` | Visualizer Gallery | Browse all visualizations |
| `/visualizers/:id` | Interactive Visualizer | Full-screen visualizer with controls |
| `/playground` | Python Playground | In-browser Python environment |
| `/problems` | Problem Browser | Search and filter problems |
| `/problems/:id` | Problem Solver | Solve with hidden test grading |
| `/notes` | Notes | Saved personal notes |
| `/search` | Search | Search lessons and notes |
| `/issue` | Issue | Submit feedback or report issues |
| `/sorting` | Sorting Visualizer | Standalone sorting comparison |
| `/pathfinding` | Pathfinding Visualizer | Standalone pathfinding comparison |



---

##  Architecture

### Project Structure
```
AlgoSphere/
├── src/
│   ├── App.tsx                 # Route configuration
│   ├── main.tsx               # Application entry
│   ├── index.css              # Global styles & theme
│   │
│   ├── components/
│   │   ├── lesson/           # Lesson rendering blocks
│   │   │   ├── BlockRenderer.tsx
│   │   │   ├── MarkdownLite.tsx
│   │   │   ├── VizBlock.tsx
│   │   │   └── LessonNotes.tsx
│   │   │
│   │   ├── sim/              # Visualization engine
│   │   │   ├── EmbeddedSim.tsx   # Lesson-embedded player
│   │   │   ├── VizShell3.tsx     # 3-pane layout
│   │   │   ├── Interactive.tsx   # Standalone player
│   │   │   └── *Canvas.tsx       # Individual frame renderers
│   │   │
│   │   ├── Navbar.tsx         # Top navigation
│   │   ├── AccountMenu.tsx    # Google auth & sync
│   │   └── CommandPalette.tsx # ⌘K quick switcher
│   │
│   ├── content/              # LESSON CONTENT (data-driven)
│   │   ├── builder.ts        # Content authoring helpers
│   │   ├── index.ts          # Chapter registry
│   │   ├── types.ts          # Content type definitions
│   │   └── chapters/         # 23 chapter modules
│   │
│   ├── lib/
│   │   ├── problems/        # PRACTICE SYSTEM
│   │   │   ├── types.ts      # Problem & test models
│   │   │   ├── runner.ts     # Pyodide grader
│   │   │   ├── solved.ts     # Progress tracking
│   │   │   ├── cpp.ts        # C++ solutions
│   │   │   └── sets/         # Topic problem sets
│   │   │
│   │   ├── sims/            # FRAME GENERATORS
│   │   │   ├── sorting.ts    # Sorting visualizations
│   │   │   └── pathfinding.ts # Grid pathfinding
│   │   │
│   │   ├── usePlayer.ts      # Playback controls hook
│   │   ├── usePyodide.ts     # Python runtime singleton
│   │   ├── progress.ts       # Lesson progress store
│   │   ├── notesStore.ts     # Notes store
│   │   ├── supabase.ts       # Supabase client
│   │   ├── auth.ts           # Google authentication
│   │   └── sync.ts           # Cloud sync logic
│   │
│   └── pages/               # ROUTE PAGES
│       ├── visualizers/      # Gallery & registry
│       ├── HomePage.tsx
│       ├── LearnPage.tsx
│       ├── LessonPage.tsx
│       ├── ProblemsPage.tsx
│       ├── ProblemPage.tsx
│       ├── PlaygroundPage.tsx
│       ├── SearchPage.tsx
│       ├── NotesPage.tsx
│       ├── IssuePage.tsx
│       ├── SortingPage.tsx
│       └── PathfindingPage.tsx
│
├── public/                   # Static assets
├── dist/                     # Production build output
├── .env.example              # Environment variables template
├── tailwind.config.js        # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies & scripts
```

### Content Authoring Pattern
Lessons are authored as TypeScript data, enabling consistency and easy updates:

```typescript
import { callout, chapter, heading, lesson, problem, prose, viz } from "../builder";

export const sortingChapter = chapter("sorting", "Sorting Algorithms", 
  "Learn how to sort arrays efficiently.", [
    lesson("quick-sort", "Quick Sort", 
      "Divide and conquer sorting algorithm.", 15, [
        prose("Quick Sort picks a pivot and partitions the array."),
        heading("Algorithm Steps"),
        prose("1. Choose a pivot element\n2. Partition the array\n3. Recursively sort sub-arrays"),
        viz("sorting", { algo: "quick", title: "Quick Sort Visualization" }),
        callout("complexity", "Average: O(n log n), Worst: O(n²)"),
        callout("intuition", "Like sorting a deck of cards by picking a card as pivot."),
        problem("quick-sort-implementation"),
      ])
  ]);
```

### Block Types

| Helper | Purpose | Example |
|--------|---------|---------|
| `prose(text)` | Markdown text | `prose("Binary search finds elements in O(log n)")` |
| `heading(title)` | Section header | `heading("Complexity Analysis")` |
| `callout(type, text)` | Highlighted box | `callout("warning", "This has edge cases!")` |
| `viz(id, props)` | Embedded visualizer | `viz("sorting", { algo: "quick" })` |
| `derive(steps, result)` | Step-by-step proof | `derive([...], "O(n log n)")` |
| `problem(id)` | Practice problem | `problem("two-sum")` |
| `divider()` | Visual separator | `divider()` |

---

##  Visualization System

### Frame-Based Architecture
All visualizers follow a consistent pattern:

**Frame Generator (pure function):** Creates Frame[] array

**Canvas Renderer:** Renders a single frame

**Player Controls:** Play, pause, step, scrub

**Interactive Wrapper:** Handles input, speed, and limits

```typescript
// Frame generator example
function generateSortingFrames(array: number[], algo: string): Frame[] {
  const frames: Frame[] = [];
  // Generate each step as a frame
  frames.push({ 
    array: [...array], 
    highlighted: [0, 1],
    comparison: true,
    step: "Comparing elements"
  });
  return frames;
}

// Canvas renderer
function SortingCanvas({ frame }: { frame: Frame }) {
  return (
    <div className="flex items-end gap-1">
      {frame.array.map((val, i) => (
        <div 
          key={i}
          className={`w-8 ${getColor(i, frame.highlighted)}`}
          style={{ height: `${val}px` }}
        />
      ))}
    </div>
  );
}
```

### Adding a Visualizer
1. Create frame generator in `src/lib/sims/`
2. Add canvas component in `src/components/sim/`
3. Register in `Interactive.tsx` with controls
4. Add to registry in `src/pages/visualizers/registry.tsx`
5. Add thumbnail in `VizThumb.tsx`
6. Embed in lessons using `viz()` helper

---

## 📝 Problem System

### Problem Structure
```typescript
{
  id: "two-sum",
  title: "Two Sum",
  topic: "arrays",          // Matches chapter ID
  difficulty: "easy",       // easy | medium | hard
  summary: "Find two numbers that add up to target.",
  statement: "Given an array of integers...",
  funcName: "two_sum",
  starter: "def two_sum(nums, target):\n    pass",
  visible: [
    { 
      input: "[2,7,11,15], 9", 
      output: "[0,1]", 
      explain: "2 + 7 = 9" 
    }
  ],
  hidden: [
    { input: "[3,2,4], 6", output: "[1,2]" }
  ],
  hints: [
    "What data structure helps with lookups?",
    "Store complements in a hash map.",
    "Iterate once, check complement."
  ],
  solution: "def two_sum(nums, target):\n    seen = {}\n    ...",
  compare: "set",           // exact | unordered | set | approx
  complexity: "O(n) time, O(n) space",
  lesson: "/learn/arrays/two-sum",  // Related lesson
  tags: ["arrays", "hashing"]
}
```

### Grading System
- User code + test harness concatenated
- Test cases passed as base64 JSON
- Function called for each case
- Results compared based on compare mode
- Passing all tests → markSolved(id)

---

##  Cloud Sync Setup

### Environment Variables
Create `.env` from `.env.example`:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-publishable-key>
VITE_WEB3FORMS_KEY=<optional-key>
```

### Supabase Setup
1. Create Supabase project
2. Create user_state table:

```sql
CREATE TABLE user_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  state JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Enable RLS policies (see `.env.example`)
4. Enable Google OAuth in Supabase dashboard

### Sync Behavior
- **Local-first:** All data in localStorage
- **On sign-in:** Merge cloud + local (union of completions)
- **On change:** Debounced push to cloud
- **Conflict resolution:** Newest-wins per note

---

##  Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component primitives

### Runtime
- **Pyodide** - Python in the browser
- **localStorage** - Local data persistence

### Backend (Optional-Not done Yet)
- **Supabase** - PostgreSQL + Auth
- **Google OAuth** - Authentication

### Deployment
- **Vercel** - Hosting & CI/CD

---

##  Development Guidelines

### Code Style
- TypeScript strict mode enabled
- Use semantic color tokens from `index.css`
- Support light and dark themes
- Use `cn()` helper for conditional classes

### Visualizer Guidelines
- Keep frame generators pure and deterministic
- Use seeded/index-based variation (no `Math.random()`)
- Respect legibility limits (e.g., max 31 nodes for traversals)
- Surface speed controls and input limits

### Adding Content
- **Lessons:** Author in `src/content/chapters/`
- **Visualizers:** Add to `src/lib/sims/` and registry
- **Problems:** Add to `src/lib/problems/sets/`
- Always run `npm run build` to verify

### Performance
- Lazy load Pyodide (CDN)
- Use `React.memo` for canvases
- Debounce cloud sync (500ms)
- Optimize frame generation (O(n) per frame)

---

##  Testing & Building

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

**Note:** No separate test runner exists yet. All verification is manual via the dev server.

---

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Add proper TypeScript types
- Follow existing code patterns
- Test all visualizers in dev server
- Update documentation as needed
- Ensure `npm run build` passes

---




