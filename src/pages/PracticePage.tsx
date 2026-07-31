import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PenTool, Check, X, ArrowLeft, RotateCw, Award, Clock, AlertCircle, BookmarkPlus, BookmarkCheck, BarChart3, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { chapters } from '@/lib/data';
import { generatePracticeQuestions, type PracticeQuestion } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn, formatTime } from '@/lib/utils';

export function PracticePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBookmarked, addBookmark, removeBookmark, bookmarks } = useBookmarks();

  const chapterSlug = searchParams.get('chapter') || '';
  const initialChapter = useMemo(
    () => chapters.find((c) => c.slug === chapterSlug) || chapters[0],
    [chapterSlug]
  );

  const [selectedChapter, setSelectedChapter] = useState(initialChapter.slug);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Mixed');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [started, setStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [retryMode, setRetryMode] = useState(false);
  const [retryQuestions, setRetryQuestions] = useState<PracticeQuestion[]>([]);
  const [retryAnswers, setRetryAnswers] = useState<Record<string, string>>({});
  const [retryIdx, setRetryIdx] = useState(0);
  const [retryScore, setRetryScore] = useState(0);
  const [showRetryResult, setShowRetryResult] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<{ chapter: string; score: number; total: number; date: string }[]>([]);

  // Timer
  useEffect(() => {
    if (started && !showResult && !retryMode) {
      const interval = setInterval(() => setElapsedTime((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [started, showResult, retryMode]);

  // Load score history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('quiz-score-history');
    if (history) {
      try { setScoreHistory(JSON.parse(history)); } catch { /* ignore */ }
    }
  }, []);

  function saveScoreToHistory(chapterName: string, correct: number, total: number) {
    const entry = { chapter: chapterName, score: correct, total, date: new Date().toISOString() };
    const updated = [entry, ...scoreHistory].slice(0, 10);
    setScoreHistory(updated);
    localStorage.setItem('quiz-score-history', JSON.stringify(updated));
  }

  function handleStart(e: FormEvent) {
    e.preventDefault();
    setGenerating(true);
    const chapter = chapters.find((c) => c.slug === selectedChapter)!;
    const generated = generatePracticeQuestions(chapter.slug, questionCount, difficulty);
    setQuestions(generated);
    setCurrentIdx(0);
    setAnswers({});
    setShowResult(false);
    setStarted(true);
    setGenerating(false);
    setElapsedTime(0);
    setRetryMode(false);
    setShowRetryResult(false);
  }

  function handleAnswer(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleSubmit() {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setShowResult(true);

    const chapter = chapters.find((c) => c.slug === selectedChapter)!;
    saveScoreToHistory(chapter.name, correct, questionCount);

    if (user) {
      supabase.from('practice_attempts').insert({
        chapter: chapter.name,
        question_count: questionCount,
        difficulty,
        score: correct,
        total: questionCount,
      });
    }
  }

  function handleRetryWrong() {
    const wrong = questions.filter((q) => answers[q.id] !== q.correctAnswer);
    if (wrong.length === 0) return;
    setRetryQuestions(wrong);
    setRetryAnswers({});
    setRetryIdx(0);
    setRetryScore(0);
    setRetryMode(true);
    setShowRetryResult(false);
  }

  function handleRetryAnswer(questionId: string, answer: string) {
    setRetryAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleSubmitRetry() {
    let correct = 0;
    retryQuestions.forEach((q) => {
      if (retryAnswers[q.id] === q.correctAnswer) correct++;
    });
    setRetryScore(correct);
    setShowRetryResult(true);
  }

  function handleRestart() {
    setQuestions([]);
    setAnswers({});
    setShowResult(false);
    setStarted(false);
    setCurrentIdx(0);
    setScore(0);
    setRetryMode(false);
    setShowRetryResult(false);
  }

  function toggleBookmark(q: PracticeQuestion) {
    const bookmarkTitle = `Quiz: ${q.question.slice(0, 80)}`;
    const existing = bookmarks.find((b) => b.title === bookmarkTitle);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      const chapter = chapters.find((c) => c.slug === selectedChapter)!;
      addBookmark('question', bookmarkTitle, `${q.question}\n\nAnswer: ${q.correctAnswer}\n\nExplanation: ${q.explanation}`, chapter.name, chapter.subject);
    }
  }

  // Retry mode quiz UI
  if (retryMode && !showRetryResult) {
    const current = retryQuestions[retryIdx];
    const progress = ((retryIdx + 1) / retryQuestions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setRetryMode(false)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Results
          </Button>
          <span className="text-sm text-muted-foreground">
            Retry: Question {retryIdx + 1} of {retryQuestions.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-error/10 text-error">Retrying Wrong Questions</Badge>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-error transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{current.type}</Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">{current.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.options ? (
              current.options.map((option, i) => {
                const isSelected = retryAnswers[current.id] === option;
                return (
                  <button
                    key={i}
                    onClick={() => handleRetryAnswer(current.id, option)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })
            ) : (
              <textarea
                className="w-full min-h-[120px] p-4 rounded-lg border-2 border-border focus:border-primary outline-none resize-none text-sm bg-background"
                placeholder="Type your answer here..."
                value={retryAnswers[current.id] || ''}
                onChange={(e) => handleRetryAnswer(current.id, e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setRetryIdx((prev) => Math.max(0, prev - 1))} disabled={retryIdx === 0}>
            Previous
          </Button>
          {retryIdx < retryQuestions.length - 1 ? (
            <Button onClick={() => setRetryIdx((prev) => prev + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSubmitRetry}><Check className="h-4 w-4 mr-1" /> Submit Retry</Button>
          )}
        </div>
      </div>
    );
  }

  // Retry result
  if (retryMode && showRetryResult) {
    const percentage = Math.round((retryScore / retryQuestions.length) * 100);
    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <div className={cn('inline-flex h-20 w-20 items-center justify-center rounded-full mb-4', percentage >= 70 ? 'bg-success/10' : 'bg-warning/10')}>
              <Award className={cn('h-10 w-10', percentage >= 70 ? 'text-success' : 'text-warning')} />
            </div>
            <h2 className="text-3xl font-bold mb-2">{retryScore} / {retryQuestions.length}</h2>
            <p className="text-muted-foreground mb-6">
              Retry score: {percentage}% — {percentage >= 70 ? 'You got it now!' : 'Keep practising!'}
            </p>
            <Button onClick={() => setRetryMode(false)}>Back to Results</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active quiz
  if (started && questions.length > 0 && !showResult) {
    const current = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleRestart}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Exit
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> {formatTime(elapsedTime)}
            </span>
            <span className="text-sm text-muted-foreground">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{current.type}</Badge>
                <span className="text-xs text-muted-foreground">{current.chapter}</span>
              </div>
              <button
                onClick={() => toggleBookmark(current)}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Bookmark question"
              >
                {isBookmarked(`Quiz: ${current.question.slice(0, 80)}`)
                  ? <BookmarkCheck className="h-5 w-5 text-primary" />
                  : <BookmarkPlus className="h-5 w-5" />}
              </button>
            </div>
            <CardTitle className="text-lg leading-relaxed">{current.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.options ? (
              current.options.map((option, i) => {
                const isSelected = answers[current.id] === option;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(current.id, option)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })
            ) : (
              <textarea
                className="w-full min-h-[120px] p-4 rounded-lg border-2 border-border focus:border-primary outline-none resize-none text-sm bg-background"
                placeholder="Type your answer here..."
                value={answers[current.id] || ''}
                onChange={(e) => handleAnswer(current.id, e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))} disabled={currentIdx === 0}>
            Previous
          </Button>
          {currentIdx < questions.length - 1 ? (
            <Button onClick={() => setCurrentIdx((prev) => prev + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}><Check className="h-4 w-4 mr-1" /> Submit</Button>
          )}
        </div>
      </div>
    );
  }

  // Results
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const wrongCount = questions.length - score;
    const avgTimePerQuestion = Math.round(elapsedTime / questions.length);

    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <div className={cn('inline-flex h-20 w-20 items-center justify-center rounded-full mb-4', percentage >= 70 ? 'bg-success/10' : 'bg-warning/10')}>
              <Award className={cn('h-10 w-10', percentage >= 70 ? 'text-success' : 'text-warning')} />
            </div>
            <h2 className="text-3xl font-bold mb-2">{score} / {questions.length}</h2>
            <p className="text-muted-foreground mb-6">
              You scored {percentage}% — {percentage >= 70 ? 'Great work!' : 'Keep practising!'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <Timer className="h-5 w-5 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold">{avgTimePerQuestion}s</p>
                <p className="text-xs text-muted-foreground">Per Question</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <AlertCircle className="h-5 w-5 text-error mx-auto mb-1" />
                <p className="text-lg font-bold">{wrongCount}</p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              {wrongCount > 0 && (
                <Button variant="outline" onClick={handleRetryWrong}>
                  <RotateCw className="h-4 w-4 mr-1" /> Retry Wrong ({wrongCount})
                </Button>
              )}
              <Button variant="outline" onClick={handleRestart}>
                <RotateCw className="h-4 w-4 mr-1" /> New Practice
              </Button>
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>

        {/* Score history */}
        {scoreHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Recent Quiz Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scoreHistory.slice(0, 5).map((entry, i) => {
                  const pct = Math.round((entry.score / entry.total) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                      <div>
                        <p className="font-medium">{entry.chapter}</p>
                        <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <Badge variant={pct >= 70 ? 'success' : 'warning'}>{entry.score}/{entry.total} ({pct}%)</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review answers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Answers</h3>
          {questions.map((q, i) => {
            const userAnswer = answers[q.id] || 'Not answered';
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <Card key={q.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5', isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}>
                      {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-2">Q{i + 1}. {q.question.split('\n')[0]}</p>
                      <div className="space-y-1 text-sm">
                        <p className={cn('text-muted-foreground', isCorrect && 'text-success')}>
                          Your answer: {userAnswer}
                        </p>
                        {!isCorrect && (
                          <p className="text-success">Correct answer: {q.correctAnswer}</p>
                        )}
                        <p className="text-muted-foreground mt-2 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Setup screen
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <PenTool className="h-7 w-7 text-primary" />
          Practice Quiz
        </h1>
        <p className="text-muted-foreground mt-1">
          Test yourself with board-style questions. Includes timer, retry wrong questions, and score history.
        </p>
      </div>

      <Card>
        <form onSubmit={handleStart}>
          <CardHeader>
            <CardTitle>Configure Practice Session</CardTitle>
            <CardDescription>Choose a chapter, number of questions, and difficulty level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chapter</label>
              <Select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.slug}>
                    {chapter.subject} — {chapter.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <div className="flex gap-2">
                {[5, 10, 20, 30, 50].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                      questionCount === count ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <div className="flex gap-2">
                {['Mixed', 'Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                      difficulty === level ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={generating}>
              {generating ? 'Generating questions...' : (
                <>
                  <PenTool className="h-4 w-4 mr-2" />
                  Start {questionCount}-Question Quiz
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Score history on setup screen */}
      {scoreHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Your Recent Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scoreHistory.slice(0, 5).map((entry, i) => {
                const pct = Math.round((entry.score / entry.total) * 100);
                return (
                  <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                    <div>
                      <p className="font-medium">{entry.chapter}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <Badge variant={pct >= 70 ? 'success' : 'warning'}>{entry.score}/{entry.total} ({pct}%)</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
