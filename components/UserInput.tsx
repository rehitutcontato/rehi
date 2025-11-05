
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface UserInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-amber-600/20 mt-auto">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 bg-black/30 rounded-lg border border-amber-600/30 p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:ring-0 resize-none h-12 p-2"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-amber-600/80 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black p-3 rounded-full transition-colors duration-200"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};
