import { Trie, TrieNode, createCompletionTrie } from '../lib/terminal/trie';

describe('Trie', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  describe('Basic Operations', () => {
    test('should insert and find words', () => {
      trie.insert('hello');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('hell')).toBe(false);
      expect(trie.search('helo')).toBe(false);
    });

    test('should handle multiple insertions', () => {
      trie.insert('help');
      trie.insert('clear');
      trie.insert('ls');
      trie.insert('run');
      
      expect(trie.search('help')).toBe(true);
      expect(trie.search('clear')).toBe(true);
      expect(trie.search('ls')).toBe(true);
      expect(trie.search('run')).toBe(true);
      expect(trie.search('sh')).toBe(false);
    });

    test('should handle case insensitivity', () => {
      trie.insert('HELLO');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('HELLO')).toBe(true);
      expect(trie.search('HeLLo')).toBe(true);
    });
  });

  describe('Prefix Search', () => {
    beforeEach(() => {
      trie.insert('help');
      trie.insert('clear');
      trie.insert('ls');
      trie.insert('run');
      trie.insert('about');
      trie.insert('projects');
    });

    test('should find words with given prefix', () => {
      expect(trie.getCompletions('h')).toContain('help');
      expect(trie.getCompletions('c')).toContain('clear');
      expect(trie.getCompletions('r')).toContain('run');
      expect(trie.getCompletions('a')).toContain('about');
      expect(trie.getCompletions('p')).toContain('projects');
    });

    test('should return multiple completions for partial prefix', () => {
      const completions = trie.getCompletions('pr');
      expect(completions).toContain('projects');
      expect(completions).not.toContain('help');
      expect(completions.length).toBe(1);
    });

    test('should return empty array for prefix with no matches', () => {
      expect(trie.getCompletions('z')).toEqual([]);
      expect(trie.getCompletions('xyz')).toEqual([]);
    });

    test('should get all words when empty prefix', () => {
      const allWords = trie.getAllWords();
      expect(allWords).toContain('help');
      expect(allWords).toContain('clear');
      expect(allWords).toContain('ls');
      expect(allWords).toContain('run');
      expect(allWords).toContain('about');
      expect(allWords).toContain('projects');
      expect(allWords.length).toBe(6);
    });
  });

  describe('Longest Common Prefix', () => {
    beforeEach(() => {
      trie.insert('about');
      trie.insert('about.exe');
      trie.insert('aboutme');
      trie.insert('projects');
      trie.insert('projects.exe');
      trie.insert('project');
    });

    test('should find longest common prefix among words', () => {
      expect(trie.findLongestCommonPrefix(['about', 'about.exe'])).toBe('about');
      expect(trie.findLongestCommonPrefix(['projects', 'projects.exe', 'project'])).toBe('project');
      expect(trie.findLongestCommonPrefix(['hello', 'help'])).toBe('hel');
      expect(trie.findLongestCommonPrefix(['abc', 'def'])).toBe('');
    });
  });

  describe('Tab Completion', () => {
    beforeEach(() => {
      trie.insert('help');
      trie.insert('clear');
      trie.insert('ls');
      trie.insert('run');
      trie.insert('about');
      trie.insert('about.exe');
      trie.insert('aboutme');
      trie.insert('projects');
      trie.insert('projects.exe');
      trie.insert('project');
      trie.insert('contact');
      trie.insert('contact.exe');
      trie.insert('resume');
      trie.insert('resume.exe');
    });

    test('should return single completion for unambiguous prefix', () => {
      const result = trie.complete('cle');
      expect(result).not.toBeNull();
      expect(result!.completed).toBe('clear');
      expect(result!.suggestions).toEqual([]);
    });

    test('should return completions with suggestions for ambiguous prefix', () => {
      const result = trie.complete('a');
      expect(result).not.toBeNull();
      expect(result!.completed).toBe('about'); // Longest common prefix of about, about.exe, aboutme
      expect(result!.suggestions).toContain('about');
      expect(result!.suggestions).toContain('about.exe');
      expect(result!.suggestions).toContain('aboutme');
      expect(result!.suggestions.length).toBe(3);
    });

    test('should auto-complete to common prefix when longer than partial', () => {
      const result = trie.complete('proj');
      expect(result).not.toBeNull();
      expect(result!.completed).toBe('project'); // common prefix of project, projects, projects.exe
      expect(result!.suggestions).toContain('project');
      expect(result!.suggestions).toContain('projects');
      expect(result!.suggestions).toContain('projects.exe');
    });

    test('should return null for no completions', () => {
      const result = trie.complete('xyz');
      expect(result).toBeNull();
    });

    test('should handle exact word matches', () => {
      const result = trie.complete('help');
      expect(result).not.toBeNull();
      expect(result!.completed).toBe('help');
      expect(result!.suggestions).toEqual([]);
    });
  });

  describe('createCompletionTrie helper', () => {
    test('should create trie with commands and processes', () => {
      const commands = ['help', 'clear', 'ls', 'run', 'sh', 'about', 'projects'];
      const processes = ['about.exe', 'projects.exe', 'contact.exe', 'resume.exe'];
      
      const trie = createCompletionTrie(commands, processes);
      
      // Should find all commands
      for (const cmd of commands) {
        expect(trie.search(cmd)).toBe(true);
      }
      
      // Should find all processes
      for (const proc of processes) {
        expect(trie.search(proc)).toBe(true);
      }
      
      // Should also find processes without .exe (added automatically)
      expect(trie.search('about')).toBe(true);
      expect(trie.search('projects')).toBe(true);
      expect(trie.search('contact')).toBe(true);
      expect(trie.search('resume')).toBe(true);
    });

    test('should handle empty arrays', () => {
      const trie = createCompletionTrie([], []);
      expect(trie.getCompletions('any')).toEqual([]);
    });

    test('should handle only commands', () => {
      const trie = createCompletionTrie(['help', 'clear']);
      expect(trie.search('help')).toBe(true);
      expect(trie.search('clear')).toBe(true);
      expect(trie.search('about')).toBe(false);
    });

    test('should handle only processes', () => {
      const trie = createCompletionTrie([], ['about.exe', 'projects.exe']);
      expect(trie.search('about.exe')).toBe(true);
      expect(trie.search('about')).toBe(true);
      expect(trie.search('projects.exe')).toBe(true);
      expect(trie.search('projects')).toBe(true);
    });
  });
});
