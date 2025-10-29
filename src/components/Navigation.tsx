/**
 * Navigation Component
 * Mobile-first responsive navigation with hamburger menu
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface NavLink {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

const mainLinks: NavLink[] = [
  { name: "Habits", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Goals", path: "/goals" },
  { name: "Trends", path: "/trends" },
  { name: "Motivation", path: "/motivation" },
  { name: "Export", path: "/export" },
  { name: "Settings", path: "/settings" },
];

const infoLinks: NavLink[] = [
  { name: "About", path: "/about" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Top navigation bar */}
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">TinyHabits</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {mainLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className="transition-all duration-200"
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Theme toggle & hamburger */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-transform hover:rotate-12"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile slide-in menu */}
      <div
        className={cn(
          "fixed right-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-card border-l border-border shadow-lg transition-transform duration-300 ease-in-out md:hidden overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Main links */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Main
            </p>
            {mainLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={closeMenu}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Info links */}
          <div className="space-y-1 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Information
            </p>
            {infoLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={closeMenu}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
