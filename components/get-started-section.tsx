import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GetStartedSection() {
  return (
    <section className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[980px] text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Get started today
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join millions of members and play more than 50 million games per day on our website and mobile apps!
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <Image
            src="/placeholder.svg?height=200&width=400"
            alt="Unlimited games illustration"
            width={400}
            height={200}
            className="rounded-lg mb-4"
          />
          <h3 className="text-xl font-bold mb-2">Unlimited games</h3>
          <p className="text-muted-foreground">Play as many games as you want, whenever you want!</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Image
            src="/placeholder.svg?height=200&width=400"
            alt="Play anywhere illustration"
            width={400}
            height={200}
            className="rounded-lg mb-4"
          />
          <h3 className="text-xl font-bold mb-2">Play anywhere</h3>
          <p className="text-muted-foreground">Enjoy the same great experience across all your devices.</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Image
            src="/placeholder.svg?height=200&width=400"
            alt="Awesome experience illustration"
            width={400}
            height={200}
            className="rounded-lg mb-4"
          />
          <h3 className="text-xl font-bold mb-2">Awesome experience</h3>
          <p className="text-muted-foreground">Experience stunning visuals, easy-to-use features, and more!</p>
        </div>
      </div>
      <div className="mt-12 text-center">
        <Button asChild size="lg" className="px-8">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </section>
  )
}

