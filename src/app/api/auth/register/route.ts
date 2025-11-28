import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create the user
    const user = db.createUser(email, password, name);

    // Create default categories for the new user
    db.createCategory({ name: "Personal", color: "#6366f1", icon: "user", userId: user.id });
    db.createCategory({ name: "Work", color: "#f59e0b", icon: "briefcase", userId: user.id });
    db.createCategory({ name: "Ideas", color: "#10b981", icon: "lightbulb", userId: user.id });

    // Create session
    await createSessionCookie(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
