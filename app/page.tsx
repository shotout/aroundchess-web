import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { AnalysisSection } from "@/components/analysis-section"
import { CTASection } from "@/components/cta-section"
import { SiteHeaderNew } from "@/components/site-header-new"
import { SiteFooterNew } from "@/components/site-footer-new"

export default function Home() {
  return (
    <>
      <SiteHeaderNew />
      <HeroSection />
      <FeaturesSection />
      <AnalysisSection />
      <CTASection />
      <SiteFooterNew/>
    </>
  )
}

