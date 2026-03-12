/**
 * Trie Data Structure for Efficient Prefix-Based Autocompletion
 * Perfect for tab completion in terminals
 */

export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): TrieNode | null {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }
    return node;
  }

  getAllWords(prefix: string = ''): string[] {
    const words: string[] = [];
    
    if (prefix === '') {
      // Get all words from root
      this.collectAllWords(this.root, '', words);
    } else {
      const node = this.startsWith(prefix);
      if (node) {
        this.collectAllWords(node, prefix, words);
      }
    }
    
    return words;
  }

  private collectAllWords(node: TrieNode, currentPrefix: string, words: string[]): void {
    if (node.isEndOfWord) {
      words.push(currentPrefix);
    }
    
    for (const [char, child] of node.children) {
      this.collectAllWords(child, currentPrefix + char, words);
    }
  }

  getCompletions(prefix: string): string[] {
    const prefixLower = prefix.toLowerCase();
    const node = this.startsWith(prefixLower);
    if (!node) {
      return [];
    }
    
    const completions: string[] = [];
    this.collectAllWords(node, prefixLower, completions);
    return completions;
  }

  findLongestCommonPrefix(words: string[]): string {
    if (words.length === 0) return '';
    
    if (words.length === 1) return words[0];
    
    // Sort to bring similar prefixes together
    const sorted = [...words].sort();
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    let i = 0;
    while (i < first.length && i < last.length && first[i] === last[i]) {
      i++;
    }
    
    return first.substring(0, i);
  }

  /**
   * Perform tab completion on a given partial input
   * @param partial The incomplete word to complete
   * @returns Object with completion info or null if no completions
   */
  complete(partial: string): { completed: string; suggestions: string[] } | null {
    const completions = this.getCompletions(partial);
    
    if (completions.length === 0) {
      return null;
    }
    
    if (completions.length === 1) {
      // Single completion - return full word
      return {
        completed: completions[0],
        suggestions: []
      };
    }
    
    // Multiple completions - find longest common prefix
    const commonPrefix = this.findLongestCommonPrefix(completions);
    
    // If common prefix is longer than partial, we can auto-complete to that
    if (commonPrefix.length > partial.length) {
      return {
        completed: commonPrefix,
        suggestions: completions
      };
    }
    
    // Otherwise, return the list of suggestions (common prefix is just the partial)
    return {
      completed: partial,
      suggestions: completions
    };
  }
}

/**
 * Utility to create and populate a trie with terminal commands and processes
 */
export function createCompletionTrie(
  commands: string[],
  processes: string[] = []
): Trie {
  const trie = new Trie();
  
  // Add all commands
  for (const cmd of commands) {
    trie.insert(cmd);
  }
  
  // Add all processes (with and without .exe extension for flexibility)
  for (const process of processes) {
    trie.insert(process);
    // Also add without .exe if present
    if (process.endsWith('.exe')) {
      trie.insert(process.slice(0, -4));
    }
  }
  
  return trie;
}
