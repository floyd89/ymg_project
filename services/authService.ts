import { supabase } from '../lib/supabaseClient';
// FIX: Import `Subscription` type for the return value of onAuthStateChange.
import type { AuthError, Session, SignInWithPasswordCredentials, User, Subscription } from '@supabase/supabase-js';

// FIX: The errors indicate a v2 @supabase/supabase-js is being used, but the code was written for v1.
// The code has been updated to use the v2 authentication API.
const signIn = async (credentials: SignInWithPasswordCredentials): Promise<{ session: Session | null, error: AuthError | null }> => {
  // v1 uses `signIn` for password auth and returns { user, session, error }
  // FIX: Use `signInWithPassword` which is the v2 equivalent of `signIn`.
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  return { session: data.session, error };
};

const signOut = async (): Promise<{ error: AuthError | null }> => {
  // signOut has a consistent signature across v1 and v2.
  const { error } = await supabase.auth.signOut();
  return { error };
};

const getUser = async (): Promise<{ user: User | null, error: AuthError | null }> => {
    // v1 uses `user()` which is synchronous. Wrapped in a promise to maintain the async interface.
    // FIX: Use async `getUser()` which is the v2 equivalent of `user()`.
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
}

const onAuthStateChange = (callback: (session: Session | null) => void): Subscription => {
  // v1's onAuthStateChange returns the subscription in the `data` property.
  // FIX: Correctly destructure the subscription object from the v2 API response to fix the `unsubscribe` error.
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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