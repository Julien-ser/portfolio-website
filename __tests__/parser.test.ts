import { CommandParser, ParsedCommand } from '../lib/terminal/parser';

describe('CommandParser', () => {
  let parser: CommandParser;

  beforeEach(() => {
    parser = new CommandParser();
  });

  describe('parse()', () => {
    test('should parse valid commands', () => {
      const commands = ['help', 'clear', 'ls', 'run', 'sh', 'about', 'projects'] as const;

      for (const cmd of commands) {
        const result = parser.parse(cmd);
        expect(result).not.toBeNull();
        expect(result!.command).toBe(cmd);
        expect(result!.args).toEqual([]);
        expect(result!.raw).toBe(cmd);
      }
    });

    test('should parse commands with arguments', () => {
      const result = parser.parse('sh What is JavaScript?');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('sh');
      expect(result!.args).toEqual(['What', 'is', 'JavaScript?']);
      expect(result!.raw).toBe('sh What is JavaScript?');
    });

    test('should parse run command with process name', () => {
      const result = parser.parse('run about.exe');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('run');
      expect(result!.args).toEqual(['about.exe']);
    });

    test('should handle quoted arguments', () => {
      const result = parser.parse('sh "What is TypeScript?"');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('sh');
      expect(result!.args).toEqual(['What is TypeScript?']);
    });

    test('should handle single quoted arguments', () => {
      const result = parser.parse('sh \'What is React?\'');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('sh');
      expect(result!.args).toEqual(['What is React?']);
    });

    test('should handle multiple quoted arguments', () => {
      const result = parser.parse('run "my program.exe" --flag "value here"');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('run');
      expect(result!.args).toEqual(['my program.exe', '--flag', 'value here']);
    });

    test('should handle escaped quotes in arguments', () => {
      const result = parser.parse('sh "He said \\"hello\\""');
      expect(result).not.toBeNull();
      // Parser preserves backslashes as part of the string
      expect(result!.args).toEqual(['He said \\"hello\\"']);
    });

    test('should trim whitespace from input', () => {
      const result = parser.parse('  help  ');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('help');
      expect(result!.raw).toBe('help');
    });

    test('should return null for empty input', () => {
      const result = parser.parse('');
      expect(result).toBeNull();
    });

    test('should return null for whitespace-only input', () => {
      const result = parser.parse('   ');
      expect(result).toBeNull();
    });

    test('should return unknown command for unrecognized commands', () => {
      const result = parser.parse('unknown');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('unknown');
      expect(result!.args).toEqual(['unknown']);
    });

    test('should handle case-insensitive command recognition', () => {
      const result = parser.parse('HELP');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('help');
    });

    test('should handle command with many arguments', () => {
      const result = parser.parse('sh arg1 arg2 arg3 arg4 arg5');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('sh');
      expect(result!.args).toEqual(['arg1', 'arg2', 'arg3', 'arg4', 'arg5']);
    });

    test('should handle command with flags', () => {
      const result = parser.parse('ls -la --all');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('ls');
      expect(result!.args).toEqual(['-la', '--all']);
    });

    test('should preserve mixed case in arguments', () => {
      const result = parser.parse('sh "JavaScript and TypeScript"');
      expect(result).not.toBeNull();
      expect(result!.args).toEqual(['JavaScript and TypeScript']);
    });

    test('should handle argument with special characters', () => {
      const result = parser.parse('sh "C++ vs JavaScript?"');
      expect(result).not.toBeNull();
      expect(result!.args).toEqual(['C++ vs JavaScript?']);
    });
  });

  describe('parseArgs()', () => {
    test('should split on spaces', () => {
      const args = parser['parseArgs']('arg1 arg2 arg3');
      expect(args).toEqual(['arg1', 'arg2', 'arg3']);
    });

    test('should handle single argument', () => {
      const args = parser['parseArgs']('single');
      expect(args).toEqual(['single']);
    });

    test('should preserve quoted strings with spaces', () => {
      const args = parser['parseArgs']('arg1 "quoted arg" arg3');
      expect(args).toEqual(['arg1', 'quoted arg', 'arg3']);
    });

    test('should handle consecutive spaces', () => {
      const args = parser['parseArgs']('arg1  arg2   arg3');
      expect(args).toEqual(['arg1', 'arg2', 'arg3']);
    });

    test('should handle mixed quotes', () => {
      const args = parser['parseArgs']("arg1 'single' arg2 \"double\" arg3");
      expect(args).toEqual(['arg1', 'single', 'arg2', 'double', 'arg3']);
    });

    test('should handle empty strings between spaces', () => {
      const args = parser['parseArgs']('arg1  arg2');
      expect(args).toEqual(['arg1', 'arg2']);
    });

    test('should handle leading and trailing spaces', () => {
      const args = parser['parseArgs']('  arg1 arg2  ');
      expect(args).toEqual(['arg1', 'arg2']);
    });

    test('should handle quotes at start', () => {
      const args = parser['parseArgs']('"first arg" other');
      expect(args).toEqual(['first arg', 'other']);
    });

    test('should handle quotes at end', () => {
      const args = parser['parseArgs']('first "second arg"');
      expect(args).toEqual(['first', 'second arg']);
    });

    test('should handle empty input', () => {
      const args = parser['parseArgs']('');
      expect(args).toEqual([]);
    });

    test('should handle only spaces', () => {
      const args = parser['parseArgs']('   ');
      expect(args).toEqual([]);
    });
  });

  describe('getCommands()', () => {
    test('should return all available commands', () => {
      const commands = parser.getCommands();
      expect(commands).toContain('help');
      expect(commands).toContain('clear');
      expect(commands).toContain('ls');
      expect(commands).toContain('run');
      expect(commands).toContain('sh');
      expect(commands).toContain('about');
      expect(commands).toContain('projects');
      expect(commands.length).toBe(7);
    });

    test('should return immutable array', () => {
      const commands = parser.getCommands();
      commands.push('newcommand');
      const commands2 = parser.getCommands();
      expect(commands2).not.toContain('newcommand');
    });
  });

  describe('isCommand()', () => {
    test('should return true for valid commands', () => {
      expect(parser.isCommand('help')).toBe(true);
      expect(parser.isCommand('clear')).toBe(true);
      expect(parser.isCommand('ls')).toBe(true);
      expect(parser.isCommand('run')).toBe(true);
      expect(parser.isCommand('sh')).toBe(true);
      expect(parser.isCommand('about')).toBe(true);
      expect(parser.isCommand('projects')).toBe(true);
    });

    test('should return true for valid commands with arguments', () => {
      expect(parser.isCommand('sh hello world')).toBe(true);
      expect(parser.isCommand('run about.exe')).toBe(true);
      expect(parser.isCommand('ls -la')).toBe(true);
    });

    test('should return false for invalid commands', () => {
      expect(parser.isCommand('unknown')).toBe(false);
      expect(parser.isCommand('test')).toBe(false);
      expect(parser.isCommand('')).toBe(false);
    });

    test('should be case-insensitive', () => {
      expect(parser.isCommand('HELP')).toBe(true);
      expect(parser.isCommand('HeLp')).toBe(true);
    });

    test('should handle whitespace-only input', () => {
      expect(parser.isCommand('   ')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle newline characters in input', () => {
      const result = parser.parse('help\n');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('help');
    });

    test('should handle command with no space after command', () => {
      const result = parser.parse('help');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('help');
      expect(result!.args).toEqual([]);
    });

    test('should handle command with many spaces', () => {
      const result = parser.parse('sh    many    spaces    here');
      expect(result).not.toBeNull();
      expect(result!.command).toBe('sh');
      expect(result!.args).toEqual(['many', 'spaces', 'here']);
    });

    test('should handle numeric arguments', () => {
      const result = parser.parse('sh 123 456 789');
      expect(result).not.toBeNull();
      expect(result!.args).toEqual(['123', '456', '789']);
    });

    test('should handle special shell characters in quotes', () => {
      const result = parser.parse('sh "foo & bar | baz > output"');
      expect(result).not.toBeNull();
      expect(result!.args).toEqual(['foo & bar | baz > output']);
    });
  });
});
