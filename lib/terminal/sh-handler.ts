import interviewData from '@/data/interview.json';
import { searchDuckDuckGo } from '@/lib/api/duckduckgo';
import { searchGoogle } from '@/lib/api/search';

export interface ShResult {
  success: boolean;
  answer: string;
  source?: 'interview' | 'llm' | 'web' | 'error';
  sourceDetails?: 'duckduckgo' | 'google' | string;
  metadata?: {
    queryType?: string;
    confidence?: number;
    model?: string;
  };
}

/**
 * Determines if a query is likely a web search query
 */
function isWebSearchQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Keywords that suggest web search intent
  const searchKeywords = [
    'search for', 'find', 'look up', 'what is', 'who is', 'where is',
    'when was', 'how to', 'latest', 'recent', 'news', 'weather',
    'stock price', 'crypto', 'bitcoin', 'definition', 'meaning',
    'who won', 'results for', 'update on', 'current status'
  ];
  
  // Check for questions starting with these words
  for (const keyword of searchKeywords) {
    if (lowerQuery.startsWith(keyword)) {
      return true;
    }
  }
  
  // Check for questions with ¿? characters or common question patterns
  if (query.includes('?') || query.includes('¿')) {
    // Many questions are general knowledge, lean towards LLM unless clearly search-oriented
    const generalKnowledge = ['what is', 'who is', 'where is', 'when was', 'how does'];
    return generalKnowledge.some(k => lowerQuery.startsWith(k));
  }
  
  // Check for specific entity searches (names, places, events)
  const capitalizedWords = query.match(/\b[A-Z][a-z]+\b/g);
  if (capitalizedWords && capitalizedWords.length >= 2) {
    // Multiple capitalized words often indicate a specific entity search
    return true;
  }
  
  return false;
}

/**
 * Checks if query matches any interview question (fuzzy matching)
 */
function matchInterviewQuestion(query: string): { match: boolean; answer?: string; confidence: number } {
  const lowerQuery = query.toLowerCase().trim();
  
  for (const qa of interviewData.questions) {
    const lowerQuestion = qa.question.toLowerCase();
    
    // Exact match
    if (lowerQuery === lowerQuestion) {
      return { match: true, answer: qa.answer, confidence: 1.0 };
    }
    
    // Check if query is contained in question
    if (lowerQuestion.includes(lowerQuery) && lowerQuery.length > 10) {
      return { match: true, answer: qa.answer, confidence: 0.8 };
    }
    
    // Check word overlap (simple similarity)
    const queryWords = new Set(lowerQuery.split(/\s+/).filter(w => w.length > 3));
    const questionWords = new Set(lowerQuestion.split(/\s+/).filter(w => w.length > 3));
    
    if (queryWords.size > 0 && questionWords.size > 0) {
      const intersection = new Set([...queryWords].filter(x => questionWords.has(x)));
      const similarity = intersection.size / Math.min(queryWords.size, questionWords.size);
      
      if (similarity >= 0.6) {
        return { match: true, answer: qa.answer, confidence: similarity };
      }
    }
  }
  
  return { match: false, confidence: 0 };
}

/**
 * Main sh command handler - routes queries to appropriate backend
 */
export async function handleShCommand(query: string): Promise<ShResult> {
  if (!query || query.trim().length === 0) {
    return {
      success: false,
      answer: 'Usage: sh <question>\nExample: sh "What is React?"',
      source: 'error'
    };
  }
  
  const trimmedQuery = query.trim();
  
  // Step 1: Check if it's an interview question
  const interviewMatch = matchInterviewQuestion(trimmedQuery);
  if (interviewMatch.match) {
    return {
      success: true,
      answer: interviewMatch.answer!,
      source: 'interview',
      metadata: {
        queryType: 'interview',
        confidence: interviewMatch.confidence
      }
    };
  }
  
  // Step 2: Check if it's a web search query
  if (isWebSearchQuery(trimmedQuery)) {
    // Try DuckDuckGo first as primary
    try {
      const searchResult = await searchDuckDuckGo(trimmedQuery);
      
      let answer = searchResult.answer;
      if (searchResult.source) {
        answer += `\n\nSource: ${searchResult.source}`;
      }
      
      return {
        success: true,
        answer: answer || `No results found for "${trimmedQuery}"`,
        source: 'web',
        sourceDetails: 'duckduckgo',
        metadata: {
          queryType: 'web_search',
          confidence: 0.9
        }
      };
    } catch (error) {
      console.error('DuckDuckGo search failed, trying Google Search:', error);
      
      // Fallback to Google Search as secondary option
      try {
        const googleResult = await searchGoogle(trimmedQuery);
        
        let answer = googleResult.answer;
        if (googleResult.source) {
          answer += `\n\nSource: ${googleResult.source}`;
        }
        
        return {
          success: true,
          answer: answer || `No results found for "${trimmedQuery}"`,
          source: 'web',
          sourceDetails: 'google',
          metadata: {
            queryType: 'web_search',
            confidence: 0.85
          }
        };
      } catch (googleError) {
        console.error('Google Search also failed:', googleError);
        // Both search engines failed, fall back to LLM
      }
    }
  }
  
  // Step 3: Default to LLM for general questions
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: trimmedQuery,
        history: []
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get LLM response');
    }
    
    return {
      success: true,
      answer: data.answer,
      source: 'llm',
      metadata: {
        queryType: 'general',
        model: data.model,
        confidence: 0.9
      }
    };
  } catch (error) {
    return {
      success: false,
      answer: `Error: ${error instanceof Error ? error.message : 'Failed to process query'}\n\nPlease check your OpenAI API key configuration or try a different query.`,
      source: 'error'
    };
  }
}
