"use client"

import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task } from "@/lib/types"

interface TaskItemProps {
  task: Task
  index: number
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}

export default function TaskItem({ task, index, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task._id, editedTitle)
    }
    setIsEditing(!isEditing)
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 mr-2"
                    autoFocus
                  />
                ) : (
                  <p className="flex-1">{task.title}</p>
                )}
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(task._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
