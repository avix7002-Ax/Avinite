import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { AIMemory } from '@/types';

const defaultMemory: Omit<AIMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  preferred_language: null,
  preferred_style: null,
  study_goals: null,
  favourite_subjects: null,
  nickname: null,
  memory_enabled: true,
  student_class: null,
  stream: null,
  board: null,
  exam: null,
  weak_subjects: null,
  study_style: null,
  daily_goals: null,
};

export function useAIMemory() {
  const { user } = useAuth();
  const [memory, setMemory] = useState<AIMemory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMemory(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('ai_memory')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error('Error loading AI memory:', error);
        setMemory(null);
        setLoading(false);
        return;
      }

      if (data) {
        const mem = data as AIMemory;
        setMemory(mem);
      } else {
        const { data: created, error: createErr } = await supabase
          .from('ai_memory')
          .upsert({
            user_id: user.id,
            ...defaultMemory,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!createErr && created && mounted) {
          setMemory(created as AIMemory);
        }
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const saveMemory = useCallback(
    async (updates: Partial<typeof defaultMemory>) => {
      if (!user) return { error: 'Not authenticated' };

      const current = memory || defaultMemory;
      const merged = { ...current, ...updates };

      const { data, error } = await supabase
        .from('ai_memory')
        .upsert({
          user_id: user.id,
          ...merged,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        setMemory(data as AIMemory);
      }

      return { error: error?.message || null };
    },
    [user, memory]
  );

  const toggleMemory = useCallback(
    async (enabled: boolean) => {
      return saveMemory({ memory_enabled: enabled });
    },
    [saveMemory]
  );

  const deleteMemory = useCallback(async () => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('ai_memory').delete().eq('user_id', user.id);

    if (!error) {
      setMemory(null);
    }

    return { error: error?.message || null };
  }, [user]);

  return useMemo(
    () => ({ memory, loading, saveMemory, toggleMemory, deleteMemory }),
    [memory, loading, saveMemory, toggleMemory, deleteMemory]
  );
}
