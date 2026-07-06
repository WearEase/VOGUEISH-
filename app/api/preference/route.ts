import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { extractPreferences } from "@/lib/preference/parser";
import { updateUserPromptsAndPreferences } from "@/lib/preference/repo";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const pref = extractPreferences(text);
    
    // @ts-expect-error Session user type does not include id or _id by default in next-auth
    const userId = session.user.id || session.user._id;
    if (userId) {
      await updateUserPromptsAndPreferences(userId, text, pref);
    }

    return NextResponse.json({ success: true, pref });
  } catch (error) {
    console.error("Preference Error:", error);
    return NextResponse.json({ error: "Failed to process preferences" }, { status: 500 });
  }
}
