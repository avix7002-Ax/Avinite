import { useState, type FormEvent } from 'react';
import {
  User, Mail, Calendar, Target, Clock, Save, Check,
  Sun, Moon, Palette, Zap, Sparkles, X, Play, Bell,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingPage } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserStats } from '@/hooks/useUserStats';
import { useRevisionProgress } from '@/hooks/useRevisionProgress';
import { useTheme, themeColorOptions, type ThemeColor, type AnimationMode } from '@/hooks/useTheme';
import { useIntro } from '@/hooks/useIntro';
import { UpgradeModal } from '@/components/UpgradeModal';
import { TIERS } from '@/lib/subscription';
import { supabase } from '@/lib/supabase';
import { getInitials, formatDate, cn } from '@/lib/utils';
import { Crown, Lock } from 'lucide-react';

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats } = useUserStats();
  const { completedCount, completionPercent } = useRevisionProgress();
  const { tier, isPro, isPremium, purchasesEnabled, upgrade } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const chaptersCount = 16;
  const { mode, color, animations, setMode, setColor, setAnimations } = useTheme();
  const { resetIntro } = useIntro();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [examDate, setExamDate] = useState(profile?.exam_date || '');
  const [dailyHours, setDailyHours] = useState(String(profile?.daily_study_hours || 2));
  const [targetPercentage, setTargetPercentage] = useState(String(profile?.target_percentage || 90));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [introReplayed, setIntroReplayed] = useState(false);

  if (!user) return <LoadingPage />;

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await supabase.from('profiles').upsert({
      id: user!.id,
      full_name: fullName,
      exam_date: examDate || null,
      daily_study_hours: parseFloat(dailyHours),
      target_percentage: parseInt(targetPercentage),
    });

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReplayIntro() {
    resetIntro();
    setIntroReplayed(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  const animationOptions: { val: AnimationMode; label: string; icon: LucideIcon }[] = [
    { val: 'full', label: 'Full', icon: Zap },
    { val: 'reduced', label: 'Reduced', icon: Sparkles },
    { val: 'off', label: 'Off', icon: X },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 font-display">
          <User className="h-7 w-7 text-primary" />
          Profile & Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account, study preferences, and appearance.</p>
      </div>

      {/* Profile header */}
      <Card className="glass-card lift-on-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xl font-semibold">
              {getInitials(profile?.full_name || user.email || 'U')}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{profile?.full_name || 'Student'}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {user.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Joined {formatDate(profile?.created_at || user.created_at)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                tier === 'premium' ? 'bg-gradient-to-r from-primary to-accent text-white' :
                tier === 'pro' ? 'bg-primary/10 text-primary' :
                'bg-muted text-muted-foreground'
              )}>
                {(isPro || isPremium) && <Crown className="h-3 w-3" />}
                {TIERS[tier].name} Plan
              </div>
              {tier !== 'premium' && (
                <Button size="sm" variant="outline" onClick={() => setShowUpgrade(true)}>
                  {purchasesEnabled ? <>Upgrade</> : <><Lock className="h-3 w-3 mr-1" /> View Plans</>}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier={tier}
        purchasesEnabled={purchasesEnabled}
        onUpgrade={upgrade}
      />

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card lift-on-hover">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{stats.totalQuestionsPractised}</p>
            <p className="text-xs text-muted-foreground">Questions Practised</p>
          </CardContent>
        </Card>
        <Card className="glass-card lift-on-hover">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{stats.totalMockTests}</p>
            <p className="text-xs text-muted-foreground">Mock Tests</p>
          </CardContent>
        </Card>
        <Card className="glass-card lift-on-hover">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{stats.bestMockScore}%</p>
            <p className="text-xs text-muted-foreground">Best Score</p>
          </CardContent>
        </Card>
        <Card className="glass-card lift-on-hover">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{completedCount}/{chaptersCount}</p>
            <p className="text-xs text-muted-foreground">Chapters Revised</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Appearance & Settings ── */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance & Settings
          </CardTitle>
          <CardDescription>Customise how Avinite AI looks and feels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('light')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all flex-1 justify-center',
                  mode === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                )}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
              <button
                onClick={() => setMode('dark')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all flex-1 justify-center',
                  mode === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                )}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>
          </div>

          {/* Accent color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Accent Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {themeColorOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setColor(opt.name as ThemeColor)}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all hover:scale-105',
                    color === opt.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                  )}
                >
                  <span className="h-5 w-5 rounded-full" style={{ backgroundColor: opt.swatch }} />
                  <span className="text-xs font-medium">{opt.label}</span>
                  {color === opt.name && <Check className="h-3 w-3 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Animation settings */}
          <div>
            <label className="text-sm font-medium mb-2 block">Animations</label>
            <div className="flex gap-2">
              {animationOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.val}
                    onClick={() => setAnimations(opt.val as AnimationMode)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all flex-1 justify-center',
                      animations === opt.val ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Icon className="h-4 w-4" /> {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {animations === 'full' && 'All animations and transitions are enabled for the best experience.'}
              {animations === 'reduced' && 'Animations are simplified for users who prefer less motion.'}
              {animations === 'off' && 'All animations are disabled for maximum performance and accessibility.'}
            </p>
          </div>

          {/* Replay welcome intro */}
          <div className="pt-4 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Replay Welcome Animation</p>
                <p className="text-xs text-muted-foreground mt-0.5">See the cinematic intro again.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplayIntro}
                className="ripple-btn"
                disabled={introReplayed}
              >
                {introReplayed ? (
                  <><Check className="h-3.5 w-3.5 mr-1" /> Reloading...</>
                ) : (
                  <><Play className="h-3.5 w-3.5 mr-1" /> Replay</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      <Card className="glass-card">
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle>Study Preferences</CardTitle>
            <CardDescription>Customise your learning experience and study plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Exam Date
                </label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Daily Hours
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Target className="h-4 w-4" /> Target %
                </label>
                <Input
                  type="number"
                  min="50"
                  max="100"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving} className="ripple-btn">
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" /> Save Changes
                  </>
                )}
              </Button>
              {saved && (
                <Badge variant="success">
                  <Check className="h-3 w-3 mr-1" /> Saved
                </Badge>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
