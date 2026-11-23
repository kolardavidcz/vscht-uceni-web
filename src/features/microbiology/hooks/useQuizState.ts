import { useCallback, useEffect, useState } from "react";
import { sortEmojis } from "../data/emojis";
import type { EmojiOption } from "../types";

const PIN_KEY = "microbiology_palette_pinned";
const ANSWERS_KEY = "microbiology_quiz_answers_v1";

function loadSavedAnswers(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const clean: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(v) && v.every((x) => typeof x === "string") && v.length > 0) {
        clean[k] = v;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function useQuizState(emojiOptions: EmojiOption[]) {
  const [selectedEmojis, setSelectedEmojis] = useState<Record<string, string[]>>(
    loadSavedAnswers
  );
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isPalettePinned, setIsPalettePinned] = useState(() => {
    try {
      return localStorage.getItem(PIN_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Persist quiz progress so accidental reloads or visiting Atlas keep filled answers
  useEffect(() => {
    try {
      if (Object.keys(selectedEmojis).length === 0) {
        localStorage.removeItem(ANSWERS_KEY);
      } else {
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(selectedEmojis));
      }
    } catch {
      /* ignore storage errors */
    }
  }, [selectedEmojis]);

  const togglePin = useCallback(() => {
    setIsPalettePinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(PIN_KEY, String(next));
      } catch {
        /* ignore */
      }
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
