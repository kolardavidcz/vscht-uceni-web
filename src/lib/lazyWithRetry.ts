import { type ComponentType, lazy } from "react";

export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Loading chunk") ||
    message.includes("Load failed") ||
    message.includes("Failed to load module script") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error resolving module specifier")
  );
}

const RELOAD_KEY_PREFIX = "app_chunk_reload_";

export function handleChunkLoadFailure(
  url = typeof window !== "undefined" ? window.location.pathname : "/"
): boolean {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return false;
  }
  const reloadKey = RELOAD_KEY_PREFIX + url;
  const lastReload = Number(sessionStorage.getItem(reloadKey) || "0");
  // Only reload if not reloaded in the last 15 seconds to avoid infinite reload loops
  if (Date.now() - lastReload > 15000) {
    sessionStorage.setItem(reloadKey, Date.now().toString());
    window.location.reload();
    return true;
  }
  return false;
}

/**
 * Wraps dynamic component imports with retry attempts and automatic page reload
 * on stale chunk hashes (e.g. after new deployments or mobile wake from sleep).
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 800
) {
  return lazy(async () => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await factory();
      } catch (error) {
        if (i === retries) {
          if (isChunkLoadError(error)) {
            const reloaded = handleChunkLoadFailure();
            if (reloaded) {
              // Return an unresolved promise while browser reloads the page
              return new Promise<{ default: T }>(() => {});
            }
          }
          throw error;
        }
        // Wait before retrying (e.g. while mobile device reconnects to Wi-Fi)
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }
    return factory();
  });
}
