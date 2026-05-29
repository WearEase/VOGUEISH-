import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy JWT login is disabled. Use NextAuth credentials provider 'buyer-signin'.",
    },
    { status: 410 }
  );
}