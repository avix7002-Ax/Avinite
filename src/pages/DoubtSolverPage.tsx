import { useState, useRef, useEffect, type FormEvent } from 'react';
import { MessageCircleQuestion, Send, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { solveDoubt } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { chapters } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  'Explain electrolysis.',
  'Why is carbon tetravalent?',
  'Explain refraction simply.',
  'Difference between acids and bases.',
  "What is Ohm's law?",
  'Explain photosynthesis.',
];

export function DoubtSolverPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm your Science tutor. Ask me anything about Class 10 Science — I'll explain it simply. Try: \"Explain electrolysis\", \"Why is carbon tetravalent?\", or \"Explain refraction simply.\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking with minimal delay
    setTimeout(async () => {
      const answer = solveDoubt(userMessage.content);

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);

      if (user) {
        const matchedChapter = chapters.find((c) =>
          c.topics.some((t) =>
            userMessage.content.toLowerCase().includes(t.toLowerCase())
          )
        );

        supabase.from('doubt_history').insert({
          question: userMessage.content,
          answer,
          chapter: matchedChapter?.name || null,
        });
      }
    }, 400);
  }

  function handleSuggested(q: string) {
    setInput(q);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MessageCircleQuestion className="h-7 w-7 text-primary" />
          AI Doubt Solver
        </h1>
        <p className="text-muted-foreground mt-1">
          Ask any Science question and get a simple, student-friendly explanation.
        </p>
      </div>

      <div className="flex gap-2 items-center text-sm">
        <Badge variant="default">
          <Sparkles className="h-3 w-3 mr-1" /> AI Tutor
        </Badge>
      </div>

      {/* Chat interface */}
      <Card className="flex flex-col h-[60vh] min-h-[400px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                msg.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gradient-to-br from-primary to-accent text-white'
                )}
              >
                {msg.role === 'user' ? (
                  <span className="text-xs font-semibold">You</span>
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  'rounded-lg p-3 max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-4 flex gap-1">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea
              placeholder="Ask any Science question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[44px] max-h-32 flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <Button type="submit" size="lg" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Suggested questions */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Try asking
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSuggested(q)}
              className="px-3 py-2 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Quick chapter links */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Quick chapter links
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {chapters.slice(0, 6).map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setInput(`Explain ${chapter.topics[0]} from ${chapter.name}`)}
              className="text-left px-3 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors text-sm"
            >
              {chapter.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

