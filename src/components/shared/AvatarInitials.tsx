import React from 'react'
import { getInitials, hashStringToColor } from '../../lib/scoring'

interface AvatarInitialsProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarInitials({ name, size = 'md', className = '' }: AvatarInitialsProps) {
  const bg = hashStringToColor(name)
  const initials = getInitials(name)
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full font-body font-bold text-white flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}
