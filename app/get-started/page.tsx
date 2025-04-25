"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import NavBar from "@/components/nav-bar"

export default function GetStartedPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome to Task App!</CardTitle>
            <CardDescription className="text-lg mt-2">Get started with managing your tasks efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Create Tasks</h3>
                <p className="text-muted-foreground">
                  Add tasks to your board and organize them into different columns.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Drag & Drop</h3>
                <p className="text-muted-foreground">
                  Easily move tasks between To Do, In Progress, and Complete columns.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">Monitor your productivity by tracking task completion.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Upgrade to Premium</h3>
                <p className="text-muted-foreground">Get unlimited tasks and more features with a premium account.</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Send a friend request to get Premium!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send a friend request to our Facebook profile and get premium status for free!
              </p>
              <div className="flex justify-center">
                <a
                  href="https://www.facebook.com/profile.php?id=100055235052516"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  Visit Facebook Profile
                </a>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button size="lg">Start Using Task App</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
