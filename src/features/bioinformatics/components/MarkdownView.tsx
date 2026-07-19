import { useEffect, useRef, useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
// Subset only languages we use in wiki fences — full highlight.js is huge
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import { contentMayHaveMath, loadMathJax } from "@/lib/loadMathJax";

type Props = {
  content: string;
};

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

const highlightLanguages = {
  c,
  cpp,
  bash,
  sh: bash,
  shell: bash,
  python,
  py: python,
  json,
  plaintext,
  text: plaintext,
};

/**
 * Normalizes lists to ensure consistent 4-space indentation for nesting.
 * This guarantees CommonMark lists parse correctly up to 5+ levels
 * even when using mixed delimiters like *, -, 1. or 1).
 */
function normalizeMarkdownLists(content: string): string {
  const lines = content.split(/\r?\n/);
  const result: string[] = [];
  const stack: number[] = [0];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for code blocks to avoid altering formatting inside them
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Blank lines: preserve as is and do not reset state
    if (trimmed === "") {
      result.push(line);
      continue;
    }

    // Match list markers: *, -, +, 1., 1), 1.1., 1.1) etc.
    const listMatch = line.match(/^(\s*)([*+-]|\d+(?:\.\d+)*[.)])(?:\s+(.*)|$)$/);

    // Get current line's leading indentation
    const matchIndent = line.match(/^(\s*)/);
    const origIndent = matchIndent ? matchIndent[0].length : 0;

    if (listMatch) {
      const marker = listMatch[2];
      const rest = listMatch[3] || "";

      // Manage the indentation stack
      if (origIndent > stack[stack.length - 1]) {
        stack.push(origIndent);
      } else {
        while (stack.length > 1 && stack[stack.length - 1] > origIndent) {
          stack.pop();
        }
        if (stack[stack.length - 1] < origIndent) {
          stack.push(origIndent);
        }
      }

      const level = stack.length - 1;
      const normalizedIndent = " ".repeat(4 * level);
      result.push(`${normalizedIndent}${marker}${rest ? " " + rest : ""}`);
    } else {
      // Continuation line (part of a list item) or normal paragraph
      let i = stack.length - 1;
      while (i > 0 && stack[i] > origIndent) {
        i--;
      }
      
      while (stack.length - 1 > i) {
        stack.pop();
      }

      const shift = (4 * i) - stack[i];
      const newIndentLength = Math.max(0, origIndent + shift);
      const newIndent = " ".repeat(newIndentLength);
      const lineContent = line.slice(origIndent);
      result.push(`${newIndent}${lineContent}`);
    }
  }

  return result.join("\n");
}

export function MarkdownView({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const processedContent = useMemo(() => normalizeMarkdownLists(content), [content]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!contentMayHaveMath(content)) return;

    let cancelled = false;
    const run = async () => {
      try {
        await loadMathJax();
        if (cancelled || !ref.current) return;
        if (window.MathJax?.typesetPromise) {
          window.MathJax.typesetClear?.([ref.current]);
          await window.MathJax.typesetPromise([ref.current]);
        }
      } catch {
        /* ignore MathJax race / network */
      }
    };
    const t = window.setTimeout(() => {
      void run();
    }, 50);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [content]);

  return (
    <div ref={ref} className="wiki-prose tex2jax_process">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeHighlight,
            {
              languages: highlightLanguages,
              // Unknown language tags fall back to plaintext instead of shipping all grammars
              plainText: ["txt", "text", "plain"],
            },
          ],
        ]}
        components={{
          code({ className, children, ...props }: CodeProps) {
            const isBlock = Boolean(className?.includes("language-"));
            if (!isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
