"use client"

import * as React from "react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CalendarCustomDays() {
  const year = new Date().getFullYear()

  const subjects = [
    { name: "Mathematics", date: new Date(year, 1, 3), color: "bg-red-100 text-red-700" },
    { name: "Physics", date: new Date(year, 1, 8), color: "bg-blue-100 text-blue-700" },
    { name: "Chemistry", date: new Date(year, 1, 12), color: "bg-green-100 text-green-700" },
    { name: "Biology", date: new Date(year, 1, 18), color: "bg-purple-100 text-purple-700" },
    { name: "Computer Science", date: new Date(year, 1, 22), color: "bg-orange-100 text-orange-700" },
  ]

  return (
    <TooltipProvider>
        <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            defaultMonth={new Date(year, 1, 1)} // February
            captionLayout="dropdown"
            className="[--cell-size:--spacing(44)]"
            components={{
              DayButton: ({ children, modifiers, day, ...props }) => {
                const subject = subjects.find(
                  (s) =>
                    s.date.toDateString() === day.date.toDateString()
                )

                const content = (
                  <CalendarDayButton
                    day={day}
                    modifiers={modifiers}
                    {...props}
                    className={`flex flex-col items-center justify-start pt-1 transition ${
                      subject ? subject.color : ""
                    }`}
                  >
                    {/* Date Number */}
                    <span className="text-sm font-semibold">
                      {children}
                    </span>

                    {/* Subject Name */}
                    {subject && !modifiers.outside && (
                      <span className="mt-1 text-[10px] truncate w-full text-center px-1">
                        {subject.name}
                      </span>
                    )}
                  </CalendarDayButton>
                )

                if (subject) {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {content}
                      </TooltipTrigger>
                      <TooltipContent>
                        {subject.name}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return content
              },
            }}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default function CalendarPage() {
  return <CalendarCustomDays />
}