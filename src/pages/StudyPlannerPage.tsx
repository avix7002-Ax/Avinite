import { useState, type FormEvent } from 'react';
import { CalendarDays, Clock, Target, Check, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { chapters } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { daysUntil, cn } from '@/lib/utils';
import type { StudyPhase, WeeklySchedule } from '@/types';

export function StudyPlannerPage() {
  const { user } = useAuth();
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState('2');
  const [targetPercentage, setTargetPercentage] = useState('90');
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [plan, setPlan] = useState<{ phases: StudyPhase[]; weekly: WeeklySchedule[]; daysLeft: number } | null>(null);
  const [generating, setGenerating] = useState(false);

  function toggleChapter(name: string) {
    setCompletedChapters((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!examDate) return;

    setGenerating(true);

    setTimeout(() => {
      const days = daysUntil(examDate);
      const hours = parseFloat(dailyHours);
      const target = parseInt(targetPercentage);
      const remaining = chapters.length - completedChapters.length;

      // Generate phases
      const phases: StudyPhase[] = [
        {
          name: 'Phase 1: Learning',
          duration: `${Math.ceil(days * 0.5)} days`,
          description: `Cover ${remaining} remaining chapters. Focus on understanding concepts and making notes.`,
          chapters: chapters.filter((c) => !completedChapters.includes(c.name)).map((c) => c.name),
        },
        {
          name: 'Phase 2: Practice & Revision',
          duration: `${Math.ceil(days * 0.3)} days`,
          description: 'Solve PYQs, take mock tests, and revise all chapters using flashcards and notes.',
          chapters: chapters.map((c) => c.name),
        },
        {
          name: 'Phase 3: Final Revision',
          duration: `${Math.ceil(days * 0.2)} days`,
          description: 'Full-syllabus mock tests, formula revision, and weak-chapter focus.',
          chapters: chapters.filter((c) => c.weightage >= 7).map((c) => c.name),
        },
      ];

      // Generate weekly schedule
      const weeks = Math.ceil(days / 7);
      const weekly: WeeklySchedule[] = [];
      const chaptersPerWeek = Math.ceil(remaining / Math.max(weeks * 0.5, 1));
      let chapterIdx = completedChapters.length;

      for (let w = 0; w < weeks; w++) {
        const weekChapters = chapters
          .slice(chapterIdx, chapterIdx + chaptersPerWeek)
          .map((c) => c.name);
        chapterIdx += chaptersPerWeek;

        const days_arr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayPlans = days_arr.map((day, di) => {
          const slots = [];
          const studyTime = `${hours}h`;

          if (di < 5) {
            slots.push({ time: 'Morning', activity: `Study: ${weekChapters[di % weekChapters.length] || 'Revision'}` });
            slots.push({ time: 'Evening', activity: 'Practice questions (30 min)' });
          } else {
            slots.push({ time: 'Morning', activity: 'Weekly revision + flashcards' });
            slots.push({ time: 'Afternoon', activity: 'Mock test (1h)' });
          }

          return { day, slots: slots.map((s) => ({ time: s.time, activity: s.activity })) };
        });

        weekly.push({
          week: w + 1,
          focus: w < weeks * 0.5 ? 'Chapter learning' : w < weeks * 0.8 ? 'Practice & PYQs' : 'Full revision & mock tests',
          days: dayPlans,
        });
      }

      setPlan({ phases, weekly, daysLeft: days });
      setGenerating(false);

      if (user) {
        supabase.from('study_plans').insert({
          exam_date: examDate,
          daily_hours: hours,
          target_percentage: target,
          completed_chapters: completedChapters,
          plan_data: { phases, weekly } as unknown as object,
        });
      }
    }, 500);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          Study Planner
        </h1>
        <p className="text-muted-foreground mt-1">
          Enter your exam date and goals to generate a personalised study schedule.
        </p>
      </div>

      {!plan && (
        <Card>
          <form onSubmit={handleGenerate}>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Fill in your details to generate a custom study plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Board Exam Date
                  </label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Daily Study Hours
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Target className="h-4 w-4" /> Target Percentage
                  </label>
                  <Input
                    type="number"
                    min="50"
                    max="100"
                    value={targetPercentage}
                    onChange={(e) => setTargetPercentage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Completed Chapters ({completedChapters.length} / {chapters.length})
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chapters.map((chapter) => {
                    const isDone = completedChapters.includes(chapter.name);
                    return (
                      <button
                        key={chapter.id}
                        type="button"
                        onClick={() => toggleChapter(chapter.name)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all',
                          isDone
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-primary/30'
                        )}
                      >
                        <div className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors flex-shrink-0',
                          isDone ? 'border-accent bg-accent text-white' : 'border-border'
                        )}>
                          {isDone && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{chapter.name}</p>
                          <p className="text-xs text-muted-foreground">{chapter.subject}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={generating}>
                {generating ? 'Generating plan...' : 'Generate Study Plan'}
              </Button>
            </CardContent>
          </form>
        </Card>
      )}

      {plan && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{plan.daysLeft}</p>
                <p className="text-xs text-muted-foreground">Days until exam</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">{chapters.length - completedChapters.length}</p>
                <p className="text-xs text-muted-foreground">Chapters left</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-6 w-6 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{dailyHours}h</p>
                <p className="text-xs text-muted-foreground">Daily study time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-6 w-6 text-chart-4 mx-auto mb-2" />
                <p className="text-2xl font-bold">{targetPercentage}%</p>
                <p className="text-xs text-muted-foreground">Target score</p>
              </CardContent>
            </Card>
          </div>

          {/* Phases */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Study Phases</h2>
            <div className="space-y-4">
              {plan.phases.map((phase, i) => (
                <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold">{phase.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                      </div>
                      <Badge variant="secondary">{phase.duration}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {phase.chapters.map((ch) => (
                        <span key={ch} className="text-xs px-2 py-1 rounded-md bg-muted">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Weekly schedule */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Schedule
            </h2>
            <div className="space-y-4">
              {plan.weekly.map((week) => (
                <Card key={week.week}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Week {week.week}</CardTitle>
                      <Badge variant="default">{week.focus}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                      {week.days.map((day) => (
                        <div key={day.day} className="border border-border rounded-lg p-3 min-h-[100px]">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">{day.day}</p>
                          <div className="space-y-1.5">
                            {day.slots.map((slot, si) => (
                              <div key={si} className="text-xs">
                                <p className="font-medium text-primary">{slot.time}</p>
                                <p className="text-muted-foreground">{slot.activity}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => setPlan(null)}>
            Create New Plan
          </Button>
        </div>
      )}
    </div>
  );
}
