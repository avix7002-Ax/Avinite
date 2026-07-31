import { Link, useNavigate } from 'react-router-dom';
import {
  Atom,
  TrendingUp,
  PenTool,
  MessageCircleQuestion,
  RefreshCw,
  FileClock,
  CalendarDays,
  Bookmark,
  FileUp,
  FlaskConical,
  Leaf,
  Globe,
  Check,
  ChevronDown,
  Star,
  Sparkles,
  ArrowRight,
  Search,
  Bot,
  Zap,
  Brain,
  Target,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { subjects, chapters } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AvixLogo } from '@/components/AvixLogo';

const features = [
  {
    icon: TrendingUp,
    title: 'PYQ Trend Analysis',
    description: 'See chapter weightage, frequently tested topics, and difficulty trends with visual charts and heatmaps.',
  },
  {
    icon: PenTool,
    title: 'AI Practice Questions',
    description: 'Generate 5 to 50 original board-style questions — MCQs, assertion-reason, case studies, numericals and more.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'AI Doubt Solver',
    description: 'Ask any question and get a simple, student-friendly explanation tailored for Class 10 level.',
  },
  {
    icon: RefreshCw,
    title: 'Smart Revision Mode',
    description: 'One-page notes, flashcards, formula sheets, mnemonics, and mind maps for every chapter.',
  },
  {
    icon: FileClock,
    title: 'Mock Tests',
    description: 'Take chapter, full-syllabus, or custom tests with a timer. Get instant results and a predicted board score.',
  },
  {
    icon: CalendarDays,
    title: 'Study Planner',
    description: 'Enter your exam date and daily hours to generate a daily timetable, weekly plan, and monthly revision schedule.',
  },
  {
    icon: Bookmark,
    title: 'Bookmarks',
    description: 'Save important questions, notes, flashcards, and topics to revisit them anytime.',
  },
  {
    icon: FileUp,
    title: 'RAG Document Upload',
    description: 'Upload your own notes — our AI uses retrieval-augmented generation to answer from your material.',
  },
];

const reviews = [
  {
    initials: 'AS',
    name: 'Aarav Sharma',
    location: 'Class 10, Delhi',
    text: 'The PYQ trend analysis showed me exactly which topics come every year. My Science score jumped from 68 to 91 in the pre-boards!',
  },
  {
    initials: 'PN',
    name: 'Priya Nair',
    location: 'Class 10, Kerala',
    text: 'The AI doubt solver explains things so simply. I finally understood electrolysis and refraction. Better than my tuition teacher.',
  },
  {
    initials: 'RG',
    name: 'Rohan Gupta',
    location: 'Class 10, Lucknow',
    text: 'The mock tests with predicted board scores are amazing. I took 20+ tests and felt fully prepared on exam day.',
  },
  {
    initials: 'SR',
    name: 'Sneha Reddy',
    location: 'Class 10, Hyderabad',
    text: 'Flashcards and one-page notes saved me during last-minute revision. The mind maps are so helpful for remembering everything.',
  },
  {
    initials: 'KI',
    name: 'Karthik Iyer',
    location: 'Class 10, Chennai',
    text: 'The study planner created a perfect timetable based on my exam date. I covered all 16 chapters with time to spare.',
  },
  {
    initials: 'AD',
    name: 'Ananya Das',
    location: 'Class 10, Kolkata',
    text: 'Unlimited AI practice questions for every chapter is a game changer. The explanations after each question taught me the concepts properly.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    tagline: 'Perfect for getting started',
    price: '₹0',
    period: 'forever',
    cta: 'Start Free',
    href: '/signup',
    features: [
      'Access to all 16 chapters',
      'PYQ trend analysis',
      '10 AI practice questions / day',
      'AI doubt solver (5 / day)',
      'Basic revision notes',
      'Study streak tracking',
    ],
  },
  {
    name: 'Pro',
    tagline: 'Everything you need to top Science',
    price: '₹299',
    period: '/month',
    cta: 'Get Pro',
    href: '/signup',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited AI practice questions',
      'Unlimited AI doubt solver',
      'Full revision mode (mind maps, mnemonics)',
      'Mock tests with predicted scores',
      'Study planner with custom schedules',
      'RAG document upload',
      'Priority AI responses',
    ],
  },
  {
    name: 'Premium',
    tagline: 'Best value for board exam year',
    price: '₹1,999',
    period: '/year',
    cta: 'Get Premium',
    href: '/signup',
    features: [
      'Everything in Pro',
      'Full-year access',
      '2 months free',
      'Personalised weak-chapter plan',
      'Achievements & progress badges',
      'Email progress reports',
      'Early access to new features',
    ],
  },
];

const faqs = [
  {
    q: 'Does this reproduce CBSE textbook or previous-year question papers?',
    a: 'No. All questions, notes, and content are originally generated by our AI. We do not reproduce any copyrighted CBSE material. Our platform analyses trends and generates fresh, board-style questions that test the same concepts.',
  },
  {
    q: 'Do I need to train the AI myself?',
    a: 'Not at all. The AI is pre-trained on Class 10 Science concepts and CBSE exam patterns. Just pick a chapter, choose the number of questions, and start practising immediately.',
  },
  {
    q: 'Which subjects and chapters are covered?',
    a: 'All four subjects — Physics, Chemistry, Biology, and Environment — covering all 16 chapters of the CBSE Class 10 Science syllabus. Every chapter has practice questions, revision notes, and trend analysis.',
  },
  {
    q: 'How does the AI generate practice questions?',
    a: 'Our AI creates original board-style questions based on the chapter topics and CBSE exam patterns. You can generate 5 to 50 questions per session, including MCQs, assertion-reason, case studies, numericals, and short answers.',
  },
  {
    q: 'Can I upload my own study notes?',
    a: 'Yes! Pro and Premium users can upload their own notes. Our AI uses retrieval-augmented generation (RAG) to answer questions and create practice material based on your uploaded documents.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes, the Free plan gives you access to all 16 chapters, PYQ trend analysis, 10 AI practice questions per day, and 5 doubt-solver questions per day. Upgrade to Pro for unlimited access.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Absolutely. The platform is fully responsive and works seamlessly on mobile phones, tablets, and desktops. Study anywhere, anytime.',
  },
];

const subjectIcons: Record<string, typeof Atom> = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Leaf,
  Environment: Globe,
};

const quickActions: { icon: LucideIcon; label: string; color: string }[] = [
  { icon: Bot, label: 'Ask AI', color: 'from-blue-500 to-indigo-500' },
  { icon: PenTool, label: 'Practice', color: 'from-green-500 to-teal-500' },
  { icon: RefreshCw, label: 'Revise', color: 'from-orange-500 to-amber-500' },
  { icon: FileClock, label: 'Mock Test', color: 'from-purple-500 to-pink-500' },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            animation: `float ${Math.random() * 4 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl opacity-30 animate-glow-pulse" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl opacity-30 animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <FloatingParticles />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="mb-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-medium border border-primary/20">
                <Sparkles className="h-3 w-3 text-primary" />
                AI-Powered CBSE Science Revision
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">NEW</span>
              </div>
            </div>

            {/* Logo + Title */}
            <div className="mb-6 animate-fade-in-up">
              <AvixLogo size={64} animated className="mx-auto drop-shadow-2xl" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6 animate-fade-in-up font-display" style={{ animationDelay: '0.1s' }}>
              Score Higher in{' '}
              <span className="gradient-text-brand animate-gradient-x">CBSE Class 10 Science</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mb-8 text-balance animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Find chapter trends, revise smarter, solve doubts, and practise unlimited
              AI-generated board-style questions.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mb-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center glass-panel rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters, topics, or questions..."
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="mr-2 rounded-xl gradient-bg-brand px-4 py-2 text-sm font-medium text-white hover:scale-105 transition-transform ripple-btn"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto ripple-btn glow-primary group">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto lift-on-hover">
                  Login
                </Button>
              </Link>
            </div>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-3 mt-10 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to="/signup"
                    className="flex items-center gap-2 rounded-full glass-card px-4 py-2 text-xs font-medium lift-on-hover"
                  >
                    <span className={cn('flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-white', action.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {action.label}
                  </Link>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {[
                { value: '16', label: 'Chapters', sub: 'Full syllabus' },
                { value: 'PYQ', label: 'Trends', sub: 'Chapter weightage' },
                { value: 'AI', label: 'Practice', sub: 'Unlimited questions' },
              ].map((stat) => (
                <div key={stat.label} className="text-center glass-card rounded-2xl p-4 lift-on-hover">
                  <div className="text-3xl font-bold gradient-text-brand">{stat.value}</div>
                  <div className="text-sm font-medium mt-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Assistant Highlight Card ── */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />
            <Card className="relative glass-card border-border/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40" />
              <CardContent className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-xl animate-glow-pulse" />
                      <div className="relative w-24 h-24 rounded-3xl gradient-bg-brand flex items-center justify-center shadow-2xl">
                        <Bot className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                      <Zap className="h-3 w-3" /> Powered by Hybrid Knowledge Base + AI
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
                      Meet <span className="gradient-text-brand">Avix AI</span> — Your Smart Learning Companion
                    </h2>
                    <p className="text-muted-foreground mb-4 max-w-xl">
                      Get instant answers to CBSE Class 10 Science questions. Upload images, read files,
                      see diagrams, and render beautiful math — all in one place.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      {['Image Analysis', 'File Upload', 'Math Rendering', 'Diagrams', 'Memory'].map((feat) => (
                        <span key={feat} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-accent" /> {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link to="/signup">
                      <Button className="ripple-btn glow-brand group">
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Everything you need to ace Science</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Eight powerful AI-driven tools built specifically for CBSE Class 10 Science students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="glass-card hover:shadow-lg hover:border-primary/30 lift-on-hover group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Subjects ── */}
      <section id="subjects" className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Four subjects, sixteen chapters</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The complete CBSE Class 10 Science syllabus, organised and analysed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {subjects.map((subject, i) => {
              const Icon = subjectIcons[subject.name] || Atom;
              const subjectChapters = chapters.filter((c) => c.subject === subject.name);
              return (
                <Link
                  key={subject.name}
                  to={`/search?subject=${subject.name}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Card className="glass-card hover:shadow-lg hover:border-primary/30 lift-on-hover h-full group">
                    <CardHeader>
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white mb-2 group-hover:scale-110 transition-transform', subject.gradient)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{subject.chapterCount} chapters</span>
                        <Badge variant="secondary">{subjectChapters.reduce((s, c) => s + c.pyqCount, 0)} PYQs</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Loved by students across India</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thousands of Class 10 students are studying smarter with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <Card
                key={review.name}
                className="glass-card lift-on-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-4 leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Simple, student-friendly pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you are ready for unlimited AI practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card
                key={plan.name}
                className={cn(
                  'relative glass-card animate-fade-in-up',
                  plan.popular && 'border-primary shadow-lg md:scale-105 glow-primary'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="shadow-md">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={plan.href}>
                    <Button
                      className={cn('w-full ripple-btn', plan.popular && 'glow-primary')}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Frequently asked questions</h2>
            <p className="text-muted-foreground">Everything you need to know before getting started.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="overflow-hidden glass-card">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform',
                      openFaq === i && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openFaq === i ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
            <Card className="relative glass-card border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
              <CardContent className="relative flex flex-col items-center text-center py-12 md:py-16">
                <div className="mb-4">
                  <AvixLogo size={48} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Ready to score higher in Science?</h2>
                <p className="text-muted-foreground max-w-xl mb-8">
                  Join thousands of Class 10 students using AI to study smarter, not harder. Start free today.
                </p>
                <Link to="/signup">
                  <Button size="lg" className="ripple-btn glow-primary group">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
