import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { FileClock, Timer, Check, X, ArrowLeft, Award, RotateCw, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { chapters } from '@/lib/data';
import { generateMockQuestions, predictBoardScore, type MockQuestion } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn, formatTime } from '@/lib/utils';

type TestType = 'chapter' | 'full' | 'custom';

export function MockTestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [testType, setTestType] = useState<TestType>('chapter');
  const [selectedChapter, setSelectedChapter] = useState(chapters[0].slug);
  const [customChapters, setCustomChapters] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Mixed');
  const [timer, setTimer] = useState(10);

  const [phase, setPhase] = useState<'setup' | 'test' | 'result'>('setup');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [predictedScore, setPredictedScore] = useState(0);
  const [generating, setGenerating] = useState(false);

  // Stable refs for the timer callback so we don't recreate the interval
  const answersRef = useRef(answers);
  const questionsRef = useRef(questions);
  const timerRef = useRef(timer);
  const testTypeRef = useRef(testType);
  const selectedChapterRef = useRef(selectedChapter);
  const customChaptersRef = useRef(customChapters);
  const userRef = useRef(user);
  const phaseRef = useRef(phase);

  answersRef.current = answers;
  questionsRef.current = questions;
  timerRef.current = timer;
  testTypeRef.current = testType;
  selectedChapterRef.current = selectedChapter;
  customChaptersRef.current = customChapters;
  userRef.current = user;
  phaseRef.current = phase;

  // Returns chapter slugs — used for question generation (validated against data.ts)
  const getTestChapterSlugs = useCallback((): string[] => {
    if (testTypeRef.current === 'chapter') {
      return [selectedChapterRef.current];
    }
    if (testTypeRef.current === 'full') {
      return chapters.map((c) => c.slug);
    }
    return customChaptersRef.current;
  }, []);

  // Returns chapter names — used for database storage and display
  const getTestChapterNames = useCallback((): string[] => {
    const slugs = getTestChapterSlugs();
    return slugs.map((slug) => chapters.find((c) => c.slug === slug)!.name);
  }, [getTestChapterSlugs]);

  const handleSubmit = useCallback(() => {
    const qs = questionsRef.current;
    let correct = 0;
    qs.forEach((q) => {
      if (answersRef.current[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    const predicted = predictBoardScore(correct, qs.length);
    setPredictedScore(predicted);
    setPhase('result');

    if (userRef.current) {
      const elapsed = timerRef.current * 60 - (timeLeftRef.current || 0);
      supabase.from('mock_test_results').insert({
        test_type: testTypeRef.current,
        chapters: getTestChapterNames(),
        question_count: qs.length,
        difficulty: difficulty,
        score: correct,
        total: qs.length,
        time_taken_seconds: elapsed,
        predicted_score: predicted,
      });
    }
  }, [difficulty, getTestChapterNames]);

  const timeLeftRef = useRef(0);
  timeLeftRef.current = timeLeft;

  // Timer — single interval, only depends on `phase`
  useEffect(() => {
    if (phase !== 'test') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Defer submit to avoid setState-in-render
          setTimeout(() => handleSubmit(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, handleSubmit]);

  function handleStart(e: FormEvent) {
    e.preventDefault();

    if (testType === 'custom' && customChapters.length === 0) {
      return;
    }

    setGenerating(true);

    setTimeout(() => {
      const testChapterSlugs = getTestChapterSlugs();
      const generated = generateMockQuestions(testChapterSlugs, questionCount, difficulty);
      setQuestions(generated);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeft(timer * 60);
      setPhase('test');
      setGenerating(false);
    }, 600);
  }

  function handleAnswer(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleRestart() {
    setPhase('setup');
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(0);
  }

  function toggleCustomChapter(slug: string) {
    setCustomChapters((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  // Test phase
  if (phase === 'test' && questions.length > 0) {
    const current = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleRestart}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Exit Test
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant={timeLeft < 60 ? 'error' : timeLeft < 180 ? 'warning' : 'default'}>
              <Timer className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Q{currentIdx + 1}/{questions.length}
            </span>
          </div>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{current.type}</Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">{current.question.split('\n')[0]}</CardTitle>
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
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
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
          <Button
            variant="outline"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
          >
            Previous
          </Button>
          {currentIdx < questions.length - 1 ? (
            <Button onClick={() => setCurrentIdx((prev) => prev + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-1" /> Submit Test
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Result phase
  if (phase === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <div className={cn(
              'inline-flex h-20 w-20 items-center justify-center rounded-full mb-4',
              percentage >= 70 ? 'bg-success/10' : 'bg-warning/10'
            )}>
              <Award className={cn('h-10 w-10', percentage >= 70 ? 'text-success' : 'text-warning')} />
            </div>
            <h2 className="text-3xl font-bold mb-2">{score} / {questions.length}</h2>
            <p className="text-muted-foreground mb-4">You scored {percentage}%</p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Award className="h-5 w-5" />
              <span className="font-medium">Predicted Board Score: {predictedScore}%</span>
            </div>

            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCw className="h-4 w-4 mr-1" /> New Test
              </Button>
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            </div>
          </CardContent>
        </Card>

        {/* Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Answers</h3>
          {questions.map((q, i) => {
            const userAnswer = answers[q.id] || 'Not answered';
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <Card key={q.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5',
                      isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    )}>
                      {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-2">Q{i + 1}. {q.question.split('\n')[0]}</p>
                      <div className="space-y-1 text-sm">
                        <p className={cn('text-muted-foreground', isCorrect && 'text-success')}>
                          Your answer: {userAnswer}
                        </p>
                        {!isCorrect && <p className="text-success">Correct: {q.correctAnswer}</p>}
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

  // Setup phase
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <FileClock className="h-7 w-7 text-primary" />
          Mock Tests
        </h1>
        <p className="text-muted-foreground mt-1">
          Create chapter, full-syllabus, or custom tests with a timer and instant results.
        </p>
      </div>

      <Card>
        <form onSubmit={handleStart}>
          <CardHeader>
            <CardTitle>Test Type</CardTitle>
            <CardDescription>Choose what kind of test you want to take.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test type selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'chapter' as TestType, label: 'Chapter Test', sub: 'Test one chapter' },
                { id: 'full' as TestType, label: 'Full Syllabus', sub: 'All 16 chapters' },
                { id: 'custom' as TestType, label: 'Custom Test', sub: 'Pick chapters' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setTestType(type.id)}
                  className={cn(
                    'p-4 rounded-lg border-2 text-center transition-all',
                    testType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <p className="font-medium text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.sub}</p>
                </button>
              ))}
            </div>

            {/* Chapter selector */}
            {testType === 'chapter' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Chapter</label>
                <Select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.slug}>
                      {chapter.subject} — {chapter.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Custom chapter selection */}
            {testType === 'custom' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Chapters ({customChapters.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-border rounded-lg p-3">
                  {chapters.map((chapter) => (
                    <label
                      key={chapter.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={customChapters.includes(chapter.slug)}
                        onChange={() => toggleCustomChapter(chapter.slug)}
                        className="rounded"
                      />
                      <span className="text-sm">{chapter.subject} — {chapter.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Questions</label>
              <div className="flex gap-2">
                {[5, 10, 20, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                      questionCount === count
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
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
                      difficulty === level
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Timer (minutes)</label>
              <div className="flex gap-2">
                {[10, 15, 30, 60].map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setTimer(min)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                      timer === min
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    {min} m
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={generating || (testType === 'custom' && customChapters.length === 0)}>
              {generating ? (
                <>Preparing test...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Test
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
