import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-[220px] overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
