"use client"

import React, { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import EventList from "./EventList"
import EventForm from "./Eventform"

// Import the new EventList component

const getDayOfWeek = (dateString: string): string => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const date = new Date(dateString)
  const dayIndex = date.getDay()
  return daysOfWeek[dayIndex]
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  description: string
}

interface CalendarProps {
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

const currentDate = new Date()
let sameDay = `${currentDate.getFullYear()}-${String(
  currentDate.getMonth() + 1
).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`

const Calendar: React.FC<CalendarProps> = ({ events, setEvents }) => {
  const { data } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [eventToEdit, setEventToEdit] = useState<{
    title: string
    time: string
    description: string
  } | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)

  const handleShowMore = () => {
    setShowAllEvents(true)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const handleCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const handleSubmit = async (formData: {
    title: string
    time: string
    description: string
  }) => {
    if (selectedDate) {
      if (editingEventId) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editingEventId ? { ...event, ...formData } : event
          )
        )
        setEditingEventId(null)
      } else {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            date: selectedDate,
            time: formData.time,
            description: formData.description,
          }),
        })
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: Math.random(),
            title: formData.title,
            date: selectedDate,
            time: formData.time,
            description: formData.description,
          },
        ])
      }
      setSelectedDate(null)
      setEventToEdit(null)
    }
  }

  const generateCalendar = () => {
    const calendarDays = []

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay()
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate()
    const previousMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate()

    const nextMonthYear =
      currentDate.getMonth() === 11
        ? currentDate.getFullYear() + 1
        : currentDate.getFullYear()
    const nextMonth = (currentDate.getMonth() + 1) % 12
    const prevMonthYear =
      currentDate.getMonth() === 0
        ? currentDate.getFullYear() - 1
        : currentDate.getFullYear()
    const prevMonth = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth()

    const totalDays = [
      ...Array(firstDayOfMonth)
        .fill(null)
        .map((_, i) => ({
          day: previousMonthDays - (firstDayOfMonth - 1) + i,
          type: "prev",
          year: prevMonthYear,
          month: prevMonth,
        })),
      ...Array(daysInMonth)
        .fill(null)
        .map((_, i) => ({
          day: i + 1,
          type: "current",
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        })),
      ...Array(
        (firstDayOfMonth + daysInMonth) % 7 !== 0
          ? 7 - ((firstDayOfMonth + daysInMonth) % 7)
          : 0
      )
        .fill(null)
        .map((_, i) => ({
          day: i + 1,
          type: "next",
          year: nextMonthYear,
          month: nextMonth + 1,
        })),
    ]

    return totalDays.map(({ day, type, year, month }, index) => {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`
      const dayEvents = events.filter((event) => event.date === date)

      return (
        <Popover
          key={index}
          open={isPopoverOpen && selectedDate === date}
          onOpenChange={(open) => {
            setIsPopoverOpen(open)
            if (open) {
              setSelectedDate(date)
            } else {
              setSelectedDate(null)
              setEditingEventId(null)
              setEventToEdit(null)
            }
          }}
        >
          <PopoverTrigger asChild>
            <div className=" p-2  flex flex-col border-t cursor-pointer">
              <div className="flex font-bold  text-sm w-full justify-between">
                <div
                  className={cn(
                    "  size-8 grid place-items-center  rounded-full ",
                    type !== "current" && "text-gray-400",
                    sameDay === date && "bg-black text-white"
                  )}
                >
                  <span>{day}</span>
                </div>
                {index < 7 && (
                  <span className="text-gray-400 size-8 grid place-items-center">
                    {getDayOfWeek(date)}
                  </span>
                )}
              </div>

              {showAllEvents
                ? dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-blue-200 rounded mx-1 mt-1 px-1"
                    >
                      {event.title}
                    </div>
                  ))
                : // Otherwise, show only the first 3 events
                  dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-blue-200 rounded mx-1 mt-1 px-1"
                    >
                      {event.title}
                    </div>
                  ))}

              {!showAllEvents && dayEvents.length > 3 && (
                <div
                  className="text-xs text-gray-500 mx-1 mt-1 cursor-pointer"
                  onClick={handleShowMore} // Handle click to show all events
                >
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <EventForm
              selectedDate={date}
              onSubmit={handleSubmit}
              editingEventId={editingEventId}
              eventToEdit={eventToEdit}
            />
          </PopoverContent>
        </Popover>
      )
    })
  }

  return (
    <div className="border rounded-xl w-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex p-3 items-center justify-between border-b">
        <h2 className="text-3xl  font-extrabold">{`${currentDate.toLocaleString(
          "default",
          { month: "long" }
        )} ${currentDate.getFullYear()}`}</h2>

        <div className="space-x-2 flex items-center ">
          <Button className="bg-blue-700" onClick={() => signOut()}>
            Logout
          </Button>
          <span>{data?.user?.email}</span>
          <Button onClick={handleCurrentMonth} variant="outline">
            Today
          </Button>
          <Button
            onClick={handlePreviousMonth}
            className="bg-gray-200 border size-10 border-gray-300 text-gray-700"
          >
            <ArrowLeft className="shrink-0" />
          </Button>
          <Button
            onClick={handleNextMonth}
            className=" bg-gray-200 size-10 border border-gray-300 text-gray-700"
          >
            <ArrowRight className="shrink-0" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 grow auto-rows-fr [&>*:not(:nth-child(7n))]:border-r ">
        {/* {daysOfWeek.map((day) => (
          <div className=" ml-4 fontbo" key={day}>
            {day}
          </div>
        ))} */}

        {generateCalendar()}
      </div>

      {/* {events.length > 0 && (
        <div className="mt-8 ">
          <h3 className="font-bold text-lg mb-2">Event List</h3>
          <ul>
            {events.map((event) => (
              <li
                key={event.id}
                className="flex justify-between p-2 border-b border-gray-300"
              >
                <div>
                  <strong>{event.title}</strong> - {event.date} at {event.time}
                  <br />
                  <span className="text-sm text-gray-500">
                    {event.description}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  )
}

export default Calendar
