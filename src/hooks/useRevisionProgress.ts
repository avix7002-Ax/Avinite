import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { RevisionProgress } from '@/types';
import { chapters } from '@/lib/data';

export function useRevisionProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, RevisionProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('revision_progress')
        .select('*')
        .eq('user_id', user.id);

      if (!mounted) return;

      if (error) {
        console.error('Error loading revision progress:', error);
      }

      const progressMap: Record<string, RevisionProgress> = {};
      (data as RevisionProgress[] || []).forEach((p) => {
        progressMap[p.chapter] = p;
      });
      setProgress(progressMap);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const updateStatus = useCallback(async (chapterName: string, status: RevisionProgress['status']) => {
    if (!user) return { error: 'Not authenticated' };

    setProgress((prev) => {
      const existing = prev[chapterName];
      if (existing) {
        supabase
          .from('revision_progress')
          .update({
            status,
            last_revised: status === 'completed' ? new Date().toISOString() : existing.last_revised,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .then(({ data, error }) => {
            if (!error && data) {
              setProgress((p) => ({ ...p, [chapterName]: data as RevisionProgress }));
            }
          });
      } else {
        supabase
          .from('revision_progress')
          .insert({
            chapter: chapterName,
            status,
            last_revised: status === 'completed' ? new Date().toISOString() : null,
          })
          .select()
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setProgress((p) => ({ ...p, [chapterName]: data as RevisionProgress }));
            }
          });
      }
      return prev; // no optimistic update here; the .then() will update
    });

    return { error: null };
  }, [user]);

  return useMemo(() => {
    const values = Object.values(progress);
    const completedCount = values.filter((p) => p.status === 'completed').length;
    const inProgressCount = values.filter((p) => p.status === 'in-progress').length;
    const notStartedCount = chapters.length - completedCount - inProgressCount;

    return {
      progress,
      loading,
      updateStatus,
      completedCount,
      inProgressCount,
      notStartedCount,
      completionPercent: Math.round((completedCount / chapters.length) * 100),
    };
  }, [progress, loading, updateStatus]);
}
