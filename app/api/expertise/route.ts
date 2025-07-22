import connectViaMongoose from "@/lib/db";
import Expertise from "@/models/Expertise";
import { NextResponse } from "next/server";

export async function GET() {
  await connectViaMongoose();
  const expertise = await Expertise.find({ archived: false });
  return NextResponse.json(expertise);
}

export async function POST(req: Request) {
  await connectViaMongoose();
  const { label } = await req.json();
  const value = label.toLowerCase().replace(/\s+/g, "-");
  let existing = await Expertise.findOne({ value });
  if (existing) {
    return NextResponse.json(existing);
  }
  const expertise = await Expertise.create({ value, label });
  return NextResponse.json(expertise);
}
