import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, MessageSquarePlus, Sparkles, Compass, Code2, Brain, NotebookPen } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { AccountMenu, SyncStatusLine } from "./AccountMenu";
import { initAuth, useAuth, signInWithGoogle } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

const NAV = [
  { to: "/learn", label: "Learn", icon: Brain },
  { to: "/visualizers", label: "Visualizers", icon: Compass },
  { to: "/playground", label: "Playground", icon: Code2 },
  { to: "/problems", label: "Problems", icon: Sparkles },
  { to: "/notes", label: "Notes", icon: NotebookPen },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
  const { user } = useAuth();

  useEffect(() => {
    initAuth();
  }, []);

  // Global shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "?" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setHelpOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    // Update active indicator position when pathname changes
    updateActiveIndicator();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    updateActiveIndicator();
    window.addEventListener("resize", updateActiveIndicator);
    return () => window.removeEventListener("resize", updateActiveIndicator);
  }, []);

  const updateActiveIndicator = () => {
    const activeLink = document.querySelector(`[data-nav-active="true"]`);
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const container = document.querySelector('[data-nav-container]');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setActiveIndicator({
          left: rect.left - containerRect.left,
          width: rect.width,
        });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 transition-all duration-300",
          scrolled ? "top-2" : "top-4"
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl border backdrop-blur-xl transition-all duration-300",
            scrolled 
              ? "border-white/20 bg-black/70 shadow-2xl dark:bg-white/10" 
              : "border-white/10 bg-black/50 dark:bg-white/5",
            "hover:border-white/30 hover:shadow-xl"
          )}
        >
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            {/* Logo */}
            <Link 
              to="/" 
              className="group relative flex items-center gap-2.5"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
              <Logo className="relative h-7 w-7 transition-transform duration-200 group-hover:scale-105" />
              <span className="relative font-display text-lg font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Algo<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sphere</span>
              </span>
            </Link>

            {/* Desktop Navigation - Modern pill design */}
            <div 
              data-nav-container
              className="relative hidden items-center gap-1 rounded-full bg-white/5 px-2 py-1 backdrop-blur-sm md:flex"
            >
              {/* Active indicator */}
              {activeIndicator.width > 0 && (
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 transition-all duration-300"
                  style={{
                    left: activeIndicator.left,
                    width: activeIndicator.width,
                  }}
                />
              )}
              
              {NAV.map((item) => {
                const active = pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-nav-active={active}
                    className={cn(
                      "relative z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                      active 
                        ? "text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/10",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Quick switcher button */}
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60 transition-all hover:bg-white/10 hover:text-white sm:flex"
                aria-label="Open quick switcher"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="text-xs">Search...</span>
                <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/40">⌘K</kbd>
              </button>
              
              <button
                onClick={() => setPaletteOpen(true)}
                className="btn-icon rounded-full sm:hidden"
                aria-label="Open quick switcher"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link
                to="/issue"
                className={cn(
                  "rounded-full p-2 transition-all",
                  pathname.startsWith("/issue") 
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white" 
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
                aria-label="Submit feedback"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Link>
              
              <ThemeToggle />
              <AccountMenu />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-full p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden rounded-b-2xl">
              <nav className="flex flex-col gap-2 p-4">
                {NAV.map((item) => {
                  const active = pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        active 
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white" 
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                
                <Link 
                  to="/issue" 
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Submit feedback
                </Link>
                
                {isSupabaseConfigured && !user && (
                  <button
                    onClick={() => signInWithGoogle()}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-3 text-sm font-medium text-white transition-all hover:from-purple-500/30 hover:to-pink-500/30"
                  >
                    Sign in with Google
                  </button>
                )}
                
                <SyncStatusLine />
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-20" />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}