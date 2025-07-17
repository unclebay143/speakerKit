import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import { initializePayment } from "@/services/paystack";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || !["pro", "lifetime"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    if (plan === "lifetime") {
      const lifetimeCount = await User.countDocuments({ plan: "lifetime" });
      if (lifetimeCount >= 20) {
        return NextResponse.json(
          { error: "All lifetime slots have been taken" },
          { status: 400 }
        );
      }
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Define payment parameters
    const amount = plan === "pro" ? 480000 : 100000; 
    const metadata = {
      userId: user._id.toString(),
      plan,
      userEmail: user.email
    };

    // Initialize payment
    const paymentData = await initializePayment(
      user.email,
      amount,
      metadata,
      plan === "pro" ? process.env.PAYSTACK_PRO_PLAN_CODE : undefined
    );

    if (!paymentData.status) {
      return NextResponse.json(
        { error: paymentData.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

