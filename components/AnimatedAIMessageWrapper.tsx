
import React from 'react';

interface AnimatedAIMessageWrapperProps {
  children: React.ReactNode;
}

export const AnimatedAIMessageWrapper: React.FC<AnimatedAIMessageWrapperProps> = ({ children }) => {
  return <div className="animate-unblur">{children}</div>;
};
