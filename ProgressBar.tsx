'use client'

interface ProgressBarProps {
  label: string
  value: number
  max: number
  unit?: string
  color?: 'green' | 'amber' | 'red' | 'blue'
  showPercentage?: boolean
}

export function ProgressBar({ 
  label, 
  value, 
  max, 
  unit = '', 
  color = 'green',
  showPercentage = true 
}: ProgressBarProps): JSX.Element {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100))
  
  const colorConfig = {
    green: {
      bg: 'bg-green-900/50',
      fill: 'bg-green-500',
      text: 'text-green-400',
      glow: 'shadow-green-500/50'
    },
    amber: {
      bg: 'bg-amber-900/50',
      fill: 'bg-amber-500',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/50'
    },
    red: {
      bg: 'bg-red-900/50',
      fill: 'bg-red-500',
      text: 'text-red-400',
      glow: 'shadow-red-500/50'
    },
    blue: {
      bg: 'bg-blue-900/50',
      fill: 'bg-blue-500',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/50'
    }
  }

  const config = colorConfig[color]

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={`text-xs ${config.text} font-mono`}>
          {label}
        </span>
        <span className={`text-xs ${config.text} font-mono`}>
          {showPercentage 
            ? `${percentage.toFixed(1)}%`
            : `${value.toFixed(1)}${unit}/${max}${unit}`
          }
        </span>
      </div>
      
      {/* Progress bar container */}
      <div className={`w-full h-2 ${config.bg} border border-gray-600 relative overflow-hidden`}>
        {/* Progress fill */}
        <div 
          className={`h-full ${config.fill} transition-all duration-300 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="flex-1 border-r border-gray-700/50 last:border-r-0" />
          ))}
        </div>
      </div>
      
      {/* ASCII-style indicator */}
      <div className="font-mono text-xs text-gray-500">
        {'['}{Array.from({ length: 20 }, (_, i) => 
          i < (percentage / 5) ? '█' : '░'
        ).join('')}{']'}
      </div>
    </div>
  )
}
