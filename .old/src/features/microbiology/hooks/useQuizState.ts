import { useState, useCallback, useEffect } from 'react';
import { EmojiOption } from '../../../types';
import { sortEmojis } from '../data/data';

export function useQuizState(emojiOptions: EmojiOption[]) {
  const [selectedEmojis, setSelectedEmojis] = useState<Record<string, string[]>>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isPalettePinned, setIsPalettePinned] = useState(() => localStorage.getItem('microbiology_palette_pinned') === 'true');

  const handleTogglePin = useCallback(() => {
    setIsPalettePinned(prev => {
      const next = !prev;
      localStorage.setItem('microbiology_palette_pinned', String(next));
      return next;
    });
  }, []);

  const handleActivate = useCallback((id: string) => {
    setActiveItemId(prev => prev === id ? null : id);
  }, []);

  const handleSelectEmoji = useCallback((id: string, emoji: string) => {
    setSelectedEmojis(prev => {
      const current = prev[id] || [];
      if (current.includes(emoji)) return prev;
      const updated = [...current, emoji];
      return { ...prev, [id]: sortEmojis(updated, emojiOptions) };
    });
  }, [emojiOptions]);

  const handleRemoveEmoji = useCallback((id: string, emoji: string) => {
    setSelectedEmojis(prev => {
      const current = prev[id] || [];
      const updated = current.filter(e => e !== emoji);
      if (updated.length === 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: updated };
    });
  }, []);

  const handleClearAll = useCallback((id: string) => {
    setSelectedEmojis(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleClosePalette = useCallback(() => {
    setActiveItemId(null);
  }, []);

  // Close palette when clicking outside
  useEffect(() => {
    if (!activeItemId) return;
    
    const handleDocumentClick = () => {
      setActiveItemId(null);
    };
    
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [activeItemId]);

  const handleCheck = useCallback(() => {
    setShowResults(true);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedEmojis({});
    setActiveItemId(null);
    setShowResults(false);
  }, []);

  return {
    selectedEmojis,
    activeItemId,
    showResults,
    isPalettePinned,
    handleTogglePin,
    handleActivate,
    handleSelectEmoji,
    handleRemoveEmoji,
    handleClearAll,
    handleClosePalette,
    handleCheck,
    handleReset
  };
}
