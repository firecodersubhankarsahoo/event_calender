"use client"

import { Star, Bookmark, Eye, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useHR } from "@/lib/context/hr-context"
import Link from "next/link"
import Image from "next/image"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  company: {
    department: string
  }
  image: string
  rating: number
}

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const { state, dispatch } = useHR()
  const isBookmarked = state.bookmarkedUsers.includes(user.id)

  const handleBookmark = () => {
    dispatch({ type: "TOGGLE_BOOKMARK", payload: user.id })
  }

  const handlePromote = () => {
    dispatch({ type: "PROMOTE_USER", payload: user.id })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-200"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Image
            src={user.image || "/placeholder.svg"}
            alt={`${user.firstName} ${user.lastName}`}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{user.company.department}</Badge>
          <span className="text-sm text-muted-foreground">Age: {user.age}</span>
        </div>

        <div className="flex items-center space-x-1">
          {renderStars(user.rating)}
          <span className="ml-2 text-sm font-medium">{user.rating.toFixed(1)}</span>
        </div>

        <div className="flex space-x-2">
          <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
            <Link href={`/employee/${user.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Link>
          </Button>
          <Button size="sm" variant={isBookmarked ? "default" : "outline"} onClick={handleBookmark} className="flex-1">
            <Bookmark className={`w-4 h-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Saved" : "Bookmark"}
          </Button>
          <Button size="sm" variant="outline" onClick={handlePromote} className="flex-1 bg-transparent">
            <TrendingUp className="w-4 h-4 mr-1" />
            Promote
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
