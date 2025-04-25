import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { username, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    // Create new user
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      isPremium: false,
      createdAt: new Date(),
    })

    const user = await db.collection("users").findOne({ _id: result.insertedId })

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
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
