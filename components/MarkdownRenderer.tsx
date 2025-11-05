import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    // FIX: Wrap ReactMarkdown in a div and apply prose classes to it. The `className` prop
    // is not part of the `ReactMarkdown` component's type definition, causing a TypeScript error.
    // This is also the standard way to use Tailwind's Typography plugin.
    <div
      className="prose prose-lg max-w-none 
                 prose-p:font-loro prose-p:text-marrom-sepia dark:prose-p:text-cream/90
                 prose-headings:font-the-seasons prose-headings:text-verde-musgo dark:prose-headings:text-satin-gold
                 prose-strong:text-preto-carvao dark:prose-strong:text-cream
                 prose-a:text-satin-gold hover:prose-a:text-[#a88a53] transition-colors
                 prose-blockquote:border-l-4 prose-blockquote:border-satin-gold/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-cinza-chumbo dark:prose-blockquote:text-cream/70
                 prose-li:marker:text-satin-gold prose-li:font-loro prose-li:text-marrom-sepia dark:prose-li:text-cream/90
                 prose-code:text-satin-gold prose-code:bg-dark-green/10 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono
                 dark:prose-code:bg-cream/10 dark:prose-code:text-amber-300
                 prose-table:font-loro
                 prose-thead:border-b-2 prose-thead:border-satin-gold/30
                 prose-th:text-verde-musgo dark:prose-th:text-satin-gold
                 prose-td:text-marrom-sepia dark:prose-td:text-cream/90
                 prose-tr:border-satin-gold/20
                 "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // FIX: Type the destructured props as `any` to resolve an error with the `inline` property.
          // This is a workaround for what appears to be an issue with react-markdown's type definitions.
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4 rounded-md overflow-hidden shadow-inner bg-[#0d1117]">
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  // FIX: Removed {...props} spread. The props are for a `<code>` element and cause type conflicts
                  // with SyntaxHighlighter, specifically with the `ref` prop which leads to an overload error.
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="text-satin-gold bg-dark-green/10 dark:bg-cream/10 dark:text-amber-300 rounded px-1.5 py-1 font-mono text-sm" {...props}>
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
};