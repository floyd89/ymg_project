
import { supabase } from '../lib/supabaseClient';
import type { AuthError, Session, SignInWithPasswordCredentials, User } from '@supabase/supabase-js';

const signIn = async (credentials: SignInWithPasswordCredentials): Promise<{ session: Session | null, error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  return { session: data.session, error };
};

const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

const getUser = async (): Promise<{ user: User | null, error: AuthError | null }> => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
}

const onAuthStateChange = (callback: (session: Session | null) => void) => {
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
