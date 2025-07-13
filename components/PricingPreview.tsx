"use client";

import { plans } from "@/app/pricing/page";
import PricingGroup from "./PricingGroup";
import { SparklesCore } from "./sparkles";

export default function PricingPreview() {
  return (
    <section className='py-20 bg-black/[0.98] bg-grid-white/[0.02] relative min-h-screen'>
      <div className='absolute inset-0 w-full h-full z-0'>
        <SparklesCore
          id='tsparticles-features'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className='w-full h-full'
          particleColor='#A78BFA'
        />
      </div>
      <div className='relative z-10'>
        <PricingGroup
          title='Simple, Transparent Pricing'
          subtitle="Start for free. Upgrade when you're ready to unlock more."
          plans={plans}
          ctaLink='/pricing'
          ctaText='See Full Pricing & Features'
        />
      </div>
    </section>
  );
}
