import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Play, Loader2, RotateCcw, CheckCircle2, XCircle, Lightbulb,
  Eye, BookOpen, Send, Trophy, Sparkles, Clock, Zap, BarChart3,
  Terminal, ChevronDown, ChevronUp, AlertCircle, FileCode, Brain,
  Target, Award, Flame, Star} from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownLite } from "@/components/lesson/MarkdownLite";
import { usePyodide } from "@/lib/usePyodide";
import { getProblem, DIFFICULTY_LABEL, topicLabel } from "@/lib/problems";
import type { Difficulty, Problem } from "@/lib/problems";
import { runProblem, type ProblemRunResult } from "@/lib/problems/runner";
import { markSolved, useSolved } from "@/lib/problems/solved";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

const DIFF_STYLE: Record<Difficulty, { bg: string; text: string; icon: ReactNode }> = {
  easy: { 
    bg: "bg-run/10", 
    text: "text-run", 
    icon: <Zap className="h-3 w-3" /> 
  },
  medium: { 
    bg: "bg-pivot/10", 
    text: "text-pivot", 
    icon: <Target className="h-3 w-3" /> 
  },
  hard: { 
    bg: "bg-swap/10", 
    text: "text-swap", 
    icon: <Flame className="h-3 w-3" /> 
  },
};

type SolutionLanguage = "python" | "cpp";

function pyRepr(v: unknown): string {
  if (v === null) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "string") return `'${v}'`;
  if (Array.isArray(v)) return `[${v.map(pyRepr).join(", ")}]`;
  return String(v);
}

function callString(funcName: string, input: unknown[]): string {
  return `${funcName}(${input.map(pyRepr).join(", ")})`;
}

// Stats Card Component
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
      <div className={cn("rounded-lg p-2", color)}>{icon}</div>
      <div>
        <p className="text-xs text-subtle">{label}</p>
        <p className="text-lg font-semibold text-fg">{value}</p>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-xs text-subtle">{label}</div>}
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={cn(
            "h-full rounded-full",
            percentage === 100 ? "bg-run" : percentage >= 60 ? "bg-pivot" : "bg-swap"
          )}
        />
      </div>
    </div>
  );
}

export function ProblemPage() {
  const { id = "" } = useParams();
  const problem = getProblem(id);
  const solved = useSolved();
  const { status, run } = usePyodide();

  const [solutionLanguage, setSolutionLanguage] = useState<SolutionLanguage>("python");
  const [code, setCode] = useState(problem?.starter ?? "");
  const [result, setResult] = useState<ProblemRunResult | null>(null);
  const [ranMode, setRanMode] = useState<"examples" | "all">("examples");
  const [running, setRunning] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [executionTimes, setExecutionTimes] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const exampleCount = problem?.examples.length ?? 0;

  useEffect(() => {
    setSolutionLanguage("python");
    setCode(problem?.starter ?? "");
    setResult(null);
    setHintsShown(0);
    setShowSolution(false);
    setExecutionTimes([]);
  }, [problem?.id, problem?.starter]);

  useEffect(() => {
    if (result?.ok && ranMode === "all") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [result?.ok, ranMode]);

  const onRun = async (which: "examples" | "all") => {
    if (!problem) return;
    setRunning(true);
    setResult(null);
    setRanMode(which);
    
    const startTime = performance.now();
    const r = await runProblem(run, problem, code, which);
    const endTime = performance.now();
    
    setExecutionTimes(prev => [...prev.slice(-4), endTime - startTime]);
    setResult(r);
    setRunning(false);
    
    if (which === "all" && r.ok) {
      markSolved(problem.id);
    }
  };

  const reset = () => {
    if (!problem) return;
    setCode(problem.starter);
    setResult(null);
  };

  const busy = running || status === "loading";
  const avgExecutionTime = executionTimes.length > 0 
    ? (executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length).toFixed(1)
    : null;

  if (!problem) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-subtle mb-4" />
        <p className="text-muted">That problem doesn't exist.</p>
        <Link to="/problems" className="mt-4 inline-block text-run underline hover:text-run/80">
          Back to problems
        </Link>
      </div>
    );
  }

  const isDone = solved.has(problem.id);
  const passedCount = result?.passed ?? 0;
  const totalTests = result?.total ?? 0;
  const passRate = totalTests > 0 ? (passedCount / totalTests) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-surface/50">
      {/* Confetti effect placeholder - you can add react-confetti here */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-run/20 via-transparent to-pivot/20 animate-pulse" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/problems" 
            className="group inline-flex items-center gap-1.5 text-sm text-muted transition-all hover:text-run"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> 
            All problems
          </Link>
          <div className="flex items-center gap-2">
            <CopyButton 
              text={typeof window !== "undefined" ? window.location.href : ""} 
              label="Copy link" 
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Statement Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="min-w-0 space-y-6"
          >
            {/* Title & Badges */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
                  {problem.title}
                </h1>
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                  DIFF_STYLE[problem.difficulty].bg,
                  DIFF_STYLE[problem.difficulty].text,
                  "ring-1 ring-current/30"
                )}>
                  {DIFF_STYLE[problem.difficulty].icon}
                  {DIFFICULTY_LABEL[problem.difficulty]}
                </span>
                {isDone && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-run/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-run ring-1 ring-run/30">
                    <Trophy className="h-3 w-3" /> Solved
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-elevated px-2.5 py-1 font-medium text-subtle">
                  {topicLabel(problem.topic)}
                </span>
                {problem.complexity && (
                  <>
                    <span className="rounded-md bg-elevated px-2.5 py-1 font-mono text-subtle">
                      ⏱️ {problem.complexity.time}
                    </span>
                    <span className="rounded-md bg-elevated px-2.5 py-1 font-mono text-subtle">
                      💾 {problem.complexity.space}
                    </span>
                  </>
                )}
                {problem.lesson && (
                  <Link 
                    to={problem.lesson} 
                    className="inline-flex items-center gap-1 rounded-md bg-elevated px-2.5 py-1 font-medium text-run transition-all hover:bg-run/10 hover:scale-105"
                  >
                    <BookOpen className="h-3 w-3" /> Learn the concept
                  </Link>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="prose prose-sm max-w-none">
              <MarkdownLite md={problem.statement} />
            </div>

            {/* Examples Section */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                <FileCode className="h-3.5 w-3.5" />
                Examples
              </h2>
              <div className="space-y-3">
                {problem.examples.map((ex, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-xl border border-line bg-surface p-4 font-mono text-sm transition-all hover:border-run/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="text-muted">
                          <span className="text-subtle text-xs">Input</span>
                          <pre className="mt-1 text-fg">{callString(problem.funcName, ex.input)}</pre>
                        </div>
                        <div className="text-muted">
                          <span className="text-subtle text-xs">Output</span>
                          <pre className="mt-1 text-run font-semibold">{pyRepr(ex.expected)}</pre>
                        </div>
                        {ex.explain && (
                          <div className="mt-2 font-sans text-xs text-subtle border-l-2 border-run/30 pl-3">
                            💡 {ex.explain}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hints Section */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                <Lightbulb className="h-3.5 w-3.5" />
                Hints
              </h2>
              <div className="space-y-2">
                <AnimatePresence>
                  {problem.hints.slice(0, hintsShown).map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 rounded-xl border border-pivot/30 bg-pivot/5 p-4 text-sm text-muted"
                    >
                      <Lightbulb className="h-4 w-4 shrink-0 text-pivot" />
                      <span>{h}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {hintsShown < problem.hints.length && (
                  <button
                    onClick={() => setHintsShown(n => n + 1)}
                    className="btn-ghost text-sm w-full justify-center"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {hintsShown === 0 ? "Show a hint" : `Next hint (${hintsShown}/${problem.hints.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* Solution Section */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                <Eye className="h-3.5 w-3.5" />
                Reference Solution
              </h2>
              <AnimatePresence>
                {showSolution ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="overflow-hidden rounded-xl border border-line bg-code"
                  >
                    <div className="flex items-center gap-1.5 border-b border-line px-3 py-2 bg-elevated">
                      <LanguagePill
                        active={solutionLanguage === "python"}
                        onClick={() => setSolutionLanguage("python")}
                      >
                        Python
                      </LanguagePill>
                      <LanguagePill
                        active={solutionLanguage === "cpp"}
                        onClick={() => setSolutionLanguage("cpp")}
                      >
                        C++
                      </LanguagePill>
                      <CopyButton
                        className="ml-auto"
                        text={solutionLanguage === "python" ? problem.solution : problem.cppSolution ?? ""}
                      />
                    </div>
                    <pre className="overflow-auto p-4 font-mono text-xs leading-relaxed text-fg max-h-[400px]">
                      <code>{solutionLanguage === "python" ? problem.solution : problem.cppSolution ?? "// C++ solution not added yet."}</code>
                    </pre>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setShowSolution(true)} 
                    className="btn-ghost text-sm w-full justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" /> Reveal solution
                  </button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Workspace Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="min-w-0"
          >
            <div className="sticky top-20 space-y-4">
              {/* Stats Panel */}
              {showStats && (result || isDone) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-line bg-surface p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle flex items-center gap-2">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Performance Stats
                    </h3>
                    <button onClick={() => setShowStats(false)} className="text-subtle hover:text-fg">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      icon={<Trophy className="h-4 w-4" />}
                      label="Success Rate"
                      value={`${Math.round(passRate)}%`}
                      color="bg-run/10 text-run"
                    />
                    {avgExecutionTime && (
                      <StatCard
                        icon={<Clock className="h-4 w-4" />}
                        label="Avg Time"
                        value={`${avgExecutionTime}ms`}
                        color="bg-pivot/10 text-pivot"
                      />
                    )}
                  </div>
                  {totalTests > 0 && (
                    <ProgressBar value={passedCount} max={totalTests} label={`${passedCount}/${totalTests} tests passed`} />
                  )}
                </motion.div>
              )}

              {/* Code Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-subtle" />
                    <span className="text-xs font-mono text-subtle">solution.py</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-subtle">
                    <Brain className="h-3 w-3" />
                    <span>Write your solution</span>
                  </div>
                </div>
                <CodeEditor value={code} onChange={setCode} className="h-[380px]" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => onRun("examples")} 
                  disabled={busy} 
                  className="btn-ghost flex-1 group"
                >
                  {busy && ranMode === "examples" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
                  )}
                  Test Examples
                </button>
                <button 
                  onClick={() => onRun("all")} 
                  disabled={busy} 
                  className="btn-primary flex-1 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-run to-pivot opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    {busy && ranMode === "all" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                    Submit Solution
                    {!isDone && <Sparkles className="h-3 w-3" />}
                  </span>
                </button>
                <button 
                  onClick={reset} 
                  disabled={busy} 
                  className="btn-icon" 
                  title="Reset to starter"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {status === "loading" && (
                <div className="rounded-xl bg-elevated border border-line p-3 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2 text-run" />
                  <p className="text-xs text-subtle">Booting Python runtime… (first run downloads it once)</p>
                </div>
              )}

              {/* Results */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Results 
                      problem={problem} 
                      result={result} 
                      which={ranMode} 
                      exampleCount={exampleCount}
                      passRate={passRate}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LanguagePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
        active 
          ? "bg-run/15 text-fg ring-1 ring-run/40 shadow-sm" 
          : "text-muted hover:bg-elevated hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function Results({
  result,
  which,
  exampleCount,
  problem,
  passRate,
}: {
  result: ProblemRunResult;
  which: "examples" | "all";
  exampleCount: number;
  problem: Problem;
  passRate: number;
}) {
  const [expandedTests, setExpandedTests] = useState<number[]>([]);

  const toggleTest = (index: number) => {
    setExpandedTests(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (result.fatal) {
    return (
      <div className="rounded-xl border border-swap/40 bg-swap/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-swap">
          <XCircle className="h-4 w-4" /> Runtime Error
        </div>
        <pre className="whitespace-pre-wrap font-mono text-xs text-muted bg-swap/5 p-2 rounded">{result.fatal}</pre>
      </div>
    );
  }

  const allPassed = result.ok;
  const bannerIcon = allPassed ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />;
  
  return (
    <div className="space-y-3">
      {/* Result Banner */}
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={cn(
          "rounded-xl border p-4 transition-all",
          allPassed 
            ? "border-run/40 bg-gradient-to-r from-run/5 to-transparent" 
            : "border-swap/40 bg-swap/5"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-full p-2",
              allPassed ? "bg-run/20 text-run" : "bg-swap/20 text-swap"
            )}>
              {bannerIcon}
            </div>
            <div>
              <h3 className={cn(
                "font-semibold",
                allPassed ? "text-run" : "text-swap"
              )}>
                {which === "all" && allPassed 
                  ? "🎉 Perfect! Solution accepted!" 
                  : which === "all" 
                    ? `${result.passed}/${result.total} tests passed` 
                    : `${result.passed}/${result.total} examples passed`}
              </h3>
              {!allPassed && (
                <p className="text-xs text-muted mt-1">
                  Keep going! You're {Math.round(passRate)}% there.
                </p>
              )}
            </div>
          </div>
          {allPassed && which === "all" && (
            <Award className="h-5 w-5 text-run animate-pulse" />
          )}
        </div>
        
        {allPassed && which === "all" && (
          <div className="mt-3 flex items-center gap-2 text-xs text-run border-t border-run/20 pt-3">
            <Star className="h-3 w-3" />
            <span>Great work! You've solved this challenge.</span>
          </div>
        )}
      </motion.div>

      {/* Test Cases */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-subtle uppercase tracking-wider">Test Cases</span>
          <span className="text-muted">{result.passed}/{result.total} passed</span>
        </div>
        
        {result.cases.map((c, i) => {
          const isExample = i < exampleCount;
          const source = isExample ? problem.examples[i] : undefined;
          const isExpanded = expandedTests.includes(i);
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-lg border transition-all cursor-pointer hover:shadow-sm",
                c.ok ? "border-line bg-surface" : "border-swap/40 bg-swap/5",
                isExpanded && "shadow-md"
              )}
              onClick={() => toggleTest(i)}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  {c.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-run" />
                  ) : (
                    <XCircle className="h-4 w-4 text-swap" />
                  )}
                  <span className="text-sm font-medium">
                    {isExample ? `Example ${i + 1}` : `Test Case ${i - exampleCount + 1}`}
                  </span>
                  {!c.ok && (
                    <span className="text-xs text-swap">Failed</span>
                  )}
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform text-subtle",
                  isExpanded && "rotate-180"
                )} />
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-line/50 p-3 space-y-2 text-xs"
                  >
                    {source && (
                      <>
                        <div className="font-mono">
                          <span className="text-subtle">Input: </span>
                          <span className="text-fg">{callString(problem.funcName, source.input)}</span>
                        </div>
                        <div className="font-mono">
                          <span className="text-subtle">Expected: </span>
                          <span className="text-run">{pyRepr(source.expected)}</span>
                        </div>
                      </>
                    )}
                    {!c.ok && (
                      <div className="font-mono bg-swap/10 p-2 rounded">
                        <span className="text-subtle">Got: </span>
                        <span className="text-swap">{c.error ? `Error: ${c.error}` : c.got}</span>
                      </div>
                    )}
                    {c.stdout && c.stdout.trim() && (
                      <div className="font-mono bg-elevated p-2 rounded">
                        <span className="text-subtle">Output: </span>
                        <span className="text-fg">{c.stdout.trim()}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}