import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Compass, Code2, Brain, NotebookPen } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { AccountMenu, SyncStatusLine } from "./AccountMenu";
import { initAuth, useAuth, signInWithGoogle } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

const NAV_ITEMS = [
  { to: "/learn", label: "Learn", icon: Brain },
  { to: "/visualizers", label: "Visualizers", icon: Compass },
  { to: "/playground", label: "Playground", icon: Code2 },
  { to: "/problems", label: "Problems", icon: Sparkles },
  { to: "/notes", label: "Notes", icon: NotebookPen },
];

// --- Custom Hooks ---

function useScroll(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

// --- Main Component ---

export function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScroll();

  useEffect(() => { initAuth(); }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={cn(
              "relative flex h-14 items-center justify-between rounded-2xl border px-4 transition-all duration-300",
              scrolled 
                ? "border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl dark:bg-[#0a0a0a]/80" 
                : "border-transparent bg-transparent"
            )}
          >
            <BrandLogo />
            <DesktopNav currentPath={pathname} />
            <NavActions 
              mobileOpen={mobileOpen}
              onToggleMobile={() => setMobileOpen(!mobileOpen)}
            />
          </div>

          {/* Premium Floating Mobile Menu */}
          {mobileOpen && <MobileMenu currentPath={pathname} />}
        </div>
      </header>

      {/* Spacer */}
      <div className="h-24" aria-hidden="true" />
    </>
  );
}

// --- Sub-components ---

function BrandLogo() {
  return (
    <Link to="/" className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 transition-transform group-hover:scale-105">
        <Logo className="h-5 w-5 text-white" />
      </div>
      <span className="font-display text-lg font-bold tracking-tight text-white">
        Algo<span className="text-purple-400">Sphere</span>
      </span>
    </Link>
  );
}

function DesktopNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:flex md:-translate-x-1/2 md:-translate-y-1/2 items-center gap-1 rounded-full bg-white/5 p-1 border border-white/5 backdrop-blur-md">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive = currentPath.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
              isActive 
                ? "bg-white/10 text-white shadow-sm" 
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function NavActions({ mobileOpen, onToggleMobile }: { mobileOpen: boolean, onToggleMobile: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <AccountMenu />

      <button
        onClick={onToggleMobile}
        className="md:hidden p-2 text-neutral-400 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-full"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
}

function MobileMenu({ currentPath }: { currentPath: string }) {
  const { user } = useAuth();

  return (
    <div className="absolute left-4 right-4 top-20 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden animate-in slide-in-from-top-4 fade-in-20">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = currentPath.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive 
                  ? "bg-purple-500/10 text-purple-400" 
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        
        {isSupabaseConfigured && !user && (
          <>
            <div className="my-2 h-px w-full bg-white/10" />
            <button
              onClick={() => signInWithGoogle()}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-white text-black px-4 py-3 text-sm font-semibold transition-transform hover:scale-[0.98]"
            >
              Sign in with Google
            </button>
          </>
        )}
        
        <div className="mt-4 px-2">
          <SyncStatusLine />
        </div>
      </nav>
    </div>
  );
}