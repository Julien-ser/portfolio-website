/**
 * Command History Store
 * Manages command history with up to 100 entries and arrow key navigation
 */

export interface HistoryState {
  commands: string[];
  currentIndex: number;
  maxSize: number;
}

export type HistoryAction =
  | { type: 'ADD_COMMAND'; payload: string }
  | { type: 'NAVIGATE_UP' }
  | { type: 'NAVIGATE_DOWN' }
  | { type: 'RESET_INDEX' };

const MAX_HISTORY_SIZE = 100;

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'ADD_COMMAND':
      // Don't add empty commands or duplicates (consecutive)
      const trimmed = action.payload.trim();
      if (!trimmed) return state;
      
      const lastCommand = state.commands[state.commands.length - 1];
      if (lastCommand === trimmed) return state;

      const newCommands = [...state.commands, trimmed];
      if (newCommands.length > MAX_HISTORY_SIZE) {
        newCommands.shift();
      }
      return {
        ...state,
        commands: newCommands,
        currentIndex: newCommands.length,
      };

    case 'NAVIGATE_UP':
      if (state.currentIndex <= 0) return state;
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
      };

    case 'NAVIGATE_DOWN':
      if (state.currentIndex >= state.commands.length) return state;
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      };

    case 'RESET_INDEX':
      return {
        ...state,
        currentIndex: state.commands.length,
      };

    default:
      return state;
  }
}

export function createInitialHistoryState(): HistoryState {
  return {
    commands: [],
    currentIndex: 0,
    maxSize: MAX_HISTORY_SIZE,
  };
}
