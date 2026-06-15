import { lazy, Suspense, useMemo, memo } from "react";
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
  Layers,
  GitBranch,
  Zap,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";
import { CHAPTERS, LESSON_COUNT } from "@/content";
import { PROBLEM_COUNT } from "@/lib/problems";
import { VISUALIZERS } from "@/pages/visualizers/registry";
import { VizThumb } from "@/pages/visualizers/VizThumb";
import { cn } from "@/lib/cn";

// Lazy load preview components for better initial load performance
const SortBarsPreview = lazy(() => import("@/components/LandingPreviews").then(m => ({ default: m.SortBarsPreview })));
const GridPreview = lazy(() => import("@/components/LandingPreviews").then(m => ({ default: m.GridPreview })));
const ChallengePreview = lazy(() => import("@/components/LandingPreviews").then(m => ({ default: m.ChallengePreview })));

// Type definitions
interface Pillar {
  icon: React.ElementType;
  title: string;
  description: string;
  stat: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  benefits?: string[];
}

// Constants with proper typing
const PILLARS: readonly Pillar[] = [
  { icon: BookOpen, title: "Learn", description: "Structured lessons with clear explanations", stat: `${LESSON_COUNT} lessons` },
  { icon: MonitorPlay, title: "Visualize", description: "Watch algorithms execute step by step", stat: `${VISUALIZERS.length} visualizers` },
  { icon: Code2, title: "Practice", description: "Write and test code interactively", stat: "Live playground" },
  { icon: FlaskConical, title: "Challenge", description: "Solve problems with hidden tests", stat: `${PROBLEM_COUNT} problems` },
  { icon: NotebookPen, title: "Notes", description: "Save and sync your learning", stat: "Cloud sync" },
] as const;

const FEATURES: readonly Feature[] = [
  { title: "See algorithms in motion", description: "Every concept comes with an interactive visualizer. Watch data structures transform, step through operations, and test edge cases with your own inputs.", icon: Layers, benefits: ["Step-by-step execution control", "Custom input generation", "Real-time variable tracking", "Pause, rewind, and replay"] },
  { title: "Trace every line of code", description: "Watch how variables change as programs run. Perfect for understanding recursion, pointer manipulation, and complex state changes.", icon: GitBranch, benefits: ["Variable state visualization", "Call stack tracking", "Memory allocation viewer"] },
  { title: "Practice with purpose", description: "Test your understanding with coding challenges. Write, run, and debug code right in your browser with instant feedback.", icon: Code2, benefits: ["Hidden test cases", "Multiple solution approaches", "Complexity analysis", "Detailed explanations"] },
] as const;

const FEATURED_IDS = ["sorting", "pathfinding", "trees", "graphs"] as const;
const STATS_ITEMS = [
  { value: CHAPTERS.length, label: "Chapters" },
  { value: LESSON_COUNT, label: "Lessons" },
  { value: PROBLEM_COUNT, label: "Problems" },
  { value: VISUALIZERS.length, label: "Visualizers" },
] as const;

// Reusable component for section wrapper
const Section = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={cn("border-t border-gray-100 py-24 dark:border-gray-800", className)}>
    <div className="mx-auto max-w-6xl px-5 sm:px-6">{children}</div>
  </section>
);

// Hero Section Component
const HeroSection = memo(() => (
  <section className="relative">
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-800 dark:bg-gray-950">
          <Sparkles className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <span className="text-gray-600 dark:text-gray-400">Interactive DSA learning</span>
        </div>
        
        <h1 className="font-serif text-5xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
          Visualize every <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">algorithm</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Don't just read about data structures and algorithms — watch them run. 
          Step through real executions, experiment with inputs, and truly understand.
        </p>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/learn"
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg dark:from-white dark:to-gray-100 dark:text-gray-900"
          >
            <BookOpen className="h-4 w-4" />
            Start learning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            to="/visualizers"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            <Play className="h-4 w-4" />
            Try a visualizer
          </Link>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500">
          {[
            { icon: Zap, text: "Free forever" },
            { icon: Shield, text: "No signup" },
            { icon: Globe, text: "Works offline" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
));

HeroSection.displayName = "HeroSection";

// Stats Section Component
const StatsSection = memo(() => (
  <section className="border-y border-gray-100 bg-gradient-to-b from-gray-50/50 to-transparent dark:border-gray-800 dark:from-gray-900/30">
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
        {STATS_ITEMS.map(({ value, label }) => (
          <div key={label} className="group">
            <div className="text-4xl font-light text-gray-900 transition-all group-hover:scale-105 dark:text-white">
              {value}
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

StatsSection.displayName = "StatsSection";

// Feature Card Component
const FeatureCard = memo(({ feature, isReversed = false }: { feature: Feature; isReversed?: boolean }) => {
  const PreviewComponent = {
    "See algorithms in motion": SortBarsPreview,
    "Trace every line of code": GridPreview,
    "Practice with purpose": ChallengePreview
  }[feature.title];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className={cn("space-y-6", isReversed && "lg:order-2")}>
        <div className="inline-flex rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-3 dark:from-blue-950/30 dark:to-purple-950/30">
          <feature.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {feature.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {feature.description}
        </p>
        {feature.benefits && (
          <ul className="space-y-3">
            {feature.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={cn("overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 shadow-lg transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50", isReversed && "lg:order-1")}>
        <Suspense fallback={<div className="flex h-64 items-center justify-center">Loading preview...</div>}>
          {PreviewComponent && <PreviewComponent />}
        </Suspense>
      </div>
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Visualizer Grid Component
const VisualizerGrid = memo(() => {
  const vizById = useMemo(() => Object.fromEntries(VISUALIZERS.map((v) => [v.id, v])), []);
  const featured = useMemo(() => FEATURED_IDS.map((id) => vizById[id]).filter(Boolean), [vizById]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featured.map((visualizer) => (
        <Link
          key={visualizer.id}
          to={visualizer.to ?? `/visualizers/${visualizer.id}`}
          className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700"
        >
          <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <VizThumb id={visualizer.id} />
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
            {visualizer.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {visualizer.blurb}
          </p>
          <div className="mt-4 flex items-center text-xs font-medium text-gray-400 transition-all group-hover:text-gray-600 dark:group-hover:text-gray-300">
            Explore <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
});

VisualizerGrid.displayName = "VisualizerGrid";

// Footer Component
const Footer = memo(() => (
  <footer className="border-t border-gray-100 bg-gray-50/30 py-12 dark:border-gray-800 dark:bg-gray-900/20">
    <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
      <p className="text-lg font-medium text-gray-900 dark:text-white">
        Algo<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-light text-transparent">Sphere</span>
      </p>
      <p className="mt-2 text-sm text-gray-500">
        The interactive way to learn algorithms
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
        {["Learn", "Visualizers", "Playground", "Problems", "Notes", "Feedback"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-300"
          >
            {item}
          </Link>
        ))}
      </div>
      <p className="mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} AlgoSphere. All rights reserved.
      </p>
    </div>
  </footer>
));

Footer.displayName = "Footer";

// Main HomePage Component
export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection />
      <StatsSection />
      
      <Section>
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Five ways to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">master</span> DSA
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
            Everything you need, designed to work together seamlessly
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-xl border border-gray-100 bg-white/50 p-5 transition-all hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/30"
            >
              <pillar.icon className="mb-3 h-5 w-5 text-gray-500 transition-transform group-hover:scale-110" />
              <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="text-sm text-gray-500">
                {pillar.description}
              </p>
              <div className="mt-2 text-xs font-medium text-gray-400">
                {pillar.stat}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {FEATURES.map((feature, index) => (
        <Section key={feature.title}>
          <FeatureCard feature={feature} isReversed={index === 1} />
        </Section>
      ))}

      <Section>
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-gray-900 dark:text-white">
              Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">visualizers</span>
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Start exploring right away — no setup required
            </p>
          </div>
          <Link
            to="/visualizers"
            className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            View all visualizers
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <VisualizerGrid />
      </Section>

      <Section className="border-b">
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white px-8 py-16 text-center shadow-lg dark:from-gray-900/50 dark:to-gray-950 sm:px-12">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-gray-900 dark:text-white">
            Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">visualize</span> your learning?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
            Join thousands of developers mastering algorithms the visual way
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg dark:from-white dark:to-gray-100 dark:text-gray-900"
            >
              <BookOpen className="h-4 w-4" />
              Get started for free
            </Link>
            <Link
              to="/problems"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300"
            >
              <FlaskConical className="h-4 w-4" />
              Try a challenge
            </Link>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}