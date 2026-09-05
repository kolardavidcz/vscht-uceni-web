/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: (
    pattern: string,
    options?: { query?: string; import?: string; eager?: boolean }
  ) => Record<string, unknown>;
}

interface Window {
  MathJax?: {
    typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
    typesetClear?: (elements?: HTMLElement[]) => void;
    tex?: Record<string, unknown>;
    options?: Record<string, unknown>;
    startup?: {
      document?: {
        getMathItemsWithin?: (element: Element) => Array<{ math?: string }>;
      };
    };
    [key: string]: unknown;
  };
}
