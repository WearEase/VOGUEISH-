import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy JWT login is disabled. Use NextAuth credentials provider 'seller-signin'.",
    },
    { status: 410 }
  );
}