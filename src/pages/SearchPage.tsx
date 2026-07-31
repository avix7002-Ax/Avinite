import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, FileText, Brain, Lightbulb, Network, Zap, FileQuestion, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { subjects, chapters, getChapterBySlug } from '@/lib/data';
import { revisionContent } from '@/lib/revision-content';
import { pyqSeries } from '@/lib/pyq-series';
import type { Subject } from '@/types';
import { cn, getSubjectColor, getSubjectBg } from '@/lib/utils';

interface SearchResult {
  type: 'chapter' | 'note' | 'flashcard' | 'formula' | 'mnemonic' | 'pyq' | 'keyword';
  title: string;
  snippet: string;
  chapterName: string;
  subject: string;
  slug: string;
  link: string;
  icon: typeof FileText;
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubject = (searchParams.get('subject') as Subject | null) || null;
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<string>('all');

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Filter chapters by subject if set
    const relevantChapters = activeSubject
      ? chapters.filter((c) => c.subject === activeSubject)
      : chapters;

    // Search chapters
    relevantChapters.forEach((chapter) => {
      if (
        chapter.name.toLowerCase().includes(q) ||
        chapter.subject.toLowerCase().includes(q) ||
        chapter.topics.some((t) => t.toLowerCase().includes(q))
      ) {
        allResults.push({
          type: 'chapter',
          title: chapter.name,
          snippet: chapter.topics.join(', '),
          chapterName: chapter.name,
          subject: chapter.subject,
          slug: chapter.slug,
          link: `/revision?chapter=${chapter.slug}`,
          icon: BookOpen,
        });
      }
    });

    // Search notes, flashcards, formulas, mnemonics
    relevantChapters.forEach((chapter) => {
      const content = revisionContent[chapter.slug];
      if (!content) return;

      // Search notes
      content.notes.forEach((section) => {
        section.items.forEach((item) => {
          if (item.toLowerCase().includes(q)) {
            allResults.push({
              type: 'note',
              title: section.title,
              snippet: item,
              chapterName: chapter.name,
              subject: chapter.subject,
              slug: chapter.slug,
              link: `/revision?chapter=${chapter.slug}&tab=notes`,
              icon: FileText,
            });
          }
        });
      });

      // Search flashcards
      content.flashcards.forEach((card) => {
        if (card.front.toLowerCase().includes(q) || card.back.toLowerCase().includes(q)) {
          allResults.push({
            type: 'flashcard',
            title: card.front,
            snippet: card.back,
            chapterName: chapter.name,
            subject: chapter.subject,
            slug: chapter.slug,
            link: `/revision?chapter=${chapter.slug}&tab=flashcards`,
            icon: Brain,
          });
        }
      });

      // Search formulas
      content.formulas.forEach((formula) => {
        const searchText = `${formula.label} ${formula.formula} ${formula.usedFor} ${formula.commonMistakes} ${formula.example}`.toLowerCase();
        if (searchText.includes(q)) {
          allResults.push({
            type: 'formula',
            title: formula.label,
            snippet: formula.formula,
            chapterName: chapter.name,
            subject: chapter.subject,
            slug: chapter.slug,
            link: `/revision?chapter=${chapter.slug}&tab=formulas`,
            icon: Lightbulb,
          });
        }
      });

      // Search mnemonic
      if (content.mnemonic.toLowerCase().includes(q)) {
        allResults.push({
          type: 'mnemonic',
          title: `Mnemonic — ${chapter.name}`,
          snippet: content.mnemonic,
          chapterName: chapter.name,
          subject: chapter.subject,
          slug: chapter.slug,
          link: `/revision?chapter=${chapter.slug}&tab=mnemonic`,
          icon: Network,
        });
      }

      // Search exam meta keywords
      if (content.examMeta) {
        content.examMeta.boardKeywords.forEach((keyword) => {
          if (keyword.toLowerCase().includes(q)) {
            allResults.push({
              type: 'keyword',
              title: keyword,
              snippet: `Board keyword from ${chapter.name}`,
              chapterName: chapter.name,
              subject: chapter.subject,
              slug: chapter.slug,
              link: `/revision?chapter=${chapter.slug}&tab=lastshot`,
              icon: Zap,
            });
          }
        });

        // Search high priority topics
        content.examMeta.highPriorityTopics.forEach((topic) => {
          if (topic.topic.toLowerCase().includes(q) || topic.reason.toLowerCase().includes(q)) {
            allResults.push({
              type: 'keyword',
              title: topic.topic,
              snippet: topic.reason,
              chapterName: chapter.name,
              subject: chapter.subject,
              slug: chapter.slug,
              link: `/revision?chapter=${chapter.slug}&tab=lastshot`,
              icon: Zap,
            });
          }
        });

        // Search last minute shot
        content.lastMinuteShot.rapidRevision.forEach((point) => {
          if (point.toLowerCase().includes(q)) {
            allResults.push({
              type: 'keyword',
              title: `Last Minute: ${chapter.name}`,
              snippet: point,
              chapterName: chapter.name,
              subject: chapter.subject,
              slug: chapter.slug,
              link: `/revision?chapter=${chapter.slug}&tab=lastshot`,
              icon: Zap,
            });
          }
        });
      }
    });

    // Search PYQs
    relevantChapters.forEach((chapter) => {
      const pyqData = pyqSeries[chapter.slug];
      if (!pyqData) return;
      pyqData.questions.forEach((pq) => {
        if (pq.question.toLowerCase().includes(q) || pq.topic.toLowerCase().includes(q) || pq.modelAnswer.toLowerCase().includes(q)) {
          allResults.push({
            type: 'pyq',
            title: pq.question.slice(0, 80),
            snippet: `${pq.year} · ${pq.marks}M · ${pq.topic}`,
            chapterName: chapter.name,
            subject: chapter.subject,
            slug: chapter.slug,
            link: `/pyq-series?chapter=${chapter.slug}`,
            icon: FileQuestion,
          });
        }
      });
    });

    return allResults;
  }, [query, activeSubject]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    results.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [results]);

  const filteredResults = activeType === 'all' ? results : results.filter((r) => r.type === activeType);

  function setSubject(subject: Subject | null) {
    if (subject) {
      setSearchParams({ subject });
    } else {
      setSearchParams({});
    }
  }

  const typeIcons: Record<string, string> = {
    chapter: 'Chapter',
    note: 'Notes',
    flashcard: 'Flashcard',
    formula: 'Formula',
    mnemonic: 'Mnemonic',
    pyq: 'PYQ',
    keyword: 'Keyword / Exam',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Smart Search</h1>
        <p className="text-muted-foreground mt-1">
          Search across all chapters, notes, flashcards, formulas, PYQs, keywords, and mnemonics.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search anything... e.g. photosynthesis, Ohm's law, pH, Mendel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subject filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSubject(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            !activeSubject ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          All Subjects
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.name}
            onClick={() => setSubject(subject.name)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeSubject === subject.name ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {/* Type filters */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeIcons).map(([type, label]) => {
            if (typeCounts[type] === undefined && type !== 'all') return null;
            const count = typeCounts[type] || 0;
            if (count === 0 && type !== 'all') return null;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  activeType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {type === 'all' ? 'All' : label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Results */}
      {query.trim() && filteredResults.length > 0 && (
        <div className="space-y-3">
          {filteredResults.map((result, i) => {
            const Icon = result.icon;
            return (
              <Link
                key={i}
                to={result.link}
                className="block animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
              >
                <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0', getSubjectBg(result.subject))}>
                        <Icon className={cn('h-5 w-5', getSubjectColor(result.subject))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{typeIcons[result.type]}</Badge>
                          <span className={cn('text-xs', getSubjectColor(result.subject))}>{result.subject}</span>
                        </div>
                        <p className="font-medium text-sm">{result.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
                        <p className="text-xs text-muted-foreground mt-1">{result.chapterName}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Chapter browse when no query */}
      {!query.trim() && (
        <>
          <p className="text-sm text-muted-foreground">Or browse chapters directly:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeSubject ? chapters.filter((c) => c.subject === activeSubject) : chapters).map((chapter, i) => (
              <Link
                key={chapter.id}
                to={`/revision?chapter=${chapter.slug}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 group h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn('text-xs font-semibold', getSubjectColor(chapter.subject))}>
                            {chapter.subject}
                          </span>
                          <Badge variant="outline" className="text-xs">{chapter.difficulty}</Badge>
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{chapter.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {chapter.topics.slice(0, 3).map((topic) => (
                            <span key={topic} className={cn('text-xs px-2 py-0.5 rounded-md', getSubjectBg(chapter.subject))}>
                              {topic}
                            </span>
                          ))}
                          {chapter.topics.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-0.5">+{chapter.topics.length - 3} more</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary">{chapter.weightage} marks</Badge>
                        <span className="text-xs text-muted-foreground">{chapter.pyqCount} PYQs</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {query.trim() && filteredResults.length === 0 && (
        <div className="text-center py-16">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No results found for "{query}". Try a different term.</p>
        </div>
      )}
    </div>
  );
}
