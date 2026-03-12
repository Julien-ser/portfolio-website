/**
 * Command Parser for Terminal Interface
 * Parses user input into structured command objects with arguments
 */

export interface ParsedCommand {
  command: string;
  args: string[];
  raw: string;
}

export class CommandParser {
  private commands: string[] = ['help', 'clear', 'ls', 'run', 'sh', 'about', 'projects'];

  parse(input: string): ParsedCommand | null {
    input = input.trim();
    if (!input) return null;

    // Split by whitespace but preserve quoted strings
    const args = this.parseArgs(input);
    const command = args[0]?.toLowerCase() || '';

    if (!this.commands.includes(command)) {
      return { command: 'unknown', args, raw: input };
    }

    return { command, args: args.slice(1), raw: input };
  }

  private parseArgs(input: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !(i > 0 && input[i-1] === '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
        } else {
          current += char;
        }
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      args.push(current);
    }

    return args;
  }

  getCommands(): string[] {
    return [...this.commands];
  }

  isCommand(input: string): boolean {
    const cmd = input.trim().split(' ')[0]?.toLowerCase() || '';
    return this.commands.includes(cmd);
  }
}

export const parser = new CommandParser();
