"use client"

import React, { useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import EventForm from "./Eventform"

interface Event {
  id: number
  title: string
  date: string // Store as "YYYY-MM-DD"
  time: string
  description: string
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [eventToEdit, setEventToEdit] = useState<{
    title: string
    time: string
    description: string
  } | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const handleSubmit = (formData: {
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
      setIsPopoverOpen(false) // Close the popover after submission
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id)
    setEventToEdit({
      title: event.title,
      time: event.time,
      description: event.description,
    })
    setSelectedDate(event.date)
    setIsPopoverOpen(true) // Open the popover for editing
  }

  const handleDelete = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    )
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

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevDay = previousMonthDays - i
      calendarDays.push(
        <div
          key={`prev-${prevDay}`}
          className="h-16 border border-gray-200 relative text-gray-400"
        >
          <span className="absolute top-1 left-1 text-sm">{prevDay}</span>
        </div>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = events.filter((event) => event.date === date)

      calendarDays.push(
        <Popover
          key={day}
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
            <div className="h-16 border border-gray-200 relative cursor-pointer">
              <span className="absolute top-1 left-1 text-sm">{day}</span>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-blue-200 rounded mx-1 mt-10 px-1"
                >
                  {event.title}
                </div>
              ))}
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
    }

    const totalSlots = firstDayOfMonth + daysInMonth
    const remainingSlots = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7)

    for (let i = 1; i <= remainingSlots; i++) {
      calendarDays.push(
        <div
          key={`next-${i}`}
          className="h-16 border border-gray-200 relative text-gray-400"
        >
          <span className="absolute left-1 text-sm">{i}</span>
        </div>
      )
    }

    return calendarDays
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 bg-gray-200 rounded"
        >
          ←
        </button>
        <h2 className="text-xl font-bold">{`${currentDate.toLocaleString(
          "default",
          { month: "long" }
        )} ${currentDate.getFullYear()}`}</h2>
        <button onClick={handleNextMonth} className="p-2 bg-gray-200 rounded">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-gray-500 font-medium">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-10">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">{generateCalendar()}</div>

      {events.length > 0 && (
        <div className="mt-8">
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
      )}
    </div>
  )
}

export default Calendar
