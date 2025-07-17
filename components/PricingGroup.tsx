import { Check, CircleAlert, X as XIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Plan {
  name: string;
  price: string;
  period?: string;
  features: { label: string; value: string | boolean }[];
  highlight?: boolean;
  note?: string;
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
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
  const checkPaymentStatus = async () => {
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      const { plan, userId, timestamp } = JSON.parse(pendingPayment);
      if (Date.now() - timestamp < 30 * 60 * 1000) { // 30 minutes
        try {
          const res = await fetch(`/api/verify-payment?reference=${reference}`);
          if (res.ok) {
            localStorage.removeItem('pendingPayment');
            router.refresh(); // Refresh to show updated plan
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
        }
      }
    }
  };
  
  checkPaymentStatus();
}, []);

  const handlePayment = async (plan: string) => {
    if (!session) {
      router.push("/signup");
      return;
    }

    setLoadingPlan(plan);
    setError("");

    try {
       console.log("Initiating payment for:", plan);
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": document.cookie,
        },
        credentials: "include",
        body: JSON.stringify({ plan: plan.toLowerCase() }),
      });

      console.log("Payment API response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Payment error:", errorData);
        throw new Error(errorData.error || "Payment failed");
      }

      const data = await response.json();
       console.log("Payment data:", data);

      if (response.ok && data.data?.authorization_url) {
        localStorage.setItem('pendingPayment', JSON.stringify({
          plan,
          userId: session.user.id,
          timestamp: Date.now()
        }));
        window.location.href = data.data.authorization_url;
      } else {
        setError(data.error || "Payment initialization failed");
      }
    } catch (err) {
      setError("An error occurred while processing your request");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className='container mx-auto px-6'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2'>
          {title}
        </h2>
        <p className='text-gray-400 text-lg max-w-2xl mx-auto'>{subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-800/30 text-red-100 px-4 py-3 rounded-lg max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CircleAlert className="h-5 w-5 mr-2 text-red-400" />
              <span>{error}</span>
            </div>
            {/* <button
              onClick={() => handlePayment(loadingPlan!)}
              className="ml-4 px-3 py-1 bg-red-800/50 hover:bg-red-700/70 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button> */}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border border-white/[0.08] bg-black/80 p-8 flex flex-col items-center ${
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

            {plan.highlight && (
              <div className='absolute top-[-1rem] left-1/2 -translate-x-1/2 text-sm bg-purple-600 text-white px-2 py-1 rounded-full'>
                Best Value
              </div>
            )}

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

            <button
              onClick={() => handlePayment(plan.name)}
              disabled={loadingPlan === plan.name}
              className={`w-full py-2 rounded-lg font-semibold text-center transition-colors duration-200 ${
                plan.highlight
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              } ${
                loadingPlan === plan.name ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingPlan === plan.name ? (
                "Processing..."
              ) : plan.name === "Free" ? (
                "Get Started"
              ) : plan.name === "Pro" ? (
                "Upgrade to Pro"
              ) : (
                "Go Lifetime"
              )}
            </button>

            {plan.note && (
              <div className='absolute bottom-2 mx-auto left-0 right-0 text-xs text-white purple-500 font-medium text-center'>
                {plan.note}
              </div>
            )}
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