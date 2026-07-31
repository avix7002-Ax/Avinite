import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import {
  Send, Image as ImageIcon, Mic, MicOff, X, BookOpen, Heart,
  Settings, Brain, Trash2, Crown, Lock, Check, Copy, RefreshCw, Image as DiagramIcon,
  Paperclip, FileText, Maximize2, ZoomIn,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useProStatus } from '@/hooks/useProStatus';
import { useAIMemory } from '@/hooks/useAIMemory';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { streamAIResponse, type ChatTurn } from '@/lib/avinex-ai';
import { findDiagram } from '@/lib/diagram-library';
import { AvixLogo } from '@/components/AvixLogo';
import { renderInlineWithMath } from '@/lib/math-renderer';
import { extractFileText, formatBytes } from '@/lib/file-extraction';
import type { AvinexMode, AvinexStyle, AIConversation } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_urls?: string[] | null;
  timestamp: string;
  diagramId?: string | null;
  fileName?: string | null;
}

interface UploadedFile {
  name: string;
  size: number;
  text: string;
}

const styles: AvinexStyle[] = ['Friendly', 'Teacher', 'Professional', 'Motivational', 'Calm', 'Funny', 'Strict Mentor', 'Exam Coach'];
const languages = ['Auto-detect', 'English', 'Hindi', 'Hinglish', 'Bhojpuri', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi', 'Urdu'];
const studyStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Practical/Kinesthetic'];
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];
const streams = ['Science', 'Commerce', 'Arts', 'General'];

const academicSuggestions = [
  { text: 'Explain photosynthesis with the equation' },
  { text: "What is Ohm's law? Give a numerical example" },
  { text: 'Balance: Fe + H₂O → Fe₃O₄ + H₂' },
  { text: 'Difference between aerobic and anaerobic respiration' },
  { text: 'Explain the human heart and double circulation' },
  { text: "Explain Mendel's monohybrid cross" },
];

const companionSuggestions = [
  { text: 'I feel stressed about my board exams' },
  { text: 'Help me make a study timetable' },
  { text: 'How do I stay motivated to study?' },
  { text: "I can't concentrate while studying" },
];

const ACCEPTED_FILE_TYPES = '.pdf,.docx,.pptx,.txt,.csv';
const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ─── Markdown renderer with KaTeX math ───
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-muted text-primary text-[0.85em] font-mono">{part.slice(1, -1)}</code>;
    }
    return renderInlineWithMath(part);
  });
}

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  const [copied, setCopied] = useState(false);

  if (isUser) {
    return <div className="text-sm whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;
  let listItems: string[] = [];
  let inList = false;
  let codeBlock: string[] = [];
  let inCodeBlock = false;

  function flushTable(key: number) {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(1);
    elements.push(
      <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b-2 border-border">
              {header.map((h, i) => (
                <th key={i} className="text-left p-2.5 font-semibold">{renderInline(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className="p-2.5">{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  }

  function flushList(key: number) {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${key}`} className="my-2 space-y-1.5 ml-1">
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed flex gap-2">
            <span className="text-primary flex-shrink-0 mt-0.5">•</span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  }

  function flushCodeBlock(key: number) {
    if (codeBlock.length === 0) return;
    const code = codeBlock.join('\n');
    elements.push(
      <div key={`code-${key}`} className="my-3 relative group">
        <pre className="bg-muted/80 rounded-lg p-3.5 overflow-x-auto text-xs font-mono leading-relaxed border border-border/50">
          <code>{code}</code>
        </pre>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-muted hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </div>
    );
    codeBlock = [];
  }

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCodeBlock(idx);
      } else {
        if (inTable) { inTable = false; flushTable(idx); }
        if (inList) { inList = false; flushList(idx); }
        inCodeBlock = true;
      }
      return;
    }
    if (inCodeBlock) {
      codeBlock.push(line);
      return;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      if (inList) { inList = false; flushList(idx); }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return;
      tableRows.push(cells);
      return;
    } else if (inTable) {
      inTable = false;
      flushTable(idx);
    }

    if (line.trim().startsWith('• ')) {
      inList = true;
      listItems.push(line.trim().slice(2));
      return;
    } else if (inList) {
      inList = false;
      flushList(idx);
    }

    if (line.trim() === '---') {
      elements.push(<hr key={`hr-${idx}`} className="my-4 border-border/40" />);
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${idx}`} className="text-sm font-bold mt-4 mb-1.5 text-primary">{renderInline(line.slice(4))}</h3>);
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${idx}`} className="text-base font-bold mt-4 mb-1.5">{renderInline(line.slice(3))}</h2>);
      return;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${idx}`} className="text-lg font-bold mt-4 mb-2">{renderInline(line.slice(2))}</h1>);
      return;
    }

    if (line.trim().startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${idx}`} className="my-2.5 pl-4 pr-2 py-2 border-l-2 border-primary/60 bg-primary/5 rounded-r-lg text-sm italic">
          {renderInline(line.trim().slice(2))}
        </blockquote>
      );
      return;
    }

    if (line.trim() === '') {
      elements.push(<div key={`sp-${idx}`} className="h-1.5" />);
      return;
    }

    elements.push(<p key={`p-${idx}`} className="text-sm leading-relaxed my-1">{renderInline(line)}</p>);
  });

  flushTable(9999);
  flushList(9999);
  flushCodeBlock(9999);

  return <div className="space-y-0">{elements}</div>;
}

// ─── Diagram display ───
function DiagramDisplay({ diagramId }: { diagramId: string }) {
  const [diagram, setDiagram] = useState<{ svg: string; title: string } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    import('@/lib/diagram-library').then((mod) => {
      const d = mod.DIAGRAM_LIBRARY.find((dg) => dg.id === diagramId);
      if (d) setDiagram({ svg: d.svg, title: d.title });
    });
  }, [diagramId]);

  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [fullscreen]);

  if (!diagram) return null;

  return (
    <div className="mb-4 rounded-xl overflow-hidden border border-border/40 bg-gradient-to-br from-muted/30 to-transparent p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <DiagramIcon className="h-3.5 w-3.5" />
          {diagram.title}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoomed(z => !z)} className="p-1 rounded-md hover:bg-muted text-muted-foreground" aria-label="Toggle zoom">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setFullscreen(true)} className="p-1 rounded-md hover:bg-muted text-muted-foreground" aria-label="Fullscreen">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className={cn('w-full mx-auto [&>svg]:w-full [&>svg]:h-auto transition-all', zoomed ? 'max-w-2xl' : 'max-w-md')} dangerouslySetInnerHTML={{ __html: diagram.svg }} />
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 cursor-pointer" onClick={() => setFullscreen(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setFullscreen(false)} className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-background shadow-lg" aria-label="Close fullscreen">
              <X className="h-4 w-4" />
            </button>
            <div className="bg-background rounded-xl p-6">
              <div className="text-xs font-medium text-muted-foreground mb-3 text-center">{diagram.title}</div>
              <div className="w-full [&>svg]:w-full [&>svg]:h-auto" dangerouslySetInnerHTML={{ __html: diagram.svg }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AvixAIPage() {
  const { user } = useAuth();
  const { isPro, upgradeToPro } = useProStatus();
  const { memory, saveMemory, toggleMemory, deleteMemory } = useAIMemory();

  const [mode, setMode] = useState<AvinexMode>('academic');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [extractingFile, setExtractingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<AvinexStyle>('Friendly');
  const [selectedLanguage, setSelectedLanguage] = useState('Auto-detect');
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [retryData, setRetryData] = useState<{ message: string; images: string[]; fileText: string | null; fileName: string | null } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const streamingContentRef = useRef('');

  useEffect(() => {
    if (memory) {
      setSelectedStyle((memory.preferred_style as AvinexStyle) || 'Friendly');
      setSelectedLanguage(memory.preferred_language || 'Auto-detect');
    }
  }, [memory]);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('avix-daily-count');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setDailyMessageCount(data.count);
      } else {
        localStorage.setItem('avix-daily-count', JSON.stringify({ date: today, count: 0 }));
        setDailyMessageCount(0);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);
      if (data) {
        setMessages(
          (data as AIConversation[]).map((d) => ({
            id: d.id,
            role: d.role as 'user' | 'assistant',
            content: d.content,
            image_urls: d.image_url ? [d.image_url] : null,
            timestamp: d.created_at,
          }))
        );
      }
    })();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, streamingContent]);

  const dailyLimit = isPro ? 500 : 55;
  const canSend = dailyMessageCount < dailyLimit && !loading;

  const incrementDailyCount = useCallback(() => {
    const newCount = dailyMessageCount + 1;
    setDailyMessageCount(newCount);
    localStorage.setItem('avix-daily-count', JSON.stringify({ date: new Date().toDateString(), count: newCount }));
  }, [dailyMessageCount]);

  function handleModeChange(newMode: AvinexMode) {
    if (newMode === 'companion' && !isPro) {
      setShowSettings(false);
      return;
    }
    setMode(newMode);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string].slice(0, MAX_IMAGES));
      };
      reader.readAsDataURL(file);
    });
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large (${formatBytes(file.size)}). Maximum size is 10 MB.`);
      return;
    }
    setExtractingFile(true);
    setError(null);
    try {
      const text = await extractFileText(file);
      setUploadedFile({ name: file.name, size: file.size, text });
    } catch {
      setError('Could not read this file. Please try a different format.');
    } finally {
      setExtractingFile(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        setInput(prev => prev + ' [Voice message]');
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  }

  async function handleSend(retryMessage?: string, retryImages?: string[], retryFileText?: string | null, retryFileName?: string | null) {
    const userMessage = (retryMessage ?? input).trim();
    const userImages = retryImages ?? images;
    const fileText = retryFileText ?? (uploadedFile?.text || null);
    const fileName = retryFileName ?? (uploadedFile?.name || null);

    if (!userMessage && userImages.length === 0 && !fileText) return;
    if (mode === 'companion' && !isPro) return;
    if (!canSend) return;

    setInput('');
    setImages([]);
    setUploadedFile(null);
    setError(null);
    setRetryData(null);
    incrementDailyCount();

    const diagram = findDiagram(userMessage);

    const userChat: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage || (fileName ? `Uploaded file: ${fileName}` : 'Please analyze the image(s).'),
      image_urls: userImages.length > 0 ? userImages : null,
      timestamp: new Date().toISOString(),
      fileName,
    };
    setMessages(prev => [...prev, userChat]);

    if (user) {
      supabase.from('ai_conversations').insert({
        user_id: user.id,
        mode,
        role: 'user',
        content: userChat.content,
        image_url: userImages[0] || null,
        language: selectedLanguage,
      });
    }

    setLoading(true);
    setStreamingContent('');
    setStatusMessage('');
    streamingContentRef.current = '';

    const history: ChatTurn[] = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.content,
    }));

    const memoryContext = memory?.memory_enabled ? {
      nickname: memory.nickname,
      study_goals: memory.study_goals,
      favourite_subjects: memory.favourite_subjects,
      preferred_style: memory.preferred_style,
      preferred_language: memory.preferred_language,
      student_class: memory.student_class,
      stream: memory.stream,
      board: memory.board,
      exam: memory.exam,
      weak_subjects: memory.weak_subjects,
      study_style: memory.study_style,
      daily_goals: memory.daily_goals,
    } : null;

    abortRef.current = new AbortController();

    streamAIResponse(
      {
        message: userMessage,
        hasImage: userImages.length > 0,
        style: selectedStyle,
        language: selectedLanguage,
        mode,
        history,
        images: userImages.length > 0 ? userImages : null,
        fileContent: fileText,
        memoryContext,
      },
      (chunk) => {
        setStreamingContent(prev => {
          streamingContentRef.current = prev + chunk;
          return prev + chunk;
        });
      },
      (err) => {
        setError(err);
        setRetryData({ message: userMessage, images: userImages, fileText, fileName });
        setLoading(false);
        setStreamingContent('');
        setStatusMessage('');
        streamingContentRef.current = '';
      },
      (fullResponse) => {
        const response = fullResponse || streamingContentRef.current;
        if (!response) {
          setError('The AI returned an empty response. Please try again.');
          setRetryData({ message: userMessage, images: userImages, fileText, fileName });
          setLoading(false);
          setStreamingContent('');
          setStatusMessage('');
          streamingContentRef.current = '';
          return;
        }

        const assistantChat: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          image_urls: null,
          timestamp: new Date().toISOString(),
          diagramId: diagram?.id || null,
        };
        setMessages(prev => [...prev, assistantChat]);
        setStreamingContent('');
        setStatusMessage('');
        streamingContentRef.current = '';
        setLoading(false);

        if (user) {
          supabase.from('ai_conversations').insert({
            user_id: user.id,
            mode,
            role: 'assistant',
            content: response,
            language: selectedLanguage,
          });
        }
      },
      abortRef.current.signal,
      (status) => {
        setStatusMessage(status);
      }
    );
  }

  function stopStreaming() {
    abortRef.current?.abort();
    setLoading(false);
  }

  async function clearConversation() {
    if (!user) return;
    await supabase.from('ai_conversations').delete().eq('user_id', user.id);
    setMessages([]);
  }

  async function handleUpgrade() {
    await upgradeToPro();
  }

  function handleSaveStyle(style: AvinexStyle) {
    setSelectedStyle(style);
    if (memory?.memory_enabled) saveMemory({ preferred_style: style });
  }

  function handleSaveLanguage(lang: string) {
    setSelectedLanguage(lang);
    if (memory?.memory_enabled) saveMemory({ preferred_language: lang });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <AvixLogo size={40} className="flex-shrink-0" />
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              Avix AI
              {isPro && <Crown className="h-4 w-4 text-warning" />}
            </h1>
            <p className="text-xs text-muted-foreground">Your Smart Learning & Student Companion</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearConversation} aria-label="Clear conversation">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 py-3">
        <button
          onClick={() => handleModeChange('academic')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            mode === 'academic'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:scale-[1.02]'
          )}
        >
          <BookOpen className="h-4 w-4" />
          Academic
        </button>
        <button
          onClick={() => handleModeChange('companion')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative',
            mode === 'companion'
              ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
              : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:scale-[1.02]',
            !isPro && 'opacity-60'
          )}
        >
          <Heart className="h-4 w-4" />
          Companion
          {!isPro && <Lock className="h-3 w-3" />}
        </button>
        {memory?.memory_enabled && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-accent/10 text-accent text-xs font-medium ml-auto">
            <Brain className="h-3.5 w-3.5" />
            Memory ON
          </div>
        )}
      </div>

      {/* Settings panel */}
      {showSettings && (
        <Card className="mb-3 animate-fade-in border-border/40">
          <CardContent className="pt-4 pb-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">AI Style</label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleSaveStyle(style)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                      selectedStyle === style
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleSaveLanguage(lang)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                      selectedLanguage === lang
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            {/* Memory controls */}
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  AI Memory
                </span>
                <button
                  onClick={() => toggleMemory(!memory?.memory_enabled)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors duration-200',
                    memory?.memory_enabled ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                    memory?.memory_enabled ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
              {memory?.memory_enabled ? (
                <p className="text-xs text-muted-foreground mb-2">
                  Memory is ON. Avix AI remembers your preferences and past conversations. It will never turn off automatically.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mb-2">
                  Memory is OFF. Nothing is saved. Turn it on for a personalized experience.
                </p>
              )}
              {memory?.memory_enabled && (
                <Button variant="outline" size="sm" onClick={() => setShowMemory(!showMemory)}>
                  {showMemory ? 'Hide' : 'View'} Memory
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory panel — expanded */}
      {showMemory && memory?.memory_enabled && (
        <Card className="mb-3 animate-fade-in border-border/40">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" /> Your AI Memory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nickname</label>
                <Input
                  value={memory.nickname || ''}
                  onChange={(e) => saveMemory({ nickname: e.target.value })}
                  placeholder="What should I call you?"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Class</label>
                <Input
                  value={memory.student_class || ''}
                  onChange={(e) => saveMemory({ student_class: e.target.value })}
                  placeholder="e.g., Class 10"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Board</label>
                <select
                  value={memory.board || ''}
                  onChange={(e) => saveMemory({ board: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select board</option>
                  {boards.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Stream</label>
                <select
                  value={memory.stream || ''}
                  onChange={(e) => saveMemory({ stream: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select stream</option>
                  {streams.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Exam Target</label>
                <Input
                  value={memory.exam || ''}
                  onChange={(e) => saveMemory({ exam: e.target.value })}
                  placeholder="e.g., Board Exam 2026"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Study Style</label>
                <select
                  value={memory.study_style || ''}
                  onChange={(e) => saveMemory({ study_style: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select style</option>
                  {studyStyles.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Favourite Subjects</label>
              <Input
                value={memory.favourite_subjects || ''}
                onChange={(e) => saveMemory({ favourite_subjects: e.target.value })}
                placeholder="e.g., Physics, Chemistry"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Weak Subjects</label>
              <Input
                value={memory.weak_subjects || ''}
                onChange={(e) => saveMemory({ weak_subjects: e.target.value })}
                placeholder="e.g., Biology, Numericals"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Study Goals</label>
              <Input
                value={memory.study_goals || ''}
                onChange={(e) => saveMemory({ study_goals: e.target.value })}
                placeholder="e.g., Score 90+ in boards"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Daily Goals</label>
              <Input
                value={memory.daily_goals || ''}
                onChange={(e) => saveMemory({ daily_goals: e.target.value })}
                placeholder="e.g., Study 3 hours, solve 5 PYQs"
                className="mt-1"
              />
            </div>
            <Button variant="outline" size="sm" onClick={deleteMemory} className="text-destructive">
              <Trash2 className="h-3 w-3 mr-1" /> Delete All Memory
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-4 scroll-smooth">
        {messages.length === 0 && !loading && (
          <div className="text-center py-8 max-w-2xl mx-auto">
            <div className="inline-flex mb-4 animate-fade-in">
              <AvixLogo size={56} />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Hi{memory?.nickname ? ` ${memory.nickname}` : ''}! I'm Avix AI
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm leading-relaxed">
              {mode === 'academic'
                ? 'Ask me anything about your CBSE Class 10 Science syllabus — concepts, formulas, numericals, PYQs, and more. I can analyze images, read files, show diagrams, and render beautiful math!'
                : "I'm here to support you with motivation, study planning, stress management, and more. How are you feeling today?"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {(mode === 'academic' ? academicSuggestions : companionSuggestions).map((suggestion) => (
                <button
                  key={suggestion.text}
                  onClick={() => setInput(suggestion.text)}
                  className="text-left p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/30 hover:border-border/50 transition-all duration-200 text-sm hover:scale-[1.02] hover:shadow-sm"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3 animate-fade-in', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <AvixLogo size={32} />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3.5 transition-all',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-md shadow-sm'
                    : 'bg-muted/60 border border-border/30 rounded-tl-md'
                )}
              >
                {msg.diagramId && <DiagramDisplay diagramId={msg.diagramId} />}
                {msg.image_urls && msg.image_urls.length > 0 && (
                  <div className={cn('mb-3', msg.image_urls.length > 1 ? 'grid grid-cols-2 gap-2' : '')}>
                    {msg.image_urls.map((img, i) => (
                      <img key={i} src={img} alt={`Upload ${i + 1}`} className="rounded-lg max-h-52 object-cover w-full" />
                    ))}
                  </div>
                )}
                {msg.fileName && (
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {msg.fileName}
                  </div>
                )}
                <MessageContent content={msg.content} isUser={msg.role === 'user'} />
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex-shrink-0 mt-1">
                <AvixLogo size={32} />
              </div>
              <div className="bg-muted/60 border border-border/30 rounded-2xl rounded-tl-md px-4 py-3.5 max-w-[85%] md:max-w-[75%]">
                {streamingContent ? (
                  <MessageContent content={streamingContent} isUser={false} />
                ) : (
                  <div className="flex gap-1.5 items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-muted-foreground ml-2 animate-pulse">
                      {statusMessage || 'Avix AI is thinking...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center max-w-md mx-auto">
              <div className="text-sm text-destructive bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                {error}
              </div>
              {retryData && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => handleSend(retryData.message, retryData.images, retryData.fileText, retryData.fileName)}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Try Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Daily limit warning */}
      {dailyMessageCount >= dailyLimit * 0.8 && dailyMessageCount < dailyLimit && (
        <div className="text-xs text-warning text-center pb-2 max-w-3xl mx-auto">
          You've used {dailyMessageCount}/{dailyLimit} messages today. {isPro ? '' : 'Upgrade to Pro for 500+ messages/day.'}
        </div>
      )}
      {dailyMessageCount >= dailyLimit && (
        <div className="text-xs text-destructive text-center pb-2 max-w-3xl mx-auto">
          Daily limit reached ({dailyMessageCount}/{dailyLimit}). Come back tomorrow or {isPro ? '' : 'upgrade to Pro.'}
        </div>
      )}

      {/* Pro upgrade banner for companion mode */}
      {mode === 'companion' && !isPro && (
        <Card className="mb-3 border-warning/30 bg-gradient-to-br from-warning/5 to-primary/5 max-w-3xl mx-auto w-full">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-warning flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Companion Mode is a Pro Feature</p>
                <p className="text-xs text-muted-foreground">Unlock for one-time payment</p>
              </div>
              <Button size="sm" onClick={handleUpgrade}>Upgrade</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input area */}
      <div className="border-t border-border/40 pt-3 max-w-3xl mx-auto w-full">
        {/* Image previews */}
        {images.length > 0 && (
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`Preview ${i + 1}`} className="h-16 w-16 rounded-lg object-cover border border-border/40" />
                <button
                  onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                onClick={() => imageInputRef.current?.click()}
                className="h-16 w-16 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="Add more images"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        {/* File preview */}
        {uploadedFile && (
          <div className="mb-2 flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium flex-1 truncate">{uploadedFile.name}</span>
            <span className="text-xs text-muted-foreground">{formatBytes(uploadedFile.size)}</span>
            <button onClick={() => setUploadedFile(null)} className="text-muted-foreground hover:text-destructive" aria-label="Remove file">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {extractingFile && (
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Extracting text from file...
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={loading || images.length >= MAX_IMAGES}
            aria-label="Upload images"
            className="flex-shrink-0"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || !!uploadedFile}
            aria-label="Upload file"
            className="flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            disabled={loading}
            aria-label="Voice input"
            className="flex-shrink-0"
          >
            {isRecording ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />}
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={mode === 'academic' ? 'Ask about any concept, formula, or numerical...' : "Tell me how you're feeling..."}
              disabled={loading || !canSend}
              className="rounded-xl"
            />
          </div>
          {loading ? (
            <Button
              onClick={stopStreaming}
              size="sm"
              variant="outline"
              className="flex-shrink-0 rounded-xl"
              aria-label="Stop"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => handleSend()}
              disabled={(!input.trim() && images.length === 0 && !uploadedFile) || !canSend}
              size="sm"
              className="flex-shrink-0 rounded-xl"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {dailyMessageCount}/{dailyLimit} messages used today {isPro ? '· Pro' : '· Free'} · Powered by Avix AI
        </p>
      </div>
    </div>
  );
}

export default AvixAIPage;
