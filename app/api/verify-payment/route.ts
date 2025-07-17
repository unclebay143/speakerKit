import { verifyTransaction } from "@/services/paystack";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');
  
  if (!reference) {
    return NextResponse.json({ error: "Reference required" }, { status: 400 });
  }
  
  try {
    const verification = await verifyTransaction(reference);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}