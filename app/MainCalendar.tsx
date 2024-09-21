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
export default function MainCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  return (
    <div>
      <EventList events={events} setEvents={setEvents} />
      <Calendar events={events} setEvents={setEvents} />
    </div>
  )
}
