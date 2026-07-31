import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { ProUpgrade } from '@/types';

export function useProStatus() {
  const { user } = useAuth();
  const [proUpgrade, setProUpgrade] = useState<ProUpgrade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProUpgrade(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('pro_upgrades')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error('Error loading pro status:', error);
      }
      setProUpgrade((data as ProUpgrade) || null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const upgradeToPro = useCallback(async () => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('pro_upgrades')
      .upsert({
        user_id: user.id,
        is_pro: true,
        amount: 30,
        upgraded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      setProUpgrade(data as ProUpgrade);
    }

    return { error: error?.message || null };
  }, [user]);

  return useMemo(
    () => ({
      isPro: proUpgrade?.is_pro ?? false,
      proUpgrade,
      loading,
      upgradeToPro,
    }),
    [proUpgrade, loading, upgradeToPro]
  );
}
