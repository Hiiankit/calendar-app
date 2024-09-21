// components/EventList.tsx
"use client"

// This enables client-side functionality like state management
import React, { useState } from "react"

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

const EventList: React.FC<CalendarProps> = ({ events, setEvents }) => {
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [eventToEdit, setEventToEdit] = useState<{
    title: string
    time: string
    description: string
  } | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Handles the start of editing by setting the event to be edited
  const handleEdit = (event: Event) => {
    setEditingEventId(event.id)
    setEventToEdit({
      title: event.title,
      time: event.time,
      description: event.description,
    })
    setSelectedDate(event.date)
  }

  // Submits the edit changes and updates the event list
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingEventId !== null && eventToEdit && selectedDate) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEventId
            ? {
                ...event,
                title: eventToEdit.title,
                time: eventToEdit.time,
                description: eventToEdit.description,
                date: selectedDate,
              }
            : event
        )
      )

      // Reset editing state
      setEditingEventId(null)
      setEventToEdit(null)
      setSelectedDate(null)
    }
  }

  // Handles deletion of an event by filtering out the event from the event list
  const handleDelete = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    )
  }

  return (
    <div>
      {events.length > 0 && (
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
      )}

      {/* Render edit form when editing an event */}
      {editingEventId !== null && eventToEdit && selectedDate && (
        <form onSubmit={handleSubmitEdit} className="mt-4">
          <h3>Edit Event</h3>

          <div className="mb-2">
            <label>Title</label>
            <input
              type="text"
              value={eventToEdit.title}
              onChange={(e) =>
                setEventToEdit({ ...eventToEdit, title: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label>Time</label>
            <input
              type="text"
              value={eventToEdit.time}
              onChange={(e) =>
                setEventToEdit({ ...eventToEdit, time: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label>Description</label>
            <textarea
              value={eventToEdit.description}
              onChange={(e) =>
                setEventToEdit({ ...eventToEdit, description: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
        </form>
      )}
    </div>
  )
}

export default EventList
