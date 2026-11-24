/**
 * Upstash Redis store for community wiki edit suggestions and approved live overrides.
 * Replaces the legacy GitHub PR workflow so edits do not require a GitHub token,
 * branches, or full redeploys to go live.
 */

import { randomUUID } from "node:crypto";
import { getRedis } from "./redis.js";

export const WIKI_SUGGESTIONS_KEY = "wiki:suggestions";
export const WIKI_OVERRIDES_KEY = "wiki:overrides";

export const MAX_MARKDOWN_LENGTH = 400_000;
export const MAX_PENDING_SUGGESTIONS = 100;

export interface WikiSuggestion {
  id: string;
  filePath: string;
  title: string;
  markdown: string;
  note?: string;
  authorName?: string;
  createdAt: string;
}

export interface WikiOverride {
  markdown: string;
  updatedAt: string;
  updatedBy?: string;
  note?: string;
}

export type WikiOverrideMap = Record<string, WikiOverride>;

export type SuggestionInput = {
  filePath: string;
  title: string;
  markdown: string;
  note?: string;
  authorName?: string;
};

export type ValidatedSuggestionResult =
  | { ok: true; suggestion: WikiSuggestion }
  | { ok: false; status: number; error: string; detail?: string };

/** Allow only repo-relative markdown paths under bioinformatics content/. */
export function isAllowedWikiPath(filePath: string): boolean {
  if (!filePath || /[\0\r\n]/.test(filePath)) return false;
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("..") || normalized.includes("//")) return false;
  return (
    normalized.startsWith("src/features/bioinformatics/content/") &&
    normalized.endsWith(".md")
  );
}

/** Strips carriage returns and newlines from single-line metadata fields. */
export function sanitizeSingleLine(text: string): string {
  return text.replace(/[\r\n]+/g, " ").trim();
}

/** Validates and normalizes an incoming community edit suggestion. */
export function validateSuggestionInput(
  input: SuggestionInput,
  nowIso = new Date().toISOString(),
  id: string = randomUUID()
): ValidatedSuggestionResult {
  const filePath = String(input.filePath || "").replace(/\\/g, "/").trim();
  const title = sanitizeSingleLine(String(input.title || "wiki")).slice(0, 150);
  const markdown = String(input.markdown ?? "");
  const note = String(input.note || "").trim().slice(0, 2000) || undefined;
  const authorName =
    sanitizeSingleLine(String(input.authorName || "")).slice(0, 80) ||
    undefined;

  if (!isAllowedWikiPath(filePath)) {
    return {
      ok: false,
      status: 400,
      error: "Neplatná cesta souboru",
      detail: "Úpravy jsou povoleny jen v bioinformatics content/*.md",
    };
  }
  if (!markdown.trim()) {
    return {
      ok: false,
      status: 400,
      error: "Markdown nesmí být prázdný",
    };
  }
  if (markdown.length > MAX_MARKDOWN_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: "Soubor je příliš velký (max 400 KB)",
    };
  }

  return {
    ok: true,
    suggestion: {
      id,
      filePath,
      title: title || "wiki",
      markdown,
      ...(note ? { note } : {}),
      ...(authorName ? { authorName } : {}),
      createdAt: nowIso,
    },
  };
}

/** Pure helper: prepends a suggestion and trims oldest entries beyond the cap. */
export function appendSuggestion(
  existing: readonly WikiSuggestion[],
  next: WikiSuggestion,
  maxItems = MAX_PENDING_SUGGESTIONS
): WikiSuggestion[] {
  return [next, ...existing].slice(0, maxItems);
}

/** Pure helper: removes a suggestion by ID. */
export function removeSuggestionById(
  existing: readonly WikiSuggestion[],
  id: string
): WikiSuggestion[] {
  return existing.filter((s) => s.id !== id);
}

/** Pure helper: upserts an approved live markdown override. */
export function upsertOverride(
  existing: WikiOverrideMap,
  filePath: string,
  override: WikiOverride
): WikiOverrideMap {
  if (!isAllowedWikiPath(filePath)) return existing;
  return {
    ...existing,
    [filePath]: override,
  };
}

/** Pure helper: removes a live override so the page reverts to the bundled .md file. */
export function removeOverrideByPath(
  existing: WikiOverrideMap,
  filePath: string
): WikiOverrideMap {
  if (!(filePath in existing)) return existing;
  const next = { ...existing };
  delete next[filePath];
  return next;
}

function normalizeSuggestionList(raw: unknown): WikiSuggestion[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is WikiSuggestion =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as WikiSuggestion).id === "string" &&
      typeof (item as WikiSuggestion).filePath === "string" &&
      typeof (item as WikiSuggestion).markdown === "string"
  );
}

function normalizeOverrideMap(raw: unknown): WikiOverrideMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: WikiOverrideMap = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (
      isAllowedWikiPath(key) &&
      val &&
      typeof val === "object" &&
      typeof (val as WikiOverride).markdown === "string"
    ) {
      out[key] = val as WikiOverride;
    }
  }
  return out;
}

export async function getWikiSuggestions(): Promise<WikiSuggestion[]> {
  const redis = getRedis();
  const raw = await redis.get(WIKI_SUGGESTIONS_KEY);
  return normalizeSuggestionList(raw);
}

export async function setWikiSuggestions(
  suggestions: WikiSuggestion[]
): Promise<void> {
  const redis = getRedis();
  await redis.set(WIKI_SUGGESTIONS_KEY, suggestions);
}

export async function getWikiOverrides(): Promise<WikiOverrideMap> {
  const redis = getRedis();
  const raw = await redis.get(WIKI_OVERRIDES_KEY);
  return normalizeOverrideMap(raw);
}

export async function setWikiOverrides(
  overrides: WikiOverrideMap
): Promise<void> {
  const redis = getRedis();
  await redis.set(WIKI_OVERRIDES_KEY, overrides);
}

export async function submitWikiSuggestion(
  input: SuggestionInput
): Promise<
  | { ok: true; suggestion: WikiSuggestion }
  | { ok: false; status: number; error: string; detail?: string }
> {
  const validated = validateSuggestionInput(input);
  if (!validated.ok) return validated;

  const existing = await getWikiSuggestions();
  const updated = appendSuggestion(existing, validated.suggestion);
  await setWikiSuggestions(updated);
  return { ok: true, suggestion: validated.suggestion };
}
