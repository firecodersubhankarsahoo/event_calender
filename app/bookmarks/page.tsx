"use client"

import { UserCard } from "@/components/ui/user-card"
import { useUsers } from "@/hooks/use-users"
import { useHR } from "@/lib/context/hr-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Users, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"

export default function BookmarksPage() {
  const { allUsers } = useUsers()
  const { state, dispatch } = useHR()

  const bookmarkedUsers = allUsers.filter((user) => state.bookmarkedUsers.includes(user.id))

  const clearAllBookmarks = () => {
    state.bookmarkedUsers.forEach((id) => {
      dispatch({ type: "TOGGLE_BOOKMARK", payload: id })
    })
  }

  const handleBulkPromote = () => {
    bookmarkedUsers.forEach((user) => {
      dispatch({ type: "PROMOTE_USER", payload: user.id })
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarked Employees</h1>
          <p className="text-muted-foreground">Manage your saved employees and perform bulk actions</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>

      {bookmarkedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Bulk Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleBulkPromote} variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Promote All ({bookmarkedUsers.length})
              </Button>
              <Button onClick={clearAllBookmarks} variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Bookmarks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {bookmarkedUsers.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No bookmarked employees</h3>
          <p className="text-muted-foreground">Start bookmarking employees from the dashboard to see them here</p>
          <Button asChild className="mt-4">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookmarkedUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
