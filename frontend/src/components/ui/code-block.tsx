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

// Token types for syntax highlighting
type TokenType = 'tag' | 'attribute' | 'string' | 'keyword' | 'comment' | 'number' | 'function' | 'punctuation' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// Color palette
const tokenColors: Record<TokenType, string> = {
  tag: '#f472b6',       // pink-400
  attribute: '#7dd3fc', // sky-300  
  string: '#fcd34d',    // amber-300
  keyword: '#c084fc',   // purple-400
  comment: '#71717a',   // zinc-500
  number: '#4ade80',    // green-400
  function: '#60a5fa',  // blue-400
  punctuation: '#a1a1aa', // zinc-400
  plain: '#fafafa',     // zinc-50
};

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

  const tokens = tokenize(code, language);

  return (
    <div className={cn("relative group rounded-lg border bg-zinc-950 dark:bg-zinc-900 overflow-hidden", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-900">
          <span className="text-xs text-zinc-400 font-mono">{filename}</span>
          <span className="text-xs text-zinc-500 uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "overflow-x-auto p-4 text-sm leading-relaxed",
          showLineNumbers && "pl-2"
        )}>
          <code className="text-zinc-100 font-mono">
            {tokens.map((token, i) => (
              <span key={i} style={{ color: tokenColors[token.type] }}>
                {token.value}
              </span>
            ))}
          </code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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

function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  
  if (language === 'html' || language === 'jsx' || language === 'tsx') {
    return tokenizeHTML(code);
  }
  
  if (language === 'javascript' || language === 'js' || language === 'typescript' || language === 'ts') {
    return tokenizeJS(code);
  }
  
  if (language === 'bash' || language === 'shell' || language === 'sh') {
    return tokenizeBash(code);
  }
  
  if (language === 'json') {
    return tokenizeJSON(code);
  }
  
  // Default: return as plain text
  return [{ type: 'plain', value: code }];
}

function tokenizeHTML(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    // Check for HTML comment
    if (code.slice(i, i + 4) === '<!--') {
      const end = code.indexOf('-->', i);
      if (end !== -1) {
        tokens.push({ type: 'comment', value: code.slice(i, end + 3) });
        i = end + 3;
        continue;
      }
    }
    
    // Check for opening tag
    if (code[i] === '<') {
      // Check for closing tag
      const isClosing = code[i + 1] === '/';
      const tagStart = i;
      
      // Find tag name end
      let j = isClosing ? i + 2 : i + 1;
      while (j < code.length && /[a-zA-Z0-9-]/.test(code[j])) {
        j++;
      }
      
      const tagName = code.slice(isClosing ? i + 2 : i + 1, j);
      
      if (tagName) {
        // Add opening bracket
        tokens.push({ type: 'punctuation', value: isClosing ? '</' : '<' });
        // Add tag name
        tokens.push({ type: 'tag', value: tagName });
        i = j;
        
        // Parse attributes until >
        while (i < code.length && code[i] !== '>') {
          // Skip whitespace
          if (/\s/.test(code[i])) {
            let ws = '';
            while (i < code.length && /\s/.test(code[i])) {
              ws += code[i];
              i++;
            }
            tokens.push({ type: 'plain', value: ws });
            continue;
          }
          
          // Check for attribute name
          if (/[a-zA-Z_-]/.test(code[i])) {
            let attr = '';
            while (i < code.length && /[a-zA-Z0-9_-]/.test(code[i])) {
              attr += code[i];
              i++;
            }
            tokens.push({ type: 'attribute', value: attr });
            
            // Check for =
            if (code[i] === '=') {
              tokens.push({ type: 'punctuation', value: '=' });
              i++;
              
              // Parse attribute value
              if (code[i] === '"' || code[i] === "'") {
                const quote = code[i];
                let val = quote;
                i++;
                while (i < code.length && code[i] !== quote) {
                  val += code[i];
                  i++;
                }
                if (code[i] === quote) {
                  val += quote;
                  i++;
                }
                tokens.push({ type: 'string', value: val });
              } else if (code[i] === '{') {
                // JSX expression
                let depth = 1;
                let expr = '{';
                i++;
                while (i < code.length && depth > 0) {
                  if (code[i] === '{') depth++;
                  if (code[i] === '}') depth--;
                  expr += code[i];
                  i++;
                }
                tokens.push({ type: 'keyword', value: expr });
              }
            }
            continue;
          }
          
          // Self-closing /
          if (code[i] === '/') {
            tokens.push({ type: 'punctuation', value: '/' });
            i++;
            continue;
          }
          
          // Unknown character, add as plain
          tokens.push({ type: 'plain', value: code[i] });
          i++;
        }
        
        // Add closing bracket
        if (code[i] === '>') {
          tokens.push({ type: 'punctuation', value: '>' });
          i++;
        }
        continue;
      }
    }
    
    // Regular text content
    let text = '';
    while (i < code.length && code[i] !== '<') {
      text += code[i];
      i++;
    }
    if (text) {
      tokens.push({ type: 'plain', value: text });
    }
  }
  
  return tokens;
}

function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = [];
  const keywords = new Set([
    'window', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 
    'while', 'import', 'export', 'from', 'default', 'async', 'await', 'new', 
    'this', 'class', 'extends', 'null', 'undefined', 'true', 'false', 'typeof', 
    'instanceof', 'try', 'catch', 'finally', 'throw'
  ]);
  
  let i = 0;
  
  while (i < code.length) {
    // Single line comment
    if (code.slice(i, i + 2) === '//') {
      const end = code.indexOf('\n', i);
      const comment = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value: comment });
      i += comment.length;
      continue;
    }
    
    // Multi-line comment
    if (code.slice(i, i + 2) === '/*') {
      const end = code.indexOf('*/', i);
      const comment = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: 'comment', value: comment });
      i += comment.length;
      continue;
    }
    
    // String with double quotes
    if (code[i] === '"') {
      let str = '"';
      i++;
      while (i < code.length && code[i] !== '"') {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (code[i] === '"') {
        str += '"';
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }
    
    // String with single quotes
    if (code[i] === "'") {
      let str = "'";
      i++;
      while (i < code.length && code[i] !== "'") {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (code[i] === "'") {
        str += "'";
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }
    
    // Template literal
    if (code[i] === '`') {
      let str = '`';
      i++;
      while (i < code.length && code[i] !== '`') {
        str += code[i];
        i++;
      }
      if (code[i] === '`') {
        str += '`';
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }
    
    // Numbers
    if (/[0-9]/.test(code[i])) {
      let num = '';
      while (i < code.length && /[0-9.]/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }
    
    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      let ident = '';
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        ident += code[i];
        i++;
      }
      tokens.push({ 
        type: keywords.has(ident) ? 'keyword' : 'plain', 
        value: ident 
      });
      continue;
    }
    
    // Whitespace and other
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }
  
  return tokens;
}

function tokenizeBash(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    // Comments
    if (code[i] === '#') {
      const end = code.indexOf('\n', i);
      const comment = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value: comment });
      i += comment.length;
      continue;
    }
    
    // Double quoted strings
    if (code[i] === '"') {
      let str = '"';
      i++;
      while (i < code.length && code[i] !== '"') {
        str += code[i];
        i++;
      }
      if (code[i] === '"') {
        str += '"';
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }
    
    // Single quoted strings
    if (code[i] === "'") {
      let str = "'";
      i++;
      while (i < code.length && code[i] !== "'") {
        str += code[i];
        i++;
      }
      if (code[i] === "'") {
        str += "'";
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }
    
    // Flags (starts with -)
    if (code[i] === '-' && (i === 0 || /\s/.test(code[i - 1]))) {
      let flag = '';
      while (i < code.length && /[a-zA-Z0-9_-]/.test(code[i])) {
        flag += code[i];
        i++;
      }
      tokens.push({ type: 'attribute', value: flag });
      continue;
    }
    
    // Commands at start of line or after | or && or ;
    if (/[a-zA-Z]/.test(code[i])) {
      let word = '';
      while (i < code.length && /[a-zA-Z0-9_.-]/.test(code[i])) {
        word += code[i];
        i++;
      }
      const isCommand = tokens.length === 0 || 
        tokens[tokens.length - 1]?.value.trim() === '|' ||
        tokens[tokens.length - 1]?.value.trim() === '&&' ||
        tokens[tokens.length - 1]?.value.trim() === ';' ||
        tokens[tokens.length - 1]?.value.endsWith('\n');
      tokens.push({ 
        type: isCommand ? 'function' : 'plain', 
        value: word 
      });
      continue;
    }
    
    // Everything else
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }
  
  return tokens;
}

function tokenizeJSON(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let expectValue = false;
  
  while (i < code.length) {
    // Whitespace
    if (/\s/.test(code[i])) {
      let ws = '';
      while (i < code.length && /\s/.test(code[i])) {
        ws += code[i];
        i++;
      }
      tokens.push({ type: 'plain', value: ws });
      continue;
    }
    
    // Structural characters
    if ('{}[]:,'.includes(code[i])) {
      if (code[i] === ':') {
        expectValue = true;
      } else if (code[i] === ',' || code[i] === '{' || code[i] === '[') {
        expectValue = false;
      }
      tokens.push({ type: 'punctuation', value: code[i] });
      i++;
      continue;
    }
    
    // Strings
    if (code[i] === '"') {
      let str = '"';
      i++;
      while (i < code.length && code[i] !== '"') {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (code[i] === '"') {
        str += '"';
        i++;
      }
      tokens.push({ type: expectValue ? 'string' : 'attribute', value: str });
      expectValue = false;
      continue;
    }
    
    // Numbers
    if (/[0-9-]/.test(code[i])) {
      let num = '';
      while (i < code.length && /[0-9.eE+-]/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      expectValue = false;
      continue;
    }
    
    // Booleans and null
    if (/[a-z]/.test(code[i])) {
      let word = '';
      while (i < code.length && /[a-z]/.test(code[i])) {
        word += code[i];
        i++;
      }
      tokens.push({ type: 'keyword', value: word });
      expectValue = false;
      continue;
    }
    
    // Unknown
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }
  
  return tokens;
}
