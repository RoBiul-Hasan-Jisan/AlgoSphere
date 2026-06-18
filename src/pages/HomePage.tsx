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
  Star,
  TrendingUp,
  Award,
  Clock,
  Users,
  Heart,
 
} from "lucide-react";
import { CHAPTERS, LESSON_COUNT } from "@/content";
import { PROBLEM_COUNT } from "@/lib/problems";
import { VISUALIZERS } from "@/pages/visualizers/registry";
import { VizThumb } from "@/pages/visualizers/VizThumb";
import { cn } from "@/lib/cn";

// Lazy load preview components
const SortBarsPreview = lazy(() => 
  import("@/components/LandingPreviews").then(m => ({ default: m.SortBarsPreview }))
);
const GridPreview = lazy(() => 
  import("@/components/LandingPreviews").then(m => ({ default: m.GridPreview }))
);
const ChallengePreview = lazy(() => 
  import("@/components/LandingPreviews").then(m => ({ default: m.ChallengePreview }))
);

// ========== Types ==========
interface Pillar {
  icon: React.ElementType;
  title: string;
  description: string;
  stat: string;
  color: string;
  gradient: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  benefits: string[];
  stats?: { value: string; label: string }[];
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

// ========== Constants ==========
const PILLARS: readonly Pillar[] = [
  { 
    icon: BookOpen, 
    title: "Learn", 
    description: "Structured lessons with clear explanations", 
    stat: `${LESSON_COUNT}+ lessons`,
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    icon: MonitorPlay, 
    title: "Visualize", 
    description: "Watch algorithms execute step by step", 
    stat: `${VISUALIZERS.length}+ visualizers`,
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    icon: Code2, 
    title: "Practice", 
    description: "Write and test code interactively", 
    stat: "Live playground",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    icon: FlaskConical, 
    title: "Challenge", 
    description: "Solve problems with hidden tests", 
    stat: `${PROBLEM_COUNT}+ problems`,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-500"
  },
  { 
    icon: NotebookPen, 
    title: "Notes", 
    description: "Save and sync your learning", 
    stat: "Cloud sync",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500"
  },
] as const;

const FEATURES: readonly Feature[] = [
  { 
    title: "See algorithms in motion", 
    description: "Every concept comes with an interactive visualizer. Watch data structures transform, step through operations, and test edge cases with your own inputs.", 
    icon: Layers, 
    benefits: [
      "Step-by-step execution control",
      "Custom input generation", 
      "Real-time variable tracking",
      "Pause, rewind, and replay"
    ],
    stats: [
      { value: "30+", label: "Visualizers" },
      { value: "100+", label: "Examples" }
    ]
  },
  { 
    title: "Trace every line of code", 
    description: "Watch how variables change as programs run. Perfect for understanding recursion, pointer manipulation, and complex state changes.", 
    icon: GitBranch, 
    benefits: [
      "Variable state visualization",
      "Call stack tracking", 
      "Memory allocation viewer",
      "Execution timeline"
    ],
    stats: [
      { value: "99%", label: "Accuracy" },
      { value: "Real-time", label: "Updates" }
    ]
  },
  { 
    title: "Practice with purpose", 
    description: "Test your understanding with coding challenges. Write, run, and debug code right in your browser with instant feedback.", 
    icon: Code2, 
    benefits: [
      "Hidden test cases",
      "Multiple solution approaches", 
      "Complexity analysis",
      "Detailed explanations"
    ],
    stats: [
      { value: "200+", label: "Problems" },
      { value: "Hard", label: "Difficulty levels" }
    ]
  },
] as const;

const FEATURED_IDS = ["sorting", "pathfinding", "trees", "graphs"] as const;

const STATS_ITEMS = [
  { value: CHAPTERS.length, label: "Chapters", icon: BookOpen },
  { value: LESSON_COUNT, label: "Lessons", icon: Clock },
  { value: PROBLEM_COUNT, label: "Problems", icon: TrendingUp },
  { value: VISUALIZERS.length, label: "Visualizers", icon: MonitorPlay },
] as const;

const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Software Engineer @ Google",
    content: "The visual approach finally made algorithms click for me. Being able to see each step of quicksort helped me understand it deeply.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Marcus Johnson",
    role: "CS Student",
    content: "This platform transformed how I learn. The interactive visualizers make complex concepts accessible and even fun to explore.",
    rating: 5,
    avatar: "MJ"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Professor of CS",
    content: "An excellent resource for teaching algorithms. My students grasp concepts much faster when they can visualize the execution.",
    rating: 5,
    avatar: "ER"
  }
];

// ========== UI Components ==========
const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
    {children}
  </div>
);

const Section = ({ children, className, id, background = "white" }: { 
  children: React.ReactNode; 
  className?: string; 
  id?: string;
  background?: "white" | "gray" | "gradient";
}) => {
  const bgStyles = {
    white: "bg-white dark:bg-gray-950",
    gray: "bg-gray-50 dark:bg-gray-900/50",
    gradient: "bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/30 dark:via-gray-950 dark:to-gray-900/30"
  };
  
  return (
    <section id={id} className={cn(bgStyles[background], "py-12 sm:py-16 md:py-20 lg:py-28", className)}>
      <Container>{children}</Container>
    </section>
  );
};

const Badge = ({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) => (
  <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs sm:text-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
    {Icon && <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" aria-hidden="true" />}
    <span className="text-gray-600 dark:text-gray-400">{children}</span>
  </div>
);

const GradientText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", className)}>
    {children}
  </span>
);

// ========== Hero Section ==========
const HeroSection = memo(() => (
  <section className="relative overflow-hidden">
    {/* Animated background blobs - hidden on mobile for performance */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl hidden sm:block" />
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl hidden sm:block" />
    </div>
    
    <Container className="py-12 sm:py-16 md:py-20 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Badge icon={Sparkles}>Interactive DSA learning platform</Badge>
        
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
          Visualize every{" "}
          <GradientText>algorithm</GradientText>
        </h1>
        
        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 px-4">
          Don't just read about data structures and algorithms — watch them run in real-time.
          Step through executions, experiment with inputs, and truly understand how they work.
        </p>
        
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/learn"
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 px-6 sm:px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-xl dark:from-white dark:to-gray-100 dark:text-gray-900 min-h-[48px]"
          >
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span>Start learning for free</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
          </Link>
          
          <Link
            to="/visualizers"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white/80 px-6 sm:px-8 py-3.5 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-900 min-h-[48px]"
          >
            <Play className="h-4 w-4 flex-shrink-0" />
            <span>Try a visualizer</span>
          </Link>
        </div>
        
        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 px-4">
          {[
            { icon: Zap, text: "Free forever" },
            { icon: Shield, text: "No signup required" },
            { icon: Globe, text: "Works offline" },
            { icon: Heart, text: "Open source" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
));

HeroSection.displayName = "HeroSection";

// ========== Stats Section ==========
const StatsSection = memo(() => (
  <Section background="gray" className="py-8 sm:py-12">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
      {STATS_ITEMS.map(({ value, label, icon: Icon }) => (
        <div key={label} className="group">
          <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 transition-all group-hover:scale-105 dark:text-white">
            {value}
          </div>
          <div className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
            {label}
          </div>
        </div>
      ))}
    </div>
  </Section>
));

StatsSection.displayName = "StatsSection";

// ========== Pillars Section ==========
const PillarsSection = memo(() => (
  <Section>
    <div className="mb-10 sm:mb-12 md:mb-16 text-center px-4">
      <Badge>A comprehensive approach</Badge>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
        Five ways to <GradientText>master</GradientText> DSA
      </h2>
      <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-400">
        Everything you need, designed to work together seamlessly
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 px-4">
      {PILLARS.map((pillar) => (
        <div
          key={pillar.title}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/50 p-4 sm:p-6 transition-all hover:border-gray-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/30"
        >
          <div className={cn("mb-3 sm:mb-4 inline-flex rounded-xl bg-gradient-to-br p-2.5 sm:p-3", pillar.gradient, "bg-opacity-10")}>
            <pillar.icon className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110", pillar.color)} />
          </div>
          <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {pillar.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {pillar.description}
          </p>
          <div className="mt-2 sm:mt-3 text-xs font-semibold text-gray-400">
            {pillar.stat}
          </div>
        </div>
      ))}
    </div>
  </Section>
));

PillarsSection.displayName = "PillarsSection";

// ========== Feature Card ==========
const FeatureCard = memo(({ feature, isReversed = false }: { feature: Feature; isReversed?: boolean }) => {
  const PreviewComponent = {
    "See algorithms in motion": SortBarsPreview,
    "Trace every line of code": GridPreview,
    "Practice with purpose": ChallengePreview
  }[feature.title];

  return (
    <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 px-4">
      <div className={cn("space-y-4 sm:space-y-6", isReversed && "lg:order-2")}>
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-2.5 sm:p-3 dark:from-blue-950/30 dark:to-purple-950/30">
          <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
        </div>
        
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {feature.title}
        </h2>
        
        <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          {feature.description}
        </p>
        
        {feature.stats && (
          <div className="flex gap-4 sm:gap-6 border-t border-gray-100 pt-4 sm:pt-6 dark:border-gray-800">
            {feature.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        <ul className="space-y-2.5 sm:space-y-3">
          {feature.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-green-500" />
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className={cn(
        "overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-lg transition-all hover:shadow-xl dark:border-gray-800 dark:from-gray-900/30 dark:to-gray-950 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]",
        isReversed && "lg:order-1"
      )}>
        <Suspense fallback={
          <div className="flex h-48 sm:h-64 lg:h-80 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          </div>
        }>
          {PreviewComponent && <PreviewComponent />}
        </Suspense>
      </div>
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

// ========== Testimonials Section ==========
const TestimonialsSection = memo(() => (
  <Section background="gray">
    <div className="mb-8 sm:mb-10 md:mb-12 text-center px-4">
      <Badge icon={Users}>Loved by learners worldwide</Badge>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
        Trusted by <GradientText>thousands</GradientText>
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4">
      {TESTIMONIALS.map((testimonial) => (
        <div
          key={testimonial.name}
          className="rounded-2xl bg-white p-5 sm:p-6 shadow-lg dark:bg-gray-900/50"
        >
          <div className="mb-3 sm:mb-4 flex gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">"{testimonial.content}"</p>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs sm:text-sm font-semibold text-white flex-shrink-0">
              {testimonial.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{testimonial.name}</div>
              <div className="text-xs sm:text-sm text-gray-500 truncate">{testimonial.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Section>
));

TestimonialsSection.displayName = "TestimonialsSection";

// ========== Visualizer Grid ==========
const VisualizerGrid = memo(() => {
  const vizById = useMemo(() => Object.fromEntries(VISUALIZERS.map((v) => [v.id, v])), []);
  const featured = useMemo(() => FEATURED_IDS.map((id) => vizById[id]).filter(Boolean), [vizById]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
      {featured.map((visualizer) => (
        <Link
          key={visualizer.id}
          to={visualizer.to ?? `/visualizers/${visualizer.id}`}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 transition-all hover:border-gray-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700"
        >
          <div className="mb-3 sm:mb-4 flex h-24 sm:h-28 md:h-32 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <VizThumb id={visualizer.id} />
          </div>
          <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {visualizer.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
            {visualizer.blurb}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center text-sm font-medium text-blue-600 transition-all group-hover:gap-1 dark:text-blue-400">
            <span>Explore</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
});

VisualizerGrid.displayName = "VisualizerGrid";

// ========== CTA Section ==========
const CTASection = memo(() => (
  <Section background="gradient" className="border-b">
    <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-14 md:py-16 text-center shadow-2xl dark:from-gray-950 dark:to-gray-900 mx-4">
      <Badge icon={Award}>Start your journey today</Badge>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
        Ready to <GradientText>visualize</GradientText> your learning?
      </h2>
      <p className="mx-auto mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-gray-300">
        Join thousands of developers mastering algorithms the visual way
      </p>
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Link
          to="/learn"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-white px-6 sm:px-8 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-xl min-h-[48px]"
        >
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span>Get started for free</span>
        </Link>
        <Link
          to="/problems"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border-2 border-gray-600 bg-transparent px-6 sm:px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white/10 min-h-[48px]"
        >
          <FlaskConical className="h-4 w-4 flex-shrink-0" />
          <span>Try a challenge</span>
        </Link>
      </div>
    </div>
  </Section>
));

CTASection.displayName = "CTASection";

// ========== Footer ==========
const Footer = memo(() => (
  <footer className="border-t border-gray-100 bg-white py-8 sm:py-10 md:py-12 dark:border-gray-800 dark:bg-gray-950">
    <Container>
      <div className="text-center px-4">
        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Algo<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-light text-transparent">Sphere</span>
        </p>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
          The interactive way to learn algorithms
        </p>
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-x-8 sm:gap-y-3 text-xs sm:text-sm text-gray-500">
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
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} AlgoSphere. Made with ❤️ for developers worldwide.
          </p>
        </div>
      </div>
    </Container>
  </footer>
));

Footer.displayName = "Footer";

// ========== Main Component ==========
export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <PillarsSection />
      
      {FEATURES.map((feature, index) => (
        <Section key={feature.title} className="py-12 sm:py-16 md:py-20 lg:py-28">
          <FeatureCard feature={feature} isReversed={index === 1} />
        </Section>
      ))}
      
      <TestimonialsSection />
      
      <Section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="mb-8 sm:mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end px-4">
          <div>
            <Badge>Start exploring right away</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Featured <GradientText>visualizers</GradientText>
            </h2>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              No setup required — just click and learn
            </p>
          </div>
          <Link
            to="/visualizers"
            className="inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white whitespace-nowrap"
          >
            <span>View all visualizers</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        </div>
        <VisualizerGrid />
      </Section>
      
      <CTASection />
      <Footer />
    </div>
  );
}