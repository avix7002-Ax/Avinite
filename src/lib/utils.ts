export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function daysUntil(date: string | Date): number {
  const target = new Date(date).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    Physics: 'text-chart-1',
    Chemistry: 'text-chart-3',
    Biology: 'text-accent',
    Environment: 'text-chart-2',
  };
  return colors[subject] || 'text-primary';
}

export function getAuthRedirectUrl(path: string): string {
  const configuredUrl = import.meta.env.VITE_PRODUCTION_URL?.trim();

  if (!configuredUrl) {
    throw new Error('Authentication redirects are not configured for the deployed website.');
  }

  let productionUrl: URL;
  try {
    productionUrl = new URL(configuredUrl);
  } catch {
    throw new Error('Authentication redirects are not configured with a valid deployed website URL.');
  }

  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
  if (productionUrl.protocol !== 'https:' || localHosts.has(productionUrl.hostname) || productionUrl.hostname === 'your-deployed-site.bolt.host') {
    throw new Error('Authentication redirects must use the deployed website HTTPS URL.');
  }

  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const basePath = productionUrl.pathname.replace(/\/$/, '');
  return productionUrl.origin + basePath + cleanPath;
}

export function getSubjectBg(subject: string): string {
  const colors: Record<string, string> = {
    Physics: 'bg-chart-1/10',
    Chemistry: 'bg-chart-3/10',
    Biology: 'bg-accent/10',
    Environment: 'bg-chart-2/10',
  };
  return colors[subject] || 'bg-primary/10';
}
