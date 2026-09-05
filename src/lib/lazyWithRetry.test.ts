import { describe, it, expect, vi, beforeEach } from "vitest";
import { isChunkLoadError, handleChunkLoadFailure } from "./lazyWithRetry";

describe("lazyWithRetry", () => {
  describe("isChunkLoadError", () => {
    it("detects Vite dynamic import chunk failure", () => {
      const error = new TypeError(
        "Failed to fetch dynamically imported module: https://example.com/assets/WikiPage-123.js"
      );
      expect(isChunkLoadError(error)).toBe(true);
    });

    it("detects WebKit / Safari load failure", () => {
      const error = new TypeError("Load failed");
      expect(isChunkLoadError(error)).toBe(true);
    });

    it("detects module script loading failure", () => {
      const error = new Error("Failed to load module script");
      expect(isChunkLoadError(error)).toBe(true);
    });

    it("detects chunk loading failure", () => {
      const error = new Error("Loading chunk 5 failed");
      expect(isChunkLoadError(error)).toBe(true);
    });

    it("returns false for regular application errors", () => {
      const error = new Error("Cannot read property 'name' of undefined");
      expect(isChunkLoadError(error)).toBe(false);
    });

    it("handles non-Error objects safely", () => {
      expect(isChunkLoadError("Failed to fetch dynamically imported module")).toBe(true);
      expect(isChunkLoadError(null)).toBe(false);
      expect(isChunkLoadError(undefined)).toBe(false);
      expect(isChunkLoadError(42)).toBe(false);
    });
  });

  describe("handleChunkLoadFailure", () => {
    let mockStore: Record<string, string> = {};

    beforeEach(() => {
      mockStore = {};
      const mockSessionStorage = {
        getItem: vi.fn((key: string) => mockStore[key] || null),
        setItem: vi.fn((key: string, val: string) => {
          mockStore[key] = val;
        }),
        clear: vi.fn(() => {
          mockStore = {};
        }),
      };
      vi.stubGlobal("sessionStorage", mockSessionStorage);
      vi.stubGlobal("window", {
        location: { pathname: "/test-route", reload: vi.fn() },
        sessionStorage: mockSessionStorage,
      });
    });

    it("triggers reload on first failure and records timestamp", () => {
      const reloadMock = vi.fn();
      window.location.reload = reloadMock;

      const reloaded = handleChunkLoadFailure("/test-route");
      expect(reloaded).toBe(true);
      expect(reloadMock).toHaveBeenCalledTimes(1);
      expect(mockStore["app_chunk_reload_/test-route"]).toBeTruthy();
    });

    it("prevents rapid infinite reload loops within 15 seconds", () => {
      const reloadMock = vi.fn();
      window.location.reload = reloadMock;

      // First failure triggers reload
      const firstReload = handleChunkLoadFailure("/test-route");
      expect(firstReload).toBe(true);
      expect(reloadMock).toHaveBeenCalledTimes(1);

      // Immediate second failure within 15s does not reload again
      const secondReload = handleChunkLoadFailure("/test-route");
      expect(secondReload).toBe(false);
      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });
});
