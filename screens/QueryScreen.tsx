import React, { useState } from 'react';
import { Logo } from '../components/icons/Logo';
import { SendIcon } from '../components/icons/SendIcon';

interface QueryScreenProps {
  onQuerySubmit: (text: string) => void;
  isLoading: boolean;
}

export const QueryScreen: React.FC<QueryScreenProps> = ({ onQuerySubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onQuerySubmit(text);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${isFocused ? 'scale-105 blur-sm' : 'scale-100 blur-0'}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=3028&auto=format&fit=crop')" }} 
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4">
        <div className="text-center animate-unblur">
          <Logo />
          <p className="mt-4 text-lg text-cream/80 max-w-xl">
            Your personal digital mentor for the pursuit of knowledge.
          </p>
        </div>

        <div className="w-full max-w-2xl mt-12 animate-unblur" style={{animationDelay: '0.3s'}}>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Qual conhecimento você busca hoje?"
              className="w-full h-16 pl-6 pr-16 text-lg text-cream bg-black/40 backdrop-blur-sm border-2 border-satin-gold/40 rounded-full focus:ring-2 focus:ring-satin-gold focus:border-satin-gold/80 focus:outline-none transition-all duration-300 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-satin-gold hover:opacity-90 disabled:bg-gray-600 disabled:cursor-not-allowed text-black w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200"
              aria-label="Submit query"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <SendIcon />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
