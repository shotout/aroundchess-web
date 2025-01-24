import { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { default as ChessFundamentals } from '@/components/chess-fundamentals/ChessFundamentals'

export const metadata: Metadata = {
  title: 'Chess Fundamentals | aroundchess',
  description: 'Learn the basic rules, piece movements, and fundamental concepts of chess.',
}

export default function ChessFundamentalsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ChessFundamentals />
      </main>
      <SiteFooter />
    </div>
  )
}
