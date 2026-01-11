"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ 
  code, 
  language = "html", 
  filename, 
  showLineNumbers = false,
  className 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className={cn("relative group rounded-lg border bg-zinc-950 dark:bg-zinc-900", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="text-xs text-zinc-400 font-mono">{filename}</span>
          <span className="text-xs text-zinc-500 uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "overflow-x-auto p-4 text-sm",
          showLineNumbers && "pl-12"
        )}>
          <code className="text-zinc-100 font-mono">
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-right pr-4 text-zinc-600 select-none w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell">{highlightCode(line, language)}</span>
                </div>
              ))
            ) : (
              <span dangerouslySetInnerHTML={{ __html: highlightCodeBlock(code, language) }} />
            )}
          </code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-zinc-400" />
          )}
        </button>
      </div>
    </div>
  );
}

// Simple syntax highlighting
function highlightCodeBlock(code: string, language: string): string {
  let highlighted = escapeHtml(code);
  
  if (language === "html" || language === "jsx") {
    // Highlight HTML tags
    highlighted = highlighted.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span class="text-pink-400">$2</span>'
    );
    // Highlight attributes
    highlighted = highlighted.replace(
      /(\s)([\w-]+)(=)/g,
      '$1<span class="text-sky-300">$2</span>$3'
    );
    // Highlight strings
    highlighted = highlighted.replace(
      /(&quot;[^&]*&quot;|&#39;[^&]*&#39;|"[^"]*"|'[^']*')/g,
      '<span class="text-amber-300">$1</span>'
    );
    // Highlight comments
    highlighted = highlighted.replace(
      /(&lt;!--.*?--&gt;)/g,
      '<span class="text-zinc-500">$1</span>'
    );
  }
  
  if (language === "javascript" || language === "js" || language === "jsx") {
    // Highlight keywords
    const keywords = ['window', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'];
    keywords.forEach(kw => {
      highlighted = highlighted.replace(
        new RegExp(`\\b(${kw})\\b`, 'g'),
        '<span class="text-purple-400">$1</span>'
      );
    });
    // Highlight strings
    highlighted = highlighted.replace(
      /("[^"]*"|'[^']*'|`[^`]*`)/g,
      '<span class="text-amber-300">$1</span>'
    );
    // Highlight comments
    highlighted = highlighted.replace(
      /(\/\/.*$)/gm,
      '<span class="text-zinc-500">$1</span>'
    );
  }
  
  if (language === "bash" || language === "shell") {
    // Highlight commands
    highlighted = highlighted.replace(
      /^(\w+)/gm,
      '<span class="text-green-400">$1</span>'
    );
    // Highlight flags
    highlighted = highlighted.replace(
      /(\s)(--?[\w-]+)/g,
      '$1<span class="text-sky-300">$2</span>'
    );
  }
  
  return highlighted;
}

function highlightCode(line: string, language: string): React.ReactNode {
  return <span dangerouslySetInnerHTML={{ __html: highlightCodeBlock(line, language) }} />;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
