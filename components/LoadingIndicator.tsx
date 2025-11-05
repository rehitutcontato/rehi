import React, { useState, useEffect } from 'react';

const sources = [
  "Consulting primary sources...",
  "Cross-referencing historical archives...",
  "Synthesizing expert opinions...",
  "Analyzing contemporary research...",
  "Formulating a comprehensive response...",
];

export const LoadingIndicator: React.FC = () => {
  const [currentSource, setCurrentSource] = useState(sources[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSource(prev => {
        const currentIndex = sources.indexOf(prev);
        const nextIndex = (currentIndex + 1) % sources.length;
        return sources[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-satin-gold/20">
        <div className="w-2 h-2 bg-satin-gold rounded-full animate-pulse"></div>
        <div className="text-stone-600 dark:text-stone-400 italic text-sm font-the-seasons">
            {currentSource}
        </div>
    </div>
  );
};
