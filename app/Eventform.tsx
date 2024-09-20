"use client"

import React, { useEffect, useState } from "react"

// Define the props for EventForm
interface EventFormProps {
  selectedDate: string
  onSubmit: (eventData: {
    title: string
    time: string
    description: string
  }) => void
  editingEventId: number | null
  eventToEdit: { title: string; time: string; description: string } | null
}

const EventForm: React.FC<EventFormProps> = ({
  selectedDate,
  onSubmit,
  editingEventId,
  eventToEdit,
}) => {
  // Form state
  const [form, setForm] = useState({ title: "", time: "", description: "" })

  // Populate form when editing an event
  useEffect(() => {
    if (eventToEdit) {
      setForm({
        title: eventToEdit.title,
        time: eventToEdit.time,
        description: eventToEdit.description,
      })
    } else {
      setForm({ title: "", time: "", description: "" })
    }
  }, [eventToEdit])

  const handleSubmit = () => {
    if (form.title && form.time && form.description) {
      onSubmit(form)
      setForm({ title: "", time: "", description: "" })
    }
  }

  return (
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">
        {editingEventId ? "Edit" : "Add"} Event for {selectedDate}
      </h3>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-2">
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-2">
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {editingEventId ? "Update Event" : "Add Event"}
        </button>
      </div>
    </div>
  )
}

export default EventForm
