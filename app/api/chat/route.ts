import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { env } from '@/lib/env';

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are Julien Serbanescu's AI assistant, embedded in his portfolio terminal.
You answer questions about his skills, experience, projects, and can help with general programming questions.
You are also prepared to answer interview-style questions about software development.
Be concise, professional, and helpful. If you don't know something, say so.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured', type: 'configuration_error' },
        { status: 500 }
      );
    }

    // Initialize the LLM
    const llm = new ChatOpenAI({
      apiKey: env.OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0.7,
    });

    // Build messages array with conversation history
    const messages: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT)];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user') {
          messages.push(new HumanMessage(msg.content));
        } else if (msg.role === 'assistant') {
          messages.push(new AIMessage(msg.content));
        }
      }
    }

    // Add current user message
    messages.push(new HumanMessage(message));

    // Get response from LLM
    const response = await llm.invoke(messages);
    const answer = response.content as string;

    return NextResponse.json({
      success: true,
      answer,
      model: 'gpt-4',
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Authentication failed with AI service', type: 'auth_error' },
          { status: 500 }
        );
      }

      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.', type: 'rate_limit_error' },
          { status: 429 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to process chat request', type: 'unknown_error' },
      { status: 500 }
    );
  }
}
