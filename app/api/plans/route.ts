import { NextResponse } from "next/server";
import { fetchPlans } from "@/services/paystack";

export async function GET() {
  try {
    const response = await fetchPlans();
    
    if (!response.status) {
      return NextResponse.json(
        { error: response.message || "Failed to fetch plans" },
        { status: 400 }
      );
    }

    const plans = response.data.map((plan: any) => {
    const isPro = plan.name.toLowerCase() === "pro";
    const isLifetime = plan.name.toLowerCase() === "lifetime";

  return {
    id: plan.id,
    name: plan.name,
    price: `₦${(plan.amount / 100).toLocaleString()}`,
    period: plan.interval === "one-time" ? "" : `/${plan.interval}`,
    features: isPro
      ? [
          { label: "Unlimited Folders", value: true },
          { label: "Unlimited Profiles", value: true },
          { label: "Custom Slug", value: true },
          { label: "Advanced Analytics", value: true }
        ]
      : isLifetime
      ? [
          { label: "Lifetime Access", value: true },
          { label: "Early Access Features", value: true },
          { label: "Priority Support", value: true }
        ]
      : [
          { label: "1 Folder", value: true },
          { label: "1 Profile", value: true },
          { label: "No Slug Change", value: false },
          { label: "No Analytics", value: false }
        ],
    highlight: isPro,
    note: isLifetime ? "Limited slots available" : ""
  };
});

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


