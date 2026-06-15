import { Link } from "react-router-dom";
import {
  MonitorPlay, LayoutList, 
  Grid, Search, SortAsc, GitBranch, Link2, Layers,
  Hash, Binary, Network, Map as MapIcon, Play, 
  Clock} from "lucide-react";
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
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-3 inline-flex items-center gap-2">
            <MonitorPlay className="h-3.5 w-3.5 text-run" />
            Visualizers
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Algorithms you can touch and explore.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Build intuition through interactive visualizations — manipulate stacks, grow trees, traverse graphs, and create your own hash maps.
          </p>
          <div className="mt-5 flex items-center gap-5 text-sm text-subtle">
            <span>{VISUALIZERS.length} visualizers</span>
            <span className="h-3 w-px bg-line" />
            <span>Interactive demos</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {VISUALIZERS.map((v, index) => (
          <VisualizerRow key={v.id} visualizer={v} index={index} />
        ))}
      </motion.div>
    </div>
  );
}

// Exact same style as your Learn page's ModuleRowImproved
function VisualizerRow({ visualizer: v, index }: { visualizer: typeof VISUALIZERS[0]; index: number }) {
  const href = v.to ?? `/visualizers/${v.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      {/* Visualizer Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <span className="text-purple-400">
              {getVisualizerIcon(v, "h-6 w-6")}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Visualizer {index + 1}
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-0.5">{v.title}</h2>
            </div>
            
            <Link
              to={href}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Play className="h-4 w-4" />
              Launch Visualizer
            </Link>
          </div>
          
          <p className="text-muted mt-2 max-w-2xl">{v.blurb}</p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-subtle">
            <span className="flex items-center gap-1">
              <MonitorPlay className="h-3.5 w-3.5" />
              Interactive
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Real-time
            </span>
            {v.to && (
              <span className="flex items-center gap-1">
                <LayoutList className="h-3.5 w-3.5" />
                Full page
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Divider */}
      {index < VISUALIZERS.length - 1 && (
        <div className="relative my-8 ml-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-base px-3 text-xs text-subtle">More visualizers ↓</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}