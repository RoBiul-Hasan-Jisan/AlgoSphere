import { lazy, Suspense, useMemo, memo, useState } from "react";
import logo from "../../public/og-image.png";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
  MonitorPlay,
  NotebookPen,
  Play,
  Sparkles,
  CheckCircle2,
  GitBranch,
  Layers,
  ChevronRight,
  
  Github,
  Twitter,
  Youtube,
  Heart,
} from "lucide-react";

import { CHAPTERS, LESSON_COUNT } from "@/content";
import { PROBLEM_COUNT } from "@/lib/problems";
import { VISUALIZERS } from "@/pages/visualizers/registry";
import { VizThumb } from "@/pages/visualizers/VizThumb";
import { cn } from "@/lib/cn";

// ========== Types & Interfaces ==========
interface StatItem {
  value: number;
  label: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  benefits: readonly string[];
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: "transparent" | "subtle" | "dark";
  id?: string;
}

// ========== Lazy Loaded Components ==========
const SortBarsPreview = lazy(() =>
  import("@/components/LandingPreviews").then((m) => ({ default: m.SortBarsPreview }))
);
const GridPreview = lazy(() =>
  import("@/components/LandingPreviews").then((m) => ({ default: m.GridPreview }))
);
const ChallengePreview = lazy(() =>
  import("@/components/LandingPreviews").then((m) => ({ default: m.ChallengePreview }))
);

// ========== Constants ==========
const STATS_ITEMS: readonly StatItem[] = [
  { value: CHAPTERS.length, label: "Chapters" },
  { value: LESSON_COUNT, label: "Lessons" },
  { value: PROBLEM_COUNT, label: "Problems" },
  { value: VISUALIZERS.length, label: "Visualizers" },
];

const FEATURES: readonly Feature[] = [
  {
    id: "visualize",
    title: "Algorithms in Motion",
    description:
      "Watch data structures transform in real-time. Control execution speed, test edge cases, and truly understand the mechanics.",
    icon: Layers,
    component: SortBarsPreview,
    benefits: ["Step-by-step execution", "Custom inputs", "Live variables"],
  },
  {
    id: "trace",
    title: "Trace Execution",
    description:
      "Follow the call stack and memory allocation exactly as the machine processes it. Perfect for mastering recursion and pointers.",
    icon: GitBranch,
    component: GridPreview,
    benefits: ["Call stack tracking", "Memory viewer", "Timeline scrub"],
  },
  {
    id: "practice",
    title: "Active Practice",
    description:
      "Transition from watching to writing. Solve competitive programming challenges with instant complexity analysis.",
    icon: Code2,
    component: ChallengePreview,
    benefits: ["Hidden tests", "Time/Space analysis", "Multiple solutions"],
  },
];

const FEATURED_IDS = ["sorting", "pathfinding", "trees", "graphs"] as const;

// ========== Shared UI Components ==========
const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
);

const Section = memo(({ children, className, bg = "transparent", id }: SectionProps) => {
  const backgrounds = {
    transparent: "bg-white dark:bg-gray-950",
    subtle: "bg-gray-50/50 dark:bg-gray-900/20",
    dark: "bg-gray-900 dark:bg-black border-y border-gray-800",
  };
  return (
    <section id={id} className={cn("py-16 md:py-24", backgrounds[bg], className)}>
      <Container>{children}</Container>
    </section>
  );
});
Section.displayName = "Section";

const LoadingSpinner = memo(() => (
  <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
      <span className="text-xs text-gray-400">Loading visualizer...</span>
    </div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// ========== Sections ==========

const HeroSection = memo(() => (
  <Section className="relative overflow-hidden pt-24 md:pt-32">
    <div
      className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20"
      aria-hidden="true"
    />

    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center relative z-10">
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/50 px-3 py-1 text-xs font-medium text-gray-600 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400 shadow-sm">
          <Sparkles className="h-3 w-3 text-blue-500" aria-hidden="true" />
          <span>The modern standard for DSA mastery</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-6xl mb-6">
          Stop memorizing. <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Start visualizing.
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
          A high-performance learning environment that pairs structured curriculum with real-time algorithm
          visualization and a powerful in-browser code editor.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/learn"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-md dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
          >
            Start Learning
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/visualizers"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
          >
            <Play className="h-4 w-4 text-gray-500" aria-hidden="true" />
            Explore Visualizers
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800 pt-8 max-w-xl">
          {STATS_ITEMS.map((stat) => (
            <div key={stat.label} className="px-4 first:pl-0">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}+</div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Graphic Right Side - Algorithm Visualizer */}
      <div className="hidden lg:block relative w-full h-[450px] rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-background via-background to-blue-500/5 overflow-hidden shadow-xl">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Graph Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 450"
        >
          <line x1="120" y1="100" x2="250" y2="70" stroke="currentColor" className="text-blue-500/20" />
          <line x1="250" y1="70" x2="380" y2="140" stroke="currentColor" className="text-blue-500/20" />
          <line x1="120" y1="100" x2="180" y2="240" stroke="currentColor" className="text-blue-500/20" />
          <line x1="180" y1="240" x2="420" y2="260" stroke="currentColor" className="text-blue-500/20" />
          <line x1="380" y1="140" x2="420" y2="260" stroke="currentColor" className="text-blue-500/20" />
        </svg>

        {/* Graph Nodes */}
        {[
          { x: "20%", y: "22%" },
          { x: "42%", y: "15%" },
          { x: "65%", y: "30%" },
          { x: "30%", y: "55%" },
          { x: "72%", y: "60%" },
        ].map((node, i) => (
          <div
            key={i}
            className="absolute h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse"
            style={{
              left: node.x,
              top: node.y,
            }}
          />
        ))}

        {/* Sorting Visualizer */}
        <div className="absolute bottom-8 left-8 flex items-end gap-1">
          {[40, 80, 50, 120, 70, 150, 90, 130].map((h, i) => (
            <div
              key={i}
              className="w-4 rounded-t bg-gradient-to-t from-blue-600 to-cyan-400"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Code Window */}
        <div className="absolute right-6 top-6 w-64 rounded-xl border border-blue-500/20 bg-black/80 backdrop-blur">
          <div className="p-4 text-xs font-mono text-green-400">
            <div>while (low ≤ high)</div>
            <div>{"{"}</div>
            <div className="ml-4">mid = (low+high)/2;</div>
            <div className="ml-4">if(arr[mid]==x)</div>
            <div className="ml-8">return mid;</div>
            <div>{"}"}</div>
          </div>
        </div>

        {/* Center Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full" />
            <div className="relative h-28 w-28 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <span className="font-bold text-3xl text-blue-500">
                DSA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
));
HeroSection.displayName = "HeroSection";

const BentoPillarsSection = memo(() => (
  <Section bg="subtle">
    <div className="mb-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        A Complete Ecosystem
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Everything required to master technical interviews and systems logic.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Large Block 1 */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <BookOpen className="h-6 w-6 text-blue-500 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Structured Curriculum</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
          Carefully designed paths from basic arrays to advanced dynamic programming. Learn concepts in the right
          order.
        </p>
      </div>

      {/* Large Block 2 */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <MonitorPlay className="h-6 w-6 text-purple-500 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Interactive Visualizers</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
          Every data structure comes alive. Pause, rewind, and inject custom inputs to see exactly how algorithms break
          down data.
        </p>
      </div>

      {/* Small Blocks */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <Code2 className="h-5 w-5 text-green-500 mb-3" aria-hidden="true" />
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Live Coding</h3>
        <p className="text-xs text-gray-500">In-browser IDE with instant feedback.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <FlaskConical className="h-5 w-5 text-orange-500 mb-3" aria-hidden="true" />
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Testing Engine</h3>
        <p className="text-xs text-gray-500">Hidden test cases and complexity analysis.</p>
      </div>

      <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
        <div>
          <NotebookPen className="h-5 w-5 text-indigo-500 mb-3" aria-hidden="true" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cloud Sync & Notes</h3>
          <p className="text-xs text-gray-500">Your progress, code snapshots, and annotations sync everywhere.</p>
        </div>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Coming soon</span>
      </div>
    </div>
  </Section>
));
BentoPillarsSection.displayName = "BentoPillarsSection";

const InteractiveFeatures = memo(() => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const ActiveComponent = FEATURES[activeTab].component;

  return (
    <Section id="features">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Learn by seeing and doing</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Interactive tools designed to build deep intuition, not just rote memorization.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800">
          
          {/* Navigation/Text Area with Accessibility */}
          <div
            className="lg:col-span-4 flex flex-col bg-gray-50/50 dark:bg-gray-900/20"
            role="tablist"
            aria-orientation="vertical"
          >
            {FEATURES.map((feature, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={feature.id}
                  id={`tab-${feature.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${feature.id}`}
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    "text-left p-6 transition-all focus:outline-none flex flex-col gap-2 relative group",
                    isSelected
                      ? "bg-white dark:bg-gray-950 shadow-[inset_2px_0_0_0_#3b82f6]"
                      : "hover:bg-gray-100/50 dark:hover:bg-gray-900/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <feature.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isSelected
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      )}
                      aria-hidden="true"
                    />
                    <h3
                      className={cn(
                        "font-semibold transition-colors",
                        isSelected
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"
                      )}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  {isSelected && (
                    <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <CheckCircle2 className="h-3 w-3 text-blue-500 flex-shrink-0" aria-hidden="true" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview Area */}
          <div
            className="lg:col-span-8 p-6 lg:p-8 bg-gray-50 dark:bg-[#0a0a0a] min-h-[400px] flex items-center justify-center relative"
            id={`panel-${FEATURES[activeTab].id}`}
            role="tabpanel"
            aria-labelledby={`tab-${FEATURES[activeTab].id}`}
          >
            <div className="w-full h-full max-h-[500px] rounded-xl border border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
              <Suspense fallback={<LoadingSpinner />}>
                <ActiveComponent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
});
InteractiveFeatures.displayName = "InteractiveFeatures";

const VisualizerGrid = memo(() => {
  const vizById = useMemo(() => Object.fromEntries(VISUALIZERS.map((v) => [v.id, v])), []);
  const featured = useMemo(() => FEATURED_IDS.map((id) => vizById[id]).filter(Boolean), [vizById]);

  return (
    <Section bg="subtle" id="visualizers">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Visualizers</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Jump straight into our most popular modules.</p>
        </div>
        <Link
          to="/visualizers"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((visualizer) => (
          <Link
            key={visualizer.id}
            to={visualizer.to ?? `/visualizers/${visualizer.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
          >
            <div className="h-32 border-b border-gray-100 bg-gray-50 flex items-center justify-center dark:border-gray-800 dark:bg-gray-900/50">
              <VizThumb id={visualizer.id} />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{visualizer.title}</h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{visualizer.blurb}</p>
              </div>
              <div className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
});
VisualizerGrid.displayName = "VisualizerGrid";

const Footer = memo(() => (
  <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-900 dark:bg-[#050505]">
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
        <img
    src={logo}
    alt="AlgoSphere Logo"
    className="h-7 w-7 rounded-md object-cover"
  />
  AlgoSphere
</div>

        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link to="/learn" className="hover:text-gray-900 dark:hover:text-white transition-colors">Learn</Link>
          <Link to="/visualizers" className="hover:text-gray-900 dark:hover:text-white transition-colors">Visualizers</Link>
          <Link to="/problems" className="hover:text-gray-900 dark:hover:text-white transition-colors">Problems</Link>
          <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4 text-gray-400">
          <a href="https://github.com/RoBiul-Hasan-Jisan" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} AlgoSphere. Made with <Heart className="inline h-3 w-3 text-red-400" aria-label="love" /> for developers worldwide.
      </div>
    </Container>
  </footer>
));
Footer.displayName = "Footer";

// ========== Main Page Component ==========
export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/50 dark:selection:text-blue-100">
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <BentoPillarsSection />
        <InteractiveFeatures />
        <VisualizerGrid />
      </main>
      <Footer />
    </div>
  );
}