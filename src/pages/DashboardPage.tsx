import { Link } from 'react-router-dom';
import {
  PenTool,
  MessageCircleQuestion,
  RefreshCw,
  FileClock,
  CalendarDays,
  TrendingUp,
  FileText,
  Bot,
  Search,
  Bookmark,
  ArrowRight,
  Flame,
  Target,
  Trophy,
  BookOpen,
  Clock,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingPage } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserStats } from '@/hooks/useUserStats';
import { useRevisionProgress } from '@/hooks/useRevisionProgress';
import { chapters, subjects } from '@/lib/data';
import { formatDate, getInitials, cn } from '@/lib/utils';
import { AviniteLogo } from '@/components/AviniteLogo';
import { Lock } from 'lucide-react';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const { stats, loading } = useUserStats();
  const { completedCount, completionPercent } = useRevisionProgress();
  const { canAccessMockTest, canAccessStudyPlanner, canAccessPYQ, canAccessCompanion } = useSubscription();

  if (loading) return <LoadingPage />;

  const quickActions: { label: string; href: string; icon: LucideIcon; color: string; desc: string; locked?: boolean }[] = [
    { label: 'Avinite AI', href: '/avinex-ai', icon: Bot, color: 'from-blue-500 to-indigo-500', desc: 'Ask any question' },
    { label: 'Practice', href: '/practice', icon: PenTool, color: 'from-green-500 to-teal-500', desc: 'AI questions' },
    { label: 'Doubt Solver', href: '/doubt-solver', icon: MessageCircleQuestion, color: 'from-orange-500 to-amber-500', desc: 'Get explanations' },
    { label: 'Revision', href: '/revision', icon: RefreshCw, color: 'from-purple-500 to-pink-500', desc: 'Notes & flashcards' },
    { label: 'Mock Test', href: '/mock-test', icon: FileClock, color: 'from-rose-500 to-red-500', desc: 'Timed tests', locked: !canAccessMockTest },
    { label: 'Study Planner', href: '/study-planner', icon: CalendarDays, color: 'from-cyan-500 to-blue-500', desc: 'Custom timetable', locked: !canAccessStudyPlanner },
    { label: 'PYQ Trends', href: '/trends', icon: TrendingUp, color: 'from-violet-500 to-purple-500', desc: 'Chapter weightage' },
    { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark, color: 'from-emerald-500 to-green-500', desc: 'Saved items' },
  ];

  // Determine study streak from stats (mock calculation based on recent activity)
  const studyStreak = Math.min(stats.recentPractice.length + stats.recentMockTests.length, 7);
  const dailyGoalHours = profile?.daily_study_hours || 2;
  const dailyProgress = Math.min((stats.totalQuestionsPractised / Math.max(1, dailyGoalHours * 10)) * 100, 100);
  const featuredChapters = chapters.slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Welcome header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-1">Here's your Science prep overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold">{studyStreak} day streak</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold">
            {getInitials(profile?.full_name || user?.email || 'U')}
          </div>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: PenTool, label: 'Questions Practised', value: stats.totalQuestionsPractised, color: 'text-chart-1', bg: 'bg-chart-1/10' },
          { icon: FileClock, label: 'Mock Tests Taken', value: stats.totalMockTests, color: 'text-accent', bg: 'bg-accent/10' },
          { icon: Trophy, label: 'Best Mock Score', value: `${stats.bestMockScore}%`, color: 'text-warning', bg: 'bg-warning/10' },
          { icon: BookOpen, label: 'Chapters Revised', value: `${completedCount}/${chapters.length}`, color: 'text-chart-2', bg: 'bg-chart-2/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="glass-card hover:shadow-lg lift-on-hover group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110', stat.bg, stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Daily Progress + Study Streak ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily progress */}
        <Card className="glass-card lg:col-span-2 lift-on-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Daily Progress
                </CardTitle>
                <CardDescription className="mt-1">Track your daily study goals</CardDescription>
              </div>
              <Badge variant={dailyProgress >= 100 ? 'success' : 'default'}>{Math.round(dailyProgress)}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-4 rounded-full bg-muted overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 relative overflow-hidden"
                style={{ width: `${dailyProgress}%` }}
              >
                <div className="absolute inset-0 shimmer-bg" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {dailyProgress >= 100 ? 'Daily goal completed! Great work!' : `Keep going — ${Math.round(100 - dailyProgress)}% to go`}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Goal: {dailyGoalHours}h study
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study streak */}
        <Card className="glass-card lift-on-hover">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-bold gradient-text-brand">{studyStreak}</div>
              <div className="text-sm text-muted-foreground">days in a row</div>
            </div>
            <div className="flex gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 h-12 rounded-lg flex items-center justify-center transition-all',
                    i < studyStreak
                      ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md'
                      : 'bg-muted/50 text-muted-foreground/40'
                  )}
                >
                  {i < studyStreak ? (
                    <Flame className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Revision Progress bar ── */}
      <Card className="glass-card lift-on-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Revision Progress</CardTitle>
            <Badge variant={completionPercent === 100 ? 'success' : 'default'}>{completionPercent}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 rounded-full bg-muted overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 relative overflow-hidden"
              style={{ width: `${completionPercent}%` }}
            >
              <div className="absolute inset-0 shimmer-bg" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            You've revised {completedCount} out of {chapters.length} chapters. {completionPercent < 100 ? 'Keep going!' : 'All chapters revised — amazing!'}
          </p>
        </CardContent>
      </Card>

      {/* ── Quick Actions ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-display">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.href}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Card className="glass-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 group h-full">
                  <CardContent className="flex flex-col items-center justify-center py-6 gap-2.5">
                    <div className="relative">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white group-hover:scale-110 group-hover:rotate-3 transition-transform', action.color)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {action.locked && (
                        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 border-border">
                          <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                    <span className="text-xs text-muted-foreground">{action.desc}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Continue Learning ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-display">Continue Learning</h2>
          <Link to="/search">
            <Button variant="ghost" size="sm">
              Browse all <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredChapters.map((chapter, i) => (
            <Link
              key={chapter.id}
              to={`/search?subject=${chapter.subject}&chapter=${chapter.name}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Card className="glass-card hover:shadow-lg hover:border-primary/30 lift-on-hover group h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold', chapter.subject === 'Physics' ? 'bg-chart-1/10 text-chart-1' : chapter.subject === 'Chemistry' ? 'bg-chart-3/10 text-chart-3' : chapter.subject === 'Biology' ? 'bg-accent/10 text-accent' : 'bg-chart-2/10 text-chart-2')}>
                      {chapter.name.slice(0, 2).toUpperCase()}
                    </div>
                    <Badge variant="secondary" className="text-xs">{chapter.pyqCount} PYQs</Badge>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{chapter.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{chapter.subject}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Link to={`/practice?subject=${chapter.subject}&chapter=${chapter.name}`} onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-primary hover:underline">Practice</span>
                    </Link>
                    <span className="text-muted-foreground/30 text-xs">|</span>
                    <Link to={`/revision?subject=${chapter.subject}&chapter=${chapter.name}`} onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-primary hover:underline">Revise</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card lift-on-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Practice</CardTitle>
              <Link to="/practice">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentPractice.length === 0 ? (
              <div className="text-center py-8">
                <PenTool className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No practice yet. Start practising!</p>
                <Link to="/practice">
                  <Button size="sm" className="mt-3 ripple-btn">Start Practice</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentPractice.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 -mx-2 px-2 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{attempt.chapter}</p>
                      <p className="text-xs text-muted-foreground">
                        {attempt.question_count} questions · {formatDate(attempt.created_at)}
                      </p>
                    </div>
                    {attempt.score !== null && attempt.total !== null && (
                      <Badge variant={attempt.score / attempt.total >= 0.7 ? 'success' : 'warning'}>
                        {attempt.score}/{attempt.total}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card lift-on-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Mock Tests</CardTitle>
              <Link to="/mock-test">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentMockTests.length === 0 ? (
              <div className="text-center py-8">
                <FileClock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No mock tests yet. Take your first test!</p>
                <Link to="/mock-test">
                  <Button size="sm" className="mt-3 ripple-btn">Start Mock Test</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentMockTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 -mx-2 px-2 rounded-lg">
                    <div>
                      <p className="text-sm font-medium capitalize">{test.test_type} Test</p>
                      <p className="text-xs text-muted-foreground">
                        {test.score}/{test.total} · {formatDate(test.created_at)}
                      </p>
                    </div>
                    {test.predicted_score !== null && (
                      <Badge variant={test.predicted_score >= 75 ? 'success' : 'warning'}>
                        Predicted: {test.predicted_score}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Subjects Overview ── */}
      <div>
        <h2 className="text-xl font-semibold mb-4 font-display">Subjects</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject, i) => (
            <Link
              key={subject.name}
              to={`/search?subject=${subject.name}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Card className="glass-card hover:shadow-lg hover:border-primary/30 lift-on-hover group h-full">
                <CardContent className="pt-6">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg mb-2 group-hover:scale-110 transition-transform', subject.gradient)}>
                    {subject.name === 'Physics' && <BookOpen className="h-5 w-5 text-white" />}
                    {subject.name === 'Chemistry' && <BookOpen className="h-5 w-5 text-white" />}
                    {subject.name === 'Biology' && <BookOpen className="h-5 w-5 text-white" />}
                    {subject.name === 'Environment' && <BookOpen className="h-5 w-5 text-white" />}
                  </div>
                  <p className="font-semibold">{subject.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{subject.chapterCount} chapters</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
