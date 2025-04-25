import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const client = await clientPromise
    const db = client.db()

    const tasks = await db.collection("tasks").find({ userId }).toArray()

    // Convert MongoDB ObjectId to string for client-side use
    const formattedTasks = tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
    }))

    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId
    const isPremium = session.isPremium

    const client = await clientPromise
    const db = client.db()

    // Check task limit for non-premium users
    if (!isPremium) {
      const taskCount = await db.collection("tasks").countDocuments({ userId })
      if (taskCount >= 10) {
        return NextResponse.json(
          { error: "Task limit reached. Upgrade to premium for unlimited tasks." },
          { status: 403 },
        )
      }
    }

    const data = await request.json()

    const result = await db.collection("tasks").insertOne({
      title: data.title,
      status: data.status || "todo",
      userId,
      createdAt: new Date(),
    })

    const newTask = await db.collection("tasks").findOne({ _id: result.insertedId })

    return NextResponse.json({
      ...newTask,
      _id: newTask?._id.toString(),
    })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
