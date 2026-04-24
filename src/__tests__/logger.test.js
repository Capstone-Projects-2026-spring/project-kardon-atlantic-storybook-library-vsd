import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));
const getUserMock = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (...args) => fromMock(...args),
    auth: { getUser: (...args) => getUserMock(...args) },
  },
}));

const {
  logHotspotClick,
  logHotspotCreate,
  logHotspotEdit,
  logHotspotDelete,
  logHotspotTtsError,
  __SESSION_ID__,
} = await import('../logger');

describe('hotspot logger', () => {
  let warnSpy;

  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
    getUserMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('session id is a non-empty string', () => {
    expect(typeof __SESSION_ID__).toBe('string');
    expect(__SESSION_ID__.length).toBeGreaterThan(0);
  });

  test('logHotspotClick inserts expected row', async () => {
    await logHotspotClick({
      hotspotId: 'h1',
      pageId: 'p1',
      bookId: 'b1',
      word: 'apple',
    });
    expect(fromMock).toHaveBeenCalledWith('hotspot_logs');
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'hotspot_click',
        hotspot_id: 'h1',
        page_id: 'p1',
        book_id: 'b1',
        word: 'apple',
        user_id: 'user-123',
        session_id: __SESSION_ID__,
      }),
    );
  });

  test('logHotspotCreate includes shape and coordinates', async () => {
    await logHotspotCreate({
      hotspotId: 'h2',
      pageId: 'p1',
      bookId: 'b1',
      word: 'dog',
      shapeType: 'circle',
      coordinates: { x: 1, y: 2, radius: 10 },
    });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'hotspot_create',
        shape_type: 'circle',
        coordinates: { x: 1, y: 2, radius: 10 },
      }),
    );
  });

  test('logHotspotEdit sends edit event', async () => {
    await logHotspotEdit({
      hotspotId: 'h3',
      word: 'cat',
      shapeType: 'rectangle',
      coordinates: { x: 0, y: 0, width: 5, height: 5 },
    });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: 'hotspot_edit', word: 'cat' }),
    );
  });

  test('logHotspotDelete sends delete event', async () => {
    await logHotspotDelete({ hotspotId: 'h4', word: 'gone' });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: 'hotspot_delete', hotspot_id: 'h4' }),
    );
  });

  test('logHotspotTtsError stores error message under coordinates.error', async () => {
    await logHotspotTtsError({ hotspotId: 'h5', word: 'oops', errorMessage: 'boom' });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'hotspot_tts_error',
        word: 'oops',
        coordinates: { error: 'boom' },
      }),
    );
  });

  test('falls back to null user_id when auth lookup fails', async () => {
    getUserMock.mockRejectedValueOnce(new Error('nope'));
    await logHotspotClick({ hotspotId: 'h6', word: 'x' });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: null }),
    );
  });

  test('swallows insert errors without throwing', async () => {
    insertMock.mockResolvedValueOnce({ error: { message: 'rls blocked' } });
    await expect(
      logHotspotClick({ hotspotId: 'h7', word: 'y' }),
    ).resolves.not.toThrow();
    expect(warnSpy).toHaveBeenCalled();
  });
});
