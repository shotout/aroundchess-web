import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { AnalysisSection } from "@/components/analysis-section"
import { CTASection } from "@/components/cta-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      <AnalysisSection />
      <CTASection />
      <SiteFooter />
    </>
  )
}

