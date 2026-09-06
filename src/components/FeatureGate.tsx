import { Crown, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState, type ReactNode } from 'react';
import { UpgradeModal } from '@/components/UpgradeModal';
import type { SubscriptionTier } from '@/hooks/useSubscription';

interface FeatureGateProps {
  children: ReactNode;
  canAccess: boolean;
  currentTier: SubscriptionTier;
  purchasesEnabled: boolean;
  onUpgrade: (tier: 'pro' | 'premium') => Promise<{ error: string | null }>;
  featureName: string;
  requiredTier: SubscriptionTier;
  description?: string;
}

export function FeatureGate({
  children,
  canAccess,
  currentTier,
  purchasesEnabled,
  onUpgrade,
  featureName,
  requiredTier,
  description,
}: FeatureGateProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (canAccess) return <>{children}</>;

  const tierLabel = requiredTier === 'premium' ? 'Premium' : 'Pro';

  return (
    <>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Lock className="h-7 w-7 text-muted-foreground" />
            {featureName}
          </h1>
        </div>

        <Card className="border-warning/30 bg-gradient-to-br from-warning/5 to-primary/5">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg-brand text-white mb-4">
              <Crown className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">{featureName} is a {tierLabel} Feature</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              {description || `Upgrade to ${tierLabel} to unlock ${featureName} and many more features.`}
            </p>
            <Button size="lg" onClick={() => setShowUpgrade(true)} className="ripple-btn">
              <Crown className="h-4 w-4 mr-2" /> Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier={currentTier}
        purchasesEnabled={purchasesEnabled}
        onUpgrade={onUpgrade}
      />
    </>
  );
}
