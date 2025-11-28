import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
