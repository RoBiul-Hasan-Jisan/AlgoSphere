import { Link } from "react-router-dom";
import {
  MonitorPlay, LayoutList, 
  Grid, Search, SortAsc, GitBranch, Link2, Layers,
  Hash, Binary, Network, Map as MapIcon, Play, 
  Terminal
} from "lucide-react";
import { motion } from "framer-motion";
import { VISUALIZERS } from "./registry";

// Map visualizer to appropriate icon
function getVisualizerIcon(v: typeof VISUALIZERS[0], size = "h-5 w-5") {
  const id = v.id.toLowerCase();
  const title = v.title.toLowerCase();
  const iconClass = size;
  
  if (id.includes('array') || title.includes('array')) return <Grid className={iconClass} />;
  if (id.includes('search') || title.includes('search')) return <Search className={iconClass} />;
  if (id.includes('sort') || title.includes('sort')) return <SortAsc className={iconClass} />;
  if (id.includes('recurs') || title.includes('recurs') || title.includes('backtrack')) return <GitBranch className={iconClass} />;
  if (id.includes('linked') || title.includes('linked')) return <Link2 className={iconClass} />;
  if (id.includes('stack') || title.includes('stack')) return <Layers className={iconClass} />;
  if (id.includes('hash') || title.includes('hash')) return <Hash className={iconClass} />;
  if (id.includes('tree') || title.includes('tree')) return <Binary className={iconClass} />;
  if (id.includes('graph') || title.includes('graph')) return <Network className={iconClass} />;
  if (id.includes('map') || title.includes('map') || title.includes('dict')) return <MapIcon className={iconClass} />;
  
  return v.icon ? <v.icon className={iconClass} /> : <Grid className={iconClass} />;
}

export function VisualizersPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
      {/* Header Section */}
      <div className="mb-16 border-b border-white/10 pb-10">
        <div className="flex items-center gap-3 text-purple-400 mb-4">
          <Terminal className="h-5 w-5" />
          <span className="font-mono text-sm font-semibold tracking-wider uppercase">Runtime Environment</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Interactive Algorithms
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Don't just read about data structures. Manipulate stacks, grow trees, and traverse graphs in a real-time, interactive environment.
        </p>
      </div>

      {/* Visualizers List with Connecting Line */}
      <div className="relative">
        {/* Continuous vertical line */}
        <div className="absolute left-[27px] top-4 bottom-8 w-px bg-gradient-to-b from-purple-500/50 via-white/10 to-transparent md:left-[35px]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {VISUALIZERS.map((v, index) => (
            <VisualizerRow key={v.id} visualizer={v} index={index} isLast={index === VISUALIZERS.length - 1} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function VisualizerRow({ visualizer: v, index, isLast }: { visualizer: typeof VISUALIZERS[0]; index: number; isLast: boolean }) {
  const href = v.to ?? `/visualizers/${v.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative flex items-start gap-6 group md:gap-8"
    >
      {/* Node Icon on the line */}
      <div className="relative z-10 flex shrink-0 items-center justify-center pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-background shadow-sm transition-all duration-300 group-hover:border-purple-500/40 group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] md:h-16 md:w-16">
          <span className="text-muted transition-colors duration-300 group-hover:text-purple-400">
            {getVisualizerIcon(v, "h-6 w-6 md:h-7 md:w-7")}
          </span>
        </div>
      </div>
      
      {/* Content Card */}
      <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04] md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs text-purple-400/80">0{index + 1}</span>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{v.title}</h2>
            </div>
            <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
              {v.blurb}
            </p>
            
            <div className="flex gap-4 mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <MonitorPlay className="h-3.5 w-3.5" /> DOM Canvas
              </span>
              {v.to && (
                <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                  <LayoutList className="h-3.5 w-3.5" /> Full View
                </span>
              )}
            </div>
          </div>
          
          <div className="shrink-0 mt-4 md:mt-0">
            <Link
              to={href}
              className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white/5 px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:text-white"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover/btn:duration-1000 group-hover/btn:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/10" />
              </div>
              <Play className="h-4 w-4 text-purple-400 transition-colors group-hover/btn:text-purple-300" />
              <span>Initialize</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}