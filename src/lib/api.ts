// Centralised access to the Supabase Edge Function backend.
//
// Every request to the backend needs the same two headers: the public anon key as the
// Bearer token (required by the Supabase gateway) and the user's access token in
// X-User-Token (used by the function to identify the user). This was hand-written at ~18
// call sites; keeping it here removes the duplication and the risk of one site drifting.
import { supabaseUrl, publicAnonKey } from '/utils/supabase/info';

// Base URL for the deployed Edge Function. The suffix is the function's deploy id.
export const MENU_API = `${supabaseUrl}/functions/v1/make-server-791d0b68`;

// Headers for an authenticated backend request. Pass `withJson` for requests that send a
// JSON body so the Content-Type is set.
export function authHeaders(accessToken: string, withJson = false): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${publicAnonKey}`,
    'X-User-Token': accessToken,
  };
  if (withJson) headers['Content-Type'] = 'application/json';
  return headers;
}
