// Supabase project URL and anon (public) key.
//
// These are PUBLIC values by design: the anon key is a JWT that ships in every
// client bundle, and data is protected by Row Level Security on the server — it is
// NOT a secret (the service_role key, which IS secret, lives only in Edge Function
// env vars and never reaches the browser).
//
// They are hardcoded so the app works without any deploy-time env configuration.
// An env var override is still honoured *only if it looks like a valid JWT*, so a
// stray non-JWT value (e.g. a new-style `sb_publishable_...` key, which the Edge
// Functions reject with "Invalid JWT") can never silently break saving again.
const FALLBACK_URL = 'https://byjzimgolemrdsmfarhm.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anppbWdvbGVtcmRzbWZhcmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Mzg1NDEsImV4cCI6MjA4NzMxNDU0MX0.7TDhSLy6icfuLRbGldBWn8HpsqD_C7wm7tkTuv7F4SI';

const isJwt = (v: unknown): v is string =>
  typeof v === 'string' && /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(v);

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const projectId = 'byjzimgolemrdsmfarhm';
export const supabaseUrl: string = typeof envUrl === 'string' && envUrl ? envUrl : FALLBACK_URL;
export const publicAnonKey: string = isJwt(envKey) ? envKey : FALLBACK_ANON_KEY;
