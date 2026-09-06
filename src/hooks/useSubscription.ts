import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { TIERS, hasFeature } from '@/lib/subscription';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

const UNLIMITED = 999999;

export interface UseSubscription {
  tier: SubscriptionTier;
  isOwner: boolean;
  isFree: boolean;
  isPro: boolean;
  isPremium: boolean;
  loading: boolean;
  purchasesEnabled: boolean;
  dailyAIMessages: number;
  dailyPracticeQuestions: number;
  dailyDoubtSolver: number;
  canUse: (requiredTier: SubscriptionTier) => boolean;
  canAccessCompanion: boolean;
  canAccessPYQ: boolean;
  canAccessMockTest: boolean;
  canAccessStudyPlanner: boolean;
  canAccessPerformanceAnalysis: boolean;
  canAccessMarksCalculator: boolean;
  upgrade: (newTier: 'pro' | 'premium') => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscription {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasesEnabled, setPurchasesEnabled] = useState(false);

  const loadTier = useCallback(async () => {
    if (!user) {
      setTier('free');
      setIsOwner(false);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, is_owner')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.subscription_tier) {
      setTier(profile.subscription_tier as SubscriptionTier);
    } else {
      setTier('free');
    }
    setIsOwner(profile?.is_owner === true);
  }, [user]);

  const loadPurchasesEnabled = useCallback(async () => {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'purchases_enabled')
      .maybeSingle();

    setPurchasesEnabled(data?.value === true);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.all([loadTier(), loadPurchasesEnabled()]);
      if (mounted) setLoading(false);
    })();

    return () => { mounted = false; };
  }, [loadTier, loadPurchasesEnabled]);

  const refresh = useCallback(async () => {
    await Promise.all([loadTier(), loadPurchasesEnabled()]);
  }, [loadTier, loadPurchasesEnabled]);

  const upgrade = useCallback(async (newTier: 'pro' | 'premium'): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: newTier })
      .eq('id', user.id);

    if (error) return { error: error.message };

    await supabase.from('pro_upgrades').upsert({
      user_id: user.id,
      is_pro: true,
      tier: newTier,
      amount: newTier === 'premium' ? 99 : 49,
      upgraded_at: new Date().toISOString(),
    });

    setTier(newTier);
    return { error: null };
  }, [user]);

  return useMemo<UseSubscription>(() => {
    const config = TIERS[tier];
    return {
      tier,
      isOwner,
      isFree: tier === 'free',
      isPro: tier === 'pro' || tier === 'premium',
      isPremium: tier === 'premium',
      loading,
      purchasesEnabled,
      dailyAIMessages: isOwner ? UNLIMITED : config.limits.dailyAIMessages,
      dailyPracticeQuestions: isOwner ? UNLIMITED : config.limits.dailyPracticeQuestions,
      dailyDoubtSolver: isOwner ? UNLIMITED : config.limits.dailyDoubtSolver,
      canUse: (required: SubscriptionTier) => isOwner || hasFeature(tier, required),
      canAccessCompanion: isOwner || hasFeature(tier, 'premium'),
      canAccessPYQ: isOwner || hasFeature(tier, 'pro'),
      canAccessMockTest: isOwner || hasFeature(tier, 'pro'),
      canAccessStudyPlanner: isOwner || hasFeature(tier, 'pro'),
      canAccessPerformanceAnalysis: isOwner || hasFeature(tier, 'pro'),
      canAccessMarksCalculator: isOwner || hasFeature(tier, 'pro'),
      upgrade,
      refresh,
    };
  }, [tier, isOwner, loading, purchasesEnabled, upgrade, refresh]);
}
