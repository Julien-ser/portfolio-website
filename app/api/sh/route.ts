import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';

// Interview questions data will be loaded from JSON
interface InterviewQuestion {
  id: number;
  question: string;
  answer: string;
}

// Detect if query is an interview question using fuzzy matching
function isInterviewQuestion(query: string, questions: InterviewQuestion[]): InterviewQuestion | null {
  const normalizedQuery = query.toLowerCase().trim();

  // First try exact match
  const exactMatch = questions.find(q => 
    q.question.toLowerCase() === normalizedQuery
  );
  if (exactMatch) return exactMatch;

  // Then try includes match (query is part of question)
  const partialMatch = questions.find(q => 
    q.question.toLowerCase().includes(normalizedQuery) ||
    normalizedQuery.includes(q.question.toLowerCase().replace(/[?.!]/g, '').trim())
  );
  if (partialMatch) return partialMatch;

  // Keyword-based matching for common interview question patterns
  const interviewKeywords = [
    'tell me about yourself',
    'greatest strength',
    'greatest weakness',
    'why do you want',
    'where do you see yourself',
    'challenging project',
    'handle conflict',
    'greatest achievement',
    'stay updated',
    'explain technical concept',
    'describe yourself',
    'strengths',
    'weaknesses',
    'experience',
    'skills',
    'background',
    'five years',
    'conflict',
    'team conflict',
    'achievement',
    'learning',
    'technology',
    'trends'
  ];

  const lowerQuery = normalizedQuery;
  for (const keyword of interviewKeywords) {
    if (lowerQuery.includes(keyword)) {
      const keywordMatch = questions.find(q => 
        q.question.toLowerCase().includes(keyword)
      );
      if (keywordMatch) return keywordMatch;
    }
  }

  return null;
}

// Detect if query is a web search based on keywords and patterns
function isWebSearch(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  
  // Web search trigger words
  const searchKeywords = [
    'search',
    'find',
    'look up',
    'google',
    'what is',
    'who is',
    'when is',
    'where is',
    'why is',
    'how to',
    'latest',
    'recent',
    'news',
    'weather',
    'stock',
    'price',
    'definition',
    'meaning',
    'wiki',
    'information about',
    'tell me about',
    'learn about',
    'research',
    'explain',
    'details'
  ];

  // If query starts with search keywords or contains them prominently
  return searchKeywords.some(keyword => 
    lowerQuery.startsWith(keyword) || 
    lowerQuery.includes(` ${keyword}`) ||
    lowerQuery.includes(keyword.split(' ')[0])
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const query = message.trim();

    // 1. Check if it's an interview question
    try {
      const interviewDataPath = join(process.cwd(), 'data', 'interview.json');
      const interviewData = await readFile(interviewDataPath, 'utf-8');
      const interviewQuestions: InterviewQuestion[] = JSON.parse(interviewData);

      const matchedQuestion = isInterviewQuestion(query, interviewQuestions);
      if (matchedQuestion) {
        return NextResponse.json({
          success: true,
          answer: matchedQuestion.answer,
          source: 'interview',
          matchedQuestion: matchedQuestion.question
        });
      }
    } catch (error) {
      console.error('Error loading interview data:', error);
      // Continue to other sources if interview data is unavailable
    }

    // 2. Check if it's a web search query
    if (isWebSearch(query)) {
      try {
        // Call DuckDuckGo API directly
        const searchResponse = await axios.get('https://api.duckduckgo.com/', {
          params: {
            q: query,
            format: 'json',
            no_html: 1,
            skip_disambig: 1,
          },
          timeout: 10000,
        });

        const data = searchResponse.data;

        let answer = '';
        if (data.AbstractText) {
          answer = data.AbstractText;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
          const firstTopic = data.RelatedTopics[0];
          if (typeof firstTopic === 'object' && 'Text' in firstTopic) {
            answer = firstTopic.Text;
          }
        }

        if (answer) {
          return NextResponse.json({
            success: true,
            answer,
            source: 'search',
            sourceName: data.AbstractSource || 'DuckDuckGo',
            sourceUrl: data.AbstractURL,
          });
        }
      } catch (error) {
        console.error('DuckDuckGo search error:', error);
        // Continue to LLM fallback
      }
    }

    // 3. Default: Use LLM via chat API
    try {
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!chatResponse.ok) {
        throw new Error(`Chat API error: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      
      if (chatData.success || chatData.answer) {
        return NextResponse.json({
          success: true,
          answer: chatData.answer,
          source: 'llm',
          model: chatData.model || 'gpt-4',
        });
      } else {
        throw new Error(chatData.error || 'No answer from chat API');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to get response. Please try again.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('SH handler error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
