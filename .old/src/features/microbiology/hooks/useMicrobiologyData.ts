import { useState, useEffect, useCallback } from 'react';
import { WorksheetItem, EmojiOption } from '../../../types';
import { worksheetData as initialWorksheetData, emojiOptions as initialEmojiOptions, emojiCategories as initialEmojiCategories, enrichWorksheetData } from '../data/data';

export function useMicrobiologyData() {
  const [currentWorksheetData, setCurrentWorksheetData] = useState<WorksheetItem[]>(() =>
    enrichWorksheetData(initialWorksheetData, initialEmojiOptions)
  );
  const [emojiOptions, setEmojiOptions] = useState<EmojiOption[]>(initialEmojiOptions);
  const [emojiCategories, setEmojiCategories] = useState<{key: string, label: string}[]>(initialEmojiCategories);

  const [isLocalMode, setIsLocalMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocalMode(isLocal);

      if (isLocal) {
        console.info('Vývojový režim (Local Dev): Využívám statická data / localStorage.');
        const saved = localStorage.getItem('microbiology_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.worksheetData) {
              const options = parsed.emojiOptions || initialEmojiOptions;
              setCurrentWorksheetData(enrichWorksheetData(parsed.worksheetData, options));
              setEmojiOptions(options);
              setEmojiCategories(parsed.emojiCategories || initialEmojiCategories);
            } else {
              setCurrentWorksheetData(enrichWorksheetData(parsed, initialEmojiOptions));
            }
          } catch (err) {
            console.warn('Nepodařilo se načíst lokální data z localStorage', err);
          }
        }
        return;
      }

      try {
        const response = await fetch('/api/get-data');
        if (response.ok) {
          const data = await response.json();
          if (data.worksheetData) {
            const options = data.emojiOptions || initialEmojiOptions;
            setCurrentWorksheetData(enrichWorksheetData(data.worksheetData, options));
            setEmojiOptions(options);
            setEmojiCategories(data.emojiCategories || initialEmojiCategories);
          } else {
            // Legacy format
            setCurrentWorksheetData(enrichWorksheetData(data, initialEmojiOptions));
          }
        }
      } catch (e) {
        console.warn('Načtení z API selhalo, přecházím na localStorage', e);
        const saved = localStorage.getItem('microbiology_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.worksheetData) {
              const options = parsed.emojiOptions || initialEmojiOptions;
              setCurrentWorksheetData(enrichWorksheetData(parsed.worksheetData, options));
              setEmojiOptions(options);
              setEmojiCategories(parsed.emojiCategories || initialEmojiCategories);
            } else {
              setCurrentWorksheetData(enrichWorksheetData(parsed, initialEmojiOptions));
            }
          } catch (err) {
            console.error('Nepodařilo se zpracovat záložní data', err);
          }
        }
      }
    };
    fetchData();
  }, []);

  const handleUpdateData = useCallback((newData: WorksheetItem[], newEmojis?: EmojiOption[], newCategories?: {key: string, label: string}[]) => {
    const opts = newEmojis || emojiOptions;
    const enriched = enrichWorksheetData(newData, opts);
    setCurrentWorksheetData(enriched);
    if (newEmojis) setEmojiOptions(newEmojis);
    if (newCategories) setEmojiCategories(newCategories);
    
    localStorage.setItem('microbiology_data', JSON.stringify({
      worksheetData: enriched,
      emojiOptions: opts,
      emojiCategories: newCategories || emojiCategories
    }));
  }, [emojiOptions, emojiCategories]);

  return {
    currentWorksheetData,
    emojiOptions,
    emojiCategories,
    handleUpdateData,
    isLocalMode
  };
}
