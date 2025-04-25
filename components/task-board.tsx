"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TaskColumn from "./task-column"
import { useAuth } from "@/lib/auth-context"
import type { Task } from "@/lib/types"

export default function TaskBoard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const response = await fetch("/api/tasks")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch tasks")
        }

        const data = await response.json()
        setTasks(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user])

  // Handle drag and drop
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the task that was dragged
    const task = tasks.find((t) => t._id === draggableId)
    if (!task) {
      return
    }

    // Find the task that was dragged
    // const task = tasks.find((t) => t._id === draggableId); // Fixed: Removed redeclaration
    // if (!task) return

    // Create a new array of tasks
    const newTasks = [...tasks]

    // Remove the task from its original position
    const taskIndex = newTasks.findIndex((t) => t._id === draggableId)
    newTasks.splice(taskIndex, 1)

    // Update the task's status based on the destination column
    const updatedTask = {
      ...task,
      status: destination.droppableId,
    }

    // Insert the task at its new position
    newTasks.splice(destination.index, 0, updatedTask)

    // Update the state optimistically
    setTasks(newTasks)

    // Update the task in the database
    try {
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: destination.droppableId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      // Revert to the original state if there's an error
      setTasks(tasks)
      setError(error.message)
    }
  }

  // Add a new task
  const addTask = async () => {
    if (!newTaskTitle.trim()) return

    const newTask = {
      title: newTaskTitle,
      status: "todo",
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add task")
      }

      const createdTask = await response.json()
      setTasks([...tasks, createdTask])
      setNewTaskTitle("")
      setIsAddDialogOpen(false)
      setError(null)
    } catch (error) {
      console.error("Error adding task:", error)
      setError(error.message)
    }
  }

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete task")
      }

      setTasks(tasks.filter((task) => task._id !== id))
      setError(null)
    } catch (error) {
      console.error("Error deleting task:", error)
      setError(error.message)
    }
  }

  // Edit a task
  const editTask = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to edit task")
      }

      setTasks(tasks.map((task) => (task._id === id ? { ...task, title } : task)))
      setError(null)
    } catch (error) {
      console.error("Error editing task:", error)
      setError(error.message)
    }
  }

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress")
  const completeTasks = tasks.filter((task) => task.status === "complete")

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Please log in to manage your tasks</p>
        <Button asChild>
          <a href="/login">Login</a>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading tasks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          {!user.isPremium && (
            <p className="text-sm text-muted-foreground">
              Free account: {todoTasks.length + inProgressTasks.length + completeTasks.length}/10 tasks
            </p>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Input placeholder="Task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              <Button onClick={addTask} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn title="To Do" tasks={todoTasks} id="todo" onDelete={deleteTask} onEdit={editTask} />
          <TaskColumn
            title="In Progress"
            tasks={inProgressTasks}
            id="inprogress"
            onDelete={deleteTask}
            onEdit={editTask}
          />
          <TaskColumn title="Complete" tasks={completeTasks} id="complete" onDelete={deleteTask} onEdit={editTask} />
        </div>
      </DragDropContext>
    </div>
  )
}
