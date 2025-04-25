import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"

export async function POST() {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const client = await clientPromise
    const db = client.db()

    // Update user to premium
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { isPremium: true } })

    // Update session
    const updatedSession = {
      ...session,
      isPremium: true,
    }

    // Set updated session cookie
    cookies().set("session", JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ success: true, isPremium: true })
  } catch (error) {
    console.error("Error upgrading to premium:", error)
    return NextResponse.json({ error: "Failed to upgrade to premium" }, { status: 500 })
  }
}
