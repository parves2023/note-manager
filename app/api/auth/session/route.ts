import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false })
    }

    const session = JSON.parse(sessionCookie.value)

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        username: session.username,
        email: session.email,
        isPremium: session.isPremium,
      },
    })
  } catch (error) {
    console.error("Error getting session:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
