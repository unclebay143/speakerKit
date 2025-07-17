import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";
import connectViaMongoose from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(transactions.map(tx => ({
      id: tx._id,
      date: tx.createdAt.toISOString().split('T')[0],
      status: tx.status === "completed" ? "Success" : "Failed",
      amount: tx.currency === "NGN" 
        ? `$${(tx.amount / 100).toFixed(2)}` 
        : `₦${(tx.amount / 100).toLocaleString()}`
    })));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}