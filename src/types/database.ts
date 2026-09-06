// Database types for the Supabase client
// Matches the schema created by the migration

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          target_percentage?: number | null;
          exam_date?: string | null;
          daily_study_hours?: number | null;
          subscription_tier?: 'free' | 'pro' | 'premium';
          is_owner?: boolean;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          target_percentage?: number | null;
          exam_date?: string | null;
          daily_study_hours?: number | null;
          subscription_tier?: 'free' | 'pro' | 'premium';
          is_owner?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          type: 'question' | 'note' | 'flashcard' | 'formula' | 'mnemonic' | 'lastshot' | 'pyq' | 'topic';
          title: string;
          content: string | null;
          chapter: string | null;
          subject: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          type?: 'question' | 'note' | 'flashcard' | 'formula' | 'mnemonic' | 'lastshot' | 'pyq' | 'topic';
          title: string;
          content?: string | null;
          chapter?: string | null;
          subject?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'question' | 'note' | 'flashcard' | 'formula' | 'mnemonic' | 'lastshot' | 'pyq' | 'topic';
          title?: string;
          content?: string | null;
          chapter?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      practice_attempts: {
        Row: {
          id: string;
          user_id: string;
          chapter: string;
          question_count: number;
          difficulty: string;
          score: number | null;
          total: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          chapter: string;
          question_count?: number;
          difficulty?: string;
          score?: number | null;
          total?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter?: string;
          question_count?: number;
          difficulty?: string;
          score?: number | null;
          total?: number | null;
        };
        Relationships: [];
      };
      mock_test_results: {
        Row: {
          id: string;
          user_id: string;
          test_type: string;
          chapters: string[] | null;
          question_count: number;
          difficulty: string;
          score: number;
          total: number;
          time_taken_seconds: number | null;
          predicted_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          test_type?: string;
          chapters?: string[] | null;
          question_count?: number;
          difficulty?: string;
          score?: number;
          total?: number;
          time_taken_seconds?: number | null;
          predicted_score?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_type?: string;
          chapters?: string[] | null;
          question_count?: number;
          difficulty?: string;
          score?: number;
          total?: number;
          time_taken_seconds?: number | null;
          predicted_score?: number | null;
        };
        Relationships: [];
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          exam_date: string;
          daily_hours: number;
          target_percentage: number;
          completed_chapters: string[];
          plan_data: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          exam_date: string;
          daily_hours?: number;
          target_percentage?: number;
          completed_chapters?: string[];
          plan_data?: unknown | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_date?: string;
          daily_hours?: number;
          target_percentage?: number;
          completed_chapters?: string[];
          plan_data?: unknown | null;
        };
        Relationships: [];
      };
      doubt_history: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          answer: string;
          chapter: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          question: string;
          answer: string;
          chapter?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          question?: string;
          answer?: string;
          chapter?: string | null;
        };
        Relationships: [];
      };
      revision_progress: {
        Row: {
          id: string;
          user_id: string;
          chapter: string;
          status: 'not-started' | 'in-progress' | 'completed';
          last_revised: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          chapter: string;
          status?: 'not-started' | 'in-progress' | 'completed';
          last_revised?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter?: string;
          status?: 'not-started' | 'in-progress' | 'completed';
          last_revised?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_memory: {
        Row: {
          id: string;
          user_id: string;
          preferred_language: string | null;
          preferred_style: string | null;
          study_goals: string | null;
          favourite_subjects: string | null;
          nickname: string | null;
          memory_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          preferred_language?: string | null;
          preferred_style?: string | null;
          study_goals?: string | null;
          favourite_subjects?: string | null;
          nickname?: string | null;
          memory_enabled?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferred_language?: string | null;
          preferred_style?: string | null;
          study_goals?: string | null;
          favourite_subjects?: string | null;
          nickname?: string | null;
          memory_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews_feedback: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          rating: number | null;
          message: string;
          screenshot_url: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          type: string;
          rating?: number | null;
          message: string;
          screenshot_url?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          rating?: number | null;
          message?: string;
          screenshot_url?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      pro_upgrades: {
        Row: {
          id: string;
          user_id: string;
          is_pro: boolean;
          payment_id: string | null;
          amount: number;
          tier: 'pro' | 'premium' | null;
          upgraded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          is_pro?: boolean;
          payment_id?: string | null;
          amount?: number;
          tier?: 'pro' | 'premium' | null;
          upgraded_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          is_pro?: boolean;
          payment_id?: string | null;
          amount?: number;
          tier?: 'pro' | 'premium' | null;
          upgraded_at?: string | null;
        };
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          role: string;
          content: string;
          image_url: string | null;
          language: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          mode: string;
          role: string;
          content: string;
          image_url?: string | null;
          language?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          mode?: string;
          role?: string;
          content?: string;
          image_url?: string | null;
          language?: string | null;
        };
        Relationships: [];
      };
      app_config: {
        Row: {
          key: string;
          value: unknown;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: unknown;
        };
        Update: {
          key?: string;
          value?: unknown;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
