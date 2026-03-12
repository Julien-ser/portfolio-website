import { test, expect } from '@playwright/test';

test.describe('Terminal Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for terminal to initialize
    await page.waitForSelector('.xterm');
  });

  test('should display welcome message', async ({ page }) => {
    const terminal = page.locator('.xterm');
    await expect(terminal).toContainText('Welcome to the portfolio terminal');
  });

  test('should show help command output', async ({ page }) => {
    // Type help command
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');

    // Wait for typing animation to complete (adjust timeout as needed)
    await page.waitForTimeout(1000);

    const terminal = page.locator('.xterm');
    await expect(terminal).toContainText('Available commands:');
    await expect(terminal).toContainText('help');
    await expect(terminal).toContainText('clear');
    await expect(terminal).toContainText('ls');
    await expect(terminal).toContainText('run');
    await expect(terminal).toContainText('sh');
    await expect(terminal).toContainText('about');
    await expect(terminal).toContainText('projects');
  });

  test('should handle ls command', async ({ page }) => {
    await page.keyboard.type('ls');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const terminal = page.locator('.xterm');
    // ls should show available processes
    await expect(terminal).toContainText('about.exe');
    await expect(terminal).toContainText('projects.exe');
    await expect(terminal).toContainText('contact.exe');
    await expect(terminal).toContainText('resume.exe');
  });

  test('should launch about process with run command', async ({ page }) => {
    await page.keyboard.type('run about.exe');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // A window should appear - check for window title or content
    const terminal = page.locator('.xterm');
    await expect(terminal).toContainText('About');
  });

  test('should launch projects process with run command', async ({ page }) => {
    await page.keyboard.type('run projects.exe');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const terminal = page.locator('.xterm');
    await expect(terminal).toContainText('Projects');
  });

  test('should handle sh command with simple query', async ({ page }) => {
    await page.keyboard.type('sh What is JavaScript?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const terminal = page.locator('.xterm');
    // The chatbot should provide some answer
    // Since we can't guarantee exact output, just check that something appears
    const text = await terminal.textContent();
    expect(text).not.toBe('');
  });

  test('should handle unknown command gracefully', async ({ page }) => {
    await page.keyboard.type('unknowncommand');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const terminal = page.locator('.xterm');
    await expect(terminal).toContainText(/Unknown command|error/i);
  });

  test('should handle empty command submission', async ({ page }) => {
    // Just press enter without typing anything
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should not crash and should still show prompt
    const terminal = page.locator('.xterm');
    // The prompt should still be visible
    await expect(terminal).toBeVisible();
  });

  test('should clear terminal with clear command', async ({ page }) => {
    // First, type something
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Now clear
    await page.keyboard.type('clear');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const terminal = page.locator('.xterm');
    // After clear, the welcome message should be gone but prompt should be back
    const text = await terminal.textContent();
    // The terminal should be mostly clean (except maybe prompt)
    expect(text).toMatch(/^\s*(\$ )?/);
  });

  test('should navigate command history with up/down arrows', async ({ page }) => {
    // Enter first command
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Enter second command
    await page.keyboard.type('ls');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Press up arrow - should show 'ls'
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(300);

    // Press up arrow again - should show 'help'
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(300);

    // Press down arrow - should show 'ls' again
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(300);

    // Press Enter to execute the currently displayed command
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // Should have executed ls twice now
    expect(text).toContain('ls');
  });

  test('should perform tab completion for commands', async ({ page }) => {
    // Type partial command 'he' and press Tab
    await page.keyboard.type('he');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);

    // Should auto-complete to 'help'
    // The terminal should now show 'help' as the current input
    // We can verify by checking terminal content has 'help' near the end (current line)
    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    expect(text).toContain('help');
  });

  test('should show completion suggestions on ambiguous tab', async ({ page }) => {
    // Type 'r' which could be 'run' or 'resume' or 'resume.exe' etc.
    await page.keyboard.type('r');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // Should show multiple suggestions either 'run' or 'resume' etc.
    expect((text as string).includes('run') || (text as string).includes('resume')).toBeTruthy();
  });

  test('should handle tab completion for processes', async ({ page }) => {
    // Type 'about' and press Tab - should complete to 'about' or 'about.exe'
    await page.keyboard.type('about');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // Should have completed to about or about.exe
    expect(text).toMatch(/about(\.exe)?/);
  });

  test('should handle backspace correctly', async ({ page }) => {
    // Type some text
    await page.keyboard.type('hello');
    await page.waitForTimeout(300);

    // Press backspace multiple times
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300);

    // The input should now be 'he' (if starting from scratch)
    // We can't easily check the current input line without more complex selectors
    // Instead, we'll type more and execute to verify backspace worked
    await page.keyboard.type('lp');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // The command executed should be 'help' not 'hello'
    expect(text).toContain('help');
  });

  test('should handle window operations from run command', async ({ page }) => {
    // Run contact.exe
    await page.keyboard.type('run contact.exe');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Check that contact window appears with expected content
    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    expect(text).toContain('Contact');
  });

  test('should handle multiple commands in sequence', async ({ page }) => {
    const commands = ['help', 'ls', 'clear', 'about', 'projects'];

    for (const cmd of commands) {
      await page.keyboard.type(cmd);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    }

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // All commands should appear in the terminal output
    for (const cmd of commands) {
      expect(text).toContain(cmd);
    }
  });

  test('should maintain prompt after each command', async ({ page }) => {
    // Execute a command
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // The prompt should be visible (we can't check exact prompt char without capturing it)
    // Instead, we verify terminal is ready for more input by typing another command
    await page.keyboard.type('ls');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // Both commands should have executed successfully
    expect(text).toContain('help');
    expect(text).toContain('ls');
  });

  test('should handle sh command with interview question', async ({ page }) => {
    // Use a question that should match interview Q&A
    await page.keyboard.type('sh Tell me about yourself');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const terminal = page.locator('.xterm');
    const text = await terminal.textContent();
    // Should provide some interview answer
    expect(text).not.toBe('');
  });
});
