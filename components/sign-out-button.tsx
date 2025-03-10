'use client'

import { useClerk } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const { signOut } = useClerk()
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => signOut(() => router.push('/'))}
    >
      Sign Out
    </Button>
  )
} 