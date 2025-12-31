import { supabase } from '../lib/supabaseClient';
import type { AuthError, Session, SignInWithPasswordCredentials, User } from '@supabase/supabase-js';

// FIX: The errors indicate an outdated version of @supabase/supabase-js is being used (likely v1).
// The code has been updated to use the v1 authentication API to match the expected environment.
const signIn = async (credentials: SignInWithPasswordCredentials): Promise<{ session: Session | null, error: AuthError | null }> => {
  // v1 uses `signIn` for password auth and returns { user, session, error }
  const { session, error } = await supabase.auth.signIn(credentials);
  return { session, error };
};

const signOut = async (): Promise<{ error: AuthError | null }> => {
  // signOut has a consistent signature across v1 and v2.
  const { error } = await supabase.auth.signOut();
  return { error };
};

const getUser = async (): Promise<{ user: User | null, error: AuthError | null }> => {
    // v1 uses `user()` which is synchronous. Wrapped in a promise to maintain the async interface.
    const user = supabase.auth.user();
    return { user, error: null };
}

const onAuthStateChange = (callback: (session: Session | null) => void) => {
  // v1's onAuthStateChange returns the subscription in the `data` property.
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
};

export const authService = {
  signIn,
  signOut,
  getUser,
  onAuthStateChange,
};