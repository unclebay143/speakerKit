import connectViaMongoose from "@/lib/db";
import Topic from "@/models/Topic";
import { NextResponse } from "next/server";

export async function GET() {
  await connectViaMongoose();
  const topics = await Topic.find({ archived: false });
  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  await connectViaMongoose();
  const { label } = await req.json();
  const value = label.toLowerCase().replace(/\s+/g, "-");
  let existing = await Topic.findOne({ value });
  if (existing) {
    return NextResponse.json(existing);
  }
  const topic = await Topic.create({ value, label });
  return NextResponse.json(topic);
}
