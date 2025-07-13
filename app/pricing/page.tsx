"use client";

import Navbar from "../../components/navbar";
import PricingGroup from "../../components/PricingGroup";
import { SparklesCore } from "../../components/sparkles";

export const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "",
    features: [
      { label: "Profiles", value: "1" },
      { label: "Photos", value: "1" },
      { label: "Custom URLs", value: false },
      { label: "Analytics", value: false },
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₦4,000",
    period: "/mo",
    features: [
      { label: "Profiles", value: "Unlimited" },
      { label: "Photos", value: "Multiple" },
      { label: "Custom URLs", value: true },
      { label: "Analytics", value: true },
    ],
    highlight: true,
  },
  {
    name: "Lifetime",
    price: "₦100,000",
    period: "once",
    features: [
      { label: "Profiles", value: "Unlimited" },
      { label: "Photos", value: "Multiple" },
      { label: "Custom URLs", value: true },
      { label: "Analytics", value: true },
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className='min-h-screen bg-black/[0.98] bg-grid-white/[0.02] py-20 relative overflow-hidden'>
      <Navbar />
      <div className='h-full w-full absolute inset-0 z-0'>
        <SparklesCore
          id='tsparticles-pricing'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className='w-full h-full'
          particleColor='#A78BFA'
        />
      </div>
      <div className='relative z-10 pt-20'>
        <PricingGroup
          title='Simple, Transparent Pricing'
          subtitle='Choose the plan that works best for you.'
          plans={plans}
          ctaLink='/signup'
          ctaText='Start Your Free Profile'
        />
      </div>
    </div>
  );
}
