
import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import { Message } from './Message';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length-1]?.sender === 'ai' && <LoadingIndicator />}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
