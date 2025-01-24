import { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import OpeningPrinciples from '@/components/opening-principles/OpeningPrinciples'

export const metadata: Metadata = {
  title: 'Chess Opening Principles | aroundchess',
  description: 'Master the fundamentals of chess openings, explore popular opening families, and learn strategies for a strong start to your game.',
}

export default function OpeningPrinciplesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <OpeningPrinciples />
      </main>
      <SiteFooter />
    </div>
  )
}
