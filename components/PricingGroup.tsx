import { Check, X as XIcon } from "lucide-react";
import Link from "next/link";

interface Plan {
  name: string;
  price: string;
  period?: string;
  features: { label: string; value: string | boolean }[];
  highlight?: boolean;
}

interface PricingGroupProps {
  title: string;
  subtitle: string;
  plans: Plan[];
  ctaLink?: string;
  ctaText?: string;
}

export default function PricingGroup({
  title,
  subtitle,
  plans,
  ctaLink,
  ctaText,
}: PricingGroupProps) {
  console.log(plans);
  return (
    <div className='container mx-auto px-6'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2'>
          {title}
        </h2>
        <p className='text-gray-400 text-lg max-w-2xl mx-auto'>{subtitle}</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border border-white/[0.08] bg-black/80 p-8 flex flex-col items-center ${
              plan.highlight ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <h3 className='text-xl font-semibold text-white mb-2'>
              {plan.name}
            </h3>
            <div className='flex items-end mb-6'>
              <span className='text-3xl font-bold text-white'>
                {plan.price}
              </span>
              {plan.period && (
                <span className='text-gray-400 ml-1'>{plan.period}</span>
              )}
            </div>
            <ul className='mb-6 w-full'>
              {plan.features.map((f) => (
                <li
                  key={f.label}
                  className='flex justify-between text-gray-300 py-1 border-b border-white/[0.05] last:border-b-0 items-center'
                >
                  <span>{f.label}</span>
                  <span className='font-semibold flex items-center'>
                    {f.value === true && (
                      <Check className='w-5 h-5 text-green-400' />
                    )}
                    {f.value === false && (
                      <XIcon className='w-5 h-5 text-red-400' />
                    )}
                    {typeof f.value === "string" && f.value}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.name === "Free" ? "/signup" : "/pricing"}
              className={`w-full py-2 rounded-lg font-semibold text-center transition-colors duration-200 ${
                plan.highlight
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {plan.name === "Free"
                ? "Get Started"
                : plan.name === "Pro"
                ? "Upgrade to Pro"
                : "Go Lifetime"}
            </Link>
          </div>
        ))}
      </div>
      {ctaLink && ctaText && (
        <div className='text-center mt-10'>
          <Link
            href={ctaLink}
            className='inline-block text-purple-400 hover:underline text-lg font-medium'
          >
            {ctaText}
          </Link>
        </div>
      )}
    </div>
  );
}
