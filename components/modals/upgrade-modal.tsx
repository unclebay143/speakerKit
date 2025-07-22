"use client";

import { plans } from "@/app/pricing/page";
import { SparklesCore } from "@/components/sparkles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, XIcon } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType?: "profile" | "folder" | "images" | "theme";
  currentCount?: number;
  limit?: number;
  isPro?: boolean;
}

export function UpgradeModal({
  open,
  onOpenChange,
  limitType,
  currentCount,
  limit,
  isPro,
}: UpgradeModalProps) {
  const proPlan = plans.find((plan) => plan.name === "Pro");
  const lifetimePlan = plans.find((plan) => plan.name === "Lifetime");

  const limitTypeText: Record<string, string> = {
    customUrl: "Upgrade to Pro to unlock custom profile URL",
    folder: "Upgrade to Pro to unlock unlimited folders",
    images: "Upgrade to Pro to unlock unlimited images",
    profile: "Upgrade to Pro to unlock custom profile URL",
    theme: "Upgrade to Pro to unlock custom theme",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl bg-white/90 dark:bg-black/[0.98] border-0 p-0 overflow-hidden max-h-[90vh] overflow-y-auto md:overflow-y-hidden'>
        {/* Sparkles background */}
        <div className='absolute inset-0 w-full h-full z-0'>
          <SparklesCore
            id='tsparticles-upgrade-modal'
            background='transparent'
            minSize={0.6}
            maxSize={1.4}
            particleDensity={80}
            className='w-full h-full'
            particleColor='#A78BFA'
          />
        </div>

        <div className='relative z-20 p-4 sm:p-6 md:p-8'>
          <DialogHeader className='mb-6 md:mb-8 text-center'>
            <div className='flex justify-center items-center mb-2'>
              <DialogTitle className='text-2xl sm:text-3xl md:text-4xl text-center font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent'>
                Upgrade Your Plan
              </DialogTitle>
            </div>
            {/* {limitType ? (
              <p className='text-sm sm:text-base text-gray-600 text-center dark:text-gray-400 mt-2 px-2'>
                {limitTypeText[limitType] ||
                  "Upgrade to Pro to unlock this feature"}
              </p>
            ) : ( */}
            <p className='text-sm sm:text-base text-gray-600 text-center dark:text-gray-400 mt-2 px-2'>
              Upgrade to Pro to unlock this feature
            </p>
            {/* )} */}
          </DialogHeader>

          <div className='grid grid-cols-1 lg:grid-cols-1 mx-auto max-w-sm justify-center items-center gap-6 md:gap-8'>
            {proPlan && (
              <div
                className={`rounded-xl p-8 sm:p-6 md:p-8 relative ${
                  proPlan.highlight
                    ? "border-2 border-purple-500 bg-gradient-to-b from-purple-100/40 to-purple-200/10 dark:from-purple-900/20 dark:to-purple-900/10"
                    : "border border-black/10 dark:border-white/10 bg-gray-100/50 dark:bg-gray-900/50"
                }`}
              >
                <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 text-center'>
                  {proPlan.name}
                  {proPlan.name === "Lifetime" && (
                    <span className='text-xs text-purple-500 font-medium text-center block mt-1'>
                      (Early Supporters)
                    </span>
                  )}
                </h3>
                <div className='flex justify-center items-end mb-4 md:mb-6'>
                  <span className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
                    {proPlan.price}
                  </span>
                  <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-2'>
                    {proPlan.period}
                  </span>
                </div>

                {proPlan.highlight && (
                  <div className='z-10 absolute top-[-0.5rem] sm:top-[-1rem] left-1/2 -translate-x-1/2 text-xs sm:text-sm bg-purple-600 text-white px-2 py-1 rounded-full'>
                    Best Value
                  </div>
                )}

                <ul className='space-y-2 sm:space-y-3 mb-6 md:mb-8'>
                  {proPlan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className='flex items-center text-sm sm:text-base md:text-lg justify-between text-gray-700 dark:text-gray-300 py-1'
                    >
                      <div className='flex items-center flex-1 min-w-0'>
                        <span className='truncate'>{feature.label}</span>
                      </div>
                      <span className='font-semibold flex items-center ml-2 flex-shrink-0'>
                        {feature.value === true && (
                          <Check className='w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400' />
                        )}
                        {feature.value === false && (
                          <XIcon className='w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400' />
                        )}
                        {typeof feature.value === "string" && (
                          <span className='text-xs sm:text-lg'>
                            {feature.value}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href='/pricing' className='w-full'>
                  <Button className='w-full bg-purple-600 hover:bg-purple-700 h-10 sm:h-12 text-sm sm:text-base md:text-lg text-white'>
                    Upgrade to Pro
                  </Button>
                </Link>

                {proPlan.note && (
                  <div className='absolute bottom-2 mx-auto left-0 right-0 text-xs text-purple-500 font-medium text-center px-2'>
                    {proPlan.note}
                  </div>
                )}
              </div>
            )}

            {lifetimePlan && (
              <div className='rounded-xl p-8 sm:p-6 md:p-8 relative overflow-hidden border border-gray-200 dark:border-white/[0.08] bg-gray-100 shadow-md dark:bg-black/80'>
                <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 text-center'>
                  {lifetimePlan.name}
                </h3>
                <div className='flex justify-center items-end mb-4 md:mb-6'>
                  <span className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
                    {lifetimePlan.price}
                  </span>
                  <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-2'>
                    {lifetimePlan.period}
                  </span>
                </div>
                <ul className='space-y-2 sm:space-y-3 mb-6 md:mb-8'>
                  {lifetimePlan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className='flex items-center justify-between text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 py-1'
                    >
                      <div className='flex items-center flex-1 min-w-0'>
                        <span className='truncate'>{feature.label}</span>
                      </div>
                      <span className='font-semibold flex items-center ml-2 flex-shrink-0'>
                        {feature.value === true && (
                          <Check className='w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400' />
                        )}
                        {feature.value === false && (
                          <XIcon className='w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400' />
                        )}
                        {typeof feature.value === "string" && (
                          <span className='text-xs sm:text-lg'>
                            {feature.value}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href='/pricing' className='w-full'>
                  <Button className='w-full bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white h-10 sm:h-12 text-sm sm:text-base md:text-lg'>
                    Go Lifetime
                  </Button>
                </Link>

                {lifetimePlan.note && (
                  <div className='absolute bottom-2 mx-auto left-0 right-0 text-xs text-gray-500 font-medium text-center px-2'>
                    {lifetimePlan.note}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
