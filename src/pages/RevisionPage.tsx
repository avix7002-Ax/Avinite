import { useState } from 'react';
import { RefreshCw, BookOpen, FileText, Brain, Lightbulb, Network, Check, ChevronRight, BarChart3, TrendingUp, TrendingDown, Minus, Target, ArrowRight, BookMarked, Key, Sigma, FlaskConical, Image, Eye, AlertTriangle, Star, Box, GraduationCap, Zap, Award, Table2, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { chapters, subjects } from '@/lib/data';
import { useRevisionProgress } from '@/hooks/useRevisionProgress';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useChapterReport } from '@/hooks/useChapterReport';
import { getRevisionContent } from '@/lib/revision-content';
import { cn, getSubjectColor, getSubjectBg } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { Chapter } from '@/types';

export function RevisionPage() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'formulas' | 'mnemonic' | 'lastshot' | 'report'>('notes');
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [showFlashcardBack, setShowFlashcardBack] = useState(false);
  const { progress, updateStatus, completionPercent, completedCount } = useRevisionProgress();
  const { addBookmark } = useBookmarks();
  const { report } = useChapterReport(selectedChapter?.name || null);

  if (selectedChapter) {
    const content = getRevisionContent(selectedChapter);
    const chapterProgress = progress[selectedChapter.name];
    const status = chapterProgress?.status || 'not-started';

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setSelectedChapter(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4 rotate-180" /> All Chapters
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">{selectedChapter.name}</h1>
            <p className="text-muted-foreground mt-1">{selectedChapter.subject} · {selectedChapter.difficulty}</p>
          </div>
          <Badge
            variant={status === 'completed' ? 'success' : status === 'in-progress' ? 'warning' : 'outline'}
          >
            {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Not Started'}
          </Badge>
        </div>

        {/* Status controls */}
        <div className="flex gap-2">
          {(['not-started', 'in-progress', 'completed'] as const).map((s) => (
            <Button
              key={s}
              variant={status === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateStatus(selectedChapter.name, s)}
            >
              {s === 'completed' && <Check className="h-3 w-3 mr-1" />}
              {s.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-hide">
          {[
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'flashcards', label: 'Flashcards', icon: Brain },
            { id: 'formulas', label: 'Formula Sheet', icon: Lightbulb },
            { id: 'mnemonic', label: 'Mnemonics', icon: Network },
            { id: 'lastshot', label: 'Last Minute Shot', icon: Zap },
            { id: 'report', label: 'Report Card', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[300px]">
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">One-Page Notes</CardTitle>
                  <CardDescription>Complete revision sheet — based on NCERT Class 10 Science syllabus</CardDescription>
                </CardHeader>
              </Card>
              {content.notes.map((section, si) => {
                const sectionIcon = section.icon === 'BookOpen' ? BookOpen
                  : section.icon === 'BookMarked' ? BookMarked
                  : section.icon === 'Key' ? Key
                  : section.icon === 'Sigma' ? Sigma
                  : section.icon === 'FlaskConical' ? FlaskConical
                  : section.icon === 'Image' ? Image
                  : section.icon === 'Eye' ? Eye
                  : section.icon === 'Lightbulb' ? Lightbulb
                  : section.icon === 'AlertTriangle' ? AlertTriangle
                  : section.icon === 'Star' ? Star
                  : section.icon === 'Box' ? Box
                  : section.icon === 'Brain' ? Brain
                  : section.icon === 'GraduationCap' ? GraduationCap
                  : FileText;
                const Icon = sectionIcon;
                return (
                  <Card key={si}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {section.items.map((item, ii) => (
                        <div key={ii} className="flex items-start gap-2.5">
                          <div className="flex h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-2" />
                          <p className="text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => addBookmark('note', `Notes: ${selectedChapter.name}`, content.notes.map(s => `${s.title}:\n${s.items.join('\n')}`).join('\n\n'), selectedChapter.name, selectedChapter.subject)}
              >
                Bookmark these notes
              </Button>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <Card
                className="cursor-pointer min-h-[280px]"
                onClick={() => setShowFlashcardBack(!showFlashcardBack)}
              >
                <CardContent className="pt-6 pb-6 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Card {flashcardIdx + 1} of {content.flashcards.length}</Badge>
                    <span className="text-xs text-muted-foreground">Click to flip</span>
                  </div>
                  {!showFlashcardBack ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Question</p>
                      <p className="text-lg font-medium leading-relaxed">{content.flashcards[flashcardIdx].front}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">Answer</p>
                        <p className="text-sm font-medium leading-relaxed">{content.flashcards[flashcardIdx].back}</p>
                      </div>
                      <div className="border-t border-border/50 pt-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">Definition</p>
                        <p className="text-xs leading-relaxed">{content.flashcards[flashcardIdx].definition}</p>
                      </div>
                      <div className="border-t border-border/50 pt-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">Explanation</p>
                        <p className="text-xs leading-relaxed">{content.flashcards[flashcardIdx].explanation}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">{content.flashcards[flashcardIdx].keyword}</Badge>
                      </div>
                      <div className="border-t border-border/50 pt-2">
                        <p className="text-xs font-semibold text-error mb-0.5">Common Mistake</p>
                        <p className="text-xs leading-relaxed">{content.flashcards[flashcardIdx].commonMistake}</p>
                      </div>
                      <div className="border-t border-border/50 pt-2">
                        <p className="text-xs font-semibold text-success mb-0.5">Exam Tip</p>
                        <p className="text-xs leading-relaxed">{content.flashcards[flashcardIdx].examTip}</p>
                      </div>
                      {content.flashcards[flashcardIdx].memoryTrick && (
                        <div className="border-t border-border/50 pt-2">
                          <p className="text-xs font-semibold text-accent mb-0.5">Memory Trick</p>
                          <p className="text-xs leading-relaxed italic">{content.flashcards[flashcardIdx].memoryTrick}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFlashcardIdx((prev) => (prev - 1 + content.flashcards.length) % content.flashcards.length);
                    setShowFlashcardBack(false);
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {flashcardIdx + 1} / {content.flashcards.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFlashcardIdx((prev) => (prev + 1) % content.flashcards.length);
                    setShowFlashcardBack(false);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'formulas' && (
            <div className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Formula Sheet</CardTitle>
                  <CardDescription>Verified formulas with symbols, units, conditions, and solved examples</CardDescription>
                </CardHeader>
              </Card>
              {content.formulas.map((fc, i) => (
                <Card key={i}>
                  <CardContent className="pt-5 pb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{fc.label}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addBookmark('flashcard', `Formula: ${fc.label}`, fc.formula, selectedChapter.name, selectedChapter.subject)}
                      >
                        Bookmark
                      </Button>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <code className="text-base font-mono break-all">{fc.formula}</code>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">Symbols</p>
                        <p className="text-xs leading-relaxed">{fc.symbols}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">SI Units</p>
                        <p className="text-xs leading-relaxed">{fc.units}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">Used For</p>
                        <p className="text-xs leading-relaxed">{fc.usedFor}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">Conditions</p>
                        <p className="text-xs leading-relaxed">{fc.conditions}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-error mb-0.5">Common Mistakes</p>
                        <p className="text-xs leading-relaxed">{fc.commonMistakes}</p>
                      </div>
                      <div className="p-2 rounded-md bg-success/5 border border-success/20">
                        <p className="text-xs font-semibold text-success mb-0.5">Solved Example</p>
                        <p className="text-xs leading-relaxed">{fc.example}</p>
                      </div>
                      {fc.signConvention && (
                        <div>
                          <p className="text-xs font-semibold text-accent mb-0.5">Sign Convention</p>
                          <p className="text-xs leading-relaxed">{fc.signConvention}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'mnemonic' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Memory Mnemonic</CardTitle>
                <CardDescription>Easy way to remember key concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                  <Network className="h-8 w-8 text-primary mb-3" />
                  <p className="text-base leading-relaxed">{content.mnemonic}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'lastshot' && content.examMeta && content.lastMinuteShot && (
            <div className="space-y-4">
              {/* Exam Meta Summary */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Exam Insights
                  </CardTitle>
                  <CardDescription>Board exam weightage and priority analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Expected marks */}
                  <div>
                    <p className="text-sm font-medium mb-2">Expected Board Marks Distribution</p>
                    <div className="grid grid-cols-4 gap-2">
                      {([['1M', '1 Mark'], ['2M', '2 Marks'], ['3M', '3 Marks'], ['5M', '5 Marks']] as const).map(([key, label]) => (
                        <div key={key} className="text-center p-3 rounded-lg bg-muted/50 border border-border">
                          <p className="text-2xl font-bold text-primary">{content.examMeta.expectedMarks[key]}</p>
                          <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PYQ Frequency */}
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-warning" />
                    <div>
                      <p className="text-sm font-medium">PYQ Frequency: {content.examMeta.pyqFrequency}</p>
                      <p className="text-xs text-muted-foreground">How often this chapter appears in board exams</p>
                    </div>
                  </div>

                  {/* High Priority Topics */}
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      High Priority Topics
                    </p>
                    <div className="space-y-2">
                      {content.examMeta.highPriorityTopics.map((topic, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={cn('h-3 w-3', idx < topic.priority ? 'text-warning fill-warning' : 'text-muted-foreground/30')}
                              />
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{topic.topic}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{topic.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Board Keywords */}
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" />
                      Board Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {content.examMeta.boardKeywords.map((keyword, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Important Tables */}
                  {content.examMeta.importantTables.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-accent" />
                        Important Tables
                      </p>
                      <div className="space-y-3">
                        {content.examMeta.importantTables.map((table, i) => (
                          <div key={i} className="rounded-lg border border-border overflow-hidden">
                            <p className="text-sm font-medium p-3 bg-muted/50 border-b border-border">{table.title}</p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-border">
                                    {table.headers.map((header, j) => (
                                      <th key={j} className="text-left p-2.5 font-medium text-muted-foreground whitespace-nowrap">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.rows.map((row, j) => (
                                    <tr key={j} className="border-b border-border/40 last:border-0">
                                      {row.map((cell, k) => (
                                        <td key={k} className="p-2.5 whitespace-nowrap">{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rapid Revision */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-warning" />
                    Rapid Revision
                  </CardTitle>
                  <CardDescription>Quick bullet points — revise in 5 minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.lastMinuteShot.rapidRevision.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Formula Revision */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sigma className="h-5 w-5 text-primary" />
                    Important Formula Revision
                  </CardTitle>
                  <CardDescription>Must-know formulas and equations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.lastMinuteShot.formulaRevision.map((formula, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50 font-mono text-sm">
                        {formula}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Important Definitions */}
              {content.lastMinuteShot.importantDefinitions?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookMarked className="h-5 w-5 text-accent" />
                      Important Definitions
                    </CardTitle>
                    <CardDescription>Key terms you must know</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {content.lastMinuteShot.importantDefinitions.map((def, i) => (
                        <li key={i} className="text-sm p-3 rounded-lg bg-accent/5 border border-accent/20">
                          {def}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Common Mistakes */}
              {content.lastMinuteShot.commonMistakes?.length > 0 && (
                <Card className="border-error/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-error" />
                      Common Mistakes to Avoid
                    </CardTitle>
                    <CardDescription>Frequent errors students make</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {content.lastMinuteShot.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-error flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Exam Tricks */}
              {content.lastMinuteShot.examTricks?.length > 0 && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Exam Tricks & Shortcuts
                    </CardTitle>
                    <CardDescription>Smart techniques to remember and apply</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {content.lastMinuteShot.examTricks.map((trick, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{trick}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Frequently Confused Topics */}
              {content.lastMinuteShot.frequentlyConfused?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-warning" />
                      Frequently Confused Topics
                    </CardTitle>
                    <CardDescription>Don't mix these up in the exam</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {content.lastMinuteShot.frequentlyConfused.map((item, i) => (
                        <div key={i} className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <p className="text-sm font-semibold mb-1">{item.pair}</p>
                          <p className="text-sm text-muted-foreground">{item.difference}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* One Look Revision */}
              {content.lastMinuteShot.oneLookRevision?.length > 0 && (
                <Card className="border-success/20 bg-gradient-to-br from-success/5 to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-success" />
                      One Look Revision
                    </CardTitle>
                    <CardDescription>Top points — scan these right before the exam</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {content.lastMinuteShot.oneLookRevision.map((point, i) => (
                        <div key={i} className="p-3 rounded-lg bg-background/60 border border-border/50 text-sm font-medium">
                          {point}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Do Not Forget */}
              <Card className="border-error/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-error" />
                    Do NOT Forget
                  </CardTitle>
                  <CardDescription>Common traps and easy-to-forget points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.lastMinuteShot.doNotForget.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-error flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Exam Checklist */}
              <Card className="border-success/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-success" />
                    Exam Checklist
                  </CardTitle>
                  <CardDescription>Things to practise before the exam</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.lastMinuteShot.examChecklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-success/40 flex-shrink-0 mt-0.5">
                          <span className="text-xs text-success font-bold">{i + 1}</span>
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-4">
              {/* Overview stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{report.totalAttempts}</p>
                    <p className="text-xs text-muted-foreground">Practice Sessions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-success">{report.correctAnswers}</p>
                    <p className="text-xs text-muted-foreground">Correct</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-error">{report.wrongAnswers}</p>
                    <p className="text-xs text-muted-foreground">Wrong</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{report.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </CardContent>
                </Card>
              </div>

              {/* NEET Readiness + Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      NEET Readiness Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            report.neetReadinessScore >= 75 ? 'bg-success' : report.neetReadinessScore >= 50 ? 'bg-warning' : 'bg-error'
                          )}
                          style={{ width: `${report.neetReadinessScore}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold">{report.neetReadinessScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {report.neetReadinessScore >= 75
                        ? 'You are well-prepared for this chapter. Keep revising!'
                        : report.neetReadinessScore >= 50
                        ? 'Good progress. Practise more questions to improve.'
                        : 'Needs more focus. Study the notes and practise questions.'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Improvement Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      {report.improvementTrend === 'up' && <TrendingUp className="h-8 w-8 text-success" />}
                      {report.improvementTrend === 'down' && <TrendingDown className="h-8 w-8 text-error" />}
                      {report.improvementTrend === 'stable' && <Minus className="h-8 w-8 text-muted-foreground" />}
                      {report.improvementTrend === 'new' && <Target className="h-8 w-8 text-primary" />}
                      <div>
                        <p className="text-sm font-medium capitalize">{report.improvementTrend}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.improvementTrend === 'up' && `Recent: ${report.recentAccuracy}% vs Previous: ${report.previousAccuracy}%`}
                          {report.improvementTrend === 'down' && `Recent: ${report.recentAccuracy}% vs Previous: ${report.previousAccuracy}%`}
                          {report.improvementTrend === 'stable' && 'Performance is consistent'}
                          {report.improvementTrend === 'new' && 'Not enough data yet'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revision priority + recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium mb-2">Revision Priority</p>
                    <Badge
                      variant={report.revisionPriority === 'high' ? 'error' : report.revisionPriority === 'medium' ? 'warning' : 'success'}
                    >
                      {report.revisionPriority === 'high' ? 'High Priority' : report.revisionPriority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {report.revisionPriority === 'high'
                        ? 'Focus on this chapter — accuracy is below 50% or no practice yet.'
                        : report.revisionPriority === 'medium'
                        ? 'Moderate accuracy — keep practising to reach 75%+.'
                        : 'Well-prepared — just do a quick revision before the exam.'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium mb-2">Recommended Next Chapter</p>
                    {report.recommendedNextChapter ? (
                      <Link to="/practice" className="text-primary text-sm hover:underline flex items-center gap-1">
                        {report.recommendedNextChapter} <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground">No more chapters in this subject.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Previous attempts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Attempts</CardTitle>
                  <CardDescription>Your practice history for this chapter</CardDescription>
                </CardHeader>
                <CardContent>
                  {report.attempts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No practice attempts yet for this chapter.</p>
                      <Link to="/practice">
                        <Button size="sm" className="mt-3">Start Practising</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {report.attempts.slice().reverse().map((attempt, i) => {
                        const pct = attempt.total ? Math.round((attempt.score! / attempt.total) * 100) : 0;
                        return (
                          <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                            <div>
                              <p className="text-sm font-medium">Attempt {report.attempts.length - i}</p>
                              <p className="text-xs text-muted-foreground">
                                {attempt.question_count} questions · {attempt.difficulty}
                              </p>
                            </div>
                            <Badge variant={pct >= 70 ? 'success' : pct >= 50 ? 'warning' : 'error'}>
                              {attempt.score}/{attempt.total} ({pct}%)
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chapter selection
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <RefreshCw className="h-7 w-7 text-primary" />
          Smart Revision Mode
        </h1>
        <p className="text-muted-foreground mt-1">
          One-page notes, flashcards, formula sheets, mnemonics, and report cards for every chapter.
        </p>
      </div>

      {/* Progress overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Revision Progress</CardTitle>
            <Badge variant={completionPercent === 100 ? 'success' : 'default'}>
              {completionPercent}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {chapters.length} chapters completed
          </p>
        </CardContent>
      </Card>

      {/* Chapter grid */}
      <div className="space-y-6">
        {subjects.map((subject) => {
          const subjectChapters = chapters.filter((c) => c.subject === subject.name);
          return (
            <div key={subject.name}>
              <h2 className={cn('text-lg font-semibold mb-3 flex items-center gap-2', getSubjectColor(subject.name))}>
                <BookOpen className="h-5 w-5" />
                {subject.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjectChapters.map((chapter) => {
                  const status = progress[chapter.name]?.status || 'not-started';
                  return (
                    <Card
                      key={chapter.id}
                      className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedChapter(chapter)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium group-hover:text-primary transition-colors">{chapter.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={cn('text-xs px-2 py-0.5 rounded-md', getSubjectBg(chapter.subject))}>
                                {chapter.weightage} marks
                              </span>
                              <Badge
                                variant={status === 'completed' ? 'success' : status === 'in-progress' ? 'warning' : 'outline'}
                              >
                                {status === 'completed' ? 'Done' : status === 'in-progress' ? 'In Progress' : 'Not Started'}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
