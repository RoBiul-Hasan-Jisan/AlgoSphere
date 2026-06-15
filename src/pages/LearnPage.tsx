import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, BarChart3, Binary, BookOpen, CalendarRange, Check, Clock, Compass, Dices, Gauge, GitBranch,
  Grid3x3, Hash, Layers, ListTree, MonitorPlay, Network, Play, Repeat, RotateCcw, Rows3,
  Search, Sigma, Spline, Terminal, Triangle, Type, LayoutList, LayoutGrid, type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAPTERS, LESSON_COUNT, TOTAL_MINUTES } from "@/content";
import type { Chapter, Lesson } from "@/content/types";
import { lessonKey, useCompleted } from "@/lib/progress";
import { cn } from "@/lib/cn";

const ICONS: Record<string, LucideIcon> = {
  Compass, Rows3, Search, BarChart3, Repeat, Spline, Layers, Hash, GitBranch, ListTree, Network, Terminal, Triangle, Grid3x3, Binary, Sigma, Gauge, CalendarRange, Type, Dices,
};

function lessonKind(lesson: Lesson): { Icon: LucideIcon; tint: string; label: string } {
  if (lesson.blocks.some((b) => b.kind === "viz"))
    return { Icon: MonitorPlay, tint: "text-compare", label: "Interactive" };
  if (lesson.blocks.some((b) => b.kind === "derivation"))
    return { Icon: Sigma, tint: "text-pivot", label: "Derivation" };
  return { Icon: BookOpen, tint: "text-muted", label: "Reading" };
}

export function LearnPage() {
  const completed = useCompleted();
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("learn-view-mode");
    return (saved === "grid" || saved === "list") ? saved : "list";
  });
  
  const doneCount = completed.size;
  const pct = LESSON_COUNT > 0 ? Math.round((doneCount / LESSON_COUNT) * 100) : 0;

  useEffect(() => {
    localStorage.setItem("learn-view-mode", viewMode);
  }, [viewMode]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <p className="eyebrow mb-3 inline-flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-run" />
            The handbook
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Level up your algorithm <span className="text-run">knowledge.</span>
          </h1>
          <p className="mt-4 text-lg text-muted">
            Complete lessons, explore interactive visualizations, save your insights, and mark your progress along the way.
          </p>
          <div className="mt-5 flex items-center gap-5 text-sm text-subtle">
            <span>{CHAPTERS.length} modules</span>
            <span className="h-3 w-px bg-line" />
            <span>{LESSON_COUNT} lessons</span>
            <span className="h-3 w-px bg-line" />
            <span>~{TOTAL_MINUTES} min</span>
          </div>
          {doneCount > 0 && (
            <div className="mt-6 max-w-md">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
                <span>Overall progress</span>
                <span className="font-mono text-fg">{doneCount}/{LESSON_COUNT} · {pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-run transition-[width] duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              viewMode === "list"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <LayoutList className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              viewMode === "grid"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {CHAPTERS.map((chapter, i) => (
              <ModuleRowImproved key={chapter.id} chapter={chapter} index={i} completed={completed} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {CHAPTERS.map((chapter, i) => (
              <ModuleGridCard key={chapter.id} chapter={chapter} index={i} completed={completed} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// IMPROVED LIST VIEW - Cleaner and more modern
function ModuleRowImproved({ chapter, index, completed }: { chapter: Chapter; index: number; completed: Set<string> }) {
  const Icon = ICONS[chapter.icon] ?? Compass;
  const total = chapter.lessons.length;
  const done = chapter.lessons.filter((l) => completed.has(lessonKey(chapter.id, l.id))).length;
  const pct = Math.round((done / total) * 100);
  const next = chapter.lessons.find((l) => !completed.has(lessonKey(chapter.id, l.id))) ?? chapter.lessons[0];
  const isComplete = done === total;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      {/* Module Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
            isComplete ? "bg-green-500/20 ring-2 ring-green-500/50" : "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          )}>
            <Icon className={cn("h-6 w-6", isComplete ? "text-green-500" : "text-purple-400")} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Module {index + 1}
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-0.5">{chapter.title}</h2>
            </div>
            
            <Link
              to={`/learn/${chapter.id}/${next.id}`}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{
                background: isComplete ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #8b5cf6, #ec4899)",
                color: "white"
              }}
            >
              {isComplete ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isComplete ? "Review Module" : done === 0 ? "Start Module" : `Continue (${done}/${total})`}
            </Link>
          </div>
          
          <p className="text-muted mt-2 max-w-2xl">{chapter.blurb}</p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-subtle">
            <span className="flex items-center gap-1">
              <ListTree className="h-3.5 w-3.5" />
              {total} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              ~{chapter.lessons.reduce((s, l) => s + l.estMinutes, 0)} min
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              {done} completed
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 max-w-md">
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid within Module */}
      <div className="ml-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {chapter.lessons.map((lesson, lessonIdx) => {
          const isDone = completed.has(lessonKey(chapter.id, lesson.id));
          const kind = lessonKind(lesson);
          
          return (
            <Link
              key={lesson.id}
              to={`/learn/${chapter.id}/${lesson.id}`}
              className={cn(
                "group/lesson relative rounded-lg border transition-all duration-200 hover:shadow-md",
                isDone 
                  ? "border-green-500/30 bg-green-500/5 hover:border-green-500/50" 
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              )}
            >
              <div className="flex items-start gap-3 p-3">
                {/* Lesson Number */}
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                  isDone ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/60"
                )}>
                  {lessonIdx + 1}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      "font-medium text-sm truncate",
                      isDone && "text-green-400 line-through decoration-green-400/50"
                    )}>
                      {lesson.title}
                    </h3>
                    {isDone && <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <kind.Icon className={cn("h-3 w-3", kind.tint)} />
                    <span className="text-xs text-subtle">{kind.label}</span>
                    <span className="text-xs text-subtle">•</span>
                    <span className="text-xs text-subtle">{lesson.estMinutes} min</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Divider */}
      {index < CHAPTERS.length - 1 && (
        <div className="relative my-8 ml-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-base px-3 text-xs text-subtle">Continue learning ↓</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Grid View (same as before)
function ModuleGridCard({ chapter, index, completed }: { chapter: Chapter; index: number; completed: Set<string> }) {
  const Icon = ICONS[chapter.icon] ?? Compass;
  const total = chapter.lessons.length;
  const done = chapter.lessons.filter((l) => completed.has(lessonKey(chapter.id, l.id))).length;
  const pct = Math.round((done / total) * 100);
  const next = chapter.lessons.find((l) => !completed.has(lessonKey(chapter.id, l.id))) ?? chapter.lessons[0];
  const isComplete = done === total;
  const isStarted = done > 0;
  const ctaLabel = !isStarted ? "Start" : isComplete ? "Review" : `Continue (${done}/${total})`;
  const CtaIcon = !isStarted ? Play : isComplete ? RotateCcw : ArrowRight;
  const previewLessons = chapter.lessons.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <div className="card h-full flex flex-col p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-visited/10 p-2">
              <Icon className="h-4 w-4 text-visited" />
            </div>
            <span className="text-xs font-medium text-subtle">Module {index + 1}</span>
          </div>
          {isComplete && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
              <Check className="h-2.5 w-2.5" />
              Complete
            </span>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold tracking-tight mb-1 line-clamp-1">
          {chapter.title}
        </h3>
        <p className="text-sm text-muted line-clamp-2 mb-3">{chapter.blurb}</p>

        <div className="flex items-center gap-3 text-xs text-subtle mb-3">
          <span className="flex items-center gap-1">
            <ListTree className="h-3 w-3" />
            {total} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ~{chapter.lessons.reduce((s, l) => s + l.estMinutes, 0)} min
          </span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-subtle mb-0.5">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-run transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-2 mb-3 space-y-1.5">
          {previewLessons.map((lesson) => {
            const isLessonDone = completed.has(lessonKey(chapter.id, lesson.id));
            return (
              <div key={lesson.id} className="flex items-center gap-2 text-xs">
                {isLessonDone ? (
                  <Check className="h-2.5 w-2.5 text-run shrink-0" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-line shrink-0" />
                )}
                <span className="text-muted truncate">{lesson.title}</span>
                {total > 3 && lesson.id === previewLessons[2].id && (
                  <span className="text-[10px] text-subtle ml-auto">+{total - 3} more</span>
                )}
              </div>
            );
          })}
        </div>

        <Link
          to={`/learn/${chapter.id}/${next.id}`}
          className={cn(
            "mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            !isStarted || isComplete
              ? "btn-primary"
              : "border border-run/30 bg-run/10 text-run hover:bg-run/20"
          )}
        >
          <CtaIcon className="h-3.5 w-3.5" />
          {ctaLabel}
        </Link>
      </div>
    </motion.div>
  );
}