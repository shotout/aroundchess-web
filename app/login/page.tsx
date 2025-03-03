'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Apple, ArrowLeft } from 'lucide-react'
import { toast } from "sonner"
import { useSignIn } from "@clerk/nextjs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { signIn, isLoaded } = useSignIn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!isLoaded) return

      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        toast.success("Logged in successfully!")
        router.push('/dashboard')
      } else {
        console.error("Sign in result:", result)
        toast.error("Failed to sign in")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: "/dashboard"
      });
    } catch (error) {
      console.error("OAuth error:", error)
      toast.error("Failed to sign in with Google")
    }
  }

  const handleFacebookSignUp = async () => {
    if (!isLoaded) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: "/dashboard"
      });
    } catch (error) {
      console.error("OAuth error:", error)
      toast.error("Failed to sign up with Facebook")
    }
  }

  const handleAppleSignUp = async () => {
    if (!isLoaded) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: "/dashboard"
      });
    } catch (error) {
      console.error("OAuth error:", error)
      toast.error("Failed to sign up with Apple")
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[450px] space-y-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
                className="pr-10"
              />
              <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="relative">
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                disabled={isLoading}
                required
                className="pr-10"
              />
              <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleFacebookSignUp}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 12 12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
            </svg>
            Facebook
          </Button>
          <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleAppleSignUp}>
            <Apple className="mr-2 h-4 w-4" />
            Apple
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
