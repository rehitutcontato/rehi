import { GoogleGenAI } from "@google/genai";

// This function is designed to be deployed as a serverless function.
// It acts as a secure proxy to the Google Gemini API.
// Create an `api` folder in your project root and place this file inside.
// Hosting platforms like Vercel or Netlify will automatically handle routing
// for POST requests to /api/generate.

// NOTE: This file is for the BACKEND. It does not contain React code and will not run in the browser.

async function handlePostRequest(request: Request): Promise<Response> {
  try {
    const { text } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Query text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (!process.env.API_KEY) {
      console.error("API_KEY is not configured on the server environment.");
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const geminiStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-pro',
      contents: text,
      config: {
        systemInstruction: 'You are rehi+, a digital mentor. Your purpose is to help users master any subject with depth, elegance, and confidence. Your tone is sophisticated, knowledgeable, and patient. You provide clear, concise text, and can format responses with markdown, including code blocks, lists, and mathematical formulas. You act as a partner in the user\'s journey of personal and professional development. Structure your response as a comprehensive document, not a chat message. Use markdown formatting extensively for clarity and elegance.',
      },
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of geminiStream) {
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(encoder.encode(chunkText));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("Error in serverless proxy function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: `Failed to generate content: ${errorMessage}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// This is the standard export for Vercel Edge Functions.
export const POST = handlePostRequest;

// This provides a default export that some platforms might look for.
export default async function handler(req: Request) {
    if (req.method === 'POST') {
        return handlePostRequest(req);
    }
    return new Response('Method Not Allowed', { status: 405 });
}

// Vercel-specific configuration for optimal streaming.
export const config = {
  runtime: 'edge',
};
