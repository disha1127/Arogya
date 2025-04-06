import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Menu, X, User, Home, Clipboard, 
  CalendarClock, Pill, Building2, FileText, GraduationCap,
  FileUp, LogOut, Settings, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showFocusRing, setShowFocusRing] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show focus indicators when using keyboard navigation
      if (e.key === 'Tab') {
        setShowFocusRing(true);
      }
    };

    const handleMouseDown = () => {
      setShowFocusRing(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4 mr-1" /> },
    { path: "/symptomChecker", label: "Symptom Checker", icon: <Clipboard className="w-4 h-4 mr-1" /> },
    { path: "/dietPlanner", label: "Diet Planner", icon: <GraduationCap className="w-4 h-4 mr-1" /> },
    { path: "/medicationReminders", label: "Medication Reminders", icon: <Pill className="w-4 h-4 mr-1" /> },
    { path: "/hospitalLocator", label: "Hospital Locator", icon: <Building2 className="w-4 h-4 mr-1" /> },
    { path: "/emergency-sos", label: "Emergency SOS", icon: <AlertTriangle className="w-4 h-4 mr-1 text-red-500" /> },
    { path: "/medicalDocuments", label: "Medical Documents", icon: <FileUp className="w-4 h-4 mr-1" /> },
    { path: "/governmentSchemes", label: "Government Schemes", icon: <FileText className="w-4 h-4 mr-1" /> },
    { path: "/healthArticles", label: "Health Articles", icon: <CalendarClock className="w-4 h-4 mr-1" /> },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          .focus-visible {
            ${showFocusRing ? `
              outline: 2px solid #4F46E5 !important;
              outline-offset: 2px !important;
            ` : ''}
          }
        `
      }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center focus:outline-none focus-visible"
                aria-label="AROGYA Healthcare - Home"
              >
                <svg 
                  className="h-8 w-8 text-primary-600" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM17 17H7V15C7 13.34 10.33 12.5 12 12.5C13.67 12.5 17 13.34 17 15V17Z" fill="currentColor"/>
                </svg>
                <span className="ml-2 text-xl font-bold font-heading text-primary-600">AROGYA</span>
              </Link>
            </div>
            
            {/* Main Navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main Navigation">
              {navigationItems.slice(0, 5).map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`${
                    location === item.path 
                      ? "border-primary-500 text-primary-600" 
                      : "border-transparent text-slate-600 hover:text-primary-600"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none focus-visible transition`}
                  aria-current={location === item.path ? "page" : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center">
            {/* Search */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <form onSubmit={handleSearchSubmit} className="max-w-lg w-full lg:max-w-xs relative">
                <label htmlFor="header-search" className="sr-only">
                  Search
                </label>
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" 
                  aria-hidden="true" 
                />
                <Input 
                  id="header-search"
                  type="search" 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-10 focus-visible"
                  aria-label="Search"
                />
                <button 
                  type="submit" 
                  className="sr-only"
                  aria-label="Submit search"
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* Emergency SOS Button */}
            <div className="hidden md:flex md:items-center mr-4">
              <Link 
                href="/emergency-sos"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-primary rounded-md shadow-sm hover:from-red-600 hover:to-primary/90 focus:outline-none focus-visible"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency SOS
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-primary-700 bg-primary-50 hover:bg-primary-100 focus-visible flex items-center"
                      aria-label="User menu"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user.fullName || user.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")}
                      className="focus-visible"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/settings")}
                      className="focus-visible"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => logoutMutation.mutate()}
                      className="focus-visible text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-primary-700 bg-primary-50 hover:bg-primary-100 focus-visible"
                    aria-label="Login"
                    onClick={() => navigate("/auth")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    className="ml-3 focus-visible"
                    aria-label="Sign up"
                    onClick={() => {
                      navigate("/auth");
                      setTimeout(() => {
                        // This simulates clicking on the register tab
                        const registerTab = document.querySelector('[data-value="register"]');
                        if (registerTab) {
                          (registerTab as HTMLElement).click();
                        }
                      }, 100);
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="focus-visible"
              >
                <span className="sr-only">
                  {mobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Mobile Navigation"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`${
                    location === item.path 
                      ? "bg-primary-50 border-primary-500 text-primary-700" 
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium focus-visible`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={location === item.path ? "page" : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {/* Emergency SOS Mobile Button */}
              <div className="px-4 mb-4">
                <Link
                  href="/emergency-sos"
                  className="flex justify-center items-center px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-red-500 to-primary rounded-md shadow-sm hover:from-red-600 hover:to-primary/90 focus-visible w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency SOS
                </Link>
              </div>
              
              {user ? (
                <div className="px-4 space-y-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium text-gray-800">{user.fullName || user.username}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus-visible rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2 inline-block" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus-visible rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2 inline-block" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logoutMutation.mutate();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 focus-visible rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2 inline-block" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center px-4 space-x-3">
                  <Button 
                    variant="ghost" 
                    className="flex-1 text-primary-700 bg-primary-50 hover:bg-primary-100 focus-visible"
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }}
                    aria-label="Login"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    className="flex-1 focus-visible"
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const registerTab = document.querySelector('[data-value="register"]');
                        if (registerTab) {
                          (registerTab as HTMLElement).click();
                        }
                      }, 100);
                    }}
                    aria-label="Sign up"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;