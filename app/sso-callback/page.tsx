'use client'
import { useEffect } from "react"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
export default function SSOCallback() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
  const router = useRouter()
  useEffect(() => {
    if (!isSignInLoaded || !isSignUpLoaded) return
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        
        try {
          // First attempt sign in
          const signInAttempt = await signIn?.create({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            actionCompleteRedirectUrl: "/"
          })
          
          if (signInAttempt?.status === "complete") {
            router.push("/dashboard")
            return
          }
        } catch (err) {
          // If sign in fails, attempt sign up
          try {
            const signUpAttempt = await signUp?.create({
              strategy: "oauth_google",
              redirectUrl: "/sso-callback",
              actionCompleteRedirectUrl: "/"
            })
            if (signUpAttempt?.status === "complete") {
              router.push("/dashboard")
              return
            }
          } catch (signUpErr) {
            console.error("Sign up failed:", signUpErr)
          }
        }
        
        // If we get here, both sign in and sign up failed
        router.push("/login")
      } catch (err) {
        console.error("OAuth callback error:", err)
        router.push("/login")
      }
    }
    handleCallback()
  }, [isSignInLoaded, isSignUpLoaded, signIn, signUp, router])
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-center">
        <h1 className="text-2xl font-semibold">Completing authentication...</h1>
        <p className="text-muted-foreground">You will be redirected shortly.</p>
      </div>
    </div>
  )
} 