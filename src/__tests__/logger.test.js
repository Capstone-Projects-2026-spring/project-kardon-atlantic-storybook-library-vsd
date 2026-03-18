import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

const logger = await vi.importActual('../logger');

const { log, logLogin, logHotspotClick, logError } = logger;

describe('Logger Utility', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('logLogin records user ID', () => {
    logLogin('test-user-id');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('User logged in'),
      expect.objectContaining({ userId: 'test-user-id' })
    );
  });

  test('logHotspotClick logs clicked word', () => {
    logHotspotClick('apple');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('User clicked hotspot: "apple"')
    );
  });

  test('logError logs message and error', () => {
    const error = new Error('Test error');
    logError('Something failed', error);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] Something failed'),
      error
    );
  });
});