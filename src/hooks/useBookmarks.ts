import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Bookmark } from '@/types';

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error('Error loading bookmarks:', error);
      }
      setBookmarks((data as Bookmark[]) || []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const addBookmark = useCallback(
    async (type: Bookmark['type'], title: string, content?: string, chapter?: string, subject?: string) => {
      if (!user) return { error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          type,
          title,
          content: content || null,
          chapter: chapter || null,
          subject: subject || null,
        })
        .select()
        .single();

      if (!error && data) {
        setBookmarks((prev) => [data as Bookmark, ...prev]);
      }

      return { error: error?.message || null };
    },
    [user]
  );

  const removeBookmark = useCallback(async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }

    return { error: error?.message || null };
  }, []);

  const isBookmarked = useCallback(
    (title: string): boolean => bookmarks.some((b) => b.title === title),
    [bookmarks]
  );

  return useMemo(
    () => ({ bookmarks, loading, addBookmark, removeBookmark, isBookmarked }),
    [bookmarks, loading, addBookmark, removeBookmark, isBookmarked]
  );
}
