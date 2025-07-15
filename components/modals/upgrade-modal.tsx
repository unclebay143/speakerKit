"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { plans } from "@/app/pricing/page";
import { Check } from "lucide-react";
import Link from "next/link";
import { SparklesCore } from "@/components/sparkles";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType?: "profile" | "folder" | "images";
  currentCount?: number;
  limit?: number;
}

export function UpgradeModal({
  open,
  onOpenChange,
  limitType,
  currentCount,
  limit,
}: UpgradeModalProps) {
  const proPlan = plans.find((plan) => plan.name === "Pro");
  const lifetimePlan = plans.find((plan) => plan.name === "Lifetime");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black/[0.98] border-0 p-0 overflow-hidden">
        {/* Sparkles background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SparklesCore
            id="tsparticles-upgrade-modal"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={80}
            className="w-full h-full"
            particleColor="#A78BFA"
          />
        </div>

        <div className="relative z-10 p-8">
          <DialogHeader className="mb-8 text-center">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Upgrade Your Plan
            </DialogTitle>
            {limitType && (
              <p className="text-gray-400 mt-2">
                Your free plan is limited to {limit} {limitType}. 
                You currently have {currentCount}/{limit}.
              </p>
            )}
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {proPlan && (
              <div className={`rounded-xl p-8 relative overflow-hidden ${
                proPlan.highlight 
                  ? "border-2 border-purple-500 bg-gradient-to-b from-purple-900/20 to-purple-900/10" 
                  : "border border-white/10 bg-gray-900/50"
              }`}>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">{proPlan.name}</h3>
                <div className="flex justify-center items-end mb-6">
                    <span className="text-4xl font-bold text-white">{proPlan.price}</span>
                    <span className="text-gray-400 ml-2">{proPlan.period}</span>
                </div>

               <ul className="space-y-3 mb-8">
                    {proPlan.features.map((feature) => (
                        <li
                        key={feature.label}
                        className="flex items-center justify-between text-gray-300 text-sm border-b border-white/10 py-2"
                        >
                        <div className="flex items-center">
                            <Check className="w-4 h-4 text-purple-400 mr-2" />
                            <span>{feature.label}</span>
                        </div>
                        <span className="text-white font-medium">
                            {feature.value === true ? "✓" : feature.value === false ? "✕" : feature.value}
                        </span>
                        </li>
                    ))}
                </ul>

                <Link href="/pricing" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            )}

            {lifetimePlan && (
              <div className="rounded-xl p-8  bg-gray-900/50 relative overflow-hidden">
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">{lifetimePlan.name}</h3>
                <div className="flex justify-center items-end mb-6">
                  <span className="text-4xl font-bold text-white">{lifetimePlan.price}</span>
                  <span className="text-gray-400 ml-2">{lifetimePlan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {lifetimePlan.features.map((feature) => (
                    <li
                        key={feature.label}
                        className="flex items-center justify-between text-gray-300 text-sm border-b border-white/10 py-2"
                        >
                        <div className="flex items-center">
                            <Check className="w-4 h-4 text-purple-400 mr-2" />
                            <span>{feature.label}</span>
                        </div>
                        <span className="text-white font-medium">
                            {feature.value === true ? "✓" : feature.value === false ? "✕" : feature.value}
                        </span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="w-full">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white  h-12 text-lg">
                    Go Lifetime
                  </Button>
                </Link>
              </div>
            )}
          </div>

          
        </div>
      </DialogContent>
    </Dialog>
  );
}