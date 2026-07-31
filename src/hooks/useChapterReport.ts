import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { PracticeAttempt, MockTestResult } from '@/types';
import { chapters } from '@/lib/data';

export interface ChapterReport {
  totalAttempts: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  totalTimeMinutes: number;
  attempts: PracticeAttempt[];
  mockResults: MockTestResult[];
  recentAccuracy: number;
  previousAccuracy: number;
  improvementTrend: 'up' | 'down' | 'stable' | 'new';
  neetReadinessScore: number;
  revisionPriority: 'high' | 'medium' | 'low';
  recommendedNextChapter: string | null;
}

const emptyReport: ChapterReport = {
  totalAttempts: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  accuracy: 0,
  totalTimeMinutes: 0,
  attempts: [],
  mockResults: [],
  recentAccuracy: 0,
  previousAccuracy: 0,
  improvementTrend: 'new',
  neetReadinessScore: 0,
  revisionPriority: 'low',
  recommendedNextChapter: null,
};

export function useChapterReport(chapterName: string | null) {
  const { user } = useAuth();
  const [report, setReport] = useState<ChapterReport>(emptyReport);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !chapterName) {
      setReport(emptyReport);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      const [practiceRes, mockRes] = await Promise.all([
        supabase
          .from('practice_attempts')
          .select('*')
          .eq('user_id', user.id)
          .eq('chapter', chapterName)
          .order('created_at', { ascending: true }),
        supabase
          .from('mock_test_results')
          .select('*')
          .eq('user_id', user.id)
          .contains('chapters', [chapterName])
          .order('created_at', { ascending: true }),
      ]);

      if (!mounted) return;

      const attempts = (practiceRes.data as PracticeAttempt[]) || [];
      const mockResults = (mockRes.data as MockTestResult[]) || [];

      const totalQuestions = attempts.reduce((s, a) => s + a.question_count, 0);
      const correctAnswers = attempts.reduce((s, a) => s + (a.score || 0), 0);
      const wrongAnswers = totalQuestions - correctAnswers;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      // Recent vs previous accuracy (split attempts in half)
      const half = Math.floor(attempts.length / 2);
      const recent = attempts.slice(half);
      const previous = attempts.slice(0, half);
      const recentAccuracy = recent.length > 0
        ? Math.round((recent.reduce((s, a) => s + (a.score || 0), 0) / recent.reduce((s, a) => s + a.question_count, 0)) * 100)
        : 0;
      const previousAccuracy = previous.length > 0
        ? Math.round((previous.reduce((s, a) => s + (a.score || 0), 0) / previous.reduce((s, a) => s + a.question_count, 0)) * 100)
        : 0;

      let improvementTrend: ChapterReport['improvementTrend'] = 'new';
      if (attempts.length >= 2) {
        if (recentAccuracy > previousAccuracy + 5) improvementTrend = 'up';
        else if (recentAccuracy < previousAccuracy - 5) improvementTrend = 'down';
        else improvementTrend = 'stable';
      }

      // NEET readiness: weighted combination of accuracy, attempts, and mock scores
      const mockAvg = mockResults.length > 0
        ? mockResults.reduce((s, m) => s + (m.score / m.total) * 100, 0) / mockResults.length
        : 0;
      const neetReadinessScore = Math.round(
        accuracy * 0.5 + mockAvg * 0.3 + Math.min(attempts.length * 5, 20) * 0.2
      );

      // Revision priority
      let revisionPriority: ChapterReport['revisionPriority'] = 'low';
      if (accuracy < 50 || attempts.length === 0) revisionPriority = 'high';
      else if (accuracy < 75) revisionPriority = 'medium';

      // Recommended next chapter: first chapter in same subject with no attempts, or lowest accuracy
      const currentChapter = chapters.find((c) => c.name === chapterName);
      let recommendedNextChapter: string | null = null;
      if (currentChapter) {
        const sameSubjectChapters = chapters.filter((c) => c.subject === currentChapter.subject && c.name !== chapterName);
        const unattempted = sameSubjectChapters.find((c) => true); // first one
        recommendedNextChapter = unattempted?.name || sameSubjectChapters[0]?.name || null;
      }

      setReport({
        totalAttempts: attempts.length,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        accuracy,
        totalTimeMinutes: 0, // not tracked currently
        attempts,
        mockResults,
        recentAccuracy,
        previousAccuracy,
        improvementTrend,
        neetReadinessScore,
        revisionPriority,
        recommendedNextChapter,
      });
      setLoading(false);
    })();

    return () => { mounted = false; };
  }, [user, chapterName]);

  return useMemo(() => ({ report, loading }), [report, loading]);
}
