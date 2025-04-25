import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { email, password } = await request.json()

    // Hash password for comparison
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    // Find user
    const user = await db.collection("users").findOne({ email, password: hashedPassword })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const session = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      isPremium: user.isPremium,
    }

    // Set session cookie
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
      },
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
