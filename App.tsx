import React, { useState, useCallback } from 'react';
import { QueryScreen } from './screens/QueryScreen';
import { ResultsScreen } from './screens/ResultsScreen';

type View = 'query' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('query');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = useCallback(async (text: string) => {
    if (isLoading || !text.trim()) return;

    setIsLoading(true);
    setQuery(text);
    setResponse('');
    setError(null);
    setView('results');

    try {
      // Call the secure backend proxy instead of Gemini API directly
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${apiResponse.status}`);
      }

      if (!apiResponse.body) {
        throw new Error("The response from the server was empty.");
      }

      const reader = apiResponse.body.getReader();
      const decoder = new TextDecoder();
      let currentText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // The `stream: true` option is important for multi-byte characters.
        currentText += decoder.decode(value, { stream: true });
        setResponse(currentText);
      }
      // Final decode call to flush any remaining bytes
      const remaining = decoder.decode();
      if (remaining) {
          setResponse(currentText + remaining);
      }

    } catch (e) {
      console.error("Error generating content:", e);
      const errorMessage = e instanceof Error ? e.message : "I apologize, but I encountered an error. Please try again.";
      setError(errorMessage);
      setResponse(`An error occurred: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleNewQuery = useCallback(() => {
    setView('query');
    setQuery('');
    setResponse('');
    setError(null);
  }, []);
  
  if (view === 'query') {
    return <QueryScreen onQuerySubmit={handleQuerySubmit} isLoading={isLoading} />;
  }

  return <ResultsScreen query={query} response={response} isLoading={isLoading} onNewQuery={handleNewQuery} error={error} />;
};

export default App;