"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
  }
  company: {
    department: string
    name: string
    title: string
  }
  image: string
  rating: number
  bio: string
  projects: Array<{
    id: string
    name: string
    status: "completed" | "in-progress" | "pending"
  }>
  feedback: Array<{
    id: string
    reviewer: string
    comment: string
    date: string
    rating: number
  }>
}

interface HRState {
  users: User[]
  bookmarkedUsers: number[]
  loading: boolean
  error: string | null
  searchTerm: string
  departmentFilter: string[]
  ratingFilter: number[]
}

type HRAction =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "TOGGLE_BOOKMARK"; payload: number }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_DEPARTMENT_FILTER"; payload: string[] }
  | { type: "SET_RATING_FILTER"; payload: number[] }
  | { type: "PROMOTE_USER"; payload: number }

const initialState: HRState = {
  users: [],
  bookmarkedUsers: [],
  loading: false,
  error: null,
  searchTerm: "",
  departmentFilter: [],
  ratingFilter: [],
}

function hrReducer(state: HRState, action: HRAction): HRState {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload, loading: false }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "TOGGLE_BOOKMARK":
      const isBookmarked = state.bookmarkedUsers.includes(action.payload)
      return {
        ...state,
        bookmarkedUsers: isBookmarked
          ? state.bookmarkedUsers.filter((id) => id !== action.payload)
          : [...state.bookmarkedUsers, action.payload],
      }
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload }
    case "SET_DEPARTMENT_FILTER":
      return { ...state, departmentFilter: action.payload }
    case "SET_RATING_FILTER":
      return { ...state, ratingFilter: action.payload }
    case "PROMOTE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload ? { ...user, rating: Math.min(5, user.rating + 0.5) } : user,
        ),
      }
    default:
      return state
  }
}

const HRContext = createContext<{
  state: HRState
  dispatch: React.Dispatch<HRAction>
} | null>(null)

export function HRProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(hrReducer, initialState)

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("hr-bookmarks")
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks)
      bookmarks.forEach((id: number) => {
        dispatch({ type: "TOGGLE_BOOKMARK", payload: id })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("hr-bookmarks", JSON.stringify(state.bookmarkedUsers))
  }, [state.bookmarkedUsers])

  return <HRContext.Provider value={{ state, dispatch }}>{children}</HRContext.Provider>
}

export function useHR() {
  const context = useContext(HRContext)
  if (!context) {
    throw new Error("useHR must be used within HRProvider")
  }
  return context
}
