
import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import { verifyTransaction } from "@/services/paystack";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const payload = await req.json();
      console.log("Webhook received:", payload);

    if (payload.event !== 'charge.success') {
      return NextResponse.json({ received: true });
    }

    const { reference, metadata } = payload.data;
    
    // Verify the transaction with Paystack
    const verification = await verifyTransaction(reference);
    
    if (!verification.status) {
      console.error('Verification failed:', verification.message);
      return NextResponse.json(
        { error: verification.message },
        { status: 400 }
      );
    }

    const { userId, plan } = metadata;
    
    // Update user's plan
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const planExpiresAt = plan === 'pro' 
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
      : null;

    user.plan = plan;
    user.planExpiresAt = planExpiresAt;
    await user.save();

    // Record transaction
    await Transaction.create({
      userId,
      amount: verification.data.amount / 100,
      currency: verification.data.currency,
      status: 'completed',
      reference,
      plan,
      metadata: verification.data
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}