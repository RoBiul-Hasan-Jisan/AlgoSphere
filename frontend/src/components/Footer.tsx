import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageSquarePlus, Github, Twitter, Youtube, Heart, X,  Layers, Code, FileText, Home, AlertCircle,  BarChart3, GitBranch, GraduationCap } from "lucide-react";

export function Footer() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Define all searchable routes with metadata
  const routes = [
    {
      path: "/",
      label: "Home",
      icon: Home,
      description: "Go to homepage"
    },
    {
      path: "/learn",
      label: "Learn",
      icon: GraduationCap,
      description: "Browse all lessons"
    },
    {
      path: "/search",
      label: "Search",
      icon: Search,
      description: "Search across the platform"
    },
    {
      path: "/notes",
      label: "Notes",
      icon: FileText,
      description: "Your saved notes"
    },
    {
      path: "/playground",
      label: "Playground",
      icon: Code,
      description: "Test and experiment with code"
    },
    {
      path: "/problems",
      label: "Problems",
      icon: Layers,
      description: "Browse all problems"
    },
    {
      path: "/visualizers",
      label: "Visualizers",
      icon: BarChart3,
      description: "Interactive algorithm visualizations"
    },
    {
      path: "/sorting",
      label: "Sorting",
      icon: BarChart3,
      description: "Sorting algorithm visualizations"
    },
    {
      path: "/pathfinding",
      label: "Pathfinding",
      icon: GitBranch,
      description: "Pathfinding algorithm visualizations"
    },
    {
      path: "/issue",
      label: "Feedback",
      icon: AlertCircle,
      description: "Submit feedback or report issues"
    }
  ];

  // Filter routes based on search query
  const filteredRoutes = routes.filter(route =>
    route.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle route selection
  const handleRouteSelect = (path: string) => {
    setPaletteOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  // Close modal on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPaletteOpen(false);
      setSearchQuery("");
    }
  };

  // Command Palette Modal
  const CommandPalette = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    if (!open) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div className="relative p-4 border-b border-gray-200 dark:border-gray-800">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pages, lessons, problems..."
              className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredRoutes.length > 0 ? (
              <div className="space-y-1">
                {filteredRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.path}
                      onClick={() => handleRouteSelect(route.path)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {route.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {route.description}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-600 font-mono">
                        {route.path}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No results found</p>
                <p className="text-xs text-gray-400 mt-1">Try searching for a different term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 flex justify-between items-center text-xs text-gray-400">
            <span>
              {filteredRoutes.length} {filteredRoutes.length === 1 ? 'result' : 'results'}
            </span>
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑↓</kbd> Navigate
              </span>
              <span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> Select
              </span>
              <span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd> Close
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-900 dark:bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo */}
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <img
                src="/og-image.png" 
                alt="AlgoSphere Logo"
                className="h-7 w-7 rounded-md object-cover"
              />
              AlgoSphere
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Link to="/learn" className="hover:text-gray-900 dark:hover:text-white transition-colors">Learn</Link>
              <Link to="/visualizers" className="hover:text-gray-900 dark:hover:text-white transition-colors">Visualizers</Link>
              <Link to="/problems" className="hover:text-gray-900 dark:hover:text-white transition-colors">Problems</Link>
              <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
            </nav>

            {/* Actions & Socials */}
            <div className="flex items-center gap-4 text-gray-400">
              <button
                onClick={() => setPaletteOpen(true)}
                className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
                <span className="hidden text-sm sm:inline">Search</span>
                
              </button>

              <Link
                to="/issue"
                className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm"
                aria-label="Submit feedback"
              >
                <MessageSquarePlus className="h-4 w-4" />
                <span className="hidden text-sm sm:inline">Feedback</span>
              </Link>

              <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

              <a href="https://github.com/RoBiul-Hasan-Jisan" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} AlgoSphere. Made with <Heart className="inline h-3 w-3 text-red-400" aria-label="love" /> for developers worldwide.
          </div>
        </div>
      </footer>

      {/* Command Palette Modal */}
      <CommandPalette open={paletteOpen} onClose={() => {
        setPaletteOpen(false);
        setSearchQuery("");
      }} />
    </>
  );
}

Footer.displayName = "Footer";