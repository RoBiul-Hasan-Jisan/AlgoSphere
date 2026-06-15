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

/** Categorise a lesson by what it contains, for its branch icon. */
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

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem("learn-view-mode", viewMode);
  }, [viewMode]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
      {/* Header with View Toggle */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <p className="eyebrow mb-3 inline-flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-run" />
            The handbook
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Your algorithms <span className="text-run">roadmap.</span>
          </h1>
          <p className="mt-4 text-lg text-muted">
            Follow the path module by module — read the idea, watch it run, and take
            notes. Each branch is a lesson; tick them off as you go.
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

        {/* View Toggle Button Group */}
        <div className="flex gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              viewMode === "list"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
            aria-label="List view"
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
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* Roadmap with View Toggle */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-14"
          >
            {CHAPTERS.map((chapter, i) => (
              <ModuleRow key={chapter.id} chapter={chapter} index={i} completed={completed} />
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

// Original List View Row Component
function ModuleRow({ chapter, index, completed }: { chapter: Chapter; index: number; completed: Set<string> }) {
  const Icon = ICONS[chapter.icon] ?? Compass;
  const total = chapter.lessons.length;
  const done = chapter.lessons.filter((l) => completed.has(lessonKey(chapter.id, l.id))).length;
  const pct = Math.round((done / total) * 100);
  const next = chapter.lessons.find((l) => !completed.has(lessonKey(chapter.id, l.id))) ?? chapter.lessons[0];
  const ctaLabel = done === 0 ? "Start module" : done === total ? "Review" : "Continue";
  const CtaIcon = done === 0 ? Play : done === total ? RotateCcw : ArrowRight;
  const flip = index % 2 === 1;

  return (
    <div className={cn("grid items-center gap-x-6 gap-y-5", flip ? "lg:grid-cols-[1fr_310px]" : "lg:grid-cols-[310px_1fr]")}>
      <div className={cn("relative", flip ? "lg:order-2" : "lg:order-1")}>
        <div className="card p-5">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-visited/40 bg-visited/10 px-2 py-0.5 text-[11px] font-semibold text-visited">
            <Icon className="h-3.5 w-3.5" />
            Module {index + 1}
          </span>
          <h2 className="font-display text-lg font-semibold tracking-tight">{chapter.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{chapter.blurb}</p>

          <div className="mt-4 flex items-center gap-4 text-xs text-subtle">
            <span className="flex items-center gap-1"><ListTree className="h-3.5 w-3.5" />{total} lessons</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />~{chapter.lessons.reduce((s, l) => s + l.estMinutes, 0)} min</span>
          </div>

          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-run transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-[11px] text-subtle">{done}/{total} complete</div>
          </div>

          <Link to={`/learn/${chapter.id}/${next.id}`} className={cn("mt-4 w-full", done === total ? "btn-ghost" : "btn-primary")}>
            <CtaIcon className={cn("h-4 w-4", done === 0 && "fill-current")} />
            {ctaLabel}
          </Link>
        </div>
        <span
          className={cn(
            "absolute top-1/2 hidden h-[2px] w-8 -translate-y-1/2 bg-line lg:block",
            flip ? "left-0 -translate-x-full" : "right-0 translate-x-full",
          )}
        />
      </div>

      <div className={cn("relative", flip ? "lg:order-1" : "lg:order-2")}>
        <span
          className={cn("absolute top-5 bottom-5 hidden w-[2px] bg-line lg:block", flip ? "right-2" : "left-2")}
          aria-hidden="true"
        />
        <ol className={cn("space-y-3", flip ? "lg:pr-12" : "lg:pl-12")}>
          {chapter.lessons.map((lesson) => {
            const isDone = completed.has(lessonKey(chapter.id, lesson.id));
            const kind = lessonKind(lesson);
            return (
              <li key={lesson.id} className="relative">
                <span
                  className={cn("absolute top-1/2 hidden h-[2px] w-10 -translate-y-1/2 bg-line lg:block", flip ? "right-2" : "left-2")}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "absolute top-1/2 z-10 hidden h-3 w-3 -translate-y-1/2 rounded-full ring-4 ring-base lg:block",
                    flip ? "right-2 translate-x-1/2" : "left-2 -translate-x-1/2",
                    isDone ? "bg-run" : "bg-elevated",
                  )}
                  aria-hidden="true"
                >
                  {isDone && <Check className="absolute inset-0 m-auto h-2 w-2 text-base" />}
                </span>

                <Link
                  to={`/learn/${chapter.id}/${lesson.id}`}
                  className={cn(
                    "card card-hover group flex items-center gap-3 p-3.5 lg:max-w-md",
                    flip ? "flex-row-reverse pl-4 text-right lg:ml-auto" : "pr-4",
                  )}
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevated", kind.tint)}>
                    {isDone ? <Check className="h-4 w-4 text-run" /> : <kind.Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-fg group-hover:text-run">{lesson.title}</span>
                    <span className="block truncate text-xs text-subtle">{kind.label} · {lesson.estMinutes} min</span>
                  </span>
                  {flip ? (
                    <ArrowLeft className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:-translate-x-1 group-hover:text-run" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-run" />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// New Grid View Card Component
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

  // Get first 3 lessons for preview
  const previewLessons = chapter.lessons.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <div className="card h-full flex flex-col p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Header */}
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

        {/* Title & Description */}
        <h3 className="font-display text-lg font-semibold tracking-tight mb-1 line-clamp-1">
          {chapter.title}
        </h3>
        <p className="text-sm text-muted line-clamp-2 mb-3">{chapter.blurb}</p>

        {/* Stats */}
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

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-subtle mb-0.5">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-run transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Lesson Previews */}
        <div className="mt-2 mb-3 space-y-1.5">
          {previewLessons.map((lesson) => {
            const isLessonDone = completed.has(lessonKey(chapter.id, lesson.id));
            const kind = lessonKind(lesson);
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

        {/* CTA Button */}
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