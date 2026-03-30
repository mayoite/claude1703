import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      error: "gone",
      message: "Use /api/ai-advisor instead.",
    },
    { status: 410 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: "gone",
      message: "Use /api/ai-advisor instead.",
    },
    { status: 410 },
  );
}

