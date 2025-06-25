'use client'

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'transmitting'
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusIndicator({ status, label, size = 'md' }: StatusIndicatorProps): JSX.Element {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      textColor: 'text-green-400',
      animation: 'animate-pulse'
    },
    offline: {
      color: 'bg-gray-500',
      textColor: 'text-gray-400',
      animation: ''
    },
    warning: {
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      animation: 'animate-pulse'
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-red-400',
      animation: 'animate-pulse'
    },
    transmitting: {
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      animation: 'animate-ping'
    }
  }

  const sizeConfig = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`${sizeConfig[size]} ${config.color} rounded-full ${config.animation}`} />
        {status === 'transmitting' && (
          <div className={`absolute inset-0 ${sizeConfig[size]} ${config.color} rounded-full animate-ping opacity-75`} />
        )}
      </div>
      <span className={`text-xs ${config.textColor} font-mono`}>
        {label}
      </span>
    </div>
  )
}
