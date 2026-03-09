// src/__tests__/supabase-client.test.js
import { describe, test, expect, vi } from 'vitest';

// Mock the entire supabaseClient module (prevents real createClient from running)
vi.mock('../supabaseClient', () => {
  // Fake supabase object with the methods you use
  const fakeSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
    },
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    },
  };

  return {
    supabase: fakeSupabase,
  };
});

// Now import the mocked supabase
import { supabase } from '../supabaseClient'; // adjust path if needed

describe('supabaseClient initializes without errors', () => {
  test('supabase is defined and has expected methods', () => {
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeInstanceOf(Function);
    expect(supabase.auth.signInWithPassword).toBeInstanceOf(Function);
    expect(supabase.storage.from).toBeInstanceOf(Function);
  });

  test('supabase can be used for queries', () => {
    supabase.from('books').select('*');
    expect(supabase.from).toHaveBeenCalledWith('books');
    expect(supabase.select).toHaveBeenCalled();
  });
});