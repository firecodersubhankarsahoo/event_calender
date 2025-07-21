"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useHR } from "@/lib/context/hr-context"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]
const ratings = [1, 2, 3, 4, 5]

export function SearchFilters() {
  const { state, dispatch } = useHR()

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: value })
  }

  const handleDepartmentFilter = (department: string, checked: boolean) => {
    const newFilter = checked
      ? [...state.departmentFilter, department]
      : state.departmentFilter.filter((d) => d !== department)
    dispatch({ type: "SET_DEPARTMENT_FILTER", payload: newFilter })
  }

  const handleRatingFilter = (rating: number, checked: boolean) => {
    const newFilter = checked ? [...state.ratingFilter, rating] : state.ratingFilter.filter((r) => r !== rating)
    dispatch({ type: "SET_RATING_FILTER", payload: newFilter })
  }

  const clearFilters = () => {
    dispatch({ type: "SET_DEPARTMENT_FILTER", payload: [] })
    dispatch({ type: "SET_RATING_FILTER", payload: [] })
    dispatch({ type: "SET_SEARCH_TERM", payload: "" })
  }

  const hasActiveFilters = state.departmentFilter.length > 0 || state.ratingFilter.length > 0 || state.searchTerm

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, email, or department..."
            value={state.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Department
                {state.departmentFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {state.departmentFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {departments.map((department) => (
                <DropdownMenuCheckboxItem
                  key={department}
                  checked={state.departmentFilter.includes(department)}
                  onCheckedChange={(checked) => handleDepartmentFilter(department, checked)}
                >
                  {department}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Rating
                {state.ratingFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {state.ratingFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ratings.map((rating) => (
                <DropdownMenuCheckboxItem
                  key={rating}
                  checked={state.ratingFilter.includes(rating)}
                  onCheckedChange={(checked) => handleRatingFilter(rating, checked)}
                >
                  {rating} Star{rating !== 1 ? "s" : ""}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {state.departmentFilter.map((dept) => (
            <Badge
              key={dept}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleDepartmentFilter(dept, false)}
            >
              {dept} ×
            </Badge>
          ))}
          {state.ratingFilter.map((rating) => (
            <Badge
              key={rating}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRatingFilter(rating, false)}
            >
              {rating} Star{rating !== 1 ? "s" : ""} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
