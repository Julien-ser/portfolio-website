import axios from 'axios';

export interface DuckDuckGoResponse {
  Abstract: string;
  AbstractText: string;
  AbstractURL: string;
  AbstractSource: string;
  RelatedTopics: Array<{
    Text: string;
    FirstURL: string;
    Icon?: {
      URL: string;
    };
  } | {
    Name: string;
    Topics: Array<{
      Text: string;
      FirstURL: string;
    }>;
  }>;
  Image?: string;
  Type: string;
  Redirect: string;
  Definition?: string;
  DefinitionSource?: string;
  DefinitionURL?: string;
}

export interface SearchResult {
  answer: string;
  source?: string;
  sourceUrl?: string;
  relatedTopics?: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
  image?: string;
}

/**
 * DuckDuckGo Instant Answer API client
 * Provides web search fallback using DuckDuckGo's free API
 */
export async function searchDuckDuckGo(query: string): Promise<SearchResult> {
  try {
    const response = await axios.get<DuckDuckGoResponse>('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1,
      },
      timeout: 10000, // 10 second timeout
    });

    const data = response.data;

    // Build the answer from AbstractText if available
    let answer = '';
    if (data.AbstractText) {
      answer = data.AbstractText;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      // Take the first related topic as answer
      const firstTopic = data.RelatedTopics[0];
      if (typeof firstTopic === 'object' && 'Text' in firstTopic) {
        answer = firstTopic.Text;
      }
    }

    // Extract related topics
    const relatedTopics: SearchResult['relatedTopics'] = [];
    if (data.RelatedTopics) {
      data.RelatedTopics.forEach((topic) => {
        if (typeof topic === 'object' && 'Text' in topic && 'FirstURL' in topic) {
          relatedTopics.push({
            title: topic.Text,
            url: topic.FirstURL,
            icon: topic.Icon?.URL,
          });
        }
      });
    }

    return {
      answer: answer || `No instant answer found for: ${query}`,
      source: data.AbstractSource || undefined,
      sourceUrl: data.AbstractURL || undefined,
      relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined,
      image: data.Image,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('DuckDuckGo API error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Simple search that returns just the answer text
 */
export async function simpleSearch(query: string): Promise<string> {
  const result = await searchDuckDuckGo(query);
  return result.answer;
}