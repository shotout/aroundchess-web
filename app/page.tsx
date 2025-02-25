import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { AnalysisSection } from "@/components/analysis-section"
import { CTASection } from "@/components/cta-section"
import { SiteHeaderNew } from "@/components/site-header-new"
import { SiteFooterNew } from "@/components/site-footer-new"
import { BasedOnAI } from "@/components/based-on-ai"
import { ImproveSection } from "@/components/improve-section"
import { BenefitsOf } from "@/components/benefits-of"

export default function Home() {
  return (
    
    <div>
      <SiteHeaderNew />
      <HeroSection />
      <FeaturesSection />
      <AnalysisSection />
      <ImproveSection/>
      <BenefitsOf/>
      <BasedOnAI/>
      <CTASection />
      <SiteFooterNew/>
    </div>
  )
}

