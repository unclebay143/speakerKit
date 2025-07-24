import FeaturesSection from "../components/FeaturesSection";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import PricingPreview from "../components/PricingPreview";
import { SparklesCore } from "../components/sparkles";

export default function Home() {
  return (
    <main className='min-h-screen overflow-y-auto overflow-x-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02] relative scroll-smooth'>
      <Navbar />
      {/* Ambient background with moving particles */}
      <div className='h-full w-full absolute inset-0 z-0'>
        <SparklesCore
          id='tsparticlesfullpage'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className='w-full h-full'
          particleColor='#FFFFFF'
        />
      </div>

      <div className='relative z-10 min-h-screen overflow-x-hidden'>
        <Hero />
      </div>
      <div className='relative z-10 min-h-screen'>
        <FeaturesSection />
      </div>
      <div className='relative z-10 min-h-screen'>
        <PricingPreview />
      </div>
    </main>
  );
}
