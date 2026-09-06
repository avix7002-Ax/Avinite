import { useState, useEffect, useCallback } from 'react';
import { Star, Bug, Lightbulb, AlertCircle, MessageSquare, Upload, X, Send, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { cn, formatDate } from '@/lib/utils';
import type { ReviewFeedback } from '@/types';

const feedbackTypes = [
  { key: 'rating', label: 'Rate the App', icon: Star, color: 'text-warning' },
  { key: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-error' },
  { key: 'feature_request', label: 'Request a Feature', icon: Lightbulb, color: 'text-accent' },
  { key: 'ai_mistake', label: 'Report AI Mistake', icon: AlertCircle, color: 'text-chart-1' },
  { key: 'improvement', label: 'Suggest Improvement', icon: MessageSquare, color: 'text-primary' },
] as const;

export function ReviewsPage() {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState<string>('rating');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myFeedback, setMyFeedback] = useState<ReviewFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reviews_feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setMyFeedback((data as ReviewFeedback[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!user || !message.trim()) return;
    setSubmitting(true);
    setSubmitted(false);

    const { error } = await supabase.from('reviews_feedback').insert({
      user_id: user.id,
      type: activeType,
      rating: activeType === 'rating' ? rating : null,
      message: message.trim(),
      screenshot_url: screenshot,
    });

    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
      setMessage('');
      setRating(0);
      setScreenshot(null);
      loadFeedback();
      setTimeout(() => setSubmitted(false), 3000);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Reviews & Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Rate the app, report bugs, suggest features, or let us know about AI mistakes. Your feedback helps us improve.
        </p>
      </div>

      {submitted && (
        <Card className="border-success/30 bg-success/5 animate-fade-in">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
              <Check className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm font-medium text-success">Thank you! Your feedback has been submitted.</p>
          </CardContent>
        </Card>
      )}

      {/* Feedback type selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {feedbackTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.key}
              onClick={() => setActiveType(type.key)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                activeType === type.key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              )}
            >
              <Icon className={cn('h-5 w-5', activeType === type.key ? type.color : 'text-muted-foreground')} />
              <span className="text-xs font-medium text-center">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {feedbackTypes.find((t) => t.key === activeType)?.label}
          </CardTitle>
          <CardDescription>
            {activeType === 'rating' && 'How would you rate your experience with Science PYQs AI?'}
            {activeType === 'bug' && 'Found something broken? Tell us what happened and we\'ll fix it.'}
            {activeType === 'feature_request' && 'Have an idea for a new feature? We\'d love to hear it.'}
            {activeType === 'ai_mistake' && 'Did Avinite AI give a wrong answer? Let us know so we can improve.'}
            {activeType === 'improvement' && 'How can we make the app better for you?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Star rating */}
          {activeType === 'rating' && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-8 w-8',
                      star <= rating ? 'text-warning fill-warning' : 'text-muted-foreground'
                    )}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Message */}
          <div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                activeType === 'rating' ? 'Tell us about your experience...' :
                activeType === 'bug' ? 'Describe the bug: what happened, what you expected, and steps to reproduce...' :
                activeType === 'feature_request' ? 'Describe the feature you\'d like to see...' :
                activeType === 'ai_mistake' ? 'What did Avinite AI get wrong? Please include the question and the incorrect response...' :
                'How can we improve?'
              }
              className="min-h-[120px]"
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="text-sm font-medium mb-2 block">Attach Screenshot (optional)</label>
            {screenshot ? (
              <div className="flex items-center gap-2">
                <img src={screenshot} alt="Screenshot" className="h-20 w-20 rounded-lg object-cover border border-border" />
                <Button variant="outline" size="sm" onClick={() => setScreenshot(null)}>
                  <X className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-border hover:border-primary/30 cursor-pointer transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload a screenshot</span>
                <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
              </label>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={!message.trim() || submitting} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </CardContent>
      </Card>

      {/* My feedback history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Feedback History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : myFeedback.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {myFeedback.map((fb) => {
                const typeInfo = feedbackTypes.find((t) => t.key === fb.type);
                const Icon = typeInfo?.icon || MessageSquare;
                return (
                  <div key={fb.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', typeInfo?.color || 'text-muted-foreground')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{typeInfo?.label || fb.type}</span>
                        {fb.rating && (
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn('h-3 w-3', i < fb.rating! ? 'text-warning fill-warning' : 'text-muted-foreground')} />
                            ))}
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">{fb.status}</Badge>
                      </div>
                      <p className="text-sm">{fb.message}</p>
                      {fb.screenshot_url && (
                        <img src={fb.screenshot_url} alt="Screenshot" className="h-16 w-16 rounded-lg object-cover mt-2 border border-border" />
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(fb.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
