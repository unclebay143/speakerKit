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
      { label: "Gallery", value: "1" },
      { label: "Talk Showcase", value: "2" },
      { label: "Custom Slug", value: false },
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₦48,000",
    billing: "yearly",
    period: "/yr",
    note: "Equivalent to ₦4,000/month",
    features: [
      { label: "Profiles", value: "Unlimited" },
      { label: "Gallery", value: "Multiple" },
      { label: "Talk Showcase", value: "Unlimited" },
      { label: "Custom Slug", value: true },
    ],
    highlight: true,
  },
  // {
  //   name: "Lifetime",
  //   price: "₦100,000",
  //   period: "once",
  //   note: "Limited Slots (20 only)",
  //   features: [
  //     { label: "Profiles", value: "Unlimited" },
  //     { label: "Photos", value: "Multiple" },
  //     { label: "Talks", value: "Unlimited" },
  //     { label: "Custom URLs", value: true },
  //   ],
  //   highlight: false,
  // },
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
