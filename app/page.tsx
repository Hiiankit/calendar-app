"use client"

import React, { useState } from "react"

import EventList from "./EventList"
import Calendar from "./calendar"

interface Event {
  id: number
  title: string
  date: string
  time: string
  description: string
}

export default function page() {
  const [events, setEvents] = useState<Event[]>([])
  return (
    <div className="flex p-2 grow h-screen">
      <Calendar events={events} setEvents={setEvents} />

      <EventList events={events} setEvents={setEvents} />
    </div>
  )
}
