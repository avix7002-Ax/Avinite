import { Sun, Moon, Monitor, Palette, Check, Zap, Sparkles, X, Bell, Shield, User as UserIcon, Mail, Save, Crown, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useTheme, themeColorOptions } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { TIERS } from '@/lib/subscription';
import { cn } from '@/lib/utils';
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function SettingsPage() {
  const { mode, color, animations, setMode, setColor, setAnimations } = useTheme();
  const { user, profile, refreshProfile } = useAuth();
  const { tier, isPro, isPremium, purchasesEnabled, upgrade, refresh } = useSubscription();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingPurchases, setTogglingPurchases] = useState(false);

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user!.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      await refreshProfile();
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleTogglePurchases() {
    setTogglingPurchases(true);
    const newValue = !purchasesEnabled;
    await supabase.from('app_config').upsert({
      key: 'purchases_enabled',
      value: newValue,
    });
    await refresh();
    setTogglingPurchases(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Avinite AI Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your experience and manage your account</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5 text-primary" /> Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-10 opacity-60"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>}
            {saved && <p className="text-sm text-green-600 bg-green-600/10 rounded-md px-3 py-2">Profile updated successfully!</p>}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Appearance</CardTitle>
          <CardDescription>Choose how Avinite AI looks for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-semibold mb-3">Theme Mode</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMode('light')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  mode === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                )}
              >
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setMode('dark')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  mode === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                )}
              >
                <Moon className="h-5 w-5" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setMode('system')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  mode === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                )}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mode === 'system' ? 'Follows your device theme automatically' : `Using ${mode} mode`}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Accent Color</p>
            <div className="flex flex-wrap gap-3">
              {themeColorOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setColor(opt.name)}
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110',
                    color === opt.name && 'ring-2 ring-offset-2 ring-offset-card ring-primary'
                  )}
                  style={{ backgroundColor: opt.swatch }}
                  title={opt.label}
                >
                  {color === opt.name && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Animations</p>
            <div className="flex gap-3">
              {([
                { val: 'full' as const, label: 'Full', icon: Zap },
                { val: 'reduced' as const, label: 'Reduced', icon: Sparkles },
                { val: 'off' as const, label: 'Off', icon: X },
              ]).map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.val}
                    onClick={() => setAnimations(opt.val)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all flex-1 justify-center',
                      animations === opt.val ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Icon className="h-4 w-4" /> {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /> Subscription</CardTitle>
          <CardDescription>Your current plan and upgrade options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                tier === 'premium' ? 'bg-gradient-to-br from-primary to-accent text-white' :
                tier === 'pro' ? 'bg-primary/10 text-primary' :
                'bg-muted text-muted-foreground'
              )}>
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{TIERS[tier].name} Plan</p>
                <p className="text-xs text-muted-foreground">{TIERS[tier].tagline}</p>
              </div>
            </div>
            <Badge variant={tier === 'free' ? 'secondary' : 'default'}>
              ₹{TIERS[tier].price}{TIERS[tier].price > 0 ? TIERS[tier].period : ''}
            </Badge>
          </div>
          {tier !== 'premium' && (
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
              <div>
                <p className="text-sm font-medium">Upgrade your plan</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {purchasesEnabled ? 'Unlock more features and daily limits' : 'Purchases are currently disabled'}
                </p>
              </div>
              {purchasesEnabled ? (
                <Button size="sm" onClick={async () => {
                  if (tier === 'free') await upgrade('pro');
                  else await upgrade('premium');
                }}>
                  <Crown className="h-3.5 w-3.5 mr-1" /> Upgrade
                </Button>
              ) : (
                <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" /> Locked</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin: Purchase toggle */}
      <Card className="border-warning/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ToggleRight className="h-5 w-5 text-warning" /> Admin: Purchase Toggle</CardTitle>
          <CardDescription>Enable or disable paid plan purchases for all users</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleTogglePurchases}
            disabled={togglingPurchases}
            className={cn(
              'flex items-center justify-between w-full p-4 rounded-lg border-2 transition-all',
              purchasesEnabled ? 'border-success/50 bg-success/5' : 'border-border'
            )}
          >
            <div className="flex items-center gap-3">
              {purchasesEnabled ? (
                <ToggleRight className="h-6 w-6 text-success" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-muted-foreground" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium">Purchases {purchasesEnabled ? 'Enabled' : 'Disabled'}</p>
                <p className="text-xs text-muted-foreground">
                  {purchasesEnabled ? 'Users can buy Pro and Premium plans' : 'Upgrade buttons show "Coming Soon"'}
                </p>
              </div>
            </div>
            <Badge variant={purchasesEnabled ? 'success' : 'secondary'}>
              {purchasesEnabled ? 'ON' : 'OFF'}
            </Badge>
          </button>
        </CardContent>
      </Card>

      {/* Account & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Account & Security</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-xs text-muted-foreground">Receive study reminders and updates</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Change password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Reset via email</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
