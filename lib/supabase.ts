import { createClient } from '@supabase/supabase-js';

// Check if we're in a build environment or if environment variables are missing
const supabaseUrl = "https://jkpswqodrvbyemeaatwo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcHN3cW9kcnZieWVtZWFhdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEwNjEsImV4cCI6MjA2NjY5NzA2MX0.P2ZuI5QhzmAu-yI09gOgiM-tF8Rh3TdyOLPfiAN9Rr8"

// Create a mock client for build time if environment variables are missing
const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows returned' } }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: { id: 1, count: 0 }, error: null }),
        }),
        limit: () => ({
          single: () => Promise.resolve({ data: { id: 1, count: 0 }, error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ error: null }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  };
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();