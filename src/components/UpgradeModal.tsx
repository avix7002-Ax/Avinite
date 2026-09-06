import { useState } from 'react';
import { Crown, Lock, Check, X, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { TIERS, TIER_ORDER } from '@/lib/subscription';
import type { SubscriptionTier } from '@/hooks/useSubscription';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  purchasesEnabled: boolean;
  onUpgrade: (tier: 'pro' | 'premium') => Promise<{ error: string | null }>;
}

export function UpgradeModal({ open, onClose, currentTier, purchasesEnabled, onUpgrade }: UpgradeModalProps) {
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  async function handleUpgrade(tier: 'pro' | 'premium') {
    if (!purchasesEnabled) return;
    setUpgrading(true);
    setError(null);
    setSuccess(null);
    const result = await onUpgrade(tier);
    setUpgrading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(`You're now on ${tier === 'premium' ? 'Premium' : 'Pro'}! Enjoy your new features.`);
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-2xl border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg-brand text-white mb-4">
              <Crown className="h-7 w-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground">Unlock more features and supercharge your Science prep.</p>
          </div>

          {error && (
            <div className="mb-6 text-sm text-destructive bg-destructive/10 rounded-xl p-4 border border-destructive/20 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 text-sm text-success bg-success/10 rounded-xl p-4 border border-success/20 text-center">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIER_ORDER.map((tierId) => {
              const plan = TIERS[tierId];
              const isCurrent = currentTier === tierId;
              const isUpgradeable = tierId !== 'free' && tierId !== currentTier;
              const isPopular = tierId === 'pro';

              return (
                <Card
                  key={tierId}
                  className={cn(
                    'relative transition-all',
                    isPopular && 'border-primary shadow-lg md:scale-105',
                    isCurrent && 'border-accent ring-2 ring-accent/20'
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md">
                        <Sparkles className="h-3 w-3" /> Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6 min-h-[180px]">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs">
                          <Check className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        <Check className="h-4 w-4 mr-1" /> Current Plan
                      </Button>
                    ) : isUpgradeable ? (
                      purchasesEnabled ? (
                        <Button
                          className={cn('w-full', isPopular && 'glow-primary')}
                          variant={isPopular ? 'default' : 'outline'}
                          onClick={() => handleUpgrade(tierId as 'pro' | 'premium')}
                          disabled={upgrading}
                        >
                          {upgrading ? 'Processing...' : `Get ${plan.name}`}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          <Lock className="h-4 w-4 mr-1" /> Coming Soon
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Your Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {!purchasesEnabled && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Purchases are currently disabled. We'll notify you when paid plans go live.
              </div>
            </div>
          )}

          {purchasesEnabled && (
            <p className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Zap className="h-3 w-3" />
              Instant access. No auto-renewal. Cancel anytime.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
