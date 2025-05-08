// utils/supabase/actions.ts
'use server';

import { createClientForServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const signInWith = (provider: string) => async () => {
  const supabase = await createClientForServer();

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Use an environment variable for your app URL
  const auth_callback_url = `${origin}/sso-callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  console.log(`SSO authentication result for ${provider}:`, data);

  if (error) {
    console.error(`SSO authentication error for ${provider}:`, error);
    return { error: error.message }; // Return an error object
  }

  if (data?.url) {
    return { url: data.url }; // Return the URL
  } else {
    return { error: 'No redirect URL returned from signInWithOAuth' };
  }
};

export const signinWithGoogle = signInWith('google');
export const signInWithFacebook = signInWith('facebook');
export const signInWithApple = signInWith('apple');

export const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
  redirect('/');
};