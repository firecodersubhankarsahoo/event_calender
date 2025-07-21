"use client"

import { useEffect } from "react"
import { useHR } from "@/lib/context/hr-context"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]

function generateMockData(user: any) {
  return {
    ...user,
    company: {
      ...user.company,
      department: departments[Math.floor(Math.random() * departments.length)],
    },
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
    bio: `Experienced professional with ${Math.floor(Math.random() * 10 + 2)} years in ${user.company?.department || "Technology"}. Passionate about innovation and team collaboration.`,
    projects: Array.from({ length: Math.floor(Math.random() * 5 + 1) }, (_, i) => ({
      id: `proj-${user.id}-${i}`,
      name: `Project ${String.fromCharCode(65 + i)}`,
      status: ["completed", "in-progress", "pending"][Math.floor(Math.random() * 3)] as
        | "completed"
        | "in-progress"
        | "pending",
    })),
    feedback: Array.from({ length: Math.floor(Math.random() * 3 + 1) }, (_, i) => ({
      id: `feedback-${user.id}-${i}`,
      reviewer: `Manager ${i + 1}`,
      comment: `Great work on recent projects. Shows excellent ${["leadership", "technical skills", "communication"][i % 3]}.`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      rating: Math.floor(Math.random() * 2 + 4),
    })),
  }
}

export function useUsers() {
  const { state, dispatch } = useHR()

  useEffect(() => {
    async function fetchUsers() {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const response = await fetch("https://dummyjson.com/users?limit=20")
        const data = await response.json()
        const enhancedUsers = data.users.map(generateMockData)
        dispatch({ type: "SET_USERS", payload: enhancedUsers })
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch users" })
      }
    }

    if (state.users.length === 0) {
      fetchUsers()
    }
  }, [state.users.length, dispatch])

  const filteredUsers = state.users.filter((user) => {
    const matchesSearch =
      state.searchTerm === "" ||
      user.firstName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      user.company.department.toLowerCase().includes(state.searchTerm.toLowerCase())

    const matchesDepartment =
      state.departmentFilter.length === 0 || state.departmentFilter.includes(user.company.department)

    const matchesRating =
      state.ratingFilter.length === 0 || state.ratingFilter.some((rating) => Math.floor(user.rating) === rating)

    return matchesSearch && matchesDepartment && matchesRating
  })

  return {
    users: filteredUsers,
    loading: state.loading,
    error: state.error,
    allUsers: state.users,
  }
}
