import { useEffect, useState } from "react";

export type ClientWikiOverride = {
  markdown: string;
  updatedAt: string;
  updatedBy?: string;
  note?: string;
};

export type ClientWikiOverrideMap = Record<string, ClientWikiOverride>;

/**
 * Paint-first soft-upgrade hook for Wiki markdown pages.
 * Bundled .md files render immediately (0 ms delay); in the background we fetch
 * any admin-approved live overrides stored in Upstash Redis (`GET /api/wiki-data`).
 */
export function useWikiOverrides(): ClientWikiOverrideMap {
  const [overrides, setOverrides] = useState<ClientWikiOverrideMap>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/wiki-data");
        if (!res.ok) return;
        const data = (await res.json()) as {
          overrides?: ClientWikiOverrideMap;
        };
        if (
          !cancelled &&
          data?.overrides &&
          typeof data.overrides === "object"
        ) {
          setOverrides(data.overrides);
        }
      } catch {
        // Offline or dev without API -> bundled markdown stays active
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return overrides;
}
