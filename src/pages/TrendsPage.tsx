import { TrendingUp, BarChart3, Flame, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { chapters, subjects, totalWeightage } from '@/lib/data';
import { cn, getSubjectColor, getSubjectBg } from '@/lib/utils';

export function TrendsPage() {
  const sortedByWeightage = [...chapters].sort((a, b) => b.weightage - a.weightage);
  const maxWeightage = Math.max(...chapters.map((c) => c.weightage));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          PYQ Trend Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Chapter weightage, frequently tested topics, and difficulty trends with visual charts.
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{chapters.length}</p>
            <p className="text-xs text-muted-foreground">Total Chapters</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalWeightage}</p>
            <p className="text-xs text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="h-6 w-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {chapters.reduce((sum, c) => sum + c.pyqCount, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total PYQs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="h-6 w-6 text-chart-4 mx-auto mb-2" />
            <p className="text-2xl font-bold">{subjects.length}</p>
            <p className="text-xs text-muted-foreground">Subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Weightage chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chapter Weightage (Marks)</CardTitle>
          <CardDescription>Marks distribution across all 16 chapters based on PYQ analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedByWeightage.map((chapter, i) => {
              const widthPercent = (chapter.weightage / maxWeightage) * 100;
              return (
                <div key={chapter.id} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                  <div className="w-48 flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-medium truncate">{chapter.name}</p>
                    <p className={cn('text-xs', getSubjectColor(chapter.subject))}>{chapter.subject}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-7 rounded-md bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-md transition-all duration-500', getSubjectBg(chapter.subject))}
                          style={{ width: `${widthPercent}%` }}
                        >
                          <div className={cn('h-full bg-gradient-to-r opacity-80', `from-chart-1 to-accent`)} style={{ width: '100%' }} />
                        </div>
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">{chapter.weightage}</span>
                    </div>
                    <div className="sm:hidden">
                      <p className="text-sm font-medium mt-1">{chapter.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const subjectChapters = chapters.filter((c) => c.subject === subject.name);
          const totalMarks = subjectChapters.reduce((s, c) => s + c.weightage, 0);
          const totalPyqs = subjectChapters.reduce((s, c) => s + c.pyqCount, 0);

          return (
            <Card key={subject.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={cn('text-lg', getSubjectColor(subject.name))}>{subject.name}</CardTitle>
                  <Badge variant="secondary">{totalMarks} marks</Badge>
                </div>
                <CardDescription>{subjectChapters.length} chapters · {totalPyqs} PYQs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {subjectChapters.map((chapter) => (
                  <div key={chapter.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{chapter.name}</span>
                      <span className="text-xs text-muted-foreground">{chapter.pyqCount} PYQs</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary/60 transition-all duration-500"
                        style={{ width: `${(chapter.pyqCount / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Difficulty distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Difficulty Distribution</CardTitle>
          <CardDescription>How chapters are distributed by difficulty level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {(['Easy', 'Medium', 'Hard'] as const).map((level) => {
              const count = chapters.filter((c) => c.difficulty === level).length;
              const percent = (count / chapters.length) * 100;
              const colors = {
                Easy: 'bg-success/10 text-success border-success/20',
                Medium: 'bg-warning/10 text-warning border-warning/20',
                Hard: 'bg-error/10 text-error border-error/20',
              };
              return (
                <div key={level} className={cn('rounded-lg border p-4 text-center', colors[level])}>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-sm font-medium mt-1">{level}</p>
                  <p className="text-xs opacity-70 mt-1">{Math.round(percent)}% of chapters</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* High-weightage chapters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">High-Priority Chapters</CardTitle>
          <CardDescription>Focus on these chapters first — they carry the most marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedByWeightage.slice(0, 5).map((chapter, i) => (
              <div key={chapter.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chapter.name}</p>
                  <p className="text-xs text-muted-foreground">{chapter.subject} · {chapter.pyqCount} PYQs</p>
                </div>
                <Badge variant="default">{chapter.weightage} marks</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
