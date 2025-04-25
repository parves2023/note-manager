"use client"

import { Droppable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TaskItem from "./task-item"
import type { Task } from "@/lib/types"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  id: string
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}

export default function TaskColumn({ title, tasks, id, onDelete, onEdit }: TaskColumnProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          {title} ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={id}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[300px]">
              {tasks.map((task, index) => (
                <TaskItem key={task._id} task={task} index={index} onDelete={onDelete} onEdit={onEdit} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
