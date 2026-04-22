import React from 'react'
import type { Demo } from '../../types'

const STATUS_CONFIG: Record<Demo['status'], { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  review: { label: 'In Review', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  hold: { label: 'On Hold', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  sign: { label: 'Sign', className: 'bg-green-100 text-green-700 border-green-200' },
  pass: { label: 'Pass', className: 'bg-red-100 text-red-700 border-red-200' },
  ref: { label: 'Reference', className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

interface BadgeProps {
  status: Demo['status']
  size?: 'sm' | 'md'
}

export function Badge({ status, size = 'sm' }: BadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
  return (
    <span
      className={`inline-flex items-center rounded border font-body font-medium uppercase tracking-wide ${sizeClass} ${config.className}`}
    >
      {config.label}
    </span>
  )
}
