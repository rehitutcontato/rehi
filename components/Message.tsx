
import React from 'react';
import type { Message as MessageType } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AnimatedAIMessageWrapper } from './AnimatedAIMessageWrapper';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-[#1A472A]/50 border border-amber-600/30 text-gray-200'
    : 'bg-gray-900/50 border border-gray-700/50 text-gray-300';
  
  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-[#1A472A] border-2 border-amber-600/50 flex-shrink-0 ml-4 flex items-center justify-center font-bold text-amber-500">
      U
    </div>
  );

  const AIAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-amber-600/50 flex-shrink-0 mr-4 flex items-center justify-center font-bold text-amber-500">
      R
    </div>
  );
  
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} items-start`}>
      <div className={`flex w-full ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-3xl items-start`}>
        {isUser ? <UserAvatar /> : <AIAvatar />}
        <div className={`px-5 py-3 rounded-lg ${bubbleClasses}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <AnimatedAIMessageWrapper>
              <MarkdownRenderer content={message.text} />
            </AnimatedAIMessageWrapper>
          )}
        </div>
      </div>
    </div>
  );
};
