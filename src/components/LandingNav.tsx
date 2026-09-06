import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { AviniteLogo } from '@/components/AviniteLogo';

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { mode, toggleMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Subjects', href: '#subjects' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-nav">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg group">
          <AviniteLogo size={36} className="transition-transform group-hover:scale-105" />
          <span className="hidden sm:inline font-display tracking-tight">
            Avinite <span className="gradient-text-brand">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-all active:scale-90"
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <Button size="sm" onClick={() => navigate('/dashboard')} className="ripple-btn">
              Dashboard
            </Button>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="hidden sm:block">
                <Button size="sm" className="ripple-btn glow-primary">Start Free</Button>
              </Link>
            </>
          )}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-all active:scale-90"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-t border-border/40',
          mobileOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="container mx-auto flex flex-col px-4 py-4 gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            {!user && (
              <>
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const platformLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Search Chapters', href: '/search' },
    { label: 'Practice Questions', href: '/practice' },
    { label: 'Doubt Solver', href: '/doubt-solver' },
    { label: 'Mock Tests', href: '/mock-test' },
  ];

  const resourceLinks = [
    { label: 'Revision Mode', href: '/revision' },
    { label: 'Study Planner', href: '/study-planner' },
    { label: 'PYQ Trends', href: '/trends' },
    { label: 'Bookmarks', href: '/bookmarks' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 font-bold text-lg mb-3">
              <AviniteLogo size={36} />
              <span className="font-display">Avinite <span className="gradient-text-brand">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              AI-powered learning platform for CBSE Class 10 Science students. Score higher with
              smart revision, trend analysis, and unlimited practice.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/60 space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Avinite AI. Built for CBSE Class 10 students.
          </p>
          <p className="text-xs text-muted-foreground/70 text-center">
            Original AI-generated content. No copyrighted CBSE material reproduced.
          </p>
        </div>
      </div>
    </footer>
  );
}
