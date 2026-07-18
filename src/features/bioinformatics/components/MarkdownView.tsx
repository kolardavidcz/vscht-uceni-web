import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
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

export function MarkdownView({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

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
        {content}
      </ReactMarkdown>
    </div>
  );
}
