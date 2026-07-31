import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { PracticeAttempt, MockTestResult } from '@/types';

interface RawStats {
  totalPractice: number;
  totalMockTests: number;
  avgMockScore: number;
  totalQuestionsPractised: number;
  bestMockScore: number;
  recentPractice: PracticeAttempt[];
  recentMockTests: MockTestResult[];
}

const emptyStats: RawStats = {
  totalPractice: 0,
  totalMockTests: 0,
  avgMockScore: 0,
  totalQuestionsPractised: 0,
  bestMockScore: 0,
  recentPractice: [],
  recentMockTests: [],
};

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RawStats>(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats(emptyStats);
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      // Fetch only the 5 most recent of each + aggregate counts in a single round-trip
      const [recentPracticeRes, recentMockRes, practiceCountRes, mockCountRes] = await Promise.all([
        supabase
          .from('practice_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('mock_test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('practice_attempts')
          .select('question_count')
          .eq('user_id', user.id),
        supabase
          .from('mock_test_results')
          .select('score, total')
          .eq('user_id', user.id),
      ]);

      if (!mounted) return;

      const recentPractice = (recentPracticeRes.data as PracticeAttempt[]) || [];
      const recentMockTests = (recentMockRes.data as MockTestResult[]) || [];
      const allPracticeCounts = (practiceCountRes.data as { question_count: number }[]) || [];
      const allMockScores = (mockCountRes.data as { score: number; total: number }[]) || [];

      const totalQuestions = allPracticeCounts.reduce((sum, p) => sum + p.question_count, 0);
      const mockPercentages = allMockScores.map((m) => (m.score / m.total) * 100);
      const avgMock = mockPercentages.length > 0 ? mockPercentages.reduce((a, b) => a + b, 0) / mockPercentages.length : 0;
      const bestMock = mockPercentages.length > 0 ? Math.max(...mockPercentages) : 0;

      setStats({
        totalPractice: allPracticeCounts.length,
        totalMockTests: allMockScores.length,
        avgMockScore: Math.round(avgMock),
        totalQuestionsPractised: totalQuestions,
        bestMockScore: Math.round(bestMock),
        recentPractice,
        recentMockTests,
      });
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  return useMemo(() => ({ stats, loading }), [stats, loading]);
}
