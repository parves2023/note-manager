"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Crown } from "lucide-react"
import NavBar from "@/components/nav-bar"

export default function ProfilePage() {
  const { user, isLoading, logout, upgradeToPremium, error } = useAuth()
  const [facebookId, setFacebookId] = useState("")
  const [friendRequestStatus, setFriendRequestStatus] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const handleFriendRequest = async () => {
    // Check if the ID matches our target Facebook ID
    if (facebookId === "100055235052516") {
      await upgradeToPremium()
      setFriendRequestStatus("Friend request sent! You've been upgraded to Premium!")
    } else {
      setFriendRequestStatus("Please enter a valid Facebook ID")
    }
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium">Username</p>
              <p className="text-lg">{user?.username}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Account Type</p>
              <div className="flex items-center gap-2">
                <p className="text-lg">{user?.isPremium ? "Premium" : "Free"}</p>
                {user?.isPremium && <Crown className="h-5 w-5 text-yellow-500" />}
              </div>
            </div>

            {!user?.isPremium && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Get Premium with Friend Request</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send a friend request to our Facebook profile and enter the ID below:
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Facebook ID (100055235052516)"
                    value={facebookId}
                    onChange={(e) => setFacebookId(e.target.value)}
                  />
                  <Button onClick={handleFriendRequest}>Submit</Button>
                </div>
                {friendRequestStatus && <p className="text-sm mt-2 text-green-600">{friendRequestStatus}</p>}
                <div className="mt-4 text-center">
                  <a
                    href="https://www.facebook.com/profile.php?id=100055235052516"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Facebook Profile
                  </a>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!user?.isPremium && (
              <Button onClick={upgradeToPremium} className="w-full bg-yellow-500 hover:bg-yellow-600">
                <Crown className="mr-2 h-4 w-4" /> Upgrade to Premium
              </Button>
            )}
            <Button onClick={logout} variant="outline" className="w-full">
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
