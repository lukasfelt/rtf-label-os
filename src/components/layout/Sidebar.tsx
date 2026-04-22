import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Inbox,
  Kanban,
  Star,
  Rocket,
  Calendar,
  FileText,
  BarChart2,
  TrendingUp,
  Search,
  Settings,
} from 'lucide-react'
import { AvatarInitials } from '../shared/AvatarInitials'

const NAV_SECTIONS = [
  {
    label: 'A&R',
    items: [
      { path: '/demos', label: 'Demo Inbox', icon: Inbox },
      { path: '/pipeline', label: 'Pipeline', icon: Kanban },
      { path: '/roster', label: 'Roster', icon: Star },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/campaigns', label: 'Campaigns', icon: Rocket },
      { path: '/releases', label: 'Releases', icon: Calendar },
      { path: '/briefs', label: 'Briefs', icon: FileText },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/analytics', label: 'AI Analytics', icon: BarChart2, highlight: true },
      { path: '/trends', label: 'Trend Radar', icon: TrendingUp },
      { path: '/comps', label: 'Comp Tracks', icon: Search },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col z-20" style={{ backgroundColor: '#181818' }}>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2 border-b border-white/10">
        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: '#FF762C' }} />
        <span className="font-display text-white uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>
          Respect The Funk
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-body font-semibold uppercase tracking-widest" style={{ color: '#888780' }}>
                {section.label}
              </span>
            </div>
            {section.items.map(({ path, label, icon: Icon, highlight }) => {
              const isActive = location.pathname === path || (path === '/demos' && location.pathname === '/')
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded text-sm font-body transition-all mb-0.5 relative ${
                    isActive
                      ? 'text-white'
                      : highlight
                      ? 'text-rtf-orange hover:bg-[#FF762C14]'
                      : 'text-rtf-gray hover:bg-[#FF762C14] hover:text-white'
                  }`}
                  style={isActive ? { color: 'white' } : undefined}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r"
                      style={{ backgroundColor: '#FF762C' }}
                    />
                  )}
                  <Icon
                    size={15}
                    className="flex-shrink-0"
                    style={{ color: isActive ? '#FF762C' : highlight ? '#FF762C' : undefined }}
                  />
                  <span className={isActive ? 'font-medium' : ''}>{label}</span>
                  {highlight && !isActive && (
                    <span className="ml-auto text-[9px] font-mono px-1 py-0.5 rounded" style={{ backgroundColor: '#FF762C', color: 'white' }}>
                      AI
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-body flex-shrink-0"
          style={{ backgroundColor: '#FF762C' }}
        >
          LS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-body font-medium truncate">Lucas</div>
          <div className="text-rtf-gray text-[10px] font-body truncate">A&R Director</div>
        </div>
        <button className="text-rtf-gray hover:text-white transition-colors">
          <Settings size={14} />
        </button>
      </div>
    </aside>
  )
}
