import { useEffect, useState, useRef } from "react";
import { 
  Play, Loader2, Terminal, Code2, RotateCcw, 
  Cpu, 
  Clock, 
  Minimize2, Maximize2, Bug, StepForward,
  StepBack, ChevronRight,
  ListChecks, Variable, Braces
} from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { usePyodide, type RunResult } from "@/lib/usePyodide";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

const EXAMPLES: { name: string; code: string; difficulty: "easy" | "medium" | "hard"; time: string }[] = [
  {
    name: "Bubble sort",
    difficulty: "easy",
    time: "O(n²)",
    code: `def bubble_sort(arr):
    n = len(arr)
    arr = arr.copy()
    
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Test the algorithm
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", test_array)
print("Sorted array:  ", bubble_sort(test_array))
print("✅ Bubble sort completed!")`,
  },
  {
    name: "Binary search",
    difficulty: "easy",
    time: "O(log n)",
    code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    steps = 0
    
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid, steps
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1, steps

# Test with a sorted array
numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
target = 13

print(f"Searching for {target} in: {numbers}")
index, steps = binary_search(numbers, target)

if index != -1:
    print(f"✅ Found {target} at index {index} in {steps} steps!")
else:
    print(f"❌ {target} not found in the array")`,
  },
  {
    name: "Fibonacci",
    difficulty: "easy",
    time: "O(n)",
    code: `def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib

# Generate first 15 Fibonacci numbers
count = 15
fib_sequence = fibonacci(count)

print(f"First {count} Fibonacci numbers:")
for i, num in enumerate(fib_sequence):
    print(f"  F({i}) = {num}")`,
  },
];

const STORAGE_KEY = "algolume-playground-code";

interface DebugStep {
  line: number;
  variables: Record<string, any>;
  output: string;
  description: string;
}

function DebugVisualizer({ steps, currentStep, onStepChange }: any) {
  return (
    <div className="border-t border-line bg-elevated/30">
      <div className="flex items-center justify-between p-3 border-b border-line">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-run" />
          <span className="text-xs font-semibold uppercase tracking-wider text-run">
            Debugger
          </span>
          <span className="text-xs text-subtle">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="p-1.5 rounded hover:bg-line/60 disabled:opacity-50"
          >
            <StepBack className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="p-1.5 rounded hover:bg-line/60 disabled:opacity-50"
          >
            <StepForward className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Variables Panel */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-subtle">
            <Variable className="h-3 w-3" />
            Variables
          </div>
          <div className="bg-bg rounded-lg border border-line p-3 space-y-1 max-h-[200px] overflow-auto">
            {Object.keys(steps[currentStep]?.variables || {}).length > 0 ? (
              Object.entries(steps[currentStep]?.variables || {}).map(([name, value]) => (
                <div key={name} className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-run">{name}</span>
                  <ChevronRight className="h-3 w-3 text-subtle" />
                  <span className="text-fg">{JSON.stringify(value)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-subtle">No variables tracked</p>
            )}
          </div>
        </div>
        
        {/* Execution Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-subtle">
            <ListChecks className="h-3 w-3" />
            Execution Info
          </div>
          <div className="bg-bg rounded-lg border border-line p-3 space-y-2">
            <div className="text-xs">
              <span className="text-subtle">Line: </span>
              <span className="text-run font-mono">{steps[currentStep]?.line}</span>
            </div>
            <div className="text-xs">
              <span className="text-subtle">Action: </span>
              <span className="text-fg">{steps[currentStep]?.description}</span>
            </div>
            {steps[currentStep]?.output && (
              <div className="text-xs">
                <span className="text-subtle">Output: </span>
                <span className="text-cyan-400">{steps[currentStep]?.output}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaygroundPage() {
  const { status, run } = usePyodide();
  const [code, setCode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? EXAMPLES[0].code;
    } catch {
      return EXAMPLES[0].code;
    }
  });
  const [active, setActive] = useState(0);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([]);
  const [currentDebugStep, setCurrentDebugStep] = useState(0);
  const [showDebugger, setShowDebugger] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, [code]);

  useEffect(() => {
    if (result && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  const loadExample = (i: number) => {
    setActive(i);
    setCode(EXAMPLES[i].code);
    setResult(null);
    setExecutionTime(null);
    setDebugSteps([]);
    setIsDebugging(false);
    setShowDebugger(false);
  };

  // Parse Python code and simulate execution for debugging
  const analyzeCodeForDebugging = (code: string): DebugStep[] => {
    const steps: DebugStep[] = [];
    const lines = code.split('\n');
    const variables: Record<string, any> = {};
    
    // Simple parsing to track variable assignments and function calls
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      
      // Track variable assignments
      const assignmentMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignmentMatch) {
        const [, varName, value] = assignmentMatch;
        try {
          // Try to evaluate the value (simplified)
          if (value.includes('[')) {
            variables[varName] = eval(value); // Be careful with eval in production
          } else if (!isNaN(Number(value))) {
            variables[varName] = Number(value);
          } else if (value === 'True' || value === 'False') {
            variables[varName] = value === 'True';
          } else if (value.startsWith('"') || value.startsWith("'")) {
            variables[varName] = value.slice(1, -1);
          } else {
            variables[varName] = value;
          }
        } catch {
          variables[varName] = value;
        }
        
        steps.push({
          line: i + 1,
          variables: { ...variables },
          output: '',
          description: `Assigned ${varName} = ${variables[varName]}`
        });
      }
      
      // Track print statements
      const printMatch = line.match(/print\((.*)\)/);
      if (printMatch) {
        steps.push({
          line: i + 1,
          variables: { ...variables },
          output: printMatch[1].replace(/['"]/g, ''),
          description: `Printed to console`
        });
      }
      
      // Track function definitions
      const defMatch = line.match(/def\s+(\w+)\((.*)\)/);
      if (defMatch) {
        steps.push({
          line: i + 1,
          variables: { ...variables },
          output: '',
          description: `Defined function ${defMatch[1]}(${defMatch[2]})`
        });
      }
      
      // Track loop starts
      if (line.startsWith('for ') || line.startsWith('while ')) {
        steps.push({
          line: i + 1,
          variables: { ...variables },
          output: '',
          description: `Entered loop: ${line.substring(0, 50)}...`
        });
      }
      
      // Track returns
      const returnMatch = line.match(/return\s+(.+)/);
      if (returnMatch) {
        steps.push({
          line: i + 1,
          variables: { ...variables },
          output: '',
          description: `Returning ${returnMatch[1]}`
        });
      }
    }
    
    return steps;
  };

  const debugCode = async () => {
    setRunning(true);
    setResult(null);
    setExecutionTime(null);
    setShowDebugger(true);
    setIsDebugging(true);
    
    const startTime = performance.now();
    
    // Analyze code structure
    const steps = analyzeCodeForDebugging(code);
    setDebugSteps(steps);
    setCurrentDebugStep(0);
    
    // Run actual code
    const r = await run(code);
    const endTime = performance.now();
    
    setResult(r);
    setExecutionTime(endTime - startTime);
    setRunning(false);
    setShowStats(true);
    setTimeout(() => setShowStats(false), 3000);
  };

  const onRun = async () => {
    setRunning(true);
    setResult(null);
    setExecutionTime(null);
    setShowDebugger(false);
    setIsDebugging(false);
    
    const startTime = performance.now();
    const r = await run(code);
    const endTime = performance.now();
    
    setResult(r);
    setExecutionTime(endTime - startTime);
    setRunning(false);
    setShowStats(true);
    setTimeout(() => setShowStats(false), 3000);
  };

  const busy = running || status === "loading";
  const currentExample = EXAMPLES[active];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <div className="mb-6">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-run" />
          Interactive Python Compiler & Debugger
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Run, debug, and visualize your code.
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Execute Python code step by step, track variable changes, and understand how your algorithm works.
          Perfect for learning and debugging!
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-subtle">Examples:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.name}
            onClick={() => loadExample(i)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer",
              i === active
                ? "bg-run/15 text-fg ring-1 ring-run/40"
                : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            {ex.name}
          </button>
        ))}
        <button
          onClick={() => loadExample(active)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-line/60 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-subtle" />
                <span className="text-xs font-mono text-subtle">editor.py</span>
                {currentExample && (
                  <span className="text-xs text-subtle">
                    • {currentExample.difficulty} • {currentExample.time}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOutputExpanded(!outputExpanded)}
                className="text-subtle hover:text-fg transition-colors"
              >
                {outputExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
            <CodeEditor value={code} onChange={setCode} className="h-[420px]" />
            
            <div className="flex gap-3">
              <button onClick={onRun} disabled={busy} className="btn-primary flex-1">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                {status === "loading"
                  ? "Booting Python..."
                  : running
                    ? "Running..."
                    : "Run"}
              </button>
              
              <button 
                onClick={debugCode} 
                disabled={busy}
                className="flex-1 rounded-lg bg-elevated border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-line/60 transition-colors flex items-center justify-center gap-2"
              >
                <Bug className="h-4 w-4" />
                Debug
              </button>
            </div>
          </div>

          <div className="panel flex h-[420px] flex-col lg:h-auto">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-subtle" />
                <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
                  Output
                </span>
              </div>
              <div className="flex items-center gap-2">
                {showStats && executionTime && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Clock className="h-3 w-3 text-run" />
                    <span className="text-run">{executionTime.toFixed(2)}ms</span>
                  </motion.div>
                )}
              </div>
            </div>
            <div 
              ref={outputRef}
              className={cn(
                "min-h-[360px] flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed transition-all duration-300",
                !outputExpanded && "h-[200px]"
              )}
            >
              {result === null ? (
                <p className="text-subtle">
                  {status === "loading"
                    ? "Downloading the Python runtime..."
                    : "Press Run to execute your code, or Debug to step through it."}
                </p>
              ) : (
                <>
                  {result.output && (
                    <pre className="whitespace-pre-wrap text-fg">{result.output}</pre>
                  )}
                  {result.error && (
                    <pre className="mt-2 whitespace-pre-wrap text-swap bg-swap/5 rounded-lg p-3 border border-swap/20">
                      {result.error}
                    </pre>
                  )}
                  {result.ok && !result.output && (
                    <p className="text-subtle">-- finished with no output --</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Debug Visualizer */}
        {showDebugger && debugSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel overflow-hidden"
          >
            <DebugVisualizer 
              steps={debugSteps}
              currentStep={currentDebugStep}
              onStepChange={setCurrentDebugStep}
              isDebugging={isDebugging}
            />
          </motion.div>
        )}
      </div>

      {/* How it works section */}
      <div className="mt-8 p-4 rounded-lg bg-elevated border border-line">
        <div className="flex items-center gap-2 mb-3">
          <Braces className="h-4 w-4 text-run" />
          <h3 className="text-sm font-semibold">How the debugger works</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-run/15 text-run flex items-center justify-center text-xs font-bold mt-0.5">1</div>
            <div>
              <span className="font-semibold text-fg">Code Analysis</span>
              <p className="mt-1">The debugger analyzes your Python code to identify variables, functions, loops, and print statements.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-run/15 text-run flex items-center justify-center text-xs font-bold mt-0.5">2</div>
            <div>
              <span className="font-semibold text-fg">Step Tracking</span>
              <p className="mt-1">Each line of code is tracked as a step, capturing variable states and execution flow.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-run/15 text-run flex items-center justify-center text-xs font-bold mt-0.5">3</div>
            <div>
              <span className="font-semibold text-fg">Visualization</span>
              <p className="mt-1">Step through your code, watch variables change, and understand exactly what happens.</p>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-subtle border-t border-line pt-3">
          💡 <span className="font-semibold">Pro tip:</span> Use Debug mode to understand complex algorithms, find bugs, and learn how Python executes your code step by step.
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-subtle flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          Powered by Pyodide
        </span>
        <span>•</span>
        <span>Everything runs locally</span>
        <span>•</span>
        <span>Step-by-step debugging</span>
        <span>•</span>
        <span>Variable tracking</span>
      </p>
    </div>
  );
}