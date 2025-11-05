import React, { useRef, useEffect, useState } from 'react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { AnimatedAIMessageWrapper } from '../components/AnimatedAIMessageWrapper';
import { Logo } from '../components/icons/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

interface ResultsScreenProps {
  query: string;
  response: string;
  isLoading: boolean;
  onNewQuery: () => void;
  error: string | null;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ query, response, isLoading, onNewQuery, error }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isStreaming = isLoading && response.length > 0;
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Smoothly scroll to the bottom as new content is streamed
    if (isStreaming && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [response, isStreaming]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="bg-dark-green dark:bg-black text-cream min-h-screen flex flex-col font-sans transition-colors duration-500">
      <header className="sticky top-0 z-10 p-4 bg-dark-green/80 dark:bg-black/50 backdrop-blur-sm border-b border-satin-gold/20 flex items-center justify-between">
        <Logo />
        <button 
          onClick={onNewQuery} 
          className="px-4 py-2 text-sm border border-satin-gold/50 rounded-full hover:bg-satin-gold/20 transition-colors text-cream"
        >
          Ask a new question
        </button>
      </header>
      
      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12">
        <AnimatedAIMessageWrapper>
          <div className="max-w-4xl mx-auto bg-cream text-preto-carvao dark:bg-preto-carvao dark:text-cream rounded-lg shadow-2xl shadow-black/40 transition-colors duration-500">
            <div className="p-8 md:p-10 lg:p-14">
              <h2 className="text-3xl md:text-4xl font-the-seasons text-verde-musgo dark:text-satin-gold mb-8 border-b-2 border-satin-gold/30 pb-4 text-pressed">
                {query}
              </h2>
              
              {error ? (
                  <div className="text-red-600 dark:text-red-400 font-semibold">{error}</div>
              ) : (
                  <MarkdownRenderer content={response} />
              )}
              {isLoading && <LoadingIndicator />}
            </div>
          </div>
        </AnimatedAIMessageWrapper>
      </main>
      <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />
    </div>
  );
};