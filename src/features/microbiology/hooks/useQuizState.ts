import { useCallback, useEffect, useState } from "react";
import { sortEmojis } from "../data/emojis";
import type { EmojiOption } from "../types";

const PIN_KEY = "microbiology_palette_pinned";

export function useQuizState(emojiOptions: EmojiOption[]) {
  const [selectedEmojis, setSelectedEmojis] = useState<Record<string, string[]>>(
    {}
  );
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isPalettePinned, setIsPalettePinned] = useState(
    () => localStorage.getItem(PIN_KEY) === "true"
  );

  const togglePin = useCallback(() => {
    setIsPalettePinned((prev) => {
      const next = !prev;
      localStorage.setItem(PIN_KEY, String(next));
      return next;
    });
  }, []);

  const activate = useCallback((id: string) => {
    setActiveFieldId((prev) => (prev === id ? null : id));
  }, []);

  const closePalette = useCallback(() => {
    setActiveFieldId(null);
  }, []);

  const selectEmoji = useCallback(
    (fieldId: string, emoji: string) => {
      setShowResults(false);
      setSelectedEmojis((prev) => {
        const current = prev[fieldId] || [];
        if (current.includes(emoji)) return prev;
        return {
          ...prev,
          [fieldId]: sortEmojis([...current, emoji], emojiOptions),
        };
      });
    },
    [emojiOptions]
  );

  const removeEmoji = useCallback((fieldId: string, emoji: string) => {
    setShowResults(false);
    setSelectedEmojis((prev) => {
      const current = prev[fieldId] || [];
      const updated = current.filter((e) => e !== emoji);
      if (updated.length === 0) {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      }
      return { ...prev, [fieldId]: updated };
    });
  }, []);

  const toggleEmoji = useCallback(
    (fieldId: string, emoji: string) => {
      const current = selectedEmojis[fieldId] || [];
      if (current.includes(emoji)) removeEmoji(fieldId, emoji);
      else selectEmoji(fieldId, emoji);
    },
    [selectedEmojis, removeEmoji, selectEmoji]
  );

  const clearField = useCallback((fieldId: string) => {
    setShowResults(false);
    setSelectedEmojis((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setSelectedEmojis({});
    setShowResults(false);
    setActiveFieldId(null);
  }, []);

  const checkAnswers = useCallback(() => {
    setShowResults(true);
  }, []);

  // Close floating palette when clicking outside (pinned stays open)
  useEffect(() => {
    if (!activeFieldId || isPalettePinned) return;
    const onDocClick = () => setActiveFieldId(null);
    // Defer so the activating click doesn't immediately close
    const t = window.setTimeout(() => {
      document.addEventListener("click", onDocClick);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("click", onDocClick);
    };
  }, [activeFieldId, isPalettePinned]);

  return {
    selectedEmojis,
    activeFieldId,
    showResults,
    isPalettePinned,
    togglePin,
    activate,
    closePalette,
    selectEmoji,
    removeEmoji,
    toggleEmoji,
    clearField,
    resetAll,
    checkAnswers,
  };
}
