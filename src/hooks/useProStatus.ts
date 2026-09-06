import { useSubscription } from '@/hooks/useSubscription';

export function useProStatus() {
  const sub = useSubscription();
  return {
    isPro: sub.isPro,
    proUpgrade: null,
    loading: sub.loading,
    upgradeToPro: () => sub.upgrade('pro'),
  };
}
