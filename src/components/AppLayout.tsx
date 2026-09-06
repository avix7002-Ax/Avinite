import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  PenTool,
  MessageCircleQuestion,
  RefreshCw,
  FileClock,
  CalendarDays,
  Bookmark,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Palette,
  Check,
  FileText,
  Bot,
  Info,
  Star,
  ChevronLeft,
  Sparkles,
  Zap,
  Settings,
  Monitor,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, themeColorOptions, type ThemeColor, type AnimationMode, type ThemeMode } from '@/hooks/useTheme';
import { cn, getInitials } from '@/lib/utils';
import { AviniteLogo } from '@/components/AviniteLogo';
import { FloatingParticles } from '@/components/FloatingParticles';

const COLLAPSE_KEY = 'avinite-sidebar-collapsed';

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Avinite AI', href: '/avinex-ai', icon: Bot },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Practice', href: '/practice', icon: PenTool },
  { label: 'Doubt Solver', href: '/doubt-solver', icon: MessageCircleQuestion },
  { label: 'Revision', href: '/revision', icon: RefreshCw },
  { label: 'Mock Tests', href: '/mock-test', icon: FileClock },
  { label: 'Study Planner', href: '/study-planner', icon: CalendarDays },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'PYQ Trends', href: '/trends', icon: TrendingUp },
  { label: 'PYQ Series', href: '/pyq-series', icon: FileText },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === 'true');
  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { mode, color, animations, setMode, setColor, setAnimations, toggleMode } = useTheme();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setThemeOpen(false);
  }, [location.pathname]);

  function handleSetColor(c: ThemeColor) { setColor(c); }
  function handleSetAnimations(a: AnimationMode) { setAnimations(a); }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const userMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'About Avinite AI', href: '/about', icon: Info },
    { label: 'Reviews', href: '/reviews', icon: Star },
    { label: 'Avinite AI Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingParticles count={15} className="hidden md:block opacity-50" />
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden md:flex flex-col glass-nav transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          collapsed ? 'w-[4.5rem]' : 'w-64'
        )}
        style={{ borderRight: '1px solid hsl(var(--border) / 0.5)' }}
      >
        {/* Logo / brand */}
        <div className={cn('flex h-16 items-center gap-2.5 border-b border-border/50', collapsed ? 'justify-center px-2' : 'px-5')}>
          <Link to="/dashboard" className="flex items-center gap-2.5 font-bold group">
            <AviniteLogo size={36} className="transition-transform group-hover:scale-105" />
            {!collapsed && (
              <span className="text-base font-display tracking-tight whitespace-nowrap animate-fade-in">
                Avinite <span className="gradient-text-brand">AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-0.5 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group',
                  collapsed && 'justify-center',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
                )}
                <Icon className={cn('h-4.5 w-4.5 flex-shrink-0 transition-transform group-hover:scale-110', collapsed && 'mx-auto')} style={{ width: '1.125rem', height: '1.125rem' }} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {collapsed && (
                  <span className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse/expand button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'group relative mx-3 mb-2 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-300 overflow-hidden',
            collapsed && 'mx-2'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent group-hover:animate-[card-shimmer_0.8s_ease-out]" />
          </span>
          <span className={cn(
            'relative flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/15 group-hover:text-primary transition-all duration-300',
            'group-hover:scale-110 group-active:scale-95'
          )}>
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-500', collapsed && 'rotate-180')} />
            <span className="absolute inset-0 rounded-lg ring-1 ring-primary/0 group-hover:ring-primary/20 transition-all duration-300" />
          </span>
          {!collapsed && <span className="relative">Collapse</span>}
        </button>

        {/* Bottom: user corner + theme + sign out */}
        <div className="border-t border-border/50 p-2.5 space-y-1">
          {/* User Corner dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-sm font-medium hover:bg-muted/60 transition-all',
                collapsed && 'justify-center'
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold flex-shrink-0">
                {user ? getInitials(profile?.full_name || user.email || 'U') : 'U'}
              </div>
              {!collapsed && (
                <p className="text-sm font-medium truncate flex-1 text-left">
                  {profile?.full_name || user?.email}
                </p>
              )}
              {!collapsed && (
                <ChevronLeft className={cn('h-4 w-4 transition-transform', userMenuOpen && 'rotate-90')} />
              )}
            </button>
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-xl border border-border glass-panel shadow-xl animate-scale-in">
                {!collapsed && (
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                    {user?.email}
                  </p>
                )}
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
                    >
                      <Icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
                {/* Theme quick toggle inside user menu */}
                <div className={cn('flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground', !collapsed && 'justify-between')}>
                  {!collapsed && <span className="flex items-center gap-3"><Palette className="h-4 w-4" />Theme</span>}
                  <div className="flex gap-1">
                    <button onClick={() => setMode('light')} className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-all', mode === 'light' ? 'bg-primary/15 text-primary' : 'hover:bg-muted')}><Sun className="h-3 w-3" /></button>
                    <button onClick={() => setMode('dark')} className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-all', mode === 'dark' ? 'bg-primary/15 text-primary' : 'hover:bg-muted')}><Moon className="h-3 w-3" /></button>
                    <button onClick={() => setMode('system')} className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-all', mode === 'system' ? 'bg-primary/15 text-primary' : 'hover:bg-muted')}><Monitor className="h-3 w-3" /></button>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Logout</span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme settings */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              title={collapsed ? 'Theme Settings' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all group',
                collapsed && 'justify-center'
              )}
            >
              <Palette className="h-4 w-4 group-hover:scale-110 transition-transform" />
              {!collapsed && 'Theme Settings'}
            </button>
            {themeOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-4 rounded-xl border border-border glass-panel shadow-xl animate-scale-in">
                <p className="text-xs font-semibold mb-2">Appearance</p>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setMode('light')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center',
                      mode === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Sun className="h-3 w-3" /> Light
                  </button>
                  <button
                    onClick={() => setMode('dark')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center',
                      mode === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Moon className="h-3 w-3" /> Dark
                  </button>
                  <button
                    onClick={() => setMode('system')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center',
                      mode === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Monitor className="h-3 w-3" /> System
                  </button>
                </div>

                <p className="text-xs font-semibold mb-2">Accent Color</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {themeColorOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => handleSetColor(opt.name)}
                      className={cn(
                        'relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all hover:scale-105',
                        color === opt.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      )}
                    >
                      <span className="h-5 w-5 rounded-full" style={{ backgroundColor: opt.swatch }} />
                      {color === opt.name && <Check className="absolute top-0.5 right-0.5 h-3 w-3 text-primary" />}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-semibold mb-2">Animations</p>
                <div className="flex gap-2">
                  {([
                    { val: 'full' as AnimationMode, label: 'Full', icon: Zap },
                    { val: 'reduced' as AnimationMode, label: 'Reduced', icon: Sparkles },
                    { val: 'off' as AnimationMode, label: 'Off', icon: X },
                  ]).map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => handleSetAnimations(opt.val)}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center',
                          animations === opt.val ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                        )}
                      >
                        <Icon className="h-3 w-3" /> {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleMode}
            title={collapsed ? (mode === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all group',
              collapsed && 'justify-center'
            )}
          >
            {mode === 'dark' ? <Sun className="h-4 w-4 group-hover:scale-110 transition-transform" /> : <Moon className="h-4 w-4 group-hover:scale-110 transition-transform" />}
            {!collapsed && (mode === 'dark' ? 'Light Mode' : 'Dark Mode')}
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between glass-nav px-4 md:hidden border-b border-border/50">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <AviniteLogo size={32} />
          <span className="text-base font-display">Avinite <span className="gradient-text-brand">AI</span></span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-all active:scale-90"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* ── Mobile Nav Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 glass-nav flex flex-col animate-slide-in-right border-l border-border/50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute -left-4 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full glass-panel border border-border shadow-lg transition-all hover:scale-110 active:scale-90"
              style={{ animation: 'float-close-pulse 2s ease-in-out infinite' }}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
              <span className="font-semibold font-display">Menu</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                  >
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />}
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Corner in mobile */}
            <div className="border-t border-border/50 p-3 space-y-1">
              <div className="flex items-center gap-2.5 px-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold flex-shrink-0">
                  {user ? getInitials(profile?.full_name || user.email || 'U') : 'U'}
                </div>
                <p className="text-sm font-medium truncate flex-1">
                  {profile?.full_name || user?.email}
                </p>
              </div>
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Theme Mode</p>
                <div className="flex gap-2">
                  <button onClick={() => setMode('light')} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center', mode === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border')}>
                    <Sun className="h-3 w-3" /> Light
                  </button>
                  <button onClick={() => setMode('dark')} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center', mode === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border')}>
                    <Moon className="h-3 w-3" /> Dark
                  </button>
                  <button onClick={() => setMode('system')} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition-all flex-1 justify-center', mode === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border')}>
                    <Monitor className="h-3 w-3" /> System
                  </button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Accent Color</p>
                <div className="flex gap-2 flex-wrap">
                  {themeColorOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => handleSetColor(opt.name)}
                      className={cn(
                        'relative h-7 w-7 rounded-full transition-all hover:scale-110',
                        color === opt.name && 'ring-2 ring-offset-2 ring-offset-card ring-primary'
                      )}
                      style={{ backgroundColor: opt.swatch }}
                      title={opt.label}
                    >
                      {color === opt.name && <Check className="absolute inset-0 m-auto h-3 w-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className={cn('transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]', collapsed ? 'md:pl-[4.5rem]' : 'md:pl-64')}>
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          <div key={location.pathname} className="page-transition">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AviniteLogo size={56} animated />
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-xl font-semibold">Please sign in to continue</h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          You need an account to access this page. Sign in or create a free account to get started.
        </p>
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Start Free</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
