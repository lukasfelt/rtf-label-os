import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePipelineStore } from '../../store/pipelineStore'
import { Topbar } from '../layout/Topbar'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function ReleaseCalendar() {
  const { releases, campaigns } = usePipelineStore()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const releaseEvents = releases
      .filter((r) => r.releaseDate === dateStr)
      .map((r) => ({ label: `${r.artist} — ${r.title}`, color: '#FF762C', type: 'release' }))
    const campaignEvents = campaigns
      .filter((c) => c.dueDate === dateStr)
      .map((c) => ({ label: c.name, color: '#181818', type: 'campaign' }))
    return [...releaseEvents, ...campaignEvents]
  }

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Release Calendar" subtitle="Upcoming releases and campaign dates" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-rtf-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rtf-border">
            <h2 className="font-display text-lg uppercase tracking-wide text-rtf-black">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rtf-offwhite transition-colors text-rtf-gray">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rtf-offwhite transition-colors text-rtf-gray">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-rtf-border">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-body font-semibold uppercase tracking-widest text-rtf-gray">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const events = day ? getEventsForDay(day) : []
              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 border-b border-r border-rtf-border last:border-r-0 ${
                    !day ? 'bg-rtf-offwhite' : 'bg-white hover:bg-rtf-offwhite transition-colors'
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-mono mb-1 ${
                          isToday ? 'text-white font-bold' : 'text-rtf-black'
                        }`}
                        style={isToday ? { backgroundColor: '#FF762C' } : undefined}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {events.map((ev, j) => (
                          <div
                            key={j}
                            className="text-[10px] font-body text-white px-1 py-0.5 rounded truncate"
                            style={{ backgroundColor: ev.color }}
                            title={ev.label}
                          >
                            {ev.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF762C' }} />
            <span className="text-xs font-body text-rtf-gray">Release</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#181818' }} />
            <span className="text-xs font-body text-rtf-gray">Campaign</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#16a34a' }} />
            <span className="text-xs font-body text-rtf-gray">Milestone</span>
          </div>
        </div>
      </div>
    </div>
  )
}
