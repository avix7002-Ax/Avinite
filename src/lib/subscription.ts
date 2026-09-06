import type { SubscriptionTier } from '@/hooks/useSubscription';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: string;
  tagline: string;
  features: string[];
  limits: {
    dailyAIMessages: number;
    dailyPracticeQuestions: number;
    dailyDoubtSolver: number;
  };
}

export const TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    tagline: 'Perfect for getting started',
    features: [
      '10-20 questions per day',
      'Basic progress tracking',
      'Avinite AI academic mode',
      'Basic revision notes & flashcards',
      'Search across all chapters',
    ],
    limits: {
      dailyAIMessages: 15,
      dailyPracticeQuestions: 15,
      dailyDoubtSolver: 5,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: '/month',
    tagline: 'Everything you need to top Science',
    features: [
      'Everything in Free',
      '30-40 questions per day',
      'PYQ series with model answers',
      'Marks calculator',
      'Performance analysis & progress tracking',
      'Catch-up & weak-area analysis',
      'Mock tests with predicted scores',
      'Study planner with custom schedules',
      'Smart revision (mind maps, mnemonics)',
    ],
    limits: {
      dailyAIMessages: 100,
      dailyPracticeQuestions: 40,
      dailyDoubtSolver: 30,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: '/month',
    tagline: 'The complete learning companion',
    features: [
      'Everything in Pro',
      'Companion AI mode',
      'Advanced AI guidance & analysis',
      'Personalized recommendations',
      'AI memory with deep context',
      'Priority AI responses',
      'All future premium features',
    ],
    limits: {
      dailyAIMessages: 500,
      dailyPracticeQuestions: 100,
      dailyDoubtSolver: 100,
    },
  },
};

export const TIER_ORDER: SubscriptionTier[] = ['free', 'pro', 'premium'];

export function tierRank(tier: SubscriptionTier): number {
  return TIER_ORDER.indexOf(tier);
}

export function hasFeature(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return tierRank(userTier) >= tierRank(requiredTier);
}
