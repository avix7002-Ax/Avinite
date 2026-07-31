import { useState } from 'react';
import { Bookmark as BookmarkIcon, Trash2, FileText, Brain, BookOpen, Lightbulb, Network, Zap, FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Spinner';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';
import type { Bookmark } from '@/types';

const typeIcons: Record<string, typeof FileText> = {
  question: FileQuestion,
  note: BookOpen,
  flashcard: Brain,
  formula: Lightbulb,
  mnemonic: Network,
  lastshot: Zap,
  pyq: FileText,
  topic: Lightbulb,
};

const typeColors: Record<string, string> = {
  question: 'bg-chart-1/10 text-chart-1',
  note: 'bg-accent/10 text-accent',
  flashcard: 'bg-chart-3/10 text-chart-3',
  formula: 'bg-warning/10 text-warning',
  mnemonic: 'bg-chart-4/10 text-chart-4',
  lastshot: 'bg-error/10 text-error',
  pyq: 'bg-primary/10 text-primary',
  topic: 'bg-chart-2/10 text-chart-2',
};

const typeLabels: Record<string, string> = {
  question: 'PYQ / Question',
  note: 'Note',
  flashcard: 'Flashcard',
  formula: 'Formula',
  mnemonic: 'Mnemonic',
  lastshot: 'Last Minute Shot',
  pyq: 'PYQ Series',
  topic: 'Topic',
};

const allTypes = ['all', 'question', 'note', 'flashcard', 'formula', 'mnemonic', 'lastshot', 'pyq', 'topic'] as const;

export function BookmarksPage() {
  const { bookmarks, loading, removeBookmark } = useBookmarks();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const counts = {
    all: bookmarks.length,
    question: bookmarks.filter((b) => b.type === 'question').length,
    note: bookmarks.filter((b) => b.type === 'note').length,
    flashcard: bookmarks.filter((b) => b.type === 'flashcard').length,
    formula: bookmarks.filter((b) => b.type === 'formula').length,
    mnemonic: bookmarks.filter((b) => b.type === 'mnemonic').length,
    lastshot: bookmarks.filter((b) => b.type === 'lastshot').length,
    pyq: bookmarks.filter((b) => b.type === 'pyq').length,
    topic: bookmarks.filter((b) => b.type === 'topic').length,
  };

  const filtered = activeFilter === 'all'
    ? bookmarks
    : bookmarks.filter((b) => b.type === activeFilter);

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BookmarkIcon className="h-7 w-7 text-primary" />
          Bookmarks
        </h1>
        <p className="text-muted-foreground mt-1">
          Your saved questions, notes, flashcards, formulas, mnemonics, and last-minute shots — all in one place.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              activeFilter === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {type === 'all' ? 'All' : typeLabels[type] || type} ({counts[type]})
          </button>
        ))}
      </div>

      {/* Bookmarks list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookmarks yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Save questions, notes, flashcards, formulas, and more from across the app.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((bookmark: Bookmark) => {
            const Icon = typeIcons[bookmark.type] || FileText;
            const colorClass = typeColors[bookmark.type] || 'bg-muted text-muted-foreground';
            return (
              <Card key={bookmark.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0', colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', colorClass)}>
                          {typeLabels[bookmark.type] || bookmark.type}
                        </span>
                        {bookmark.subject && (
                          <span className="text-xs text-muted-foreground">{bookmark.subject}</span>
                        )}
                      </div>
                      <h3 className="font-medium text-sm">{bookmark.title}</h3>
                      {bookmark.content && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3 whitespace-pre-wrap">
                          {bookmark.content}
                        </p>
                      )}
                      {bookmark.chapter && (
                        <p className="text-xs text-muted-foreground mt-2">{bookmark.chapter}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
