'use server'

import { createClientForServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = (provider : any) => async () => {
  const supabase = await createClientForServer()

  const auth_callback_url = "/sso-callback"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  })

  console.log("hasil dari sso",data)

  if (error) {
    console.log(error)
  }

  if (data.url) {
    redirect(data.url)
  } else {
    throw new Error('No redirect URL returned from signInWithOAuth')
  }
}

const signinWithGoogle = signInWith('google')
const signInWithFacebook = signInWith('facebook')
const signInWithGithub = signInWith('apple')

const signOut = async () => {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
}

export { signinWithGoogle, signOut }