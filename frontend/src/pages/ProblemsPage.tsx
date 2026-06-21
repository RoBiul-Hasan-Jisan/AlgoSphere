import { useMemo, useRef, useState, useEffect } from "react";
import type { PointerEvent, ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Filter,
  FlaskConical,
  Move,
  RotateCcw,
  Search,
  Shuffle,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_ORDER,
  PROBLEM_COUNT,
  PROBLEMS,
  topicLabel,
} from "@/lib/problems";
import type { Difficulty, Problem } from "@/lib/problems";
import { useSolved } from "@/lib/problems/solved";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

// Extend Problem type to include external property
interface ExtendedProblem extends Problem {
  external?: boolean;
  neetcodeUrl?: string;
  tags?: string[];
}

const DIFF_STYLE: Record<Difficulty, string> = {
  easy: "text-run bg-run/10 ring-run/30",
  medium: "text-pivot bg-pivot/10 ring-pivot/30",
  hard: "text-swap bg-swap/10 ring-swap/30",
};

const MAP_W = 1160;
const MAP_H = 820;
const NODE_W = 156;
const NODE_H = 54;

type Accent = "visited" | "compare" | "run" | "pivot" | "swap";
type StatusFilter = "all" | "solved" | "unsolved";

interface RoadmapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  topics?: string[];
  accent: Accent;
  blurb: string;
  planned?: boolean;
  externalUrl?: string;
}

interface RoadmapEdge {
  from: string;
  to: string;
}

const ROADMAP_NODES: RoadmapNode[] = [
  {
    id: "arrays-hashing",
    label: "Arrays & Hashing",
    x: 500,
    y: 34,
    topics: ["arrays", "hashing", "strings"],
    accent: "visited",
    blurb: "Indexing, strings, frequency tables, and lookup patterns.",
    externalUrl: "https://neetcode.io/roadmap/arrays-hashing",
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    x: 330,
    y: 150,
    topics: ["arrays"],
    accent: "visited",
    blurb: "Array scans that move two indices with an invariant.",
    externalUrl: "https://neetcode.io/roadmap/two-pointers",
  },
  {
    id: "hashing",
    label: "Hash Tables",
    x: 670,
    y: 150,
    topics: ["hashing"],
    accent: "compare",
    blurb: "Use keys, counts, and sets to avoid repeated scans.",
  },
  {
    id: "binary-search",
    label: "Binary Search",
    x: 205,
    y: 274,
    topics: ["searching", "divide-and-conquer"],
    accent: "compare",
    blurb: "Halve a sorted space or a monotonic answer space.",
    externalUrl: "https://neetcode.io/roadmap/binary-search",
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    x: 455,
    y: 274,
    topics: ["arrays"],
    accent: "compare",
    blurb: "Maintain a live interval instead of recomputing each range.",
    externalUrl: "https://neetcode.io/roadmap/sliding-window",
  },
  {
    id: "stacks-queues",
    label: "Stacks & Queues",
    x: 705,
    y: 274,
    topics: ["stacks-queues"],
    accent: "compare",
    blurb: "LIFO/FIFO structures for parsing, simulation, and monotonic scans.",
  },
  {
    id: "recursion",
    label: "Recursion",
    x: 455,
    y: 406,
    topics: ["recursion"],
    accent: "run",
    blurb: "Base cases, call stacks, divide-and-conquer, and backtracking roots.",
  },
  {
    id: "linked-list",
    label: "Linked List",
    x: 150,
    y: 526,
    accent: "compare",
    planned: true,
    blurb: "Pointer rewiring and list traversal practice.",
  },
  {
    id: "trees",
    label: "Trees",
    x: 455,
    y: 526,
    accent: "compare",
    planned: true,
    blurb: "Tree basics, traversals, and search-tree operations.",
  },
  {
    id: "backtracking",
    label: "Backtracking",
    x: 780,
    y: 526,
    topics: ["recursion"],
    accent: "visited",
    blurb: "Explore choices, prune invalid branches, and undo state cleanly.",
  },
  {
    id: "heap",
    label: "Heap / Priority Queue",
    x: 355,
    y: 648,
    topics: ["heaps"],
    accent: "compare",
    blurb: "Extract-min/max structures for greedy and graph algorithms.",
    externalUrl: "https://neetcode.io/roadmap/heap",
  },
  {
    id: "graphs-mst",
    label: "Graphs & MST",
    x: 665,
    y: 648,
    topics: ["minimum-spanning-trees"],
    accent: "compare",
    blurb: "Weighted graph connections, Kruskal, Prim, and DSU.",
  },
  {
    id: "one-d-dp",
    label: "1-D DP",
    x: 900,
    y: 648,
    topics: ["dynamic-programming"],
    accent: "compare",
    blurb: "State transitions over one dimension.",
  },
  {
    id: "intervals",
    label: "Intervals",
    x: 210,
    y: 754,
    accent: "compare",
    planned: true,
    blurb: "Merge, sweep, and reason about ranges.",
  },
  {
    id: "greedy",
    label: "Greedy",
    x: 420,
    y: 754,
    topics: ["greedy"],
    accent: "pivot",
    blurb: "Local choices backed by an exchange argument.",
  },
  {
    id: "advanced-graphs",
    label: "Advanced Graphs",
    x: 620,
    y: 754,
    topics: ["graphs"],
    accent: "compare",
    blurb: "Shortest paths, DAGs, components, and graph patterns.",
  },
  {
    id: "two-d-dp",
    label: "2-D DP",
    x: 815,
    y: 754,
    topics: ["dynamic-programming"],
    accent: "compare",
    blurb: "Grid/table states with row-column transitions.",
  },
  {
    id: "bit-manipulation",
    label: "Bit Manipulation",
    x: 1010,
    y: 754,
    topics: ["bit-manipulation"],
    accent: "compare",
    blurb: "Binary operators, masks, submasks, and bit tricks.",
  },
];

const ROADMAP_EDGES: RoadmapEdge[] = [
  { from: "arrays-hashing", to: "two-pointers" },
  { from: "arrays-hashing", to: "hashing" },
  { from: "two-pointers", to: "binary-search" },
  { from: "two-pointers", to: "sliding-window" },
  { from: "two-pointers", to: "stacks-queues" },
  { from: "hashing", to: "stacks-queues" },
  { from: "binary-search", to: "recursion" },
  { from: "sliding-window", to: "recursion" },
  { from: "stacks-queues", to: "recursion" },
  { from: "recursion", to: "linked-list" },
  { from: "recursion", to: "trees" },
  { from: "recursion", to: "backtracking" },
  { from: "trees", to: "heap" },
  { from: "trees", to: "graphs-mst" },
  { from: "backtracking", to: "graphs-mst" },
  { from: "backtracking", to: "one-d-dp" },
  { from: "heap", to: "intervals" },
  { from: "heap", to: "greedy" },
  { from: "heap", to: "advanced-graphs" },
  { from: "graphs-mst", to: "advanced-graphs" },
  { from: "graphs-mst", to: "two-d-dp" },
  { from: "one-d-dp", to: "two-d-dp" },
  { from: "one-d-dp", to: "bit-manipulation" },
  { from: "two-d-dp", to: "math-geometry" },
  { from: "bit-manipulation", to: "math-geometry" },
];

const EXTRA_ROADMAP_NODES: RoadmapNode[] = [
  {
    id: "math-geometry",
    label: "Math & Geometry",
    x: 820,
    y: 874,
    topics: ["math", "game-theory"],
    accent: "run",
    blurb: "Number theory, combinatorics, game theory, and geometry.",
  },
];

const ALL_ROADMAP_NODES = [...ROADMAP_NODES, ...EXTRA_ROADMAP_NODES];
const NODES_BY_ID = new Map(ALL_ROADMAP_NODES.map((node) => [node.id, node]));

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "All status",
  solved: "Solved",
  unsolved: "Unsolved",
};

const NODE_ACCENT: Record<Accent, string> = {
  visited: "border-visited/25 bg-visited/10 dark:border-fuchsia-300/40 dark:bg-gradient-to-br dark:from-fuchsia-500 dark:to-purple-700",
  compare: "border-compare/25 bg-compare/10 dark:border-sky-300/40 dark:bg-gradient-to-br dark:from-blue-500 dark:to-indigo-700",
  run: "border-run/25 bg-run/10 dark:border-emerald-300/40 dark:bg-gradient-to-br dark:from-emerald-500 dark:to-teal-700",
  pivot: "border-pivot/25 bg-pivot/10 dark:border-amber-300/40 dark:bg-gradient-to-br dark:from-amber-500 dark:to-orange-700",
  swap: "border-swap/25 bg-swap/10 dark:border-rose-300/40 dark:bg-gradient-to-br dark:from-rose-500 dark:to-red-700",
};

export function ProblemsPage() {
  const solved = useSolved();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedNodeId = readNodeParam(searchParams);
  const difficulty = readDifficultyParam(searchParams);
  const statusFilter = readStatusParam(searchParams);
  const query = searchParams.get("q") ?? "";
  const [zoom, setZoom] = useState(0.82);
  const [pan, setPan] = useState({ x: 44, y: 26 });
  const [showProgress, setShowProgress] = useState(true);
  const [animatedNode, setAnimatedNode] = useState<string | null>(null);
  const drag = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);

  const selectedNode = selectedNodeId === "all" ? undefined : NODES_BY_ID.get(selectedNodeId);
  const selectedTopics = selectedNode?.topics ?? [];

  // Calculate solvedCount BEFORE using it
  const solvedCount = PROBLEMS.filter((problem) => solved.has(problem.id)).length;
  
  // Calculate overall progress
  const overallProgress = PROBLEM_COUNT > 0 ? (solvedCount / PROBLEM_COUNT) * 100 : 0;

  const roadmapStats = useMemo(() => {
    const stats = new Map<string, { total: number; solved: number }>();
    for (const node of ALL_ROADMAP_NODES) {
      const problems = problemsForNode(node);
      stats.set(node.id, {
        total: problems.length,
        solved: problems.filter((problem) => solved.has(problem.id)).length,
      });
    }
    return stats;
  }, [solved]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROBLEMS.filter((problem) => {
      if (selectedNodeId !== "all") {
        if (selectedTopics.length === 0 || !selectedTopics.includes(problem.topic)) return false;
      }
      const done = solved.has(problem.id);
      if (statusFilter === "solved" && !done) return false;
      if (statusFilter === "unsolved" && done) return false;
      if (difficulty !== "all" && problem.difficulty !== difficulty) return false;
      if (q && !(`${problem.title} ${problem.summary} ${(problem as ExtendedProblem).tags ?? []}`.toLowerCase().includes(q))) {
        return false;
      }
      return true;
    });
  }, [selectedNodeId, selectedTopics, difficulty, statusFilter, query, solved]);

  // Per-difficulty solved tallies for the summary chips
  const diffStats = DIFFICULTY_ORDER.map((d) => {
    const all = PROBLEMS.filter((p) => p.difficulty === d);
    return { d, total: all.length, solved: all.filter((p) => solved.has(p.id)).length };
  });

  // Jump to a random unsolved problem (or any problem if all are solved)
  const pickRandom = () => {
    const unsolved = PROBLEMS.filter((p) => !solved.has(p.id));
    const pool = unsolved.length ? unsolved : PROBLEMS;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    if (choice) navigate(`/problems/${choice.id}`);
  };
  
  const focusStats = selectedNode
    ? roadmapStats.get(selectedNode.id) ?? { total: 0, solved: 0 }
    : { total: PROBLEM_COUNT, solved: solvedCount };
  const focusLabel = selectedNode?.label ?? "All topics";
  const focusProgress = focusStats.total > 0 ? Math.round((focusStats.solved / focusStats.total) * 100) : 0;

  // Animate node when selected
  useEffect(() => {
    if (selectedNodeId && selectedNodeId !== "all") {
      setAnimatedNode(selectedNodeId);
      const timer = setTimeout(() => setAnimatedNode(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedNodeId]);

  function updateUrlParam(key: "node" | "difficulty" | "status" | "q", value: string) {
    const next = new URLSearchParams(searchParams);
    const trimmed = value.trim();
    if (!trimmed || trimmed === "all") next.delete(key);
    else next.set(key, trimmed);
    setSearchParams(next, { replace: true });
  }

  function setClampedZoom(next: number) {
    setZoom(clamp(next, 0.55, 1.35));
  }

  function resetMap() {
    setZoom(0.82);
    setPan({ x: 44, y: 26 });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    setPan({
      x: active.panX + event.clientX - active.x,
      y: active.panY + event.clientY - active.y,
    });
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId === event.pointerId) {
      drag.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
      {/* Hero Section with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow inline-flex items-center gap-2">
            <FlaskConical className="h-3.5 w-3.5 text-run" />
            Practice Roadmap
          </p>
          <button
            onClick={() => setShowProgress(!showProgress)}
            className="text-xs text-subtle hover:text-run transition-colors"
          >
            {showProgress ? "Hide" : "Show"} stats
          </button>
        </div>
        
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Master DSA through structured learning
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Follow the optimal learning path inspired by NeetCode. Track your progress,
              solve problems, and level up your coding skills.
            </p>
          </div>
          
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
            <div className="rounded-2xl border border-line bg-surface px-4 py-3 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                Overall Progress
              </div>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-mono text-2xl font-semibold text-run">{solvedCount}</span>
                <span className="pb-1 text-sm text-muted">/ {PROBLEM_COUNT}</span>
              </div>
              <div className="mt-2 w-32 h-1.5 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-run"
                />
              </div>
            </div>
            
            <button onClick={pickRandom} className="btn-ghost group">
              <Shuffle className="h-4 w-4 transition-transform group-hover:rotate-180" />
              Random Problem
            </button>
          </div>
        </div>
        
        {/* Difficulty Stats with Icons */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-3"
          >
            {diffStats.map((s) => (
              <div key={s.d} className="flex-1 rounded-lg border border-line bg-surface p-2">
                <div className="flex items-center gap-2 mb-1">
                  {s.d === "easy" && <Zap className="h-3 w-3 text-run" />}
                  {s.d === "medium" && <Target className="h-3 w-3 text-pivot" />}
                  {s.d === "hard" && <Award className="h-3 w-3 text-swap" />}
                  <span className={cn("text-xs font-semibold", 
                    s.d === "easy" ? "text-run" : s.d === "medium" ? "text-pivot" : "text-swap"
                  )}>
                    {DIFFICULTY_LABEL[s.d]}
                  </span>
                </div>
                <div className="text-lg font-mono font-semibold text-fg">{s.solved}</div>
                <div className="text-xs text-subtle">of {s.total} solved</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Onboarding Banner */}
      <Link
        to="/learn/competitive-programming/what-cp-is"
        className="mb-7 flex flex-col gap-4 rounded-xl border border-compare/30 bg-gradient-to-r from-compare/10 to-transparent p-4 transition-all hover:border-compare/60 hover:shadow-lg sm:flex-row sm:items-center group"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-compare/15 text-compare group-hover:scale-110 transition-transform">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-compare" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-compare">
              New to coding challenges?
            </span>
          </div>
          <div className="font-display text-lg font-semibold text-fg">
            Start with the competitive programming onboarding path
          </div>
          <p className="mt-1 text-sm text-muted">
            Learn the judge loop, complexity analysis, and problem-solving patterns before diving in.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-compare group-hover:gap-3 transition-all">
          Read first <ArrowRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        {/* Roadmap Section */}
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm dark:border-[#333942] dark:bg-[#202327]">
          <div className="flex flex-col gap-4 border-b border-line bg-elevated/25 px-4 py-3 text-fg dark:border-white/10 dark:bg-transparent dark:text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-subtle dark:text-white/60">
                <Move className="h-3.5 w-3.5" />
                Interactive Roadmap
              </div>
              <div className="mt-1 font-display text-xl font-semibold">Learning Path</div>
              <p className="mt-1 max-w-xl text-xs leading-5 text-muted dark:text-white/55">
                Inspired by{" "}
                <a
                  href="https://neetcode.io/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-compare underline-offset-4 hover:underline dark:text-sky-300"
                >
                  NeetCode.io <ExternalLink className="h-3 w-3" />
                </a>{" "}
                — the optimal sequence to master data structures & algorithms
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setClampedZoom(zoom - 0.1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-fg transition-colors hover:bg-line/60 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="55"
                max="135"
                value={Math.round(zoom * 100)}
                onChange={(event) => setClampedZoom(Number(event.target.value) / 100)}
                className="h-2 w-28 accent-emerald-400"
                aria-label="Zoom"
              />
              <button
                type="button"
                onClick={() => setClampedZoom(zoom + 0.1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-fg transition-colors hover:bg-line/60 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetMap}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-fg transition-colors hover:bg-line/60 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                title="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className="relative h-[620px] cursor-grab overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgb(var(--line)_/_0.38)_1px,transparent_0)] bg-[length:32px_32px] active:cursor-grabbing dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)]"
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(event) => {
              event.preventDefault();
              setClampedZoom(zoom + (event.deltaY > 0 ? -0.06 : 0.06));
            }}
          >
            <div
              className="absolute left-0 top-0"
              style={{
                width: MAP_W,
                height: MAP_H + 130,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
              }}
            >
              <svg
                className="absolute inset-0"
                width={MAP_W}
                height={MAP_H + 130}
                viewBox={`0 0 ${MAP_W} ${MAP_H + 130}`}
                fill="none"
                pointerEvents="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="roadmap-arrow"
                    markerWidth="9"
                    markerHeight="9"
                    refX="7"
                    refY="4.5"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0 0 L8 4.5 L0 9 Z" className="fill-subtle/45 dark:fill-white/75" />
                  </marker>
                </defs>
                {ROADMAP_EDGES.map((edge) => (
                  <RoadmapEdgePath key={`${edge.from}-${edge.to}`} edge={edge} />
                ))}
              </svg>

              {ALL_ROADMAP_NODES.map((node) => (
                <RoadmapNodeButton
                  key={node.id}
                  node={node}
                  active={selectedNodeId === node.id}
                  animated={animatedNode === node.id}
                  stats={roadmapStats.get(node.id) ?? { total: 0, solved: 0 }}
                  onSelect={() => updateUrlParam("node", node.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="panel overflow-hidden">
          <div className="border-b border-line p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                <Filter className="h-3.5 w-3.5" />
                {selectedNode ? "Topic Focus" : "All Problems"}
              </div>
              <button
                type="button"
                onClick={() => updateUrlParam("node", "all")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  selectedNodeId === "all"
                    ? "bg-run/15 text-fg ring-1 ring-run/40"
                    : "bg-elevated text-muted hover:bg-line/60",
                )}
              >
                View all
              </button>
            </div>
            <h2 className="font-display text-2xl font-semibold text-fg">{focusLabel}</h2>
            <p className="mt-1 text-sm text-muted">
              {selectedNode?.planned
                ? "🚧 Coming soon — this topic is in our roadmap"
                : selectedNode?.blurb ?? "Browse all problems across every topic"}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">
                {focusStats.total > 0 ? `${focusStats.solved} / ${focusStats.total} mastered` : "Coming soon"}
              </span>
              {focusStats.total > 0 && (
                <span className="flex items-center gap-1 font-mono text-xs text-subtle">
                  <TrendingUp className="h-3 w-3" />
                  {focusProgress}% complete
                </span>
              )}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${focusProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-run"
              />
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="flex flex-wrap gap-1.5">
              <FilterPill active={difficulty === "all"} onClick={() => updateUrlParam("difficulty", "all")}>
                All levels
              </FilterPill>
              {DIFFICULTY_ORDER.map((level) => (
                <FilterPill key={level} active={difficulty === level} onClick={() => updateUrlParam("difficulty", level)}>
                  {DIFFICULTY_LABEL[level]}
                </FilterPill>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((status) => (
                <FilterPill key={status} active={statusFilter === status} onClick={() => updateUrlParam("status", status)}>
                  {STATUS_LABEL[status]}
                </FilterPill>
              ))}
            </div>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                value={query}
                onChange={(event) => updateUrlParam("q", event.target.value)}
                placeholder="Search by title, topic, or tag..."
                className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-fg
                  placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
              />
            </label>

            <div className="flex items-center justify-between gap-3 text-xs text-subtle">
              <span>Showing {visible.length} of {PROBLEM_COUNT} problems</span>
              {(selectedNodeId !== "all" || difficulty !== "all" || statusFilter !== "all" || query.trim()) && (
                <button
                  type="button"
                  onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                  className="font-semibold text-run underline-offset-4 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              <AnimatePresence>
                {visible.map((problem, idx) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <ProblemRow problem={problem as ExtendedProblem} done={solved.has(problem.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {visible.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-subtle"
                >
                  No problems match your filters. Try adjusting your search!
                </motion.p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RoadmapNodeButton({
  node,
  active,
  animated,
  stats,
  onSelect,
}: {
  node: RoadmapNode;
  active: boolean;
  animated: boolean;
  stats: { total: number; solved: number };
  onSelect: () => void;
}) {
  const progress = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
  
  return (
    <motion.button
      type="button"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onSelect}
      title={node.blurb}
      aria-pressed={active}
      animate={animated ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 8px 18px rgba(38,32,22,0.10)",
          "0 0 0 4px rgba(16, 185, 129, 0.4)",
          "0 8px 18px rgba(38,32,22,0.10)"
        ]
      } : {}}
      transition={{ duration: 0.5 }}
      className={cn(
        "absolute flex flex-col justify-between rounded-lg border px-3 py-2 text-left shadow-[0_8px_18px_rgba(38,32,22,0.10)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(38,32,22,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/45",
        "dark:shadow-[0_10px_28px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_14px_34px_rgba(0,0,0,0.32)] dark:focus-visible:ring-white",
        NODE_ACCENT[node.accent],
        node.planned && "opacity-55 saturate-75",
        active && "ring-2 ring-run/45 dark:ring-white scale-105",
      )}
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-[12px] font-bold leading-none text-fg dark:text-white">
          {node.label}
        </span>
        {stats.total > 0 ? (
          <span className="shrink-0 font-mono text-[10px] text-muted dark:text-white/75">
            {stats.solved}/{stats.total}
          </span>
        ) : (
          <span className="shrink-0 rounded bg-fg/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-subtle dark:bg-white/15 dark:text-white/70">
            soon
          </span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-fg/10 dark:bg-white/70">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-run dark:bg-emerald-300"
        />
      </div>
      {node.externalUrl && (
        <div className="absolute -top-1 -right-1">
          <ExternalLink className="h-3 w-3 text-subtle" />
        </div>
      )}
    </motion.button>
  );
}

function RoadmapEdgePath({ edge }: { edge: RoadmapEdge }) {
  const from = NODES_BY_ID.get(edge.from);
  const to = NODES_BY_ID.get(edge.to);
  if (!from || !to) return null;

  const sx = from.x + NODE_W / 2;
  const sy = from.y + NODE_H;
  const tx = to.x + NODE_W / 2;
  const ty = to.y;
  const bend = Math.max(54, Math.abs(ty - sy) * 0.48);
  const d = `M ${sx} ${sy} C ${sx} ${sy + bend}, ${tx} ${ty - bend}, ${tx} ${ty}`;

  return (
    <path
      d={d}
      strokeWidth="3"
      strokeLinecap="round"
      markerEnd="url(#roadmap-arrow)"
      className="stroke-subtle/45 dark:stroke-white/75"
    />
  );
}

function ProblemRow({ problem, done }: { problem: ExtendedProblem; done: boolean }) {
  return (
    <Link
      to={`/problems/${problem.id}`}
      className="group flex items-start gap-3 rounded-xl border border-line bg-surface px-3 py-3 transition-all hover:border-run/40 hover:bg-elevated/40 hover:shadow-md"
    >
      {done ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-run" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-subtle group-hover:text-run transition-colors" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2 flex-wrap">
          <span className="truncate text-sm font-semibold text-fg group-hover:text-run transition-colors">
            {problem.title}
          </span>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1", DIFF_STYLE[problem.difficulty])}>
            {DIFFICULTY_LABEL[problem.difficulty]}
          </span>
          {problem.external && (
            <span className="inline-flex items-center gap-1 text-[9px] text-subtle">
              <ExternalLink className="h-2.5 w-2.5" />
              External
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{problem.summary}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block rounded-md bg-elevated px-2 py-1 text-[10px] font-medium text-subtle">
            {topicLabel(problem.topic)}
          </span>
          {problem.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-block rounded-md bg-line/30 px-2 py-1 text-[9px] text-subtle">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition-all group-hover:translate-x-1 group-hover:text-run" />
    </Link>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
        active ? "bg-run/15 text-fg ring-1 ring-run/40 shadow-sm" : "bg-elevated text-muted hover:bg-line/60",
      )}
    >
      {children}
    </motion.button>
  );
}

function readNodeParam(params: URLSearchParams): string | "all" {
  const node = params.get("node");
  return node && NODES_BY_ID.has(node) ? node : "all";
}

function readDifficultyParam(params: URLSearchParams): Difficulty | "all" {
  const difficulty = params.get("difficulty");
  return DIFFICULTY_ORDER.includes(difficulty as Difficulty) ? (difficulty as Difficulty) : "all";
}

function readStatusParam(params: URLSearchParams): StatusFilter {
  const status = params.get("status");
  return status === "solved" || status === "unsolved" ? status : "all";
}

function problemsForNode(node: RoadmapNode): Problem[] {
  if (!node.topics?.length) return [];
  return PROBLEMS.filter((problem) => node.topics!.includes(problem.topic));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}