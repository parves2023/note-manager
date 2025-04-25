import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const client = await clientPromise
    const db = client.db()

    const data = await request.json()
    const id = params.id

    // Check if task belongs to user
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) })
    if (!task || task.userId !== userId) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 })
    }

    const updateData: Record<string, any> = {}

    if (data.title !== undefined) {
      updateData.title = data.title
    }

    if (data.status !== undefined) {
      updateData.status = data.status
    }

    const result = await db.collection("tasks").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updatedTask = await db.collection("tasks").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      ...updatedTask,
      _id: updatedTask?._id.toString(),
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const client = await clientPromise
    const db = client.db()

    const id = params.id

    // Check if task belongs to user
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) })
    if (!task || task.userId !== userId) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 })
    }

    const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
