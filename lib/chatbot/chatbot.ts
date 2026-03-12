import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { env } from '@/lib/env';
import interviewData from '@/data/interview.json';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ChatBot {
  private openai: ChatOpenAI | null = null;
  private bedrockClient: any = null;
  private interviewQA: Map<string, string>;

  constructor() {
    // Initialize interview Q&A map
    this.interviewQA = new Map();
    for (const qa of interviewData.questions) {
      this.interviewQA.set(qa.question.toLowerCase().trim(), qa.answer);
      // Also store without question mark
      const withoutMark = qa.question.toLowerCase().replace('?', '').trim();
      this.interviewQA.set(withoutMark, qa.answer);
    }

    // Initialize OpenAI if API key is available
    if (env.OPENAI_API_KEY) {
      this.openai = new ChatOpenAI({
        apiKey: env.OPENAI_API_KEY,
        modelName: 'gpt-4',
        temperature: 0.7,
        maxTokens: 500,
      });
    }

    // Note: Bedrock fallback would require @langchain/community or aws-sdk
    // For now, we'll implement a placeholder that can be extended
    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      // Bedrock initialization would go here
      // This would require installing @langchain/community or using AWS SDK directly
      console.log('AWS credentials found, Bedrock support can be enabled');
    }
  }

  /**
   * Check if the query is an interview question
   */
  private isInterviewQuestion(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check exact matches
    if (this.interviewQA.has(normalizedQuery)) {
      return true;
    }

    // Check for partial matches (keywords)
    const interviewKeywords = [
      'tell me about yourself',
      'greatest strengths',
      'greatest weakness',
      'weaknesses',
      'why do you want to work here',
      'where do you see yourself',
      'challenging project',
      'handle conflict',
      'greatest professional achievement',
      'stay updated with technology',
      'explain a complex technical concept',
      'tell me about a time',
      'describe a situation',
    ];

    return interviewKeywords.some(keyword => normalizedQuery.includes(keyword));
  }

  /**
   * Get response for an interview question from static data
   */
  private getInterviewResponse(query: string): string {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Try exact match first
    if (this.interviewQA.has(normalizedQuery)) {
      return this.interviewQA.get(normalizedQuery)!;
    }

    // Try partial match
    for (const [question, answer] of this.interviewQA) {
      if (normalizedQuery.includes(question) || question.includes(normalizedQuery)) {
        return answer;
      }
    }

    return "I don't have a specific answer for that interview question yet, but I'm here to help with general questions too!";
  }

  /**
   * Generate a response using LLM
   */
  private async generateWithLLM(query: string): Promise<string> {
    const systemPrompt = `You are a helpful assistant for Julien Serbanescu's portfolio website.
Your responses should be concise, professional, and helpful.
You are speaking through a terminal interface, so keep responses under 500 characters when possible.
You can answer questions about Julien's projects, skills, experience, and general technical topics.
If you don't know something, be honest and direct.

Context about Julien:
- Full name: Julien Serbanescu
- Role: Software Engineer
- Tech stack: Next.js, React, TypeScript, Node.js, Python, LangChain, xterm.js
- Current project: Portfolio Terminal - an interactive terminal-style portfolio
- passions: building AI-powered tools, real-time systems, and beautiful UIs`;

    try {
      let response: string;

      if (this.openai) {
        // Use OpenAI
        const messages = [
          new SystemMessage(systemPrompt),
          new HumanMessage(query)
        ];

        const aiMessage = await this.openai.invoke(messages);
        response = aiMessage.content as string;
      } else if (this.bedrockClient) {
        // Use Bedrock/Claude (implementation would be here)
        response = 'Bedrock/Claude integration not yet implemented. Please configure OpenAI API key.';
      } else {
        throw new Error('No LLM provider configured');
      }

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again later.';
    }
  }

  /**
   * Process a user query and return a response
   */
  async chat(query: string): Promise<string> {
    if (!query || query.trim().length === 0) {
      return 'Please ask a question. Type "help" for available commands.';
    }

    const normalizedQuery = query.trim();

    // Check if it's an interview question first
    if (this.isInterviewQuestion(normalizedQuery)) {
      return this.getInterviewResponse(normalizedQuery);
    }

    // Use LLM for general questions
    return await this.generateWithLLM(normalizedQuery);
  }
}

// Export singleton instance
export const chatBot = new ChatBot();
