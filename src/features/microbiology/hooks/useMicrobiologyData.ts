import { useCallback, useEffect, useState } from "react";
import type { EmojiCategory, EmojiOption, WorksheetItem } from "../types";
import { worksheetData as staticWorksheet } from "../data/zastupci";
import {
  emojiCategories as staticCategories,
  emojiOptions as staticEmojis,
  enrichWorksheetData,
} from "../data/emojis";

/** Bumped when static payload encoding changed so stale localStorage cannot poison UI. */
const STORAGE_KEY = "microbiology_data_v2";
const LEGACY_STORAGE_KEYS = ["microbiology_data", "microbiology_data_v1"];

type Payload = {
  worksheetData?: WorksheetItem[];
  emojiOptions?: EmojiOption[];
  emojiCategories?: EmojiCategory[];
};

function looksCorruptedText(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /Ã.|Ä.|Å.|├|┼|≡ƒ|bunÄ|stÄ›|gramnegativnÃ/.test(value);
}

function payloadLooksCorrupted(payload: Payload): boolean {
  const walk = (items: WorksheetItem[] | undefined): boolean => {
    if (!items) return false;
    for (const item of items) {
      if (looksCorruptedText(item.name) || looksCorruptedText(item.description)) {
        return true;
      }
      for (const e of item.correctEmojis || []) {
        if (looksCorruptedText(e)) return true;
      }
      if (item.children && walk(item.children)) return true;
    }
    return false;
  };
  if (walk(payload.worksheetData)) return true;
  for (const opt of payload.emojiOptions || []) {
    if (
      looksCorruptedText(opt.emoji) ||
      looksCorruptedText(opt.label) ||
      looksCorruptedText(opt.category)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Data story (soft-upgrade, ~52 species catalog):
 *
 * 1. **Always** start from bundled static data — UI is interactive immediately
 *    (no wait on Redis for `/mikrobiologie` deep-links).
 * 2. **Background** `GET /api/get-data` soft-upgrades when Redis has a shared
 *    snapshot (classroom admin edits).
 * 3. localStorage mirrors offline / failed-API admin edits when Redis is empty.
 *
 * Vercel `/tmp` is NOT used (ephemeral). Bundle + optional Redis remain the stores.
 */
export function useMicrobiologyData() {
  const [worksheetData, setWorksheetData] = useState<WorksheetItem[]>(() =>
    enrichWorksheetData(staticWorksheet, staticEmojis)
  );
  const [emojiOptions, setEmojiOptions] = useState<EmojiOption[]>(staticEmojis);
  const [emojiCategories, setEmojiCategories] =
    useState<EmojiCategory[]>(staticCategories);
  const [isLocalMode, setIsLocalMode] = useState(true);
  const [kvAvailable, setKvAvailable] = useState(false);
  const [storageLabel, setStorageLabel] = useState("Balík (statická data)");
  /** True immediately — never block the quiz on network */
  const [ready] = useState(true);

  const applyPayload = useCallback((payload: Payload) => {
    const opts = payload.emojiOptions ?? staticEmojis;
    const cats = payload.emojiCategories ?? staticCategories;
    const tree = payload.worksheetData ?? staticWorksheet;
    setEmojiOptions(opts);
    setEmojiCategories(cats);
    setWorksheetData(enrichWorksheetData(tree, opts));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const purgeLegacy = () => {
      for (const key of LEGACY_STORAGE_KEYS) {
        localStorage.removeItem(key);
      }
    };

    const fromStorage = (): boolean => {
      purgeLegacy();
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw) as Payload;
        if (payloadLooksCorrupted(parsed)) {
          localStorage.removeItem(STORAGE_KEY);
          return false;
        }
        if (!cancelled) {
          applyPayload(parsed);
          setStorageLabel("localStorage (offline úpravy)");
        }
        return true;
      } catch {
        return false;
      }
    };

    const load = async () => {
      const local =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      if (!cancelled) setIsLocalMode(local);

      // Soft-upgrade: Redis in background; UI already shows static data
      try {
        const res = await fetch("/api/get-data");
        if (res.ok) {
          const data = (await res.json()) as Payload;
          if (data.worksheetData || Array.isArray(data)) {
            if (!cancelled) {
              applyPayload(
                Array.isArray(data) ? { worksheetData: data } : data
              );
              setKvAvailable(true);
              setStorageLabel("Upstash Redis");
            }
            return;
          }
        }
      } catch {
        // offline / no API
      }

      if (!cancelled) setKvAvailable(false);
      const hadLocal = fromStorage();
      if (!cancelled && !hadLocal) {
        setStorageLabel(
          local ? "Dev: statická data v balíku" : "Statická data (KV prázdná)"
        );
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [applyPayload]);

  const persistLocal = useCallback(
    (
      enriched: WorksheetItem[],
      opts: EmojiOption[],
      cats: EmojiCategory[]
    ) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          worksheetData: enriched,
          emojiOptions: opts,
          emojiCategories: cats,
        })
      );
    },
    []
  );

  /**
   * Full snapshot save (seed / offline mirror). Prefer saveChanges for multi-user.
   */
  const save = useCallback(
    async (
      nextTree: WorksheetItem[],
      nextEmojis?: EmojiOption[],
      nextCategories?: EmojiCategory[],
      password?: string
    ): Promise<{ ok: boolean; message: string }> => {
      const opts = nextEmojis ?? emojiOptions;
      const cats = nextCategories ?? emojiCategories;
      const enriched = enrichWorksheetData(nextTree, opts);

      setWorksheetData(enriched);
      if (nextEmojis) setEmojiOptions(nextEmojis);
      if (nextCategories) setEmojiCategories(nextCategories);
      persistLocal(enriched, opts, cats);

      if (password) {
        try {
          const res = await fetch("/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              password,
              data: {
                worksheetData: enriched,
                emojiOptions: opts,
                emojiCategories: cats,
              },
            }),
          });
          if (res.ok) {
            setKvAvailable(true);
            setStorageLabel("Upstash Redis");
            return { ok: true, message: "Uloženo do Redis (+ localStorage)" };
          }
          const err = await res.json().catch(() => ({}));
          return {
            ok: false,
            message:
              (err as { error?: string }).error ||
              `API ${res.status} — uloženo jen do localStorage`,
          };
        } catch {
          return {
            ok: false,
            message: "KV nedostupné — uloženo jen do localStorage",
          };
        }
      }

      setStorageLabel("localStorage (offline úpravy)");
      return { ok: true, message: "Uloženo do localStorage" };
    },
    [emojiOptions, emojiCategories, persistLocal]
  );

  /**
   * Vectoral save: send only pending change ops.
   * Server loads latest Redis snapshot, applies patches, returns merged tree.
   */
  const saveChanges = useCallback(
    async (
      changes: Array<Record<string, unknown>>,
      password: string,
      localPreview?: {
        worksheetData: WorksheetItem[];
        emojiOptions: EmojiOption[];
        emojiCategories: EmojiCategory[];
      }
    ): Promise<{ ok: boolean; message: string }> => {
      if (changes.length === 0) {
        return { ok: true, message: "Žádné změny k uložení" };
      }

      if (localPreview) {
        const opts = localPreview.emojiOptions;
        const cats = localPreview.emojiCategories;
        const enriched = enrichWorksheetData(localPreview.worksheetData, opts);
        setWorksheetData(enriched);
        setEmojiOptions(opts);
        setEmojiCategories(cats);
        persistLocal(enriched, opts, cats);
      }

      try {
        const res = await fetch("/api/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            changes,
            baseline: {
              worksheetData: localPreview?.worksheetData ?? worksheetData,
              emojiOptions: localPreview?.emojiOptions ?? emojiOptions,
              emojiCategories: localPreview?.emojiCategories ?? emojiCategories,
            },
          }),
        });

        if (res.ok) {
          const body = (await res.json()) as {
            success?: boolean;
            data?: Payload;
          };
          if (body.data?.worksheetData) {
            applyPayload(body.data);
            const opts = body.data.emojiOptions ?? emojiOptions;
            const cats = body.data.emojiCategories ?? emojiCategories;
            const tree = body.data.worksheetData ?? worksheetData;
            persistLocal(enrichWorksheetData(tree, opts), opts, cats);
          }
          setKvAvailable(true);
          setStorageLabel("Redis (vectoral merge)");
          return {
            ok: true,
            message: `Uloženo ${changes.length} změn do Redis (merge)`,
          };
        }

        const err = await res.json().catch(() => ({}));
        return {
          ok: false,
          message:
            (err as { error?: string }).error ||
            `API ${res.status} — lokální náhled zachován`,
        };
      } catch {
        return {
          ok: false,
          message: "KV nedostupné — lokální náhled v localStorage",
        };
      }
    },
    [applyPayload, emojiOptions, emojiCategories, worksheetData, persistLocal]
  );

  const resetToDefaults = useCallback(async (password?: string) => {
    localStorage.removeItem(STORAGE_KEY);
    const enriched = enrichWorksheetData(staticWorksheet, staticEmojis);
    setEmojiOptions(staticEmojis);
    setEmojiCategories(staticCategories);
    setWorksheetData(enriched);

    if (password) {
      try {
        await fetch("/api/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            data: {
              worksheetData: staticWorksheet,
              emojiOptions: staticEmojis,
              emojiCategories: staticCategories,
            },
          }),
        });
      } catch {
        /* ignore */
      }
    }
    setStorageLabel("Statická data z kódu");
  }, []);

  return {
    worksheetData,
    emojiOptions,
    emojiCategories,
    save,
    saveChanges,
    resetToDefaults,
    isLocalMode,
    kvAvailable,
    storageLabel,
    ready,
  };
}

export type MicrobiologyData = ReturnType<typeof useMicrobiologyData>;
