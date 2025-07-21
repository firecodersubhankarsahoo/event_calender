"use client"

import { useParams } from "next/navigation"
import { useUsers } from "@/hooks/use-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Phone, Mail, Bookmark, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useHR } from "@/lib/context/hr-context"

export default function EmployeeDetails() {
  const params = useParams()
  const { allUsers } = useUsers()
  const { state, dispatch } = useHR()

  const userId = Number.parseInt(params.id as string)
  const user = allUsers.find((u) => u.id === userId)
  const isBookmarked = state.bookmarkedUsers.includes(userId)

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Employee not found</h2>
          <p className="text-muted-foreground mt-2">The employee you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleBookmark = () => {
    dispatch({ type: "TOGGLE_BOOKMARK", payload: userId })
  }

  const handlePromote = () => {
    dispatch({ type: "PROMOTE_USER", payload: userId })
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Image
                src={user.image || "/placeholder.svg"}
                alt={`${user.firstName} ${user.lastName}`}
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4"
              />
              <CardTitle className="text-2xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-muted-foreground">{user.company.title}</p>
              <Badge className="w-fit mx-auto mt-2">{user.company.department}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-1">
                {renderStars(user.rating)}
                <span className="ml-2 font-medium">{user.rating.toFixed(1)}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{user.address.address}</div>
                    <div>
                      {user.address.city}, {user.address.state} {user.address.postalCode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant={isBookmarked ? "default" : "outline"} onClick={handleBookmark} className="flex-1">
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" onClick={handlePromote} className="flex-1 bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Promote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 6 }, (_, i) => {
                      const rating = Math.round((Math.random() * 2 + 3) * 10) / 10
                      const month = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                      return (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{month}</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">{renderStars(rating)}</div>
                            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">Project ID: {project.id}</p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.feedback.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{feedback.reviewer}</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">{renderStars(feedback.rating)}</div>
                            <span className="text-sm text-muted-foreground">{feedback.date}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
