import TaskBoard from "@/components/task-board"
import NavBar from "@/components/nav-bar"

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Management App</h1>
        <TaskBoard />
      </main>
    </>
  )
}
