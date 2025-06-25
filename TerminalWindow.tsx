'use client'

import { ReactNode } from 'react'

interface TerminalWindowProps {
  title: string
  children: ReactNode
  height?: string
  glowColor?: 'green' | 'amber' | 'red' | 'blue'
}

export function TerminalWindow({ 
  title, 
  children, 
  height = 'h-64',
  glowColor = 'green' 
}: TerminalWindowProps): JSX.Element {
  const glowStyles = {
    green: 'border-green-500 text-green-400 shadow-green-500/20',
    amber: 'border-amber-500 text-amber-400 shadow-amber-500/20',
    red: 'border-red-500 text-red-400 shadow-red-500/20',
    blue: 'border-blue-500 text-blue-400 shadow-blue-500/20'
  }

  const headerStyles = {
    green: 'text-green-300 border-green-500',
    amber: 'text-amber-300 border-amber-500',
    red: 'text-red-300 border-red-500',
    blue: 'text-blue-300 border-blue-500'
  }

  return (
    <div className={`
      border-2 ${glowStyles[glowColor]} 
      bg-black/80 backdrop-blur-sm 
      shadow-lg shadow-2xl 
      ${height}
      relative overflow-hidden
    `}>
      {/* Terminal header */}
      <div className={`border-b ${headerStyles[glowColor]} p-2 bg-black/60`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className={`text-sm font-bold ${headerStyles[glowColor].split(' ')[0]} drop-shadow-lg`}>
            {title}
          </div>
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 h-full overflow-y-auto text-sm">
        {children}
      </div>

      {/* Subtle glow effect */}
      <div className={`absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-r from-transparent via-${glowColor}-500 to-transparent`} />
    </div>
  )
}
