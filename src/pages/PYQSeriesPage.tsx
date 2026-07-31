import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Filter, Star, Award, Lightbulb, ChevronDown, ChevronUp, BookmarkPlus, BookmarkCheck, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { chapters, subjects } from '@/lib/data';
import { getPYQData, type PYQQuestion } from '@/lib/pyq-series';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn, getSubjectColor, getSubjectBg } from '@/lib/utils';
import type { Subject } from '@/types';

export function PYQSeriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterSlug = searchParams.get('chapter') || chapters[0].slug;
  const [filter, setFilter] = useState<'all' | 'topic' | 'year' | 'frequent'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isBookmarked, addBookmark, removeBookmark, bookmarks } = useBookmarks();

  const chapter = useMemo(() => chapters.find((c) => c.slug === chapterSlug) || chapters[0], [chapterSlug]);
  const pyqData = useMemo(() => getPYQData(chapter.slug), [chapter.slug]);

  const topics = useMemo(() => {
    if (!pyqData) return [];
    return Array.from(new Set(pyqData.questions.map((q) => q.topic)));
  }, [pyqData]);

  const years = useMemo(() => {
    if (!pyqData) return [];
    return Array.from(new Set(pyqData.questions.map((q) => q.year))).sort((a, b) => Number(b) - Number(a));
  }, [pyqData]);

  const filteredQuestions = useMemo(() => {
    if (!pyqData) return [];
    let result = pyqData.questions;
    if (filter === 'topic' && selectedTopic) {
      result = result.filter((q) => q.topic === selectedTopic);
    } else if (filter === 'year' && selectedYear) {
      result = result.filter((q) => q.year === selectedYear);
    } else if (filter === 'frequent') {
      result = result.filter((q) => q.isFrequent);
    }
    return result;
  }, [pyqData, filter, selectedTopic, selectedYear]);

  function handleChapterChange(slug: string) {
    setSearchParams({ chapter: slug });
    setFilter('all');
    setSelectedTopic(null);
    setSelectedYear(null);
    setExpandedId(null);
  }

  function toggleBookmark(q: PYQQuestion) {
    const bookmarkTitle = `PYQ: ${q.question.slice(0, 80)}`;
    const existing = bookmarks.find((b) => b.title === bookmarkTitle);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark('question', bookmarkTitle, q.modelAnswer, chapter.name, chapter.subject);
    }
  }

  if (!pyqData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">PYQ Series</h1>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No PYQ data available for this chapter yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          PYQ Series
        </h1>
        <p className="text-muted-foreground mt-1">
          Original practice questions inspired by CBSE board patterns. Each question includes model answers, references, and writing tips.
        </p>
      </div>

      {/* Chapter selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={chapterSlug} onChange={(e) => handleChapterChange(e.target.value)}>
            {subjects.map((subject) => (
              <optgroup key={subject.name} label={subject.name}>
                {chapters.filter((c) => c.subject === subject.name).map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </CardContent>
      </Card>

      {/* Chapter overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" />
              Frequently Repeated Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {pyqData.frequentlyRepeatedConcepts.map((concept, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <Star className="h-3 w-3 text-warning flex-shrink-0 mt-1 fill-warning" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              Answer Writing Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {pyqData.answerWritingTips.map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-accent font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Related NCERT topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Related NCERT Topics & Exemplar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pyqData.relatedNCERTTopics.map((topic, i) => (
              <Badge key={`n-${i}`} variant="secondary" className="text-xs">NCERT: {topic}</Badge>
            ))}
            {pyqData.relatedNCERTExemplarTopics.map((topic, i) => (
              <Badge key={`e-${i}`} variant="outline" className="text-xs">Exemplar: {topic}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(['all', 'topic', 'year', 'frequent'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setSelectedTopic(null); setSelectedYear(null); }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize',
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {f === 'all' ? 'All Questions' : f === 'frequent' ? 'Frequently Repeated' : `By ${f}`}
          </button>
        ))}
        {filter === 'topic' && (
          <Select value={selectedTopic || ''} onChange={(e) => setSelectedTopic(e.target.value || null)} className="max-w-[200px]">
            <option value="">Select topic</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        )}
        {filter === 'year' && (
          <Select value={selectedYear || ''} onChange={(e) => setSelectedYear(e.target.value || null)} className="max-w-[150px]">
            <option value="">Select year</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{filteredQuestions.length} questions</span>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          const bookmarkTitle = `PYQ: ${q.question.slice(0, 80)}`;
          const bookmarked = isBookmarked(bookmarkTitle);
          return (
            <Card key={q.id} className={cn('transition-all', isExpanded && 'border-primary/30')}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{q.year}</Badge>
                      <Badge variant="outline" className="text-xs">{q.marks}M</Badge>
                      <Badge className={cn('text-xs', q.difficulty === 'Hard' ? 'bg-error/10 text-error' : q.difficulty === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success')}>
                        {q.difficulty}
                      </Badge>
                      {q.isFrequent && (
                        <Badge className="text-xs bg-warning/10 text-warning">
                          <Star className="h-3 w-3 mr-1 fill-warning" /> Frequent
                        </Badge>
                      )}
                      <span className={cn('text-xs', getSubjectColor(chapter.subject))}>{q.topic}</span>
                    </div>
                    <p className="font-medium text-sm mb-2">{q.question}</p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Hide answer <ChevronUp className="h-3 w-3" /></>
                      ) : (
                        <>Show model answer <ChevronDown className="h-3 w-3" /></>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => toggleBookmark(q)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1 flex-shrink-0"
                    aria-label="Bookmark question"
                  >
                    {bookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3 animate-fade-in">
                    {/* Model Answer */}
                    <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                      <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1">
                        <Award className="h-3 w-3" /> Model Answer
                      </p>
                      <p className="text-sm leading-relaxed">{q.modelAnswer}</p>
                    </div>

                    {/* Answer Tips */}
                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <p className="text-xs font-semibold text-accent mb-1.5 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" /> Answer Writing Tips
                      </p>
                      <ul className="space-y-1">
                        {q.answerTips.map((tip, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-accent">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reference */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Reference</p>
                      <div className="space-y-0.5">
                        <p className="text-xs"><span className="text-muted-foreground">Source:</span> <Badge variant="outline" className="text-xs">{q.reference.source}</Badge></p>
                        <p className="text-xs"><span className="text-muted-foreground">NCERT Chapter:</span> {q.reference.ncertChapter}</p>
                        <p className="text-xs"><span className="text-muted-foreground">NCERT Topic:</span> {q.reference.ncertTopic}</p>
                        <p className="text-xs"><span className="text-muted-foreground">NCERT Page:</span> {q.reference.ncertPage}</p>
                        {q.reference.ncertExemplar && (
                          <p className="text-xs"><span className="text-muted-foreground">NCERT Exemplar:</span> {q.reference.ncertExemplar}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No questions match this filter.</p>
        </div>
      )}
    </div>
  );
}
