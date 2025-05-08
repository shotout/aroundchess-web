'use server'

import { createClientForServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = (provider: string) => async () => {
  const supabase = await createClientForServer()
  
  // Use absolute URL for redirect
  const origin = 'http://localhost:3000'
  const auth_callback_url = `${origin}/sso-callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: auth_callback_url,
    },
  })

  console.log("SSO authentication result:", data)

  if (error) {
    console.error("SSO authentication error:", error)
    throw new Error(error.message)
  }

  if (data.url) {
    redirect(data.url)
  } else {
    throw new Error('No redirect URL returned from signInWithOAuth')
  }
}

export const signinWithGoogle = signInWith('google')
export const signInWithFacebook = signInWith('facebook')
export const signInWithApple = signInWith('apple')

export const signOut = async () => {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  redirect('/')
}