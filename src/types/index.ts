export type Subject = 'Physics' | 'Chemistry' | 'Biology' | 'Environment';

export interface Chapter {
  id: string;
  name: string;
  subject: Subject;
  slug: string;
  weightage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  pyqCount: number;
}

export interface SubjectInfo {
  name: Subject;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  chapterCount: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  type: 'question' | 'note' | 'flashcard' | 'formula' | 'mnemonic' | 'lastshot' | 'pyq' | 'topic';
  title: string;
  content: string | null;
  chapter: string | null;
  subject: string | null;
  created_at: string;
}

export interface PracticeAttempt {
  id: string;
  user_id: string;
  chapter: string;
  question_count: number;
  difficulty: string;
  score: number | null;
  total: number | null;
  created_at: string;
}

export interface MockTestResult {
  id: string;
  user_id: string;
  test_type: 'chapter' | 'full' | 'custom';
  chapters: string[] | null;
  question_count: number;
  difficulty: string;
  score: number;
  total: number;
  time_taken_seconds: number | null;
  predicted_score: number | null;
  created_at: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  exam_date: string;
  daily_hours: number;
  target_percentage: number;
  completed_chapters: string[];
  plan_data: StudyPlanData | null;
  created_at: string;
}

export interface StudyPlanData {
  daysUntilExam: number;
  totalChapters: number;
  phases: StudyPhase[];
  weeklySchedule: WeeklySchedule[];
}

export interface StudyPhase {
  name: string;
  duration: string;
  description: string;
  chapters: string[];
}

export interface WeeklySchedule {
  week: number;
  focus: string;
  days: DayPlan[];
}

export interface DayPlan {
  day: string;
  slots: StudySlot[];
}

export interface StudySlot {
  time: string;
  activity: string;
  chapter?: string;
}

export interface DoubtEntry {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  chapter: string | null;
  created_at: string;
}

export interface RevisionProgress {
  id: string;
  user_id: string;
  chapter: string;
  status: 'not-started' | 'in-progress' | 'completed';
  last_revised: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  target_percentage: number | null;
  exam_date: string | null;
  daily_study_hours: number | null;
  subscription_tier: 'free' | 'pro' | 'premium';
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIMemory {
  id: string;
  user_id: string;
  preferred_language: string | null;
  preferred_style: string | null;
  study_goals: string | null;
  favourite_subjects: string | null;
  nickname: string | null;
  memory_enabled: boolean;
  student_class: string | null;
  stream: string | null;
  board: string | null;
  exam: string | null;
  weak_subjects: string | null;
  study_style: string | null;
  daily_goals: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewFeedback {
  id: string;
  user_id: string;
  type: 'rating' | 'bug' | 'feature_request' | 'ai_mistake' | 'improvement';
  rating: number | null;
  message: string;
  screenshot_url: string | null;
  status: string;
  created_at: string;
}

export interface ProUpgrade {
  id: string;
  user_id: string;
  is_pro: boolean;
  payment_id: string | null;
  amount: number;
  tier: 'pro' | 'premium' | null;
  upgraded_at: string | null;
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  mode: 'academic' | 'companion';
  role: 'user' | 'assistant';
  content: string;
  image_url: string | null;
  language: string | null;
  created_at: string;
}

export type AvinexStyle = 'Friendly' | 'Teacher' | 'Professional' | 'Motivational' | 'Calm' | 'Funny' | 'Strict Mentor' | 'Exam Coach';
export type AvinexMode = 'academic' | 'companion';
